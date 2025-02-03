import Stripe from "stripe";
import { env } from "~/env";
import { db } from "../db";

function getStripe() {
  if (!env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not set");
  }

  return new Stripe(env.STRIPE_SECRET_KEY);
}

export async function createCustomerForTeam(teamId: number) {
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

  if (!team.stripeCustomerId) {
    await createCustomerForTeam(teamId);
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: team.stripeCustomerId,
    line_items: [
      {
        price: env.STRIPE_PRICE_ID,
        quantity: 1,
      },
    ],
    success_url: `${env.NEXTAUTH_URL}/?success=true&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${env.NEXTAUTH_URL}/?canceled=true`,
    metadata: {
      teamId,
    },
  });
}
