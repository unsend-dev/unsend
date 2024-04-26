import { getApp } from "./hono";
import getDomains from "./api/domains/get-domains";
import sendEmail from "./api/emails/send-email";

export const app = getApp();

/**Domain related APIs */
getDomains(app);

/**Email related APIs */
sendEmail(app);

export default app;
