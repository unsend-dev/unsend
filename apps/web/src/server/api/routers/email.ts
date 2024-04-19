import { EmailStatus } from "@prisma/client";
import { z } from "zod";

import { createTRPCRouter, teamProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";

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

  getEmail: teamProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const email = await db.email.findUnique({
        where: {
          id: input.id,
        },
        include: {
          emailEvents: {
            orderBy: {
              createdAt: "asc",
            },
          },
        },
      });

      return email;
    }),
});
