import { EmailRenderer } from "@unsend/email-editor/src/renderer";
import { db } from "../db";
import { createHash } from "crypto";
import { env } from "~/env";
import { Campaign, Contact, EmailStatus } from "@prisma/client";
import { validateDomainFromEmail } from "./domain-service";
import { EmailQueueService } from "./email-queue-service";

export async function sendCampaign(id: string) {
  let campaign = await db.campaign.findUnique({
    where: { id },
  });

  if (!campaign) {
    throw new Error("Campaign not found");
  }

  if (!campaign.content) {
    throw new Error("No content added for campaign");
  }

  let jsonContent: Record<string, any>;

  try {
    jsonContent = JSON.parse(campaign.content);
    const renderer = new EmailRenderer(jsonContent);
    const html = await renderer.render();
    campaign = await db.campaign.update({
      where: { id },
      data: { html },
    });
  } catch (error) {
    console.error(error);
    throw new Error("Failed to parse campaign content");
  }

  if (!campaign.contactBookId) {
    throw new Error("No contact book found for campaign");
  }

  const contactBook = await db.contactBook.findUnique({
    where: { id: campaign.contactBookId },
    include: {
      contacts: {
        where: {
          subscribed: true,
        },
      },
    },
  });

  if (!contactBook) {
    throw new Error("Contact book not found");
  }

  if (!campaign.html) {
    throw new Error("No HTML content for campaign");
  }

  await sendCampaignEmail(campaign, {
    campaignId: campaign.id,
    from: campaign.from,
    subject: campaign.subject,
    html: campaign.html,
    replyTo: campaign.replyTo,
    cc: campaign.cc,
    bcc: campaign.bcc,
    teamId: campaign.teamId,
    contacts: contactBook.contacts,
  });

  await db.campaign.update({
    where: { id },
    data: { status: "SENT", total: contactBook.contacts.length },
  });
}

export function createUnsubUrl(contactId: string, campaignId: string) {
  const unsubId = `${contactId}-${campaignId}`;

  const unsubHash = createHash("sha256")
    .update(`${unsubId}-${env.NEXTAUTH_SECRET}`)
    .digest("hex");

  return `${env.NEXTAUTH_URL}/unsubscribe?id=${unsubId}&hash=${unsubHash}`;
}

export async function unsubscribeContact(id: string, hash: string) {
  const [contactId, campaignId] = id.split("-");

  if (!contactId || !campaignId) {
    throw new Error("Invalid unsubscribe link");
  }

  // Verify the hash
  const expectedHash = createHash("sha256")
    .update(`${id}-${env.NEXTAUTH_SECRET}`)
    .digest("hex");

  if (hash !== expectedHash) {
    throw new Error("Invalid unsubscribe link");
  }

  // Update the contact's subscription status
  try {
    const contact = await db.contact.findUnique({
      where: { id: contactId },
    });

    if (!contact) {
      throw new Error("Contact not found");
    }

    if (contact.subscribed) {
      await db.contact.update({
        where: { id: contactId },
        data: { subscribed: false },
      });

      await db.campaign.update({
        where: { id: campaignId },
        data: {
          unsubscribed: {
            increment: 1,
          },
        },
      });
    }

    return contact;
  } catch (error) {
    console.error("Error unsubscribing contact:", error);
    throw new Error("Failed to unsubscribe contact");
  }
}

export async function subscribeContact(id: string, hash: string) {
  const [contactId, campaignId] = id.split("-");

  if (!contactId || !campaignId) {
    throw new Error("Invalid subscribe link");
  }

  // Verify the hash
  const expectedHash = createHash("sha256")
    .update(`${id}-${env.NEXTAUTH_SECRET}`)
    .digest("hex");

  if (hash !== expectedHash) {
    throw new Error("Invalid subscribe link");
  }

  // Update the contact's subscription status
  try {
    const contact = await db.contact.findUnique({
      where: { id: contactId },
    });

    if (!contact) {
      throw new Error("Contact not found");
    }

    if (!contact.subscribed) {
      await db.contact.update({
        where: { id: contactId },
        data: { subscribed: true },
      });

      await db.campaign.update({
        where: { id: campaignId },
        data: {
          unsubscribed: {
            decrement: 1,
          },
        },
      });
    }

    return true;
  } catch (error) {
    console.error("Error subscribing contact:", error);
    throw new Error("Failed to subscribe contact");
  }
}

type CampainEmail = {
  campaignId: string;
  from: string;
  subject: string;
  html: string;
  previewText?: string;
  replyTo?: string[];
  cc?: string[];
  bcc?: string[];
  teamId: number;
  contacts: Array<Contact>;
};

export async function sendCampaignEmail(
  campaign: Campaign,
  emailData: CampainEmail
) {
  const {
    campaignId,
    from,
    subject,
    replyTo,
    cc,
    bcc,
    teamId,
    contacts,
    previewText,
  } = emailData;

  const jsonContent = JSON.parse(campaign.content || "{}");
  const renderer = new EmailRenderer(jsonContent);

  const domain = await validateDomainFromEmail(from, teamId);

  const contactWithHtml = await Promise.all(
    contacts.map(async (contact) => {
      const unsubscribeUrl = createUnsubUrl(contact.id, campaignId);

      return {
        ...contact,
        html: await renderer.render({
          shouldReplaceVariableValues: true,
          variableValues: {
            email: contact.email,
            firstName: contact.firstName,
            lastName: contact.lastName,
          },
          linkValues: {
            "{{unsend_unsubscribe_url}}": unsubscribeUrl,
          },
        }),
      };
    })
  );

  // Create emails in bulk
  await db.email.createMany({
    data: contactWithHtml.map((contact) => ({
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
      html: contact.html,
      text: previewText,
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
    emails.map((email) => {
      const unsubscribeUrl = createUnsubUrl(email.contactId, campaignId);
      EmailQueueService.queueEmail(email.id, domain.region, false, unsubscribeUrl);
    })
  );
}

export async function updateCampaignAnalytics(
  campaignId: string,
  emailStatus: EmailStatus
) {
  const campaign = await db.campaign.findUnique({
    where: { id: campaignId },
  });

  if (!campaign) {
    throw new Error("Campaign not found");
  }

  const updateData: Record<string, any> = {};

  switch (emailStatus) {
    case EmailStatus.SENT:
      updateData.sent = { increment: 1 };
      break;
    case EmailStatus.DELIVERED:
      updateData.delivered = { increment: 1 };
      break;
    case EmailStatus.OPENED:
      updateData.opened = { increment: 1 };
      break;
    case EmailStatus.CLICKED:
      updateData.clicked = { increment: 1 };
      break;
    case EmailStatus.BOUNCED:
      updateData.bounced = { increment: 1 };
      break;
    case EmailStatus.COMPLAINED:
      updateData.complained = { increment: 1 };
      break;
    default:
      break;
  }

  await db.campaign.update({
    where: { id: campaignId },
    data: updateData,
  });
}
