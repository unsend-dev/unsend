import { getApp } from "./hono";
import getDomains from "./api/get_domains";

export const app = getApp();

getDomains(app);

export default app;
