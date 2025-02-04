import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  apiKeyProcedure,
  createTRPCRouter,
  teamProcedure,
} from "~/server/api/trpc";
import { createCheckoutSessionForTeam } from "~/server/billing/payments";
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
});
