import { PLAN_LIMITS, LimitReason } from "~/lib/constants/plans";
import { db } from "../db";
import { getThisMonthUsage } from "./usage-service";

function isLimitExceeded(current: number, limit: number): boolean {
  if (limit === -1) return false; // unlimited
  return current >= limit;
}

export class LimitService {
  static async checkDomainLimit(teamId: number): Promise<{
    isLimitReached: boolean;
    limit: number;
    reason?: LimitReason;
  }> {
    const team = await db.team.findUnique({
      where: { id: teamId },
      include: {
        _count: {
          select: {
            domains: true,
          },
        },
      },
    });

    if (!team) {
      throw new Error("Team not found");
    }

    const limit = PLAN_LIMITS[team.plan].domains;
    if (isLimitExceeded(team._count.domains, limit)) {
      return {
        isLimitReached: true,
        limit,
        reason: LimitReason.DOMAIN,
      };
    }

    return {
      isLimitReached: false,
      limit,
    };
  }

  static async checkContactBookLimit(teamId: number): Promise<{
    isLimitReached: boolean;
    limit: number;
    reason?: LimitReason;
  }> {
    const team = await db.team.findUnique({
      where: { id: teamId },
      include: {
        _count: {
          select: {
            contactBooks: true,
          },
        },
      },
    });

    if (!team) {
      throw new Error("Team not found");
    }

    const limit = PLAN_LIMITS[team.plan].contactBooks;
    if (isLimitExceeded(team._count.contactBooks, limit)) {
      return {
        isLimitReached: true,
        limit,
        reason: LimitReason.CONTACT_BOOK,
      };
    }

    return {
      isLimitReached: false,
      limit,
    };
  }

  static async checkTeamMemberLimit(teamId: number): Promise<{
    isLimitReached: boolean;
    limit: number;
    reason?: LimitReason;
  }> {
    const team = await db.team.findUnique({
      where: { id: teamId },
      include: {
        teamUsers: true,
      },
    });

    if (!team) {
      throw new Error("Team not found");
    }

    const limit = PLAN_LIMITS[team.plan].teamMembers;
    if (isLimitExceeded(team.teamUsers.length, limit)) {
      return {
        isLimitReached: true,
        limit,
        reason: LimitReason.TEAM_MEMBER,
      };
    }

    return {
      isLimitReached: false,
      limit,
    };
  }

  static async checkEmailLimit(teamId: number): Promise<{
    isLimitReached: boolean;
    limit: number;
    reason?: LimitReason;
  }> {
    const team = await db.team.findUnique({
      where: { id: teamId },
    });

    if (!team) {
      throw new Error("Team not found");
    }

    // FREE plan has hard limits; paid plans are unlimited (-1)
    if (team.plan === "FREE") {
      const usage = await getThisMonthUsage(teamId);

      const monthlyUsage = usage.month.reduce(
        (acc, curr) => acc + curr.sent,
        0,
      );
      const dailyUsage = usage.day.reduce((acc, curr) => acc + curr.sent, 0);

      const monthlyLimit = PLAN_LIMITS[team.plan].emailsPerMonth;
      const dailyLimit = PLAN_LIMITS[team.plan].emailsPerDay;

      if (isLimitExceeded(monthlyUsage, monthlyLimit)) {
        return {
          isLimitReached: true,
          limit: monthlyLimit,
          reason: LimitReason.EMAIL,
        };
      }

      if (isLimitExceeded(dailyUsage, dailyLimit)) {
        return {
          isLimitReached: true,
          limit: dailyLimit,
          reason: LimitReason.EMAIL,
        };
      }
    }

    return {
      isLimitReached: false,
      limit: PLAN_LIMITS[team.plan].emailsPerMonth,
    };
  }
}
