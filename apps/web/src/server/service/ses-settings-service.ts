import { SesSetting } from "@prisma/client";
import { db } from "../db";
import { env } from "~/env";
import * as sns from "~/server/aws/sns";
import * as ses from "~/server/aws/ses";
import { EventType } from "@aws-sdk/client-sesv2";
import { EmailQueueService } from "./email-queue-service";
import { smallNanoid } from "../nanoid";

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
  private static topicArns: Array<string> = [];
  private static initialized = false;

  public static async getSetting(
    region = env.AWS_DEFAULT_REGION
  ): Promise<SesSetting | null> {
    await this.checkInitialized();
    if (this.cache[region]) {
      return this.cache[region] as SesSetting;
    }
    return null;
  }

  public static async getTopicArns() {
    await this.checkInitialized();
    return this.topicArns;
  }

  public static async getAllSettings() {
    await this.checkInitialized();
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
    sendingRateLimit,
    transactionalQuota,
  }: {
    region: string;
    unsendUrl: string;
    sendingRateLimit: number;
    transactionalQuota: number;
  }) {
    await this.checkInitialized();
    if (this.cache[region]) {
      throw new Error(`SesSetting for region ${region} already exists`);
    }

    const parsedUrl = unsendUrl.endsWith("/")
      ? unsendUrl.substring(0, unsendUrl.length - 1)
      : unsendUrl;

    const unsendUrlValidation = await isValidUnsendUrl(parsedUrl);

    if (!unsendUrlValidation.isValid) {
      throw new Error(
        `Unsend URL: ${unsendUrl} is not valid, status: ${unsendUrlValidation.code} message:${unsendUrlValidation.error}`
      );
    }

    const idPrefix = smallNanoid(10);
    let topicArn: string | undefined;

    try {
      const topicName = `${idPrefix}-${region}-unsend`;
      topicArn = await sns.createTopic(topicName, region);
      if (!topicArn) {
        throw new Error("Failed to create SNS topic");
      }

      const setting = await db.$transaction(async (tx) => {
        const setting = await tx.sesSetting.create({
          data: {
            region,
            callbackUrl: `${parsedUrl}/api/ses_callback`,
            topic: topicName,
            topicArn,
            sesEmailRateLimit: sendingRateLimit,
            transactionalQuota,
            idPrefix,
          },
        });

        await sns.subscribeEndpoint(
          topicArn!,
          `${setting.callbackUrl}`,
          setting.region
        );

        return setting;
      });

      if (!setting) {
        throw new Error("Failed to create setting");
      }

      await registerConfigurationSet(setting);

      EmailQueueService.initializeQueue(
        region,
        setting.sesEmailRateLimit,
        setting.transactionalQuota
      );
      console.log(
        EmailQueueService.transactionalQueue,
        EmailQueueService.marketingQueue
      );

      await this.invalidateCache();
    } catch (error) {
      if (topicArn) {
        try {
          await sns.deleteTopic(topicArn, region);
        } catch (deleteError) {
          console.error('Failed to delete SNS topic after error:', deleteError);
        }
      }
      throw error;
    }
  }

  public static async updateSesSetting({
    id,
    sendingRateLimit,
    transactionalQuota,
  }: {
    id: string;
    sendingRateLimit: number;
    transactionalQuota: number;
  }) {
    await this.checkInitialized();

    const setting = await db.sesSetting.update({
      where: {
        id,
      },
      data: {
        transactionalQuota,
        sesEmailRateLimit: sendingRateLimit,
      },
    });
    console.log(
      EmailQueueService.transactionalQueue,
      EmailQueueService.marketingQueue
    );

    EmailQueueService.initializeQueue(
      setting.region,
      setting.sesEmailRateLimit,
      setting.transactionalQuota
    );

    console.log(
      EmailQueueService.transactionalQueue,
      EmailQueueService.marketingQueue
    );

    await this.invalidateCache();
  }

  public static async checkInitialized() {
    if (!this.initialized) {
      await this.invalidateCache();
      this.initialized = true;
    }
  }

  static async invalidateCache() {
    this.cache = {};
    const settings = await db.sesSetting.findMany();
    settings.forEach((setting) => {
      this.cache[setting.region] = setting;
      if (setting.topicArn) {
        this.topicArns.push(setting.topicArn);
      }
    });
  }
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
    GENERAL_EVENTS,
    setting.region
  );

  const configClick = `${setting.idPrefix}-${setting.region}-unsend-click`;
  const clickStatus = await ses.addWebhookConfiguration(
    configClick,
    setting.topicArn,
    [...GENERAL_EVENTS, "CLICK"],
    setting.region
  );

  const configOpen = `${setting.idPrefix}-${setting.region}-unsend-open`;
  const openStatus = await ses.addWebhookConfiguration(
    configOpen,
    setting.topicArn,
    [...GENERAL_EVENTS, "OPEN"],
    setting.region
  );

  const configFull = `${setting.idPrefix}-${setting.region}-unsend-full`;
  const fullStatus = await ses.addWebhookConfiguration(
    configFull,
    setting.topicArn,
    [...GENERAL_EVENTS, "CLICK", "OPEN"],
    setting.region
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
  console.log("Checking if URL is valid", url);
  try {
    const response = await fetch(`${url}/api/ses_callback`, {
      method: "GET",
    });
    return {
      isValid: response.status === 200,
      code: response.status,
      error: response.statusText,
    };
  } catch (e) {
    console.log("Error checking if URL is valid", e);
    return {
      isValid: false,
      code: 500,
      error: e,
    };
  }
}
