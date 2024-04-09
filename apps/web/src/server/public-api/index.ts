import { getApp } from "./hono";
import getDomains from "./api/get_domains";
import sendEmail from "./api/send_email";

export const app = getApp();

getDomains(app);
sendEmail(app);

export default app;
