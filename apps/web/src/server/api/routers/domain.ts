import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
  teamProcedure,
} from "~/server/api/trpc";
import { db } from "~/server/db";
import { createDomain, getDomain } from "~/server/service/domain-service";

export const domainRouter = createTRPCRouter({
  createDomain: teamProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return createDomain(ctx.team.id, input.name);
    }),

  domains: teamProcedure.query(async ({ ctx }) => {
    const domains = await db.domain.findMany({
      where: {
        teamId: ctx.team.id,
      },
    });

    return domains;
  }),

  getDomain: teamProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      return getDomain(input.id);
    }),
});
