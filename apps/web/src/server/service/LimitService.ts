import { PLAN_LIMITS } from "~/lib/constants/plans";
import { db } from "../db";
import { getThisMonthUsage } from "~/lib/usage";

export class LimitService {
  static async checkDomainLimit(teamId: number): Promise<{
    isLimitReached: boolean;
    limit: number;
    reason?: string;
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

    if (team._count.domains >= PLAN_LIMITS[team.plan].domains) {
      return {
        isLimitReached: true,
        limit: PLAN_LIMITS[team.plan].domains,
        reason: "Domain limit reached",
      };
    }

    return {
      isLimitReached: false,
      limit: PLAN_LIMITS[team.plan].domains,
    };
  }

  static async checkContactBookLimit(teamId: number): Promise<{
    isLimitReached: boolean;
    limit: number;
    reason?: string;
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

    if (team._count.contactBooks >= PLAN_LIMITS[team.plan].contactBooks) {
      return {
        isLimitReached: true,
        limit: PLAN_LIMITS[team.plan].contactBooks,
        reason: "Contact book limit reached",
      };
    }

    return {
      isLimitReached: false,
      limit: PLAN_LIMITS[team.plan].contactBooks,
    };
  }

  static async checkTeamMemberLimit(teamId: number): Promise<{
    isLimitReached: boolean;
    limit: number;
    reason?: string;
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

    if (team.teamUsers.length >= PLAN_LIMITS[team.plan].teamMembers) {
      return {
        isLimitReached: true,
        limit: PLAN_LIMITS[team.plan].teamMembers,
        reason: "Team member limit reached",
      };
    }

    return {
      isLimitReached: false,
      limit: PLAN_LIMITS[team.plan].teamMembers,
    };
  }

  static async checkEmailLimit(teamId: number): Promise<{
    isLimitReached: boolean;
    limit: number;
    reason?: string;
  }> {
    const team = await db.team.findUnique({
      where: { id: teamId },
    });

    if (!team) {
      throw new Error("Team not found");
    }

    if (team.plan === "FREE") {
      const usage = await getThisMonthUsage(teamId);

      const monthlyUsage = usage.month.reduce(
        (acc, curr) => acc + curr.sent,
        0
      );
      const dailyUsage = usage.day.reduce((acc, curr) => acc + curr.sent, 0);

      if (monthlyUsage >= PLAN_LIMITS[team.plan].emailsPerMonth) {
        return {
          isLimitReached: true,
          limit: PLAN_LIMITS[team.plan].emailsPerMonth,
          reason: `Email limit reached, you have used ${monthlyUsage} emails this month.`,
        };
      }

      if (dailyUsage >= PLAN_LIMITS[team.plan].emailsPerDay) {
        return {
          isLimitReached: true,
          limit: PLAN_LIMITS[team.plan].emailsPerDay,
          reason: `Email limit reached, you have used ${dailyUsage} emails today.`,
        };
      }
    }

    return {
      isLimitReached: false,
      limit: PLAN_LIMITS[team.plan].emailsPerMonth,
    };
  }
}
