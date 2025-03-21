import Stripe from "stripe";
import { env } from "~/env";
import { db } from "../db";

function getStripe() {
  if (!env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not set");
  }

  return new Stripe(env.STRIPE_SECRET_KEY);
}

async function createCustomerForTeam(teamId: number) {
  const stripe = getStripe();
  const customer = await stripe.customers.create({ metadata: { teamId } });

  await db.team.update({
    where: { id: teamId },
    data: {
      stripeCustomerId: customer.id,
    },
  });

  return customer;
}

export async function createCheckoutSessionForTeam(teamId: number) {
  const team = await db.team.findUnique({
    where: { id: teamId },
  });

  if (!team) {
    throw new Error("Team not found");
  }

  const stripe = getStripe();

  let customerId = team.stripeCustomerId;

  if (!customerId) {
    await createCustomerForTeam(teamId);
    customerId = team.stripeCustomerId;
  }

  if (!env.STRIPE_BASIC_PRICE_ID || !customerId) {
    throw new Error("Stripe prices are not set");
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [
      {
        price: env.STRIPE_BASIC_PRICE_ID,
      },
    ],
    success_url: `${env.NEXTAUTH_URL}/payments?success=true&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${env.NEXTAUTH_URL}/payments?canceled=true`,
    metadata: {
      teamId,
    },
    client_reference_id: teamId.toString(),
  });

  return session;
}

function getPlanFromPriceId(priceId: string) {
  if (priceId === env.STRIPE_BASIC_PRICE_ID) {
    return "BASIC";
  }

  return "FREE";
}

export async function syncStripeData(customerId: string) {
  const stripe = getStripe();

  const team = await db.team.findUnique({
    where: { stripeCustomerId: customerId },
  });

  if (!team) {
    return;
  }

  const subscriptions = await stripe.subscriptions.list({
    customer: customerId,
    limit: 1,
    status: "all",
    expand: ["data.default_payment_method"],
  });

  const subscription = subscriptions.data[0];

  if (!subscription) {
    return;
  }

  await db.subscription.upsert({
    where: { id: subscription.id },
    update: {
      status: subscription.status,
      priceId: subscription.items.data[0]?.price?.id || "",
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      cancelAtPeriodEnd: subscription.cancel_at
        ? new Date(subscription.cancel_at * 1000)
        : null,
      paymentMethod: JSON.stringify(subscription.default_payment_method),
      teamId: team.id,
    },
    create: {
      id: subscription.id,
      status: subscription.status,
      priceId: subscription.items.data[0]?.price?.id || "",
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      cancelAtPeriodEnd: subscription.cancel_at
        ? new Date(subscription.cancel_at * 1000)
        : null,
      paymentMethod: JSON.stringify(subscription.default_payment_method),
      teamId: team.id,
    },
  });

  await db.team.update({
    where: { id: team.id },
    data: {
      plan: getPlanFromPriceId(subscription.items.data[0]?.price?.id || ""),
    },
  });
}
