import { EmailContent } from "~/types";
import { db } from "../db";
import { sendEmailThroughSes } from "../ses";
import { APP_SETTINGS } from "~/utils/constants";

export async function sendEmail(
  emailContent: EmailContent & { teamId: number }
) {
  const { to, from, subject, text, html, teamId } = emailContent;

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

  const messageId = await sendEmailThroughSes({
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
