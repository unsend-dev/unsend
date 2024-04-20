import { EmailContent } from "~/types";
import { db } from "../db";
import { sendEmailThroughSes, sendEmailWithAttachments } from "../aws/ses";
import { APP_SETTINGS } from "~/utils/constants";
import { sendWelcomeEmail } from "./job-service";

export async function sendEmail(
  emailContent: EmailContent & { teamId: number }
) {
  const { to, from, subject, text, html, teamId, attachments } = emailContent;

  sendWelcomeEmail({ email: to });

  const fromDomain = from.split("@")[1];

  const domain = await db.domain.findFirst({
    where: { teamId, name: fromDomain },
  });

  if (!domain) {
    throw new Error(
      "Domain of from email is wrong. Use the email verified by unsend"
    );
  }

  if (domain.status !== "SUCCESS") {
    throw new Error("Domain is not verified");
  }

  const messageId = attachments
    ? await sendEmailWithAttachments({
        to,
        from,
        subject,
        text,
        html,
        region: domain.region,
        configurationSetName: getConfigurationSetName(
          domain.clickTracking,
          domain.openTracking
        ),
        attachments,
      })
    : await sendEmailThroughSes({
        to,
        from,
        subject,
        text,
        html,
        region: domain.region,
        configurationSetName: getConfigurationSetName(
          domain.clickTracking,
          domain.openTracking
        ),
        attachments,
      });

  if (messageId) {
    return await db.email.create({
      data: {
        to,
        from,
        subject,
        text,
        html,
        sesEmailId: messageId,
        teamId,
        domainId: domain.id,
      },
    });
  }
}

function getConfigurationSetName(
  clickTracking: boolean,
  openTracking: boolean
) {
  if (clickTracking && openTracking) {
    return APP_SETTINGS.SES_CONFIGURATION_FULL;
  }
  if (clickTracking) {
    return APP_SETTINGS.SES_CONFIGURATION_CLICK_TRACKING;
  }
  if (openTracking) {
    return APP_SETTINGS.SES_CONFIGURATION_OPEN_TRACKING;
  }

  return APP_SETTINGS.SES_CONFIGURATION_GENERAL;
}
