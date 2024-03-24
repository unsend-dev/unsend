import { EmailContent } from "~/types";
import { db } from "../db";
import { sendEmailThroughSes } from "../ses";

export async function sendEmail(
  emailContent: EmailContent & { teamId: number }
) {
  const { to, from, subject, text, html, teamId } = emailContent;

  const domains = await db.domain.findMany({ where: { teamId } });

  const fromDomain = from.split("@")[1];
  if (!fromDomain) {
    throw new Error("From email is not valid");
  }

  const domain = domains.find((domain) => domain.name === fromDomain);
  if (!domain) {
    throw new Error("Domain not found. Add domain to unsend first");
  }

  if (domain.status !== "SUCCESS") {
    throw new Error("Domain is not verified");
  }

  const messageId = await sendEmailThroughSes({
    to,
    from,
    subject,
    text,
    html,
    region: domain.region,
  });

  if (messageId) {
    return await db.email.create({
      data: {
        to,
        from,
        subject,
        text,
        html,
        id: messageId,
        teamId,
        domainId: domain.id,
      },
    });
  }
}
