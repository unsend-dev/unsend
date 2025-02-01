import { domainRouter } from "~/server/api/routers/domain";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { adminRouter } from "./routers/admin";
import { apiRouter } from "./routers/api";
import { apiLogsRouter } from "./routers/api-logs";
import { campaignRouter } from "./routers/campaign";
import { contactsRouter } from "./routers/contacts";
import { emailRouter } from "./routers/email";
import { teamRouter } from "./routers/team";

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
  apiLogs: apiLogsRouter,
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
