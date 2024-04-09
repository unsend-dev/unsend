import { JsonValue } from "@prisma/client/runtime/library";
import { db } from "../db";
import { APP_SETTINGS } from "~/utils/constants";
import { createTopic, subscribeEndpoint } from "./sns";
import { env } from "~/env";
import { AppSettingsService } from "~/server/service/app-settings-service";
import { addWebhookConfiguration } from "../ses";
import { EventType } from "@aws-sdk/client-sesv2";

const GENERAL_EVENTS: EventType[] = [
  "BOUNCE",
  "COMPLAINT",
  "DELIVERY",
  "DELIVERY_DELAY",
  "REJECT",
  "RENDERING_FAILURE",
  "SEND",
  "SUBSCRIPTION",
];

export async function setupAws() {
  AppSettingsService.initializeCache();
  let snsTopicArn = await AppSettingsService.getSetting(
    APP_SETTINGS.SNS_TOPIC_ARN
  );
  console.log("Setting up AWS");

  if (!snsTopicArn) {
    console.log("SNS topic not present, creating...");
    snsTopicArn = await createUnsendSNSTopic();
  }

  await setupSESConfiguration();
}

async function createUnsendSNSTopic() {
  const topicArn = await createTopic(env.SNS_TOPIC);
  if (!topicArn) {
    console.error("Failed to create SNS topic");
    return;
  }

  await subscribeEndpoint(
    topicArn,
    `${env.APP_URL ?? env.NEXTAUTH_URL}/api/ses_callback`
  );

  return await AppSettingsService.setSetting(
    APP_SETTINGS.SNS_TOPIC_ARN,
    topicArn
  );
}

async function setupSESConfiguration() {
  const topicArn = (
    await AppSettingsService.getSetting(APP_SETTINGS.SNS_TOPIC_ARN)
  )?.toString();

  if (!topicArn) {
    return;
  }
  console.log("Setting up SES webhook configuration");

  await setWebhookConfiguration(
    APP_SETTINGS.SES_CONFIGURATION_GENERAL,
    topicArn,
    GENERAL_EVENTS
  );

  await setWebhookConfiguration(
    APP_SETTINGS.SES_CONFIGURATION_CLICK_TRACKING,
    topicArn,
    [...GENERAL_EVENTS, "CLICK"]
  );

  await setWebhookConfiguration(
    APP_SETTINGS.SES_CONFIGURATION_OPEN_TRACKING,
    topicArn,
    [...GENERAL_EVENTS, "OPEN"]
  );

  await setWebhookConfiguration(APP_SETTINGS.SES_CONFIGURATION_FULL, topicArn, [
    ...GENERAL_EVENTS,
    "CLICK",
    "OPEN",
  ]);
}

async function setWebhookConfiguration(
  setting: string,
  topicArn: string,
  eventTypes: EventType[]
) {
  const sesConfigurationGeneral = await AppSettingsService.getSetting(setting);

  if (!sesConfigurationGeneral) {
    console.log(`Setting up SES webhook configuration for ${setting}`);
    const status = await addWebhookConfiguration(setting, topicArn, eventTypes);
    await AppSettingsService.setSetting(setting, status.toString());
  }
}
