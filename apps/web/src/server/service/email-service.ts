import { EmailContent } from "~/types";
import { db } from "../db";
import { UnsendApiError } from "~/server/public-api/api-error";
import { EmailQueueService } from "./email-queue-service";
import { validateDomainFromEmail } from "./domain-service";
import { Contact } from "@prisma/client";

/**
 Send transactional email
 */
export async function sendEmail(
  emailContent: EmailContent & { teamId: number }
) {
  const {
    to,
    from,
    subject,
    text,
    html,
    teamId,
    attachments,
    replyTo,
    cc,
    bcc,
  } = emailContent;

  const domain = await validateDomainFromEmail(from, teamId);

  const email = await db.email.create({
    data: {
      to: Array.isArray(to) ? to : [to],
      from,
      subject,
      replyTo: replyTo
        ? Array.isArray(replyTo)
          ? replyTo
          : [replyTo]
        : undefined,
      cc: cc ? (Array.isArray(cc) ? cc : [cc]) : undefined,
      bcc: bcc ? (Array.isArray(bcc) ? bcc : [bcc]) : undefined,
      text,
      html,
      teamId,
      domainId: domain.id,
      attachments: attachments ? JSON.stringify(attachments) : undefined,
    },
  });

  try {
    await EmailQueueService.queueEmail(email.id, domain.region, true);
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
    throw error;
  }

  return email;
}

type CampainEmail = {
  campaignId: string;
  from: string;
  subject: string;
  html: string;
  replyTo?: string[];
  cc?: string[];
  bcc?: string[];
  teamId: number;
  contacts: Array<Contact>;
};

export async function sendCampaignEmail(emailData: CampainEmail) {
  const {
    campaignId,
    from,
    subject,
    html,
    replyTo,
    cc,
    bcc,
    teamId,
    contacts,
  } = emailData;

  const domain = await validateDomainFromEmail(from, teamId);

  // Create emails in bulk
  await db.email.createMany({
    data: contacts.map((contact) => ({
      to: [contact.email],
      replyTo: replyTo
        ? Array.isArray(replyTo)
          ? replyTo
          : [replyTo]
        : undefined,
      cc: cc ? (Array.isArray(cc) ? cc : [cc]) : undefined,
      bcc: bcc ? (Array.isArray(bcc) ? bcc : [bcc]) : undefined,
      from,
      subject,
      html,
      teamId,
      campaignId,
      contactId: contact.id,
      domainId: domain.id,
    })),
  });

  // Fetch created emails
  const emails = await db.email.findMany({
    where: {
      teamId,
      campaignId,
    },
  });

  // Queue emails
  await Promise.all(
    emails.map((email) =>
      EmailQueueService.queueEmail(email.id, domain.region, false)
    )
  );
}
