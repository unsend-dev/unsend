export const SES_WEBHOOK_QUEUE = "ses-webhook";
export const CAMPAIGN_MAIL_PROCESSING_QUEUE = "campaign-emails-processing";

export const DEFAULT_QUEUE_OPTIONS = {
  removeOnComplete: true,
  removeOnFail: {
    age: 30 * 24 * 3600, // 30 days
  },
};
