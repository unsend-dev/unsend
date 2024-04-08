import { OpenAPIHono } from "@hono/zod-openapi";

export function getApp() {
  return new OpenAPIHono().basePath("/api/v1");
}

export type PublicAPIApp = ReturnType<typeof getApp>;
