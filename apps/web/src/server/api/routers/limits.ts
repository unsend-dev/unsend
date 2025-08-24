import { z } from "zod";
import { createTRPCRouter, teamProcedure } from "~/server/api/trpc";
import { LimitService } from "~/server/service/LimitService";

const LimitTypeEnum = z.enum([
  "CONTACT_BOOK",
  "DOMAIN",
  "TEAM_MEMBER",
  "EMAIL",
]);

export const limitsRouter = createTRPCRouter({
  get: teamProcedure
    .input(
      z.object({
        type: LimitTypeEnum,
      }),
    )
    .query(async ({ ctx, input }) => {
      switch (input.type) {
        case "CONTACT_BOOK":
          return LimitService.checkContactBookLimit(ctx.team.id);
        case "DOMAIN":
          return LimitService.checkDomainLimit(ctx.team.id);
        case "TEAM_MEMBER":
          return LimitService.checkTeamMemberLimit(ctx.team.id);
        case "EMAIL":
          return LimitService.checkEmailLimit(ctx.team.id);
        default:
          // exhaustive guard
          throw new Error("Unsupported limit type");
      }
    }),
});
