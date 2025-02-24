import { Queue, Worker } from "bullmq";
import { db } from "~/server/db";
import { env } from "~/env";
import {
  getUsageDate,
  getUsageUinits,
  sendUsageToStripe,
} from "../billing/usage";
import { getRedis } from "~/server/redis";
import { DEFAULT_QUEUE_OPTIONS } from "../queue/queue-constants";

const USAGE_QUEUE_NAME = "usage-reporting";

const usageQueue = new Queue(USAGE_QUEUE_NAME, {
  connection: getRedis(),
});

// Process usage reporting jobs
const worker = new Worker(
  USAGE_QUEUE_NAME,
  async () => {
    // Get all teams with stripe customer IDs
    const teams = await db.team.findMany({
      where: {
        stripeCustomerId: {
          not: null,
        },
      },
      include: {
        dailyEmailUsages: {
          where: {
            // Get yesterday's date by subtracting 1 day from today
            date: {
              equals: getUsageDate(),
            },
          },
        },
      },
    });

    // Process each team
    for (const team of teams) {
      if (!team.stripeCustomerId) continue;

      const transactionUsage = team.dailyEmailUsages
        .filter((usage) => usage.type === "TRANSACTIONAL")
        .reduce((sum, usage) => sum + usage.sent, 0);

      const marketingUsage = team.dailyEmailUsages
        .filter((usage) => usage.type === "MARKETING")
        .reduce((sum, usage) => sum + usage.sent, 0);

      const totalUsage = getUsageUinits(marketingUsage, transactionUsage);

      try {
        await sendUsageToStripe(team.stripeCustomerId, totalUsage);
        console.log(
          `[Usage Reporting] Reported usage for team ${team.id}, date: ${getUsageDate()}, usage: ${totalUsage}`
        );
      } catch (error) {
        console.error(
          `[Usage Reporting] Failed to report usage for team ${team.id}:`,
          error instanceof Error ? error.message : error
        );
      }
    }
  },
  {
    connection: getRedis(),
  }
);

// Schedule job to run daily
await usageQueue.upsertJobScheduler(
  "daily-usage-report",
  {
    pattern: "0 0 * * *", // Run every day at 12 AM
    tz: "UTC",
  },
  {
    opts: {
      ...DEFAULT_QUEUE_OPTIONS,
    },
  }
);

worker.on("completed", (job) => {
  console.log(`[Usage Reporting] Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.error(`[Usage Reporting] Job ${job?.id} failed:`, err);
});
