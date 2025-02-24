import Stripe from "stripe";
import { env } from "~/env";

const METER_EVENT_NAME = "unsend_usage";

/**
 * Gets timestamp for usage reporting, set to yesterday's date
 * Converts to Unix timestamp (seconds since epoch)
 * @returns Unix timestamp in seconds for yesterday's date
 */
export function getUsageTimestamp() {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return Math.floor(yesterday.getTime() / 1000);
}

/**
 * Gets yesterday's date in YYYY-MM-DD format
 * @returns Yesterday's date string in YYYY-MM-DD format
 */
export function getUsageDate(): string {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const isoString = yesterday.toISOString();
  return isoString.split("T")[0] as string;
}

/**
 * Calculates total usage units based on marketing and transaction emails
 * 1 marketing email = 1 unit
 * 4 transaction emails = 1 unit
 * @param marketingUsage Number of marketing emails sent
 * @param transactionUsage Number of transaction emails sent
 * @returns Total usage units rounded down to nearest integer
 */
export function getUsageUinits(
  marketingUsage: number,
  transactionUsage: number
) {
  return marketingUsage + Math.floor(transactionUsage / 4);
}

export async function sendUsageToStripe(customerId: string, usage: number) {
  const stripe = new Stripe(env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-01-27.acacia",
  });

  const meterEvent = await stripe.billing.meterEvents.create({
    event_name: METER_EVENT_NAME,
    payload: {
      value: usage.toString(),
      stripe_customer_id: customerId,
    },
    timestamp: getUsageTimestamp(),
  });

  return meterEvent;
}
