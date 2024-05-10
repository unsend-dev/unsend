import pgBoss from "pg-boss";
import { env } from "~/env";
import { EmailAttachment, EmailContent } from "~/types";
import { db } from "../db";
import { sendEmailThroughSes, sendEmailWithAttachments } from "../aws/ses";
import { getConfigurationSetName } from "~/utils/ses-utils";

const boss = new pgBoss({
  connectionString: env.DATABASE_URL,
  archiveCompletedAfterSeconds: 60 * 60 * 24, // 24 hours
  deleteAfterDays: 7, // 7 days
});
let started = false;

async function getBoss() {
  if (!started) {
    await boss.start();
    await boss.work(
      "send_email",
      {
        teamConcurrency: env.SES_QUEUE_LIMIT,
        teamSize: env.SES_QUEUE_LIMIT,
        teamRefill: true,
      },
      executeEmail
    );
    started = true;
  }
  return boss;
}

export async function queueEmail(emailId: string) {
  const boss = await getBoss();
  await boss.send("send_email", { emailId, timestamp: Date.now() });
}

async function executeEmail(
  job: pgBoss.Job<{ emailId: string; timestamp: number }>
) {
  console.log(
    `[EmailJob]: Executing email job ${job.data.emailId}, time elapsed: ${Date.now() - job.data.timestamp}ms`
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
    console.log(`[EmailJob]: Email not found, skipping`);
    return;
  }

  const attachments: Array<EmailAttachment> = email.attachments
    ? JSON.parse(email.attachments)
    : [];

  const messageId = attachments.length
    ? await sendEmailWithAttachments({
        to: email.to,
        from: email.from,
        subject: email.subject,
        text: email.text ?? undefined,
        html: email.html ?? undefined,
        region: domain?.region ?? env.AWS_DEFAULT_REGION,
        configurationSetName: getConfigurationSetName(
          domain?.clickTracking ?? false,
          domain?.openTracking ?? false
        ),
        attachments,
      })
    : await sendEmailThroughSes({
        to: email.to,
        from: email.from,
        subject: email.subject,
        text: email.text ?? undefined,
        html: email.html ?? undefined,
        region: domain?.region ?? env.AWS_DEFAULT_REGION,
        configurationSetName: getConfigurationSetName(
          domain?.clickTracking ?? false,
          domain?.openTracking ?? false
        ),
        attachments,
      });

  await db.email.update({
    where: { id: email.id },
    data: { sesEmailId: messageId, attachments: undefined },
  });
}
