import pgBoss from "pg-boss";
import { env } from "~/env";
import { EmailAttachment } from "~/types";
import { db } from "~/server/db";
import {
  sendEmailThroughSes,
  sendEmailWithAttachments,
} from "~/server/aws/ses";
import { getConfigurationSetName } from "~/utils/ses-utils";
import { sendToDiscord } from "./notification-service";

const boss = new pgBoss({
  connectionString: env.DATABASE_URL,
  archiveCompletedAfterSeconds: 60 * 60 * 24, // 24 hours
  deleteAfterDays: 7, // 7 days
});
let started = false;

export async function getBoss() {
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

    boss.on("error", async (error) => {
      console.error(error);
      sendToDiscord(
        `Error in pg-boss: ${error.name} \n ${error.cause}\n ${error.message}\n  ${error.stack}`
      );
      await boss.stop();
      started = false;
    });
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

  const configurationSetName = await getConfigurationSetName(
    domain?.clickTracking ?? false,
    domain?.openTracking ?? false,
    domain?.region ?? env.AWS_DEFAULT_REGION
  );

  if (!configurationSetName) {
    console.log(`[EmailJob]: Configuration set not found, skipping`);
    return;
  }

  console.log(`[EmailJob]: Sending email ${email.id}`);
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
