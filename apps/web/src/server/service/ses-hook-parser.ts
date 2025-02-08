import { EmailStatus, Prisma } from "@prisma/client";
import { SesClick, SesEvent, SesEventDataKey } from "~/types/aws-types";
import { db } from "../db";
import { updateCampaignAnalytics } from "./campaign-service";
import { env } from "~/env";
import { getRedis } from "../redis";
import { Queue, Worker } from "bullmq";
import {
  DEFAULT_QUEUE_OPTIONS,
  SES_WEBHOOK_QUEUE,
} from "../queue/queue-constants";

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
        WHEN ${mailStatus}::text::\"EmailStatus\" > "latestStatus" OR "latestStatus" IS NULL OR "latestStatus" = 'SCHEDULED'::\"EmailStatus\"
        THEN ${mailStatus}::text::\"EmailStatus\"
        ELSE "latestStatus"
      END
      WHERE id = ${email.id}
    `;

  // Update daily email usage statistics
  const today = new Date().toISOString().split("T")[0] as string; // Format: YYYY-MM-DD

  if (
    [
      "DELIVERED",
      "OPENED",
      "CLICKED",
      "BOUNCED",
      "COMPLAINED",
      "SENT",
    ].includes(mailStatus)
  ) {
    const updateField = mailStatus.toLowerCase();

    await db.dailyEmailUsage.upsert({
      where: {
        teamId_domainId_date_type: {
          teamId: email.teamId,
          domainId: email.domainId ?? 0,
          date: today,
          type: email.campaignId ? "MARKETING" : "TRANSACTIONAL",
        },
      },
      create: {
        teamId: email.teamId,
        domainId: email.domainId ?? 0,
        date: today,
        type: email.campaignId ? "MARKETING" : "TRANSACTIONAL",
        delivered: updateField === "delivered" ? 1 : 0,
        opened: updateField === "opened" ? 1 : 0,
        clicked: updateField === "clicked" ? 1 : 0,
        bounced: updateField === "bounced" ? 1 : 0,
        complained: updateField === "complained" ? 1 : 0,
        sent: updateField === "sent" ? 1 : 0,
      },
      update: {
        [updateField]: {
          increment: 1,
        },
      },
    });
  }

  if (email.campaignId) {
    if (
      mailStatus !== "CLICKED" ||
      !(mailData as SesClick).link.startsWith(`${env.NEXTAUTH_URL}/unsubscribe`)
    ) {
      const mailEvent = await db.emailEvent.findFirst({
        where: {
          emailId: email.id,
          status: mailStatus,
        },
      });

      if (!mailEvent) {
        await updateCampaignAnalytics(email.campaignId, mailStatus);
      }
    }
  }

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

export class SesHookParser {
  private static sesHookQueue = new Queue(SES_WEBHOOK_QUEUE, {
    connection: getRedis(),
  });

  private static worker = new Worker(
    SES_WEBHOOK_QUEUE,
    async (job) => {
      await this.execute(job.data);
    },
    {
      connection: getRedis(),
      concurrency: 200,
    }
  );

  private static async execute(event: SesEvent) {
    await parseSesHook(event);
  }

  static async queue(data: { event: SesEvent; messageId: string }) {
    return await this.sesHookQueue.add(
      data.messageId,
      data.event,
      DEFAULT_QUEUE_OPTIONS
    );
  }
}
