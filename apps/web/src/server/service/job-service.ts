import pgBoss from "pg-boss";
import { env } from "~/env";

const SES_QUEUE_LIMIT = 14;

const boss = new pgBoss({
  connectionString: env.DATABASE_URL,
  archiveCompletedAfterSeconds: 60 * 60 * 24, // 24 hours
  deleteAfterDays: 60 * 60 * 24 * 7, // 30 days
});
let started = false;

async function getBoss() {
  if (!started) {
    await boss.start();
    await boss.work(
      "send_email",
      { teamConcurrency: SES_QUEUE_LIMIT, teamSize: SES_QUEUE_LIMIT },
      executeWelcomeEmail
    );
    started = true;
  }
  return boss;
}

export async function sendWelcomeEmail({ email }: { email: string }) {
  const boss = await getBoss();
  await boss.send("send_email", { email });
}

async function executeWelcomeEmail(job: pgBoss.Job<{ email: string }>) {
  console.log(`[WelcomeEmailJob] Sent welcome email to ${job.data.email}!`);
}
