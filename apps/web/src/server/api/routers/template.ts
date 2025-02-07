import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { EmailRenderer } from "@unsend/email-editor/src/renderer";
import { z } from "zod";
import { env } from "~/env";
import {
  teamProcedure,
  createTRPCRouter,
  campaignProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { nanoid } from "~/server/nanoid";
import {
  sendCampaign,
  subscribeContact,
} from "~/server/service/campaign-service";
import { validateDomainFromEmail } from "~/server/service/domain-service";
import {
  getDocumentUploadUrl,
  isStorageConfigured
} from "~/server/service/storage-service";

export const templateRouter = createTRPCRouter({
  getTemplates: teamProcedure
    .input(
      z.object({
        page: z.number().optional(),
      })
    )
    .query(async ({ ctx: { db, team }, input }) => {
      const page = input.page || 1;
      const limit = 30;
      const offset = (page - 1) * limit;


      const whereConditions: Prisma.TemplateFindManyArgs["where"] = {
        teamId: team.id,
      };


      const countP = db.template.count({ where: whereConditions });

      const templatesP = db.template.findMany({
        where: whereConditions,
        select: {
          id: true,
          name: true,
          subject: true,
          createdAt: true,
          updatedAt: true,
          html: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        skip: offset,
        take: limit,
      });

      const [templates, count] = await Promise.all([templatesP, countP]);

      return { templates, totalPage: Math.ceil(count / limit) };
    }),

  createTemplate: teamProcedure
    .input(
      z.object({
        name: z.string(),
        subject: z.string(),
      })
    )
    .mutation(async ({ ctx: { db, team }, input }) => {
      const template = await db.template.create({
        data: {
          ...input,
          teamId: team.id,
        },
      });

      return template;
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
        replyTo: z.string().array().optional(),
      })
    )
    .mutation(async ({ ctx: { db, team, campaign: campaignOld }, input }) => {
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
      let domainId = campaignOld.domainId;
      if (data.from) {
        const domain = await validateDomainFromEmail(data.from, team.id);
        domainId = domain.id;
      }

      let html: string | null = null;

      if (data.content) {
        const jsonContent = data.content ? JSON.parse(data.content) : null;

        const renderer = new EmailRenderer(jsonContent);
        html = await renderer.render();
      }

      const campaign = await db.campaign.update({
        where: { id: campaignId },
        data: {
          ...data,
          html,
          domainId,
        },
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

    if (!campaign) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Campaign not found",
      });
    }

    const imageUploadSupported = isStorageConfigured();

    if (campaign?.contactBookId) {
      const contactBook = await db.contactBook.findUnique({
        where: { id: campaign.contactBookId },
      });
      return { ...campaign, contactBook, imageUploadSupported };
    }
    return {
      ...campaign,
      contactBook: null,
      imageUploadSupported,
    };
  }),

  sendCampaign: campaignProcedure.mutation(
    async ({ ctx: { db, team }, input }) => {
      await sendCampaign(input.campaignId);
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

  duplicateCampaign: campaignProcedure.mutation(
    async ({ ctx: { db, team, campaign }, input }) => {
      const newCampaign = await db.campaign.create({
        data: {
          name: `${campaign.name} (Copy)`,
          from: campaign.from,
          subject: campaign.subject,
          content: campaign.content,
          teamId: team.id,
          domainId: campaign.domainId,
          contactBookId: campaign.contactBookId,
        },
      });

      return newCampaign;
    }
  ),

  generateImagePresignedUrl: campaignProcedure
    .input(
      z.object({
        name: z.string(),
        type: z.string(),
      })
    )
    .mutation(async ({ ctx: { team }, input }) => {
      const extension = input.name.split(".").pop();
      const randomName = `${nanoid()}.${extension}`;

      const url = await getDocumentUploadUrl(
        `${team.id}/${randomName}`,
        input.type
      );

      const imageUrl = `${env.S3_COMPATIBLE_PUBLIC_URL}/${team.id}/${randomName}`;

      return { uploadUrl: url, imageUrl };
    }),
});
