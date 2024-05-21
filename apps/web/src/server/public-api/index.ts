import { getApp } from "./hono";
import getDomains from "./api/domains/get-domains";
import sendEmail from "./api/emails/send-email";
import getEmail from "./api/emails/get-email";

export const app = getApp();

/**Domain related APIs */
getDomains(app);

/**Email related APIs */
getEmail(app);
sendEmail(app);

export default app;
