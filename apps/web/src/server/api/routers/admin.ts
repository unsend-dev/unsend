import { z } from "zod";
import { env } from "~/env";

import { createTRPCRouter, adminProcedure } from "~/server/api/trpc";
import { SesSettingsService } from "~/server/service/ses-settings-service";

export const adminRouter = createTRPCRouter({
  getSesSettings: adminProcedure.query(async () => {
    //await SesSettingsService.init();
    return SesSettingsService.getAllSettings();
  }),

  addSesSettings: adminProcedure
    .input(
      z.object({
        region: z.string(),
        unsendUrl: z.string().url(),
      })
    )
    .mutation(async ({ input }) => {
      return SesSettingsService.createSesSetting({
        region: input.region,
        unsendUrl: input.unsendUrl,
      });
    }),

  getSetting: adminProcedure
    .input(
      z.object({
        region: z.string().optional().nullable(),
      })
    )
    .query(async ({ input }) => {
      return SesSettingsService.getSetting(
        input.region ?? env.AWS_DEFAULT_REGION
      );
    }),
});
