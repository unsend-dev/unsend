import { z } from "zod";
import { ApiPermission } from "@prisma/client";
import { TRPCError } from "@trpc/server";

import {
  apiKeyProcedure,
  createTRPCRouter,
  teamProcedure,
} from "~/server/api/trpc";
import { addApiKey, deleteApiKey } from "~/server/service/api-service";

export const apiRouter = createTRPCRouter({
  createToken: teamProcedure
    .input(
      z.object({
        name: z.string(),
        permission: z.nativeEnum(ApiPermission),
        domainId: z.number().int().positive().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await addApiKey({
          name: input.name,
          permission: input.permission,
          teamId: ctx.team.id,
          domainId: input.domainId,
        });
      } catch (error) {
        if (error instanceof Error) {
          if (error.message === "DOMAIN_NOT_OWNED") {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "Domain does not belong to your team",
            });
          }
          if (error.message === "DOMAIN_NOT_VERIFIED") {
            throw new TRPCError({
              code: "BAD_REQUEST", 
              message: "Domain is not verified. Only verified domains can be used for API key restrictions",
            });
          }
        }
        throw error;
      }
    }),

  getApiKeys: teamProcedure.query(async ({ ctx }) => {
    const keys = await ctx.db.apiKey.findMany({
      where: {
        teamId: ctx.team.id,
      },
      select: {
        id: true,
        name: true,
        permission: true,
        partialToken: true,
        lastUsed: true,
        createdAt: true,
        domainId: true,
        domain: {
          select: {
            name: true,
          },
        },
      },
    });

    return keys;
  }),

  deleteApiKey: apiKeyProcedure.mutation(async ({ input }) => {
    return deleteApiKey(input.id);
  }),
});
