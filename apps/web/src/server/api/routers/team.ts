import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { env } from "~/env";

import {
  createTRPCRouter,
  protectedProcedure,
  teamProcedure,
  teamAdminProcedure,
} from "~/server/api/trpc";
import { sendTeamInviteEmail } from "~/server/mailer";
import send from "~/server/public-api/api/emails/send-email";

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
      include: {
        teamUsers: {
          where: {
            userId: ctx.session.user.id,
          },
        },
      },
    });

    return teams;
  }),

  getTeamUsers: teamProcedure.query(async ({ ctx }) => {
    const teamUsers = await ctx.db.teamUser.findMany({
      where: {
        teamId: ctx.team.id,
      },
      include: {
        user: true,
      },
    });

    return teamUsers;
  }),

  getTeamInvites: teamProcedure.query(async ({ ctx }) => {
    const teamInvites = await ctx.db.teamInvite.findMany({
      where: {
        teamId: ctx.team.id,
      },
    });

    return teamInvites;
  }),

  createTeamInvite: teamAdminProcedure
    .input(
      z.object({
        email: z.string(),
        role: z.enum(["MEMBER", "ADMIN"]),
        sendEmail: z.boolean().default(true),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!input.email) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Email is required",
        });
      }

      const user = await ctx.db.user.findUnique({
        where: {
          email: input.email,
        },
        include: {
          teamUsers: true,
        },
      });

      if (user && user.teamUsers.length > 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User already part of a team",
        });
      }

      const teamInvite = await ctx.db.teamInvite.create({
        data: {
          teamId: ctx.team.id,
          email: input.email,
          role: input.role,
        },
      });

      const teamUrl = `${env.NEXTAUTH_URL}/join-team?inviteId=${teamInvite.id}`;

      if (input.sendEmail) {
        await sendTeamInviteEmail(input.email, teamUrl, ctx.team.name);
      }

      return teamInvite;
    }),

  updateTeamUserRole: teamAdminProcedure
    .input(
      z.object({
        userId: z.string(),
        role: z.enum(["MEMBER", "ADMIN"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const teamUser = await ctx.db.teamUser.findFirst({
        where: {
          teamId: ctx.team.id,
          userId: Number(input.userId),
        },
      });

      if (!teamUser) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Team member not found",
        });
      }

      // Check if this is the last admin
      const adminCount = await ctx.db.teamUser.count({
        where: {
          teamId: ctx.team.id,
          role: "ADMIN",
        },
      });

      if (adminCount === 1 && teamUser.role === "ADMIN") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Need at least one admin",
        });
      }

      return ctx.db.teamUser.update({
        where: {
          teamId_userId: {
            teamId: ctx.team.id,
            userId: Number(input.userId),
          },
        },
        data: {
          role: input.role,
        },
      });
    }),

  deleteTeamUser: teamProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const teamUser = await ctx.db.teamUser.findFirst({
        where: {
          teamId: ctx.team.id,
          userId: Number(input.userId),
        },
      });

      if (!teamUser) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Team member not found",
        });
      }

      if (
        ctx.teamUser.role !== "ADMIN" &&
        ctx.session.user.id !== Number(input.userId)
      ) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to delete this team member",
        });
      }

      // Check if this is the last admin
      const adminCount = await ctx.db.teamUser.count({
        where: {
          teamId: ctx.team.id,
          role: "ADMIN",
        },
      });

      if (adminCount === 1 && teamUser.role === "ADMIN") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Need at least one admin",
        });
      }

      return ctx.db.teamUser.delete({
        where: {
          teamId_userId: {
            teamId: ctx.team.id,
            userId: Number(input.userId),
          },
        },
      });
    }),

  resendTeamInvite: teamAdminProcedure
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

      const teamUrl = `${env.NEXTAUTH_URL}/join-team?inviteId=${invite.id}`;

      // TODO: Implement email sending logic
      await sendTeamInviteEmail(invite.email, teamUrl, ctx.team.name);

      return { success: true };
    }),

  deleteTeamInvite: teamAdminProcedure
    .input(z.object({ inviteId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const invite = await ctx.db.teamInvite.findFirst({
        where: {
          teamId: ctx.team.id,
          id: {
            equals: input.inviteId,
          },
        },
      });

      if (!invite) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Invite not found",
        });
      }

      return ctx.db.teamInvite.delete({
        where: {
          teamId_email: {
            teamId: ctx.team.id,
            email: invite.email,
          },
        },
      });
    }),
});
