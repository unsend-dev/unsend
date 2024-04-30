import { z } from "zod";

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

      if (teams) {
        console.log("User already has a team");
        return;
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
