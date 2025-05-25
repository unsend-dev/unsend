import { Job, Queue, Worker } from "bullmq";
import { env } from "~/env";
import { EmailAttachment } from "~/types";
import { convert as htmlToText } from "html-to-text";
import { getConfigurationSetName } from "~/utils/ses-utils";
import { db } from "../db";
import { sendRawEmail } from "../aws/ses";
import { getRedis } from "../redis";
import { DEFAULT_QUEUE_OPTIONS } from "../queue/queue-constants";
import { Prisma } from "@prisma/client";

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
    unsubUrl?: string,
    delay?: number
  ) {
    if (!this.initialized) {
      await this.init();
    }
    const queue = transactional
      ? this.transactionalQueue.get(region)
      : this.marketingQueue.get(region);
    const isBulk = !transactional;
    if (!queue) {
      throw new Error(`Queue for region ${region} not found`);
    }
    queue.add(
      emailId,
      { emailId, timestamp: Date.now(), unsubUrl, isBulk },
      { jobId: emailId, delay, ...DEFAULT_QUEUE_OPTIONS }
    );
  }

  /**
   * Efficiently queues multiple pre-defined email jobs using BullMQ's addBulk.
   * Jobs are grouped by region and type (transactional/marketing) before queuing.
   *
   * @param jobs - Array of job details to queue.
   * @returns A promise that resolves when all bulk additions are attempted.
   */
  public static async queueBulk(
    jobs: {
      emailId: string;
      region: string;
      transactional: boolean;
      unsubUrl?: string;
      delay?: number;
      timestamp?: number; // Optional: pass timestamp if needed for data
    }[]
  ): Promise<void> {
    if (jobs.length === 0) {
      console.log("[EmailQueueService]: No jobs provided for bulk queue.");
      return;
    }

    if (!this.initialized) {
      await this.init();
    }

    console.log(
      `[EmailQueueService]: Starting bulk queue for ${jobs.length} jobs.`
    );

    // Group jobs by region and type
    const groupedJobs = jobs.reduce(
      (acc, job) => {
        const key = `${job.region}-${job.transactional ? "transactional" : "marketing"}`;
        if (!acc[key]) {
          acc[key] = {
            queue: job.transactional
              ? this.transactionalQueue.get(job.region)
              : this.marketingQueue.get(job.region),
            region: job.region,
            transactional: job.transactional,
            jobDetails: [],
          };
        }
        acc[key]?.jobDetails.push(job);
        return acc;
      },
      {} as Record<
        string,
        {
          queue: Queue | undefined;
          region: string;
          transactional: boolean;
          jobDetails: typeof jobs;
        }
      >
    );

    const bulkAddPromises: Promise<any>[] = [];

    for (const groupKey in groupedJobs) {
      const group = groupedJobs[groupKey];
      if (!group || !group.queue) {
        console.error(
          `[EmailQueueService]: Queue not found for group ${groupKey} during bulk add. Skipping ${group?.jobDetails?.length ?? 0} jobs.`
        );
        // Optionally: handle these skipped jobs (e.g., mark corresponding emails as failed)
        continue;
      }

      const queue = group.queue;
      const isBulk = !group.transactional;
      const bulkData = group.jobDetails.map((job) => ({
        name: job.emailId, // Use emailId as job name (matches single queue logic)
        data: {
          emailId: job.emailId,
          timestamp: job.timestamp ?? Date.now(),
          unsubUrl: job.unsubUrl,
          isBulk,
        },
        opts: {
          jobId: job.emailId, // Use emailId as jobId
          delay: job.delay,
          ...DEFAULT_QUEUE_OPTIONS, // Apply default options (attempts, backoff)
        },
      }));

      console.log(
        `[EmailQueueService]: Adding ${bulkData.length} jobs to queue ${queue.name}`
      );
      bulkAddPromises.push(
        queue.addBulk(bulkData).catch((error) => {
          console.error(
            `[EmailQueueService]: Failed to add bulk jobs to queue ${queue.name}:`,
            error
          );
          // Optionally: handle bulk add failure (e.g., mark corresponding emails as failed)
        })
      );
    }

    await Promise.allSettled(bulkAddPromises);
    console.log(
      "[EmailQueueService]: Finished processing bulk queue requests."
    );
  }

  public static async changeDelay(
    emailId: string,
    region: string,
    transactional: boolean,
    delay: number
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

    const job = await queue.getJob(emailId);
    if (!job) {
      throw new Error(`Job ${emailId} not found`);
    }
    await job.changeDelay(delay);
  }

  public static async chancelEmail(
    emailId: string,
    region: string,
    transactional: boolean
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

    const job = await queue.getJob(emailId);
    if (!job) {
      throw new Error(`Job ${emailId} not found`);
    }
    await job.remove();
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
  job: Job<{
    emailId: string;
    timestamp: number;
    unsubUrl?: string;
    isBulk?: boolean;
  }>
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

  console.log(`Domain: ${JSON.stringify(domain)}`);

  const configurationSetName = await getConfigurationSetName(
    domain?.clickTracking ?? false,
    domain?.openTracking ?? false,
    domain?.region ?? env.AWS_DEFAULT_REGION
  );

  if (!configurationSetName) {
    return;
  }

  console.log(`[EmailQueueService]: Sending email ${email.id}`);
  const unsubUrl = job.data.unsubUrl;
  const isBulk = job.data.isBulk;

  const text = email.text
    ? email.text
    : email.campaignId && email.html
      ? htmlToText(email.html)
      : undefined;

  let inReplyToMessageId: string | undefined = undefined;

  if (email.inReplyToId) {
    const replyEmail = await db.email.findUnique({
      where: {
        id: email.inReplyToId,
      },
    });

    if (replyEmail && replyEmail.sesEmailId) {
      inReplyToMessageId = replyEmail.sesEmailId;
    }
  }

  try {
    const messageId = await sendRawEmail({
      to: email.to,
      from: email.from,
      subject: email.subject,
      replyTo: email.replyTo ?? undefined,
      bcc: email.bcc,
      cc: email.cc,
      text,
      html: email.html ?? undefined,
      region: domain?.region ?? env.AWS_DEFAULT_REGION,
      configurationSetName,
      attachments: attachments.length > 0 ? attachments : undefined,
      unsubUrl,
      isBulk,
      inReplyToMessageId,
    });

    // Delete attachments after sending the email
    await db.email.update({
      where: { id: email.id },
      data: { sesEmailId: messageId, text, attachments: undefined },
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
