import { DailyEmailUsage, EmailUsageType } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { format } from "date-fns";
import { z } from "zod";

import {
  apiKeyProcedure,
  createTRPCRouter,
  teamProcedure,
} from "~/server/api/trpc";
import { createCheckoutSessionForTeam } from "~/server/billing/payments";
import { db } from "~/server/db";
import { addApiKey, deleteApiKey } from "~/server/service/api-service";

export const billingRouter = createTRPCRouter({
  createCheckoutSession: teamProcedure.mutation(async ({ ctx }) => {
    if (ctx.team.plan !== "FREE") {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Team is already on a paid plan",
      });
    }

    return (await createCheckoutSessionForTeam(ctx.team.id)).url;
  }),

  getThisMonthUsage: teamProcedure.query(async ({ ctx }) => {
    const isoStartDate = format(new Date(), "yyyy-MM-00");

    console.log({ isoStartDate });

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
