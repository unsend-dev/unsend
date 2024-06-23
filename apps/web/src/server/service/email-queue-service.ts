import { Job, Queue, Worker } from "bullmq";
import { env } from "~/env";
import { EmailAttachment } from "~/types";
import { getConfigurationSetName } from "~/utils/ses-utils";
import { db } from "../db";
import { sendEmailThroughSes, sendEmailWithAttachments } from "../aws/ses";
import { getRedis } from "../redis";

export class EmailQueueService {
  private static initialized = false;
  private static regionQueue = new Map<string, Queue>();
  private static regionWorker = new Map<string, Worker>();

  public static initializeQueue(region: string, quota: number) {
    const connection = getRedis();
    console.log(`[EmailQueueService]: Initializing queue for region ${region}`);

    const queueName = `${region}-transaction`;

    const queue = new Queue(queueName, { connection });

    const worker = new Worker(queueName, executeEmail, {
      limiter: {
        max: quota,
        duration: 1000,
      },
      concurrency: quota,
      connection,
    });

    this.regionQueue.set(region, queue);
    this.regionWorker.set(region, worker);
  }

  public static async queueEmail(emailId: string, region: string) {
    if (!this.initialized) {
      await this.init();
    }
    const queue = this.regionQueue.get(region);
    if (!queue) {
      throw new Error(`Queue for region ${region} not found`);
    }
    queue.add("send-email", { emailId, timestamp: Date.now() });
  }

  public static async init() {
    const sesSettings = await db.sesSetting.findMany();
    for (const sesSetting of sesSettings) {
      this.initializeQueue(sesSetting.region, sesSetting.sesEmailRateLimit);
    }
    this.initialized = true;
  }
}

async function executeEmail(job: Job<{ emailId: string; timestamp: number }>) {
  console.log(
    `[EmailQueueService]: Executing email job ${job.data.emailId}, time elapsed: ${Date.now() - job.data.timestamp}ms`
  );

  const email = await db.email.findUnique({
    where: { id: job.data.emailId },
  });

  const domain = email?.domainId
    ? await db.domain.findUnique({
        where: { id: email?.domainId },
      })
    : null;

  if (!email) {
    console.log(`[EmailQueueService]: Email not found, skipping`);
    return;
  }

  const attachments: Array<EmailAttachment> = email.attachments
    ? JSON.parse(email.attachments)
    : [];

  const configurationSetName = await getConfigurationSetName(
    domain?.clickTracking ?? false,
    domain?.openTracking ?? false,
    domain?.region ?? env.AWS_DEFAULT_REGION
  );

  if (!configurationSetName) {
    console.log(`[EmailQueueService]: Configuration set not found, skipping`);
    return;
  }

  console.log(`[EmailQueueService]: Sending email ${email.id}`);
  try {
    const messageId = attachments.length
      ? await sendEmailWithAttachments({
          to: email.to,
          from: email.from,
          subject: email.subject,
          text: email.text ?? undefined,
          html: email.html ?? undefined,
          region: domain?.region ?? env.AWS_DEFAULT_REGION,
          configurationSetName,
          attachments,
        })
      : await sendEmailThroughSes({
          to: email.to,
          from: email.from,
          subject: email.subject,
          replyTo: email.replyTo ?? undefined,
          text: email.text ?? undefined,
          html: email.html ?? undefined,
          region: domain?.region ?? env.AWS_DEFAULT_REGION,
          configurationSetName,
          attachments,
        });

    // Delete attachments after sending the email
    await db.email.update({
      where: { id: email.id },
      data: { sesEmailId: messageId, attachments: undefined },
    });
  } catch (error: any) {
    await db.emailEvent.create({
      data: {
        emailId: email.id,
        status: "FAILED",
        data: {
          error: error.toString(),
        },
      },
    });
    await db.email.update({
      where: { id: email.id },
      data: { latestStatus: "FAILED" },
    });
  }
}
