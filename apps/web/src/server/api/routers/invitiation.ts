import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { env } from "~/env";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const invitationRouter = createTRPCRouter({
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

  getUserInvites: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.session.user.email) {
      return [];
    }

    const invites = await ctx.db.teamInvite.findMany({
      where: {
        email: ctx.session.user.email,
      },
      include: {
        team: true,
      },
    });

    return invites;
  }),

  getInvite: protectedProcedure
    .input(z.object({ inviteId: z.string() }))
    .query(async ({ ctx, input }) => {
      const invite = await ctx.db.teamInvite.findUnique({
        where: {
          id: input.inviteId,
        },
      });

      return invite;
    }),

  acceptTeamInvite: protectedProcedure
    .input(z.object({ inviteId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const invite = await ctx.db.teamInvite.findUnique({
        where: {
          id: input.inviteId,
        },
      });

      if (!invite) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Invite not found",
        });
      }

      await ctx.db.teamUser.create({
        data: {
          teamId: invite.teamId,
          userId: ctx.session.user.id,
          role: invite.role,
        },
      });

      await ctx.db.teamInvite.delete({
        where: {
          id: input.inviteId,
        },
      });

      return true;
    }),
});
