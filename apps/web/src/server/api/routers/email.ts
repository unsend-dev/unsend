import { EmailStatus } from "@prisma/client";
import { format, subDays } from "date-fns";
import { z } from "zod";

import { createTRPCRouter, teamProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";
import { cancelEmail, updateEmail } from "~/server/service/email-service";

const statuses = Object.values(EmailStatus) as [EmailStatus];

const DEFAULT_LIMIT = 30;

export const emailRouter = createTRPCRouter({
  emails: teamProcedure
    .input(
      z.object({
        page: z.number().optional(),
        status: z.enum(statuses).optional().nullable(),
        domain: z.number().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const page = input.page || 1;
      const limit = DEFAULT_LIMIT;
      const offset = (page - 1) * limit;

      const whereConditions = {
        teamId: ctx.team.id,
        ...(input.status ? { latestStatus: input.status } : {}),
        ...(input.domain ? { domainId: input.domain } : {}),
      };

      const countP = db.email.count({ where: whereConditions });

      const emailsP = db.email.findMany({
        where: whereConditions,
        select: {
          id: true,
          createdAt: true,
          latestStatus: true,
          subject: true,
          to: true,
          scheduledAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        skip: offset,
        take: limit,
      });

      const [emails, count] = await Promise.all([emailsP, countP]);

      return { emails, totalPage: Math.ceil(count / limit) };
    }),

  dashboard: teamProcedure
    .input(
      z.object({
        days: z.number().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { team } = ctx;
      const days = input.days !== 7 ? 30 : 7;
      const daysInMs = days * 24 * 60 * 60 * 1000;

      const rawEmailStatusCounts = await db.email.findMany({
        where: {
          teamId: team.id,
          createdAt: {
            gt: new Date(Date.now() - daysInMs),
          },
        },
        select: {
          latestStatus: true,
          createdAt: true,
        },
      });

      const totalCount = rawEmailStatusCounts.length;

      const emailStatusCounts = rawEmailStatusCounts.reduce(
        (acc, cur) => {
          acc[cur.latestStatus] = {
            count: (acc[cur.latestStatus]?.count || 0) + 1,
            percentage: Number(
              (
                (((acc[cur.latestStatus]?.count || 0) + 1) / totalCount) *
                100
              ).toFixed(0)
            ),
          };
          return acc;
        },
        {
          DELIVERED: { count: 0, percentage: 0 },
          COMPLAINED: { count: 0, percentage: 0 },
          OPENED: { count: 0, percentage: 0 },
          CLICKED: { count: 0, percentage: 0 },
          BOUNCED: { count: 0, percentage: 0 },
        } as Record<EmailStatus, { count: number; percentage: number }>
      );

      const dateRecord: Record<
        string,
        Record<
          "DELIVERED" | "COMPLAINED" | "OPENED" | "CLICKED" | "BOUNCED",
          number
        >
      > = {};

      const currentDate = new Date();

      for (let i = 0; i < (input.days || 7); i++) {
        const actualDate = subDays(currentDate, i);
        dateRecord[format(actualDate, "MMM dd")] = {
          DELIVERED: 0,
          COMPLAINED: 0,
          OPENED: 0,
          CLICKED: 0,
          BOUNCED: 0,
        };
      }

      const _emailDailyStatusCounts = rawEmailStatusCounts.reduce(
        (acc, { latestStatus, createdAt }) => {
          const day = format(createdAt, "MMM dd");

          if (
            !day ||
            ![
              "DELIVERED",
              "COMPLAINED",
              "OPENED",
              "CLICKED",
              "BOUNCED",
            ].includes(latestStatus)
          ) {
            return acc;
          }

          if (!acc[day]) {
            return acc;
          }

          acc[day]![
            latestStatus as
              | "DELIVERED"
              | "COMPLAINED"
              | "OPENED"
              | "CLICKED"
              | "BOUNCED"
          ]++;
          return acc;
        },
        dateRecord
      );

      const emailDailyStatusCounts = Object.entries(_emailDailyStatusCounts)
        .reverse()
        .map(([date, counts]) => ({
          name: date,
          ...counts,
        }));

      return { emailStatusCounts, totalCount, emailDailyStatusCounts };
    }),

  getEmail: teamProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const email = await db.email.findUnique({
        where: {
          id: input.id,
        },
        select: {
          emailEvents: {
            orderBy: {
              status: "desc",
            },
          },
          id: true,
          createdAt: true,
          latestStatus: true,
          subject: true,
          to: true,
          from: true,
          domainId: true,
          text: true,
          html: true,
          scheduledAt: true,
        },
      });

      return email;
    }),

  cancelEmail: teamProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      await cancelEmail(input.id);
    }),

  updateEmailScheduledAt: teamProcedure
    .input(z.object({ id: z.string(), scheduledAt: z.string().datetime() }))
    .mutation(async ({ input }) => {
      await updateEmail(input.id, { scheduledAt: input.scheduledAt });
    }),
});
