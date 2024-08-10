import { Job, Queue, Worker } from "bullmq";
import { env } from "~/env";
import { EmailAttachment } from "~/types";
import { getConfigurationSetName } from "~/utils/ses-utils";
import { db } from "../db";
import { sendEmailThroughSes, sendEmailWithAttachments } from "../aws/ses";
import { getRedis } from "../redis";
import { createUnsubUrl } from "./campaign-service";

function createQueueAndWorker(region: string, quota: number, suffix: string) {
  const connection = getRedis();

  const queueName = `${region}-${suffix}`;

  const queue = new Queue(queueName, { connection });

  const worker = new Worker(queueName, executeEmail, {
    concurrency: quota,
    connection,
  });

  return { queue, worker };
}

export class EmailQueueService {
  private static initialized = false;
  public static transactionalQueue = new Map<string, Queue>();
  private static transactionalWorker = new Map<string, Worker>();
  public static marketingQueue = new Map<string, Queue>();
  private static marketingWorker = new Map<string, Worker>();

  public static initializeQueue(
    region: string,
    quota: number,
    transactionalQuotaPercentage: number
  ) {
    console.log(`[EmailQueueService]: Initializing queue for region ${region}`);

    const transactionalQuota = Math.floor(
      (quota * transactionalQuotaPercentage) / 100
    );
    const marketingQuota = quota - transactionalQuota;

    console.log(
      "is transactional queue",
      this.transactionalQueue.has(region),
      "is marketing queue",
      this.marketingQueue.has(region)
    );

    if (this.transactionalQueue.has(region)) {
      console.log(
        `[EmailQueueService]: Updating transactional quota for region ${region} to ${transactionalQuota}`
      );
      const transactionalWorker = this.transactionalWorker.get(region);
      if (transactionalWorker) {
        transactionalWorker.concurrency =
          transactionalQuota !== 0 ? transactionalQuota : 1;
      }
    } else {
      console.log(
        `[EmailQueueService]: Creating transactional queue for region ${region} with quota ${transactionalQuota}`
      );
      const { queue: transactionalQueue, worker: transactionalWorker } =
        createQueueAndWorker(
          region,
          transactionalQuota !== 0 ? transactionalQuota : 1,
          "transaction"
        );
      this.transactionalQueue.set(region, transactionalQueue);
      this.transactionalWorker.set(region, transactionalWorker);
    }

    if (this.marketingQueue.has(region)) {
      console.log(
        `[EmailQueueService]: Updating marketing quota for region ${region} to ${marketingQuota}`
      );
      const marketingWorker = this.marketingWorker.get(region);
      if (marketingWorker) {
        marketingWorker.concurrency = marketingQuota !== 0 ? marketingQuota : 1;
      }
    } else {
      console.log(
        `[EmailQueueService]: Creating marketing queue for region ${region} with quota ${marketingQuota}`
      );
      const { queue: marketingQueue, worker: marketingWorker } =
        createQueueAndWorker(
          region,
          marketingQuota !== 0 ? marketingQuota : 1,
          "marketing"
        );
      this.marketingQueue.set(region, marketingQueue);
      this.marketingWorker.set(region, marketingWorker);
    }
  }

  public static async queueEmail(
    emailId: string,
    region: string,
    transactional: boolean,
    unsubUrl?: string
  ) {
    if (!this.initialized) {
      await this.init();
    }
    const queue = transactional
      ? this.transactionalQueue.get(region)
      : this.marketingQueue.get(region);
    if (!queue) {
      throw new Error(`Queue for region ${region} not found`);
    }
    queue.add("send-email", { emailId, timestamp: Date.now(), unsubUrl });
  }

  public static async init() {
    const sesSettings = await db.sesSetting.findMany();
    for (const sesSetting of sesSettings) {
      this.initializeQueue(
        sesSetting.region,
        sesSetting.sesEmailRateLimit,
        sesSetting.transactionalQuota
      );
    }
    this.initialized = true;
  }
}

async function executeEmail(
  job: Job<{ emailId: string; timestamp: number; unsubUrl?: string }>
) {
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
  const unsubUrl = job.data.unsubUrl;

  try {
    const messageId = attachments.length
      ? await sendEmailWithAttachments({
          to: email.to,
          from: email.from,
          subject: email.subject,
          text: email.text ?? "",
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
          text: email.text ?? "",
          html: email.html ?? undefined,
          region: domain?.region ?? env.AWS_DEFAULT_REGION,
          configurationSetName,
          attachments,
          unsubUrl,
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
