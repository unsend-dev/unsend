import { domainRouter } from "~/server/api/routers/domain";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { apiRouter } from "./routers/api";
import { emailRouter } from "./routers/email";
import { teamRouter } from "./routers/team";
import { adminRouter } from "./routers/admin";
import { contactsRouter } from "./routers/contacts";
import { campaignRouter } from "./routers/campaign";
import { templateRouter } from "./routers/template";
import { billingRouter } from "./routers/billing";
import { invitationRouter } from "./routers/invitiation";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  domain: domainRouter,
  apiKey: apiRouter,
  email: emailRouter,
  team: teamRouter,
  admin: adminRouter,
  contacts: contactsRouter,
  campaign: campaignRouter,
  template: templateRouter,
  billing: billingRouter,
  invitation: invitationRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
