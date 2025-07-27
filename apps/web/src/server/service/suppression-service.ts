import { SuppressionReason, SuppressionList } from "@prisma/client";
import { db } from "../db";
import { UnsendApiError } from "~/server/public-api/api-error";
import { logger } from "../logger/log";

export type AddSuppressionParams = {
  email: string;
  teamId: number;
  reason: SuppressionReason;
  source?: string;
};

export type GetSuppressionListParams = {
  teamId: number;
  page?: number;
  limit?: number;
  search?: string;
  reason?: SuppressionReason | null;
  sortBy?: "email" | "reason" | "createdAt";
  sortOrder?: "asc" | "desc";
};

export type SuppressionListResult = {
  suppressions: SuppressionList[];
  total: number;
};

export class SuppressionService {
  /**
   * Add email to suppression list
   */
  static async addSuppression(
    params: AddSuppressionParams
  ): Promise<SuppressionList> {
    const { email, teamId, reason, source } = params;

    try {
      const suppression = await db.suppressionList.upsert({
        where: {
          teamId_email: {
            teamId,
            email: email.toLowerCase().trim(),
          },
        },
        create: {
          email: email.toLowerCase().trim(),
          teamId,
          reason,
          source,
        },
        update: {
          reason,
          source,
          updatedAt: new Date(),
        },
      });

      logger.info(
        {
          email,
          teamId,
          reason,
          source,
          suppressionId: suppression.id,
        },
        "Email added to suppression list"
      );

      return suppression;
    } catch (error) {
      logger.error(
        {
          email,
          teamId,
          reason,
          source,
          error: error instanceof Error ? error.message : "Unknown error",
        },
        "Failed to add email to suppression list"
      );

      throw new UnsendApiError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to add email to suppression list",
      });
    }
  }

  /**
   * Check if email is suppressed for team
   */
  static async isEmailSuppressed(
    email: string,
    teamId: number
  ): Promise<boolean> {
    try {
      const suppression = await db.suppressionList.findUnique({
        where: {
          teamId_email: {
            teamId,
            email: email.toLowerCase().trim(),
          },
        },
      });

      return !!suppression;
    } catch (error) {
      logger.error(
        {
          email,
          teamId,
          error: error instanceof Error ? error.message : "Unknown error",
        },
        "Failed to check email suppression status"
      );

      // In case of error, err on the side of caution and don't suppress
      return false;
    }
  }

  /**
   * Remove email from suppression list
   */
  static async removeSuppression(email: string, teamId: number): Promise<void> {
    try {
      const deleted = await db.suppressionList.delete({
        where: {
          teamId_email: {
            teamId,
            email: email.toLowerCase().trim(),
          },
        },
      });

      logger.info(
        {
          email,
          teamId,
          suppressionId: deleted.id,
        },
        "Email removed from suppression list"
      );
    } catch (error) {
      // If the record doesn't exist, that's fine - it's already not suppressed
      if (
        error instanceof Error &&
        error.message.includes("Record to delete does not exist")
      ) {
        logger.debug(
          {
            email,
            teamId,
          },
          "Attempted to remove non-existent suppression - already not suppressed"
        );
        return;
      }

      logger.error(
        {
          email,
          teamId,
          error: error instanceof Error ? error.message : "Unknown error",
        },
        "Failed to remove email from suppression list"
      );

      throw new UnsendApiError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to remove email from suppression list",
      });
    }
  }

  /**
   * Get suppression list for team with pagination
   */
  static async getSuppressionList(
    params: GetSuppressionListParams
  ): Promise<SuppressionListResult> {
    const {
      teamId,
      page = 1,
      limit = 20,
      search,
      reason,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = params;

    const offset = (page - 1) * limit;

    const where = {
      teamId,
      ...(search && {
        email: {
          contains: search,
          mode: "insensitive" as const,
        },
      }),
      ...(reason && { reason }),
    };

    try {
      const [suppressions, total] = await Promise.all([
        db.suppressionList.findMany({
          where,
          skip: offset,
          take: limit,
          orderBy: { [sortBy]: sortOrder },
        }),
        db.suppressionList.count({ where }),
      ]);

      return {
        suppressions,
        total,
      };
    } catch (error) {
      logger.error(
        {
          teamId,
          page,
          limit,
          search,
          reason,
          error: error instanceof Error ? error.message : "Unknown error",
        },
        "Failed to get suppression list"
      );

      throw new UnsendApiError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to get suppression list",
      });
    }
  }

  /**
   * Add multiple emails to suppression list
   */
  static async addMultipleSuppressions(
    suppressions: AddSuppressionParams[]
  ): Promise<SuppressionList[]> {
    try {
      const results: SuppressionList[] = [];

      // Process in batches to avoid overwhelming the database
      const batchSize = 100;
      for (let i = 0; i < suppressions.length; i += batchSize) {
        const batch = suppressions.slice(i, i + batchSize);

        const batchResults = await Promise.all(
          batch.map((suppression) => this.addSuppression(suppression))
        );

        results.push(...batchResults);
      }

      logger.info(
        {
          count: suppressions.length,
          teamId: suppressions[0]?.teamId,
        },
        "Added multiple emails to suppression list"
      );

      return results;
    } catch (error) {
      logger.error(
        {
          count: suppressions.length,
          error: error instanceof Error ? error.message : "Unknown error",
        },
        "Failed to add multiple emails to suppression list"
      );

      throw new UnsendApiError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to add multiple emails to suppression list",
      });
    }
  }

  /**
   * Get suppression statistics for a team
   */
  static async getSuppressionStats(
    teamId: number
  ): Promise<Record<SuppressionReason, number>> {
    try {
      const stats = await db.suppressionList.groupBy({
        by: ["reason"],
        where: { teamId },
        _count: { _all: true },
      });

      const result: Record<SuppressionReason, number> = {
        HARD_BOUNCE: 0,
        COMPLAINT: 0,
        MANUAL: 0,
      };

      stats.forEach((stat) => {
        result[stat.reason] = stat._count._all;
      });

      return result;
    } catch (error) {
      logger.error(
        {
          teamId,
          error: error instanceof Error ? error.message : "Unknown error",
        },
        "Failed to get suppression stats"
      );

      throw new UnsendApiError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to get suppression stats",
      });
    }
  }

  /**
   * Check multiple emails for suppression status
   */
  static async checkMultipleEmails(
    emails: string[],
    teamId: number
  ): Promise<Record<string, boolean>> {
    try {
      const normalizedEmails = emails.map((email) =>
        email.toLowerCase().trim()
      );

      const suppressions = await db.suppressionList.findMany({
        where: {
          teamId,
          email: {
            in: normalizedEmails,
          },
        },
        select: {
          email: true,
        },
      });

      const suppressedEmails = new Set(suppressions.map((s) => s.email));

      const result: Record<string, boolean> = {};
      emails.forEach((email) => {
        result[email] = suppressedEmails.has(email.toLowerCase().trim());
      });

      return result;
    } catch (error) {
      logger.error(
        {
          emailCount: emails.length,
          teamId,
          error: error instanceof Error ? error.message : "Unknown error",
        },
        "Failed to check multiple emails for suppression"
      );

      // In case of error, err on the side of caution and don't suppress any
      const result: Record<string, boolean> = {};
      emails.forEach((email) => {
        result[email] = false;
      });

      return result;
    }
  }
}
