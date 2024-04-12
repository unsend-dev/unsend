import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
  teamProcedure,
} from "~/server/api/trpc";
import { db } from "~/server/db";
import {
  createDomain,
  deleteDomain,
  getDomain,
  updateDomain,
} from "~/server/service/domain-service";
import { sendEmail } from "~/server/service/email-service";

export const domainRouter = createTRPCRouter({
  createDomain: teamProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return createDomain(ctx.team.id, input.name);
    }),

  domains: teamProcedure.query(async ({ ctx }) => {
    const domains = await db.domain.findMany({
      where: {
        teamId: ctx.team.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return domains;
  }),

  getDomain: teamProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      return getDomain(input.id);
    }),

  updateDomain: teamProcedure
    .input(
      z.object({
        id: z.number(),
        clickTracking: z.boolean().optional(),
        openTracking: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return updateDomain(input.id, {
        clickTracking: input.clickTracking,
        openTracking: input.openTracking,
      });
    }),

  deleteDomain: teamProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await deleteDomain(input.id);
      return { success: true };
    }),

  sendTestEmailFromDomain: teamProcedure
    .input(z.object({ id: z.number() }))
    .mutation(
      async ({
        ctx: {
          session: { user },
          team,
        },
        input,
      }) => {
        const domain = await db.domain.findFirst({
          where: { id: input.id, teamId: team.id },
        });

        if (!domain) {
          throw new Error("Domain not found");
        }

        if (!user.email) {
          throw new Error("User email not found");
        }

        return sendEmail({
          teamId: team.id,
          to: user.email,
          from: `hello@${domain.name}`,
          subject: "Test mail",
          text: "Hello this is a test mail",
          html: "<p>Hello this is a test mail</p>",
        });
      }
    ),
});
