import { AppSettingsService } from "~/server/service/app-settings-service";
import { parseSesHook } from "~/server/service/ses-hook-parser";
import { SnsNotificationMessage } from "~/types/aws-types";
import { APP_SETTINGS } from "~/utils/constants";

export async function GET(req: Request) {
  console.log("GET", req);
  return Response.json({ data: "Hello" });
}

export async function POST(req: Request) {
  const data = await req.json();

  console.log(data, data.Message);

  const isEventValid = await checkEventValidity(data);

  console.log("isEventValid: ", isEventValid);

  if (!isEventValid) {
    return Response.json({ data: "Event is not valid" });
  }

  if (data.Type === "SubscriptionConfirmation") {
    return handleSubscription(data);
  }

  let message = null;

  try {
    message = JSON.parse(data.Message || "{}");
    const status = await parseSesHook(message);
    console.log("Error is parsing hook", !status);
    if (!status) {
      return Response.json({ data: "Error is parsing hook" });
    }

    return Response.json({ data: "Success" });
  } catch (e) {
    console.error(e);
    return Response.json({ data: "Error is parsing hook" });
  }
}

async function handleSubscription(message: any) {
  await fetch(message.SubscribeURL, {
    method: "GET",
  });

  return Response.json({ data: "Success" });
}

// A simple check to ensure that the event is from the correct topic
async function checkEventValidity(message: SnsNotificationMessage) {
  const { TopicArn } = message;
  const configuredTopicArn = await AppSettingsService.getSetting(
    APP_SETTINGS.SNS_TOPIC_ARN
  );

  if (TopicArn !== configuredTopicArn) {
    return false;
  }

  return true;
}
