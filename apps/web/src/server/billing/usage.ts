import Stripe from "stripe";
import { env } from "~/env";
import { getUsageTimestamp } from "~/lib/usage";

const METER_EVENT_NAME = "unsend_usage";

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
