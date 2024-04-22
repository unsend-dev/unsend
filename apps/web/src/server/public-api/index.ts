import { getApp } from "./hono";
import getDomains from "./api/get-domains";
import sendEmail from "./api/send-email";

export const app = getApp();

getDomains(app);
sendEmail(app);

export default app;
