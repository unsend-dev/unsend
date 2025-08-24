import { EmailUsageType, Plan, Subscription } from "@prisma/client";
import { format } from "date-fns";
import { db } from "~/server/db";

export const USAGE_UNIT_PRICE: Record<EmailUsageType, number> = {
  [EmailUsageType.MARKETING]: 0.001,
  [EmailUsageType.TRANSACTIONAL]: 0.0004,
};

/**
 * Unit price for unsend
 * 1 marketing email = 1 unit
 * 4 transaction emails = 1 unit
 */
export const UNIT_PRICE = 0.001;

export const TRANSACTIONAL_UNIT_CONVERSION =
  UNIT_PRICE / USAGE_UNIT_PRICE[EmailUsageType.TRANSACTIONAL];

/**
 * Number of credits per plan
 * Credits are the units of measurement for email sending capacity.
 * Each plan comes with a specific number of credits that can be used for sending emails.
 * Marketing emails consume 1 credit per email, while transactional emails consume 0.25 credits per email.
 */
export const PLAN_CREDIT_UNITS = {
  [Plan.BASIC]: 10_000,
};

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

 * @param marketingUsage Number of marketing emails sent
 * @param transactionUsage Number of transaction emails sent
 * @returns Total usage units rounded down to nearest integer
 */
export function getUsageUinits(
  marketingUsage: number,
  transactionUsage: number
) {
  return (
    marketingUsage +
    Math.floor(transactionUsage / TRANSACTIONAL_UNIT_CONVERSION)
  );
}

export function getCost(usage: number, type: EmailUsageType) {
  const calculatedUsage =
    type === EmailUsageType.MARKETING
      ? usage
      : Math.floor(usage / TRANSACTIONAL_UNIT_CONVERSION);

  return calculatedUsage * UNIT_PRICE;
}

/**
 * Gets the monthly and daily usage for a team
 * @param teamId - The team ID to get usage for
 * @param db - Prisma database client
 * @param subscription - Optional subscription to determine billing period start
 * @returns Object containing month and day usage arrays
 */
export async function getThisMonthUsage(teamId: number) {
  const team = await db.team.findUnique({
    where: { id: teamId },
  });

  if (!team) {
    throw new Error("Team not found");
  }

  let subscription: Subscription | null = null;
  const isPaidPlan = team.plan !== "FREE";

  if (isPaidPlan) {
    subscription = await db.subscription.findFirst({
      where: { teamId: team.id },
      orderBy: { status: "asc" },
    });
  }

  const isoStartDate = subscription?.currentPeriodStart
    ? format(subscription.currentPeriodStart, "yyyy-MM-dd")
    : format(new Date(), "yyyy-MM-01"); // First day of current month
  const today = format(new Date(), "yyyy-MM-dd");

  const [monthUsage, dayUsage] = await Promise.all([
    // Get month usage
    db.$queryRaw<Array<{ type: EmailUsageType; sent: number }>>`
        SELECT 
          type,
          SUM(sent)::integer AS sent
        FROM "DailyEmailUsage"
        WHERE "teamId" = ${team.id}
        AND "date" >= ${isoStartDate}
        GROUP BY "type"
      `,
    // Get today's usage
    db.$queryRaw<Array<{ type: EmailUsageType; sent: number }>>`
        SELECT 
          type,
          SUM(sent)::integer AS sent
        FROM "DailyEmailUsage"
        WHERE "teamId" = ${team.id}
        AND "date" = ${today}
        GROUP BY "type"
      `,
  ]);

  return {
    month: monthUsage,
    day: dayUsage,
  };
}
