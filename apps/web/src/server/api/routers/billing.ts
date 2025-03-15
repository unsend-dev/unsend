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

  // getSubscriptionDetails: teamProcedure.query(async ({ ctx }) => {
  //   const subscription = await db.subscription.findUnique({
  //     where: { teamId: ctx.team.id },
  //   });

  //   return subscription;
  // }),

  getManageSessionUrl: teamProcedure.mutation(async ({ ctx }) => {
    return await getManageSessionUrl(ctx.team.id);
  }),

  getThisMonthUsage: teamProcedure.query(async ({ ctx }) => {
    const isoStartDate = format(new Date(), "yyyy-MM-00");

    const usage = await db.$queryRaw<
      Array<{ type: EmailUsageType; sent: number }>
    >`
      SELECT 
        type,
        SUM(sent)::integer AS sent
      FROM "DailyEmailUsage"
      WHERE "teamId" = ${ctx.team.id}
      AND "date" >= ${isoStartDate}
      GROUP BY "type"
    `;

    return usage;
  }),
});
