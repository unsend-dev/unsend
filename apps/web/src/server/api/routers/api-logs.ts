import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { DEFAULT_QUERY_LIMIT } from "~/lib/constants";
import { createTRPCRouter, teamProcedure } from "../trpc";

export const apiLogsRouter = createTRPCRouter({
  getLogs: teamProcedure
    .input(
      z.object({
        page: z.number().optional(),
        status: z.number().optional(),
        method: z.string().optional(),
        apiKeyId: z.string().optional(),
        search: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const page = input.page || 1;
      const limit = DEFAULT_QUERY_LIMIT;
      const offset = (page - 1) * limit;

      const where = {
        teamId: ctx.team.id,
        ...(input.status && { status: input.status }),
        ...(input.method && { method: input.method }),
        ...(input.apiKeyId && { apiKeyId: parseInt(input.apiKeyId) }),
        ...(input.search && {
          path: {
            contains: input.search,
          },
        }),
      };

      const [logs, total] = await Promise.all([
        ctx.db.apiLog.findMany({
          where,
          orderBy: {
            createdAt: "desc",
          },
          skip: offset,
          take: limit,
          include: {
            apiKey: {
              select: {
                name: true,
              },
            },
          },
        }),
        ctx.db.apiLog.count({ where }),
      ]);

      return {
        logs,
        total,
        pages: Math.ceil(total / limit),
      };
    }),

  getLog: teamProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const log = await ctx.db.apiLog.findUnique({
        where: {
          id: input.id,
          teamId: ctx.team.id,
        },
        include: {
          apiKey: {
            select: {
              name: true,
            },
          },
        },
      });

      if (!log) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Log not found",
        });
      }

      return log;
    }),
});
