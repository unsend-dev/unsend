import { Prisma } from "@prisma/client";
import { format, subDays } from "date-fns";
import { z } from "zod";

import { createTRPCRouter, teamProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";

export const dashboardRouter = createTRPCRouter({
  emailTimeSeries: teamProcedure
    .input(
      z.object({
        days: z.number().optional(),
        domain: z.number().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { team } = ctx;
      const days = input.days !== 7 ? 30 : 7;

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      const isoStartDate = startDate.toISOString().split("T")[0];

      type DailyEmailUsage = {
        date: string;
        sent: number;
        delivered: number;
        opened: number;
        clicked: number;
        bounced: number;
        complained: number;
      };

      const result = await db.$queryRaw<Array<DailyEmailUsage>>`
        SELECT 
          date,
          SUM(sent)::integer AS sent,
          SUM(delivered)::integer AS delivered,
          SUM(opened)::integer AS opened,
          SUM(clicked)::integer AS clicked,
          SUM(bounced)::integer AS bounced,
          SUM(complained)::integer AS complained
        FROM "DailyEmailUsage"
        WHERE "teamId" = ${team.id}
        AND "date" >= ${isoStartDate}
        ${input.domain ? Prisma.sql`AND "domainId" = ${input.domain}` : Prisma.sql``}
        GROUP BY "date"
        ORDER BY "date" ASC
      `;

      // Fill in any missing dates with 0 values
      const filledResult: DailyEmailUsage[] = [];
      const endDateObj = new Date();

      for (let i = days; i > -1; i--) {
        const dateStr = subDays(endDateObj, i)
          .toISOString()
          .split("T")[0] as string;
        const existingData = result.find((r) => r.date === dateStr);

        if (existingData) {
          filledResult.push({
            ...existingData,
            date: format(dateStr, "MMM dd"),
          });
        } else {
          filledResult.push({
            date: format(dateStr, "MMM dd"),
            sent: 0,
            delivered: 0,
            opened: 0,
            clicked: 0,
            bounced: 0,
            complained: 0,
          });
        }
      }

      const totalCounts = result.reduce(
        (acc, curr) => {
          acc.sent += curr.sent;
          acc.delivered += curr.delivered;
          acc.opened += curr.opened;
          acc.clicked += curr.clicked;
          acc.bounced += curr.bounced;
          acc.complained += curr.complained;
          return acc;
        },
        {
          sent: 0,
          delivered: 0,
          opened: 0,
          clicked: 0,
          bounced: 0,
          complained: 0,
        }
      );

      return { result: filledResult, totalCounts };
    }),

  reputationMetricsData: teamProcedure
    .input(
      z.object({
        domain: z.number().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { team } = ctx;

      const reputations = await db.cumulatedMetrics.findMany({
        where: {
          teamId: team.id,
          ...(input.domain ? { domainId: input.domain } : {}),
        },
      });

      const results = reputations.reduce(
        (acc, curr) => {
          acc.delivered += Number(curr.delivered);
          acc.hardBounced += Number(curr.hardBounced);
          acc.complained += Number(curr.complained);
          return acc;
        },
        { delivered: 0, hardBounced: 0, complained: 0 }
      );

      const resultWithRates = {
        ...results,
        bounceRate: results.delivered
          ? (results.hardBounced / results.delivered) * 100
          : 0,
        complaintRate: results.delivered
          ? (results.complained / results.delivered) * 100
          : 0,
      };

      return resultWithRates;
    }),
});
