import { z } from "zod";

import { createTRPCRouter, teamProcedure } from "~/server/api/trpc";
import { addApiKey, deleteApiKey } from "~/server/service/api-service";

export const apiRouter = createTRPCRouter({
  createToken: teamProcedure
    .input(
      z.object({ name: z.string(), permission: z.enum(["FULL", "SENDING"]) })
    )
    .mutation(async ({ ctx, input }) => {
      return addApiKey({
        name: input.name,
        permission: input.permission,
        teamId: ctx.team.id,
      });
    }),

  getApiKeys: teamProcedure.query(async ({ ctx }) => {
    const keys = await ctx.db.apiKey.findMany({
      where: {
        teamId: ctx.team.id,
      },
      select: {
        id: true,
        name: true,
        permission: true,
        partialToken: true,
        lastUsed: true,
        createdAt: true,
      },
    });

    return keys;
  }),

  deleteApiKey: teamProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return deleteApiKey(input.id);
    }),
});
