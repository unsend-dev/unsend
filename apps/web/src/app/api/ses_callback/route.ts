import { headers } from "next/headers";
import { hashToken } from "~/server/auth";
import { db } from "~/server/db";

export async function GET(req: Request) {
  console.log("GET", req);
  return Response.json({ data: "Hello" });
}

export async function POST(req: Request) {
  const data = await req.json();

  if (data.Type === "SubscriptionConfirmation") {
    return handleSubscription(data);
  }

  console.log(data, data.Message);

  let message = null;

  try {
    message = JSON.parse(data.Message || "{}");
  } catch (e) {
    console.log(e);
  }

  const emailId = message?.mail.messageId;

  console.log(emailId, message);

  if (!emailId) {
    return Response.json({ data: "Email not found" });
  }

  const email = await db.email.findUnique({
    where: {
      id: emailId,
    },
  });

  if (!email || !message.mail) {
    return Response.json({ data: "Email not found" });
  }

  console.log("FOund email", email);

  await db.email.update({
    where: {
      id: email.id,
    },
    data: {
      latestStatus: message.eventType,
    },
  });

  await db.emailEvent.upsert({
    where: {
      emailId_status: {
        emailId,
        status: message.eventType,
      },
    },
    update: {
      data: message[message.eventType.toLowerCase()],
    },
    create: {
      emailId,
      status: message.eventType,
      data: message[message.eventType.toLowerCase()],
    },
  });

  return Response.json({ data: "Hello" });
}

async function handleSubscription(message: any) {
  const subResponse = await fetch(message.SubscribeURL, {
    method: "GET",
  });

  return Response.json({ data: "Hello" });
}
