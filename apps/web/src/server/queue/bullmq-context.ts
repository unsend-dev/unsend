import { randomUUID } from "crypto";
import { getChildLogger, withLogger } from "../logger/log";
import { Job } from "bullmq";

export type TeamJob<T> = Job<T & { teamId?: number }>;

/**
 * Simple wrapper function for BullMQ worker jobs with team context
 */
export function createWorkerHandler<T>(
  handler: (job: TeamJob<T>) => Promise<void>
) {
  return async (job: TeamJob<T>) => {
    return await withLogger(
      getChildLogger({
        teamId: job.data.teamId,
        queueId: job.id ?? randomUUID(),
      }),
      async () => {
        return await handler(job);
      }
    );
  };
}
