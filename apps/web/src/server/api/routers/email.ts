import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
  teamProcedure,
} from "~/server/api/trpc";
import { db } from "~/server/db";
import { createDomain, getDomain } from "~/server/service/domain-service";

export const emailRouter = createTRPCRouter({
  emails: teamProcedure.query(async ({ ctx }) => {
    const emails = await db.email.findMany({
      where: {
        teamId: ctx.team.id,
      },
    });

    return emails;
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
              createdAt: "desc",
            },
          },
        },
      });

      return email;
    }),
});
