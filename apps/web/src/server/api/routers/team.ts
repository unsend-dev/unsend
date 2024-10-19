import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { env } from "~/env";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const teamRouter = createTRPCRouter({
  createTeam: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const teams = await ctx.db.team.findMany({
        where: {
          teamUsers: {
            some: {
              userId: ctx.session.user.id,
            },
          },
        },
      });

      if (teams.length > 0) {
        console.log("User already has a team");
        return;
      }

      if (!env.NEXT_PUBLIC_IS_CLOUD) {
        const _team = await ctx.db.team.findFirst();
        if (_team) {
          throw new TRPCError({
            message: "Can't have multiple teams in self hosted version",
            code: "UNAUTHORIZED",
          });
        }
      }

      return ctx.db.team.create({
        data: {
          name: input.name,
          teamUsers: {
            create: {
              userId: ctx.session.user.id,
              role: "ADMIN",
            },
          },
        },
      });
    }),

  getTeams: protectedProcedure.query(async ({ ctx }) => {
    const teams = await ctx.db.team.findMany({
      where: {
        teamUsers: {
          some: {
            userId: ctx.session.user.id,
          },
        },
      },
    });

    return teams;
  }),
});
