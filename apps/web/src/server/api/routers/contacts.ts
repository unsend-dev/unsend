import { CampaignStatus, Prisma } from "@prisma/client";
import { z } from "zod";

import {
  contactBookProcedure,
  createTRPCRouter,
  teamProcedure,
} from "~/server/api/trpc";
import * as contactService from "~/server/service/contact-service";

export const contactsRouter = createTRPCRouter({
  getContactBooks: teamProcedure
    .input(z.object({ search: z.string().optional() }))
    .query(async ({ ctx: { db, team }, input }) => {
      return db.contactBook.findMany({
        where: {
          teamId: team.id,
          ...(input.search
            ? { name: { contains: input.search, mode: "insensitive" } }
            : {}),
        },
        include: {
          _count: {
            select: { contacts: true },
          },
        },
      });
    }),

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

  getContactBookDetails: contactBookProcedure.query(
    async ({ ctx: { contactBook, db } }) => {
      const [totalContacts, unsubscribedContacts, campaigns] =
        await Promise.all([
          db.contact.count({
            where: { contactBookId: contactBook.id },
          }),
          db.contact.count({
            where: { contactBookId: contactBook.id, subscribed: false },
          }),
          db.campaign.findMany({
            where: {
              contactBookId: contactBook.id,
              status: CampaignStatus.SENT,
            },
            orderBy: {
              createdAt: "desc",
            },
            take: 2,
          }),
        ]);

      return {
        ...contactBook,
        totalContacts,
        unsubscribedContacts,
        campaigns,
      };
    }
  ),

  updateContactBook: contactBookProcedure
    .input(
      z.object({
        contactBookId: z.string(),
        name: z.string().optional(),
        properties: z.record(z.string()).optional(),
        emoji: z.string().optional(),
      })
    )
    .mutation(async ({ ctx: { db }, input }) => {
      const { contactBookId, ...data } = input;
      return db.contactBook.update({
        where: { id: contactBookId },
        data,
      });
    }),

  deleteContactBook: contactBookProcedure
    .input(z.object({ contactBookId: z.string() }))
    .mutation(async ({ ctx: { db }, input }) => {
      return db.contactBook.delete({ where: { id: input.contactBookId } });
    }),

  contacts: contactBookProcedure
    .input(
      z.object({
        page: z.number().optional(),
        subscribed: z.boolean().optional(),
        search: z.string().optional(),
      })
    )
    .query(async ({ ctx: { db }, input }) => {
      const page = input.page || 1;
      const limit = 30;
      const offset = (page - 1) * limit;

      const whereConditions: Prisma.ContactFindManyArgs["where"] = {
        contactBookId: input.contactBookId,
        ...(input.subscribed !== undefined
          ? { subscribed: input.subscribed }
          : {}),
        ...(input.search
          ? {
              OR: [
                { email: { contains: input.search, mode: "insensitive" } },
                { firstName: { contains: input.search, mode: "insensitive" } },
                { lastName: { contains: input.search, mode: "insensitive" } },
              ],
            }
          : {}),
      };

      const countP = db.contact.count({ where: whereConditions });

      const contactsP = db.contact.findMany({
        where: whereConditions,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          subscribed: true,
          createdAt: true,
          contactBookId: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        skip: offset,
        take: limit,
      });

      const [contacts, count] = await Promise.all([contactsP, countP]);

      return { contacts, totalPage: Math.ceil(count / limit) };
    }),

  addContacts: contactBookProcedure
    .input(
      z.object({
        contacts: z.array(
          z.object({
            email: z.string(),
            firstName: z.string().optional(),
            lastName: z.string().optional(),
            properties: z.record(z.string()).optional(),
            subscribed: z.boolean().optional(),
          })
        ),
      })
    )
    .mutation(async ({ ctx: { contactBook }, input }) => {
      return contactService.bulkAddContacts(contactBook.id, input.contacts);
    }),

  updateContact: contactBookProcedure
    .input(
      z.object({
        contactId: z.string(),
        email: z.string().optional(),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        properties: z.record(z.string()).optional(),
        subscribed: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { contactId, ...contact } = input;
      return contactService.updateContact(contactId, contact);
    }),

  deleteContact: contactBookProcedure
    .input(z.object({ contactId: z.string() }))
    .mutation(async ({ input }) => {
      return contactService.deleteContact(input.contactId);
    }),
});
