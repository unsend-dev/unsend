import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  teamProcedure,
  createTRPCRouter,
  campaignProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import {
  sendCampaign,
  subscribeContact,
} from "~/server/service/campaign-service";
import { validateDomainFromEmail } from "~/server/service/domain-service";

export const campaignRouter = createTRPCRouter({
  getCampaigns: teamProcedure
    .input(
      z.object({
        page: z.number().optional(),
      })
    )
    .query(async ({ ctx: { db, team }, input }) => {
      const page = input.page || 1;
      const limit = 30;
      const offset = (page - 1) * limit;

      const whereConditions: Prisma.CampaignFindManyArgs["where"] = {
        teamId: team.id,
      };

      const countP = db.campaign.count({ where: whereConditions });

      const campaignsP = db.campaign.findMany({
        where: whereConditions,
        select: {
          id: true,
          name: true,
          from: true,
          subject: true,
          createdAt: true,
          updatedAt: true,
          status: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        skip: offset,
        take: limit,
      });

      const [campaigns, count] = await Promise.all([campaignsP, countP]);

      return { campaigns, totalPage: Math.ceil(count / limit) };
    }),

  createCampaign: teamProcedure
    .input(
      z.object({
        name: z.string(),
        from: z.string(),
        subject: z.string(),
      })
    )
    .mutation(async ({ ctx: { db, team }, input }) => {
      const domain = await validateDomainFromEmail(input.from, team.id);

      const campaign = await db.campaign.create({
        data: {
          ...input,
          teamId: team.id,
          domainId: domain.id,
        },
      });

      return campaign;
    }),

  updateCampaign: campaignProcedure
    .input(
      z.object({
        name: z.string().optional(),
        from: z.string().optional(),
        subject: z.string().optional(),
        previewText: z.string().optional(),
        content: z.string().optional(),
        contactBookId: z.string().optional(),
      })
    )
    .mutation(async ({ ctx: { db }, input }) => {
      const { campaignId, ...data } = input;
      if (data.contactBookId) {
        const contactBook = await db.contactBook.findUnique({
          where: { id: data.contactBookId },
        });

        if (!contactBook) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Contact book not found",
          });
        }
      }
      const campaign = await db.campaign.update({
        where: { id: campaignId },
        data,
      });
      return campaign;
    }),

  deleteCampaign: campaignProcedure.mutation(
    async ({ ctx: { db, team }, input }) => {
      const campaign = await db.campaign.delete({
        where: { id: input.campaignId, teamId: team.id },
      });
      return campaign;
    }
  ),

  getCampaign: campaignProcedure.query(async ({ ctx: { db, team }, input }) => {
    const campaign = await db.campaign.findUnique({
      where: { id: input.campaignId, teamId: team.id },
    });
    return campaign;
  }),

  sendCampaign: campaignProcedure.mutation(
    async ({ ctx: { db, team }, input }) => {
      sendCampaign(input.campaignId);
    }
  ),

  reSubscribeContact: publicProcedure
    .input(
      z.object({
        id: z.string(),
        hash: z.string(),
      })
    )
    .mutation(async ({ ctx: { db }, input }) => {
      await subscribeContact(input.id, input.hash);
    }),
});
