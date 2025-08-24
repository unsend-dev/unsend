import { TRPCError } from "@trpc/server";
import { env } from "~/env";
import { db } from "~/server/db";
import { sendTeamInviteEmail } from "~/server/mailer";
import { logger } from "~/server/logger/log";
import type { Team, TeamInvite } from "@prisma/client";
import { LimitService } from "./LimitService";
import { UnsendApiError } from "../public-api/api-error";

export class TeamService {
  static async createTeam(
    userId: number,
    name: string
  ): Promise<Team | undefined> {
    const teams = await db.team.findMany({
      where: {
        teamUsers: {
          some: {
            userId: userId,
          },
        },
      },
    });

    if (teams.length > 0) {
      logger.info({ userId }, "User already has a team");
      return;
    }

    if (!env.NEXT_PUBLIC_IS_CLOUD) {
      const _team = await db.team.findFirst();
      if (_team) {
        throw new TRPCError({
          message: "Can't have multiple teams in self hosted version",
          code: "UNAUTHORIZED",
        });
      }
    }

    return db.team.create({
      data: {
        name,
        teamUsers: {
          create: {
            userId,
            role: "ADMIN",
          },
        },
      },
    });
  }

  static async getUserTeams(userId: number) {
    return db.team.findMany({
      where: {
        teamUsers: {
          some: {
            userId: userId,
          },
        },
      },
      include: {
        teamUsers: {
          where: {
            userId: userId,
          },
        },
      },
    });
  }

  static async getTeamUsers(teamId: number) {
    return db.teamUser.findMany({
      where: {
        teamId,
      },
      include: {
        user: true,
      },
    });
  }

  static async getTeamInvites(teamId: number) {
    return db.teamInvite.findMany({
      where: {
        teamId,
      },
    });
  }

  static async createTeamInvite(
    teamId: number,
    email: string,
    role: "MEMBER" | "ADMIN",
    teamName: string,
    sendEmail: boolean = true
  ): Promise<TeamInvite> {
    if (!email) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Email is required",
      });
    }

    const { isLimitReached, reason } =
      await LimitService.checkTeamMemberLimit(teamId);
    if (isLimitReached) {
      throw new UnsendApiError({
        code: "FORBIDDEN",
        message: reason ?? "Team invite limit reached",
      });
    }

    const user = await db.user.findUnique({
      where: {
        email,
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

    const teamInvite = await db.teamInvite.create({
      data: {
        teamId,
        email,
        role,
      },
    });

    const teamUrl = `${env.NEXTAUTH_URL}/join-team?inviteId=${teamInvite.id}`;

    if (sendEmail) {
      await sendTeamInviteEmail(email, teamUrl, teamName);
    }

    return teamInvite;
  }

  static async updateTeamUserRole(
    teamId: number,
    userId: string,
    role: "MEMBER" | "ADMIN"
  ) {
    const teamUser = await db.teamUser.findFirst({
      where: {
        teamId,
        userId: Number(userId),
      },
    });

    if (!teamUser) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Team member not found",
      });
    }

    // Check if this is the last admin
    const adminCount = await db.teamUser.count({
      where: {
        teamId,
        role: "ADMIN",
      },
    });

    if (adminCount === 1 && teamUser.role === "ADMIN") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Need at least one admin",
      });
    }

    return db.teamUser.update({
      where: {
        teamId_userId: {
          teamId,
          userId: Number(userId),
        },
      },
      data: {
        role,
      },
    });
  }

  static async deleteTeamUser(
    teamId: number,
    userId: string,
    requestorRole: string,
    requestorId: number
  ) {
    const teamUser = await db.teamUser.findFirst({
      where: {
        teamId,
        userId: Number(userId),
      },
    });

    if (!teamUser) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Team member not found",
      });
    }

    if (requestorRole !== "ADMIN" && requestorId !== Number(userId)) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You are not authorized to delete this team member",
      });
    }

    // Check if this is the last admin
    const adminCount = await db.teamUser.count({
      where: {
        teamId,
        role: "ADMIN",
      },
    });

    if (adminCount === 1 && teamUser.role === "ADMIN") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Need at least one admin",
      });
    }

    return db.teamUser.delete({
      where: {
        teamId_userId: {
          teamId,
          userId: Number(userId),
        },
      },
    });
  }

  static async resendTeamInvite(inviteId: string, teamName: string) {
    const invite = await db.teamInvite.findUnique({
      where: {
        id: inviteId,
      },
    });

    if (!invite) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Invite not found",
      });
    }

    const teamUrl = `${env.NEXTAUTH_URL}/join-team?inviteId=${invite.id}`;

    await sendTeamInviteEmail(invite.email, teamUrl, teamName);

    return { success: true };
  }

  static async deleteTeamInvite(teamId: number, inviteId: string) {
    const invite = await db.teamInvite.findFirst({
      where: {
        teamId,
        id: {
          equals: inviteId,
        },
      },
    });

    if (!invite) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Invite not found",
      });
    }

    return db.teamInvite.delete({
      where: {
        teamId_email: {
          teamId,
          email: invite.email,
        },
      },
    });
  }
}
