import { Email, EmailStatus, Prisma } from "@prisma/client";
import { format, subDays } from "date-fns";
import { z } from "zod";
import { DEFAULT_QUERY_LIMIT } from "~/lib/constants";

import {
  createTRPCRouter,
  emailProcedure,
  teamProcedure,
} from "~/server/api/trpc";
import { db } from "~/server/db";
import { cancelEmail, updateEmail } from "~/server/service/email-service";

const statuses = Object.values(EmailStatus) as [EmailStatus];

export const emailRouter = createTRPCRouter({
  emails: teamProcedure
    .input(
      z.object({
        page: z.number().optional(),
        status: z.enum(statuses).optional().nullable(),
        domain: z.number().optional(),
        search: z.string().optional().nullable(),
        apiId: z.number().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const page = input.page || 1;
      const limit = DEFAULT_QUERY_LIMIT;
      const offset = (page - 1) * limit;

      const emails = await db.$queryRaw<Array<Email>>`
        SELECT 
          id, 
          "createdAt", 
          "latestStatus", 
          subject, 
          "to", 
          "scheduledAt"
        FROM "Email"
        WHERE "teamId" = ${ctx.team.id}
        ${input.status ? Prisma.sql`AND "latestStatus"::text = ${input.status}` : Prisma.sql``}
        ${input.domain ? Prisma.sql`AND "domainId" = ${input.domain}` : Prisma.sql``}
        ${input.apiId ? Prisma.sql`AND "apiId" = ${input.apiId}` : Prisma.sql``}
        ${
          input.search
            ? Prisma.sql`AND (
          "subject" ILIKE ${`%${input.search}%`} 
          OR EXISTS (
            SELECT 1 FROM unnest("to") AS email 
            WHERE email ILIKE ${`%${input.search}%`}
          )
        )`
            : Prisma.sql``
        }
        ORDER BY "createdAt" DESC
        LIMIT ${DEFAULT_QUERY_LIMIT}
        OFFSET ${offset}
      `;

      return { emails };
    }),

  dashboard: teamProcedure
    .input(
      z.object({
        days: z.number().optional(),
      }),
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
        },
      );

      return { result: filledResult, totalCounts };
    }),

  getEmail: emailProcedure.query(async ({ input }) => {
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

  cancelEmail: emailProcedure.mutation(async ({ input }) => {
    await cancelEmail(input.id);
  }),

  updateEmailScheduledAt: emailProcedure
    .input(z.object({ scheduledAt: z.string().datetime() }))
    .mutation(async ({ input }) => {
      await updateEmail(input.id, { scheduledAt: input.scheduledAt });
    }),
});
