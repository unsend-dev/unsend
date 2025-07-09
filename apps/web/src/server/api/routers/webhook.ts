import { createTRPCRouter, protectedProcedure, teamProcedure } from "../trpc";
import { webhookSchema } from "~/lib/zod/webhook-schema";
import { z } from "zod";

export const webhookRouter = createTRPCRouter({
  create: teamProcedure.input(webhookSchema).mutation(async ({ ctx, input }) => {
    return await ctx.db.webhook.create({
      data: {
        ...input,
        teamId: ctx.team.id,
      },
    });
  }),

  list: teamProcedure.query(async ({ ctx }) => {
    return await ctx.db.webhook.findMany({
      where: {
        teamId: ctx.team.id,
      },
      include: {
        domain: true,
      },
    });
  }),

  update: teamProcedure
    .input(webhookSchema.extend({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return await ctx.db.webhook.update({
        where: {
          id,
        teamId: ctx.team.id,
        },
        data,
      });
    }),

  delete: teamProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    return await ctx.db.webhook.delete({
      where: {
        id: input,
        teamId: ctx.team.id,
      },
    });
  }),
});
