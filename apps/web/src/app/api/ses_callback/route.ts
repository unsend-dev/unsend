import { headers } from "next/headers";
import { hashToken } from "~/server/auth";
import { db } from "~/server/db";
import { parseSesHook } from "~/server/service/ses-hook-parser";

export async function GET(req: Request) {
  console.log("GET", req);
  return Response.json({ data: "Hello" });
}

export async function POST(req: Request) {
  const data = await req.json();

  console.log(data, data.Message);

  if (data.Type === "SubscriptionConfirmation") {
    return handleSubscription(data);
  }

  let message = null;

  try {
    message = JSON.parse(data.Message || "{}");
    const status = await parseSesHook(message);
    if (!status) {
      return Response.json({ data: "Error is parsing hook" }, { status: 400 });
    }

    return Response.json({ data: "Success" });
  } catch (e) {
    console.error(e);
    return Response.json({ data: "Error is parsing hook" }, { status: 400 });
  }
}

async function handleSubscription(message: any) {
  const subResponse = await fetch(message.SubscribeURL, {
    method: "GET",
  });

  return Response.json({ data: "Success" });
}
