import { DailyEmailUsage, EmailUsageType } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { format } from "date-fns";
import { z } from "zod";

import {
  apiKeyProcedure,
  createTRPCRouter,
  teamProcedure,
} from "~/server/api/trpc";
import {
  createCheckoutSessionForTeam,
  getManageSessionUrl,
} from "~/server/billing/payments";
import { db } from "~/server/db";

export const billingRouter = createTRPCRouter({
  createCheckoutSession: teamProcedure.mutation(async ({ ctx }) => {
    return (await createCheckoutSessionForTeam(ctx.team.id)).url;
  }),

  getManageSessionUrl: teamProcedure.mutation(async ({ ctx }) => {
    return await getManageSessionUrl(ctx.team.id);
  }),

  getThisMonthUsage: teamProcedure.query(async ({ ctx }) => {
    const isoStartDate = format(new Date(), "yyyy-MM-01"); // First day of current month
    const today = format(new Date(), "yyyy-MM-dd");

    const [monthUsage, dayUsage] = await Promise.all([
      // Get month usage
      db.$queryRaw<Array<{ type: EmailUsageType; sent: number }>>`
        SELECT 
          type,
          SUM(sent)::integer AS sent
        FROM "DailyEmailUsage"
        WHERE "teamId" = ${ctx.team.id}
        AND "date" >= ${isoStartDate}
        GROUP BY "type"
      `,
      // Get today's usage
      db.$queryRaw<Array<{ type: EmailUsageType; sent: number }>>`
        SELECT 
          type,
          SUM(sent)::integer AS sent
        FROM "DailyEmailUsage"
        WHERE "teamId" = ${ctx.team.id}
        AND "date" = ${today}
        GROUP BY "type"
      `,
    ]);

    return {
      month: monthUsage,
      day: dayUsage,
    };
  }),

  getSubscriptionDetails: teamProcedure.query(async ({ ctx }) => {
    const subscription = await db.subscription.findFirst({
      where: { teamId: ctx.team.id },
      orderBy: { status: "asc" },
    });

    return subscription;
  }),

  updateBillingEmail: teamProcedure
    .input(
      z.object({
        billingEmail: z.string().email(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { billingEmail } = input;

      await db.team.update({
        where: { id: ctx.team.id },
        data: { billingEmail },
      });
    }),
});
