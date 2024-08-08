import { EmailStatus, Prisma } from "@prisma/client";
import { SesEvent, SesEventDataKey } from "~/types/aws-types";
import { db } from "../db";

export async function parseSesHook(data: SesEvent) {
  const mailStatus = getEmailStatus(data);

  if (!mailStatus) {
    console.error("Unknown email status", data);
    return false;
  }

  const sesEmailId = data.mail.messageId;

  const mailData = getEmailData(data);

  const email = await db.email.findUnique({
    where: {
      sesEmailId,
    },
  });

  if (!email) {
    console.error("Email not found", data);
    return false;
  }

  if (
    email.latestStatus === mailStatus &&
    mailStatus === EmailStatus.DELIVERY_DELAYED
  ) {
    return true;
  }

  // Update the latest status and to avoid race conditions
  await db.$executeRaw`
      UPDATE "Email"
      SET "latestStatus" = CASE
        WHEN ${mailStatus}::text::\"EmailStatus\" > "latestStatus" OR "latestStatus" IS NULL 
        THEN ${mailStatus}::text::\"EmailStatus\"
        ELSE "latestStatus"
      END
      WHERE id = ${email.id}
    `;

  await db.emailEvent.create({
    data: {
      emailId: email.id,
      status: mailStatus,
      data: mailData as any,
    },
  });

  return true;
}

function getEmailStatus(data: SesEvent) {
  const { eventType } = data;

  if (eventType === "Send") {
    return EmailStatus.SENT;
  } else if (eventType === "Delivery") {
    return EmailStatus.DELIVERED;
  } else if (eventType === "Bounce") {
    return EmailStatus.BOUNCED;
  } else if (eventType === "Complaint") {
    return EmailStatus.COMPLAINED;
  } else if (eventType === "Reject") {
    return EmailStatus.REJECTED;
  } else if (eventType === "Open") {
    return EmailStatus.OPENED;
  } else if (eventType === "Click") {
    return EmailStatus.CLICKED;
  } else if (eventType === "Rendering Failure") {
    return EmailStatus.RENDERING_FAILURE;
  } else if (eventType === "DeliveryDelay") {
    return EmailStatus.DELIVERY_DELAYED;
  }
}

function getEmailData(data: SesEvent) {
  const { eventType } = data;

  if (eventType === "Rendering Failure") {
    return data.renderingFailure;
  } else if (eventType === "DeliveryDelay") {
    return data.deliveryDelay;
  } else {
    return data[eventType.toLowerCase() as SesEventDataKey];
  }
}
