import { EmailContent } from "~/types";
import { db } from "../db";
import { UnsendApiError } from "~/server/public-api/api-error";
import { queueEmail } from "./job-service";

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

  const fromDomain = from.split("@")[1];

  const domain = await db.domain.findFirst({
    where: { teamId, name: fromDomain },
  });

  if (!domain) {
    throw new UnsendApiError({
      code: "BAD_REQUEST",
      message:
        "Domain of from email is wrong. Use the email verified by unsend",
    });
  }

  if (domain.status !== "SUCCESS") {
    throw new UnsendApiError({
      code: "BAD_REQUEST",
      message: "Domain is not verified",
    });
  }

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

  queueEmail(email.id);

  return email;
}
