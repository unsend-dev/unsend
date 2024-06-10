import { SesSetting } from "@prisma/client";
import { db } from "../db";
import { env } from "~/env";
import { customAlphabet } from "nanoid";
import * as sns from "~/server/aws/sns";
import * as ses from "~/server/aws/ses";
import { EventType } from "@aws-sdk/client-sesv2";

const nanoid = customAlphabet("1234567890abcdef", 10);

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

export class SesSettingsService {
  private static cache: Record<string, SesSetting> = {};

  public static getSetting(region = env.AWS_DEFAULT_REGION): SesSetting | null {
    if (this.cache[region]) {
      return this.cache[region] as SesSetting;
    }
    return null;
  }

  public static getAllSettings() {
    return Object.values(this.cache);
  }

  /**
   * Creates a new setting in AWS for the given region and unsendUrl
   *
   * @param region
   * @param unsendUrl
   */
  public static async createSesSetting({
    region,
    unsendUrl,
  }: {
    region: string;
    unsendUrl: string;
  }) {
    if (this.cache[region]) {
      throw new Error(`SesSetting for region ${region} already exists`);
    }

    const unsendUrlValidation = await isValidUnsendUrl(unsendUrl);

    if (!unsendUrlValidation.isValid) {
      throw new Error(
        `Unsend URL ${unsendUrl} is not valid, status: ${unsendUrlValidation.code} ${unsendUrlValidation.error}`
      );
    }

    const idPrefix = nanoid(10);

    const setting = await db.sesSetting.create({
      data: {
        region,
        callbackUrl: `${unsendUrl}/api/ses_callback`,
        topic: `${idPrefix}-${region}-unsend`,
        idPrefix,
      },
    });

    await createSettingInAws(setting);

    this.invalidateCache();
  }

  public static async init() {
    const settings = await db.sesSetting.findMany();
    settings.forEach((setting) => {
      this.cache[setting.region] = setting;
    });
  }

  static invalidateCache() {
    this.cache = {};
    this.init();
  }
}

async function createSettingInAws(setting: SesSetting) {
  await registerTopicInAws(setting).then(registerConfigurationSet);
}

/**
 * Creates a new topic in AWS and subscribes the callback URL to it
 */
async function registerTopicInAws(setting: SesSetting) {
  const topicArn = await sns.createTopic(setting.topic);

  if (!topicArn) {
    throw new Error("Failed to create SNS topic");
  }

  await sns.subscribeEndpoint(
    topicArn,
    `${setting.callbackUrl}/api/ses_callback`
  );

  return await db.sesSetting.update({
    where: {
      id: setting.id,
    },
    data: {
      topicArn,
    },
  });
}

/**
 * Creates a new configuration set in AWS for given region
 * Totally consist of 4 configs.
 * 1. General - for general events
 * 2. Click - for click tracking
 * 3. Open - for open tracking
 * 4. Full - for click and open tracking
 */
async function registerConfigurationSet(setting: SesSetting) {
  if (!setting.topicArn) {
    throw new Error("Setting does not have a topic ARN");
  }

  const configGeneral = `${setting.idPrefix}-${setting.region}-unsend-general`;
  const generalStatus = await ses.addWebhookConfiguration(
    configGeneral,
    setting.topicArn,
    GENERAL_EVENTS
  );

  const configClick = `${setting.idPrefix}-${setting.region}-unsend-click`;
  const clickStatus = await ses.addWebhookConfiguration(
    configClick,
    setting.topicArn,
    [...GENERAL_EVENTS, "CLICK"]
  );

  const configOpen = `${setting.idPrefix}-${setting.region}-unsend-open`;
  const openStatus = await ses.addWebhookConfiguration(
    configOpen,
    setting.topicArn,
    [...GENERAL_EVENTS, "OPEN"]
  );

  const configFull = `${setting.idPrefix}-${setting.region}-unsend-full`;
  const fullStatus = await ses.addWebhookConfiguration(
    configFull,
    setting.topicArn,
    [...GENERAL_EVENTS, "CLICK", "OPEN"]
  );

  return await db.sesSetting.update({
    where: {
      id: setting.id,
    },
    data: {
      configGeneral,
      configGeneralSuccess: generalStatus,
      configClick,
      configClickSuccess: clickStatus,
      configOpen,
      configOpenSuccess: openStatus,
      configFull,
      configFullSuccess: fullStatus,
    },
  });
}

async function isValidUnsendUrl(url: string) {
  try {
    const response = await fetch(`${url}/api/ses_callback`, {
      method: "POST",
      body: JSON.stringify({ fromUnsend: true }),
    });
    return {
      isValid: response.status === 200,
      code: response.status,
      error: response.statusText,
    };
  } catch (e) {
    return {
      isValid: false,
      code: 500,
      error: e,
    };
  }
}
