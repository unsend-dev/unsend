import { z } from "zod";

import { createTRPCRouter, teamProcedure } from "~/server/api/trpc";
import { addApiKey, deleteApiKey } from "~/server/service/api-service";

export const contactsRouter = createTRPCRouter({
  createContactBook: teamProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .mutation(async ({ ctx: { db, team }, input }) => {
      const { name } = input;
      const contactBook = await db.contactBook.create({
        data: {
          name,
          teamId: team.id,
          properties: {},
        },
      });

      return contactBook;
    }),
});
