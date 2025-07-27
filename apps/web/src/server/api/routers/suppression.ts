import { SuppressionReason } from "@prisma/client";
import { z } from "zod";

import { createTRPCRouter, teamProcedure } from "~/server/api/trpc";
import { SuppressionService } from "~/server/service/suppression-service";

export const suppressionRouter = createTRPCRouter({
  // Get suppression list for team with pagination
  getSuppressions: teamProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(20),
        search: z.string().optional(),
        reason: z.nativeEnum(SuppressionReason).optional().nullable(),
        sortBy: z.enum(["email", "reason", "createdAt"]).default("createdAt"),
        sortOrder: z.enum(["asc", "desc"]).default("desc"),
      })
    )
    .query(async ({ ctx, input }) => {
      const { page, limit, search, reason, sortBy, sortOrder } = input;

      const result = await SuppressionService.getSuppressionList({
        teamId: ctx.team.id,
        page,
        limit,
        search,
        reason,
        sortBy,
        sortOrder,
      });

      return {
        suppressions: result.suppressions,
        pagination: {
          page,
          limit,
          totalCount: result.total,
          totalPages: Math.ceil(result.total / limit),
          hasNext: page * limit < result.total,
          hasPrev: page > 1,
        },
      };
    }),

  // Add manual suppression
  addSuppression: teamProcedure
    .input(
      z.object({
        email: z.string().email(),
        reason: z
          .nativeEnum(SuppressionReason)
          .default(SuppressionReason.MANUAL),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return SuppressionService.addSuppression({
        email: input.email,
        teamId: ctx.team.id,
        reason: input.reason,
      });
    }),

  // Remove suppression
  removeSuppression: teamProcedure
    .input(
      z.object({
        email: z.string().email(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await SuppressionService.removeSuppression(input.email, ctx.team.id);
    }),

  // Bulk add suppressions
  bulkAddSuppressions: teamProcedure
    .input(
      z.object({
        emails: z.array(z.string().email()).max(1000),
        reason: z
          .nativeEnum(SuppressionReason)
          .default(SuppressionReason.MANUAL),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return SuppressionService.addMultipleSuppressions(
        input.emails.map((email) => ({
          email,
          teamId: ctx.team.id,
          reason: input.reason,
        }))
      );
    }),

  // Check if email is suppressed
  checkSuppression: teamProcedure
    .input(
      z.object({
        email: z.string().email(),
      })
    )
    .query(async ({ ctx, input }) => {
      return SuppressionService.isEmailSuppressed(input.email, ctx.team.id);
    }),

  // Check multiple emails for suppression
  checkMultipleSuppressions: teamProcedure
    .input(
      z.object({
        emails: z.array(z.string().email()).max(100),
      })
    )
    .query(async ({ ctx, input }) => {
      return SuppressionService.checkMultipleEmails(input.emails, ctx.team.id);
    }),

  // Get suppression stats
  getSuppressionStats: teamProcedure.query(async ({ ctx }) => {
    return SuppressionService.getSuppressionStats(ctx.team.id);
  }),

  // Export suppressions (for download functionality)
  exportSuppressions: teamProcedure
    .input(
      z.object({
        reason: z.nativeEnum(SuppressionReason).optional().nullable(),
        search: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      // Get all suppressions without pagination for export
      const result = await SuppressionService.getSuppressionList({
        teamId: ctx.team.id,
        page: 1,
        limit: 10000, // Large limit for export
        search: input.search,
        reason: input.reason,
        sortBy: "createdAt",
        sortOrder: "desc",
      });

      return result.suppressions.map((suppression) => ({
        email: suppression.email,
        reason: suppression.reason,
        source: suppression.source,
        createdAt: suppression.createdAt.toISOString(),
      }));
    }),
});
