import { EmailRenderer } from "@unsend/email-editor/src/renderer";
import { db } from "../db";
import { sendCampaignEmail } from "./email-service";
import { createHash } from "crypto";
import { env } from "~/env";

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

  await sendCampaignEmail({
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
    data: { status: "SENT" },
  });
}

export async function createUnsubUrl(contactId: string, campaignId: string) {
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
