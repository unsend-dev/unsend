import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";
import { env } from "~/env";
import { db } from "~/server/db";
import { handleError } from "./api-error";
import { getApiKeyAndTeamFromToken } from "./auth";

export function getApp() {
  const app = new OpenAPIHono().basePath("/api");

  // Add logging middleware
  app.use("*", async (c, next) => {
    const start = performance.now();

    await next();

    const end = performance.now();

    const duration = Math.round(end - start);

    try {
      const { apiKey, team } = await getApiKeyAndTeamFromToken(c);
      const requestBody = await c.req.json().catch(() => null);
      const responseBody = c.res.body
        ? await c.res
            .clone()
            .json()
            .catch(() => null)
        : null;

      const log = await db.apiLog.create({
        data: {
          teamId: team.id,
          method: c.req.method,
          path: c.req.path,
          status: c.res.status,
          duration: duration,
          request: JSON.stringify(requestBody),
          response: JSON.stringify(responseBody),
          apiKeyId: apiKey.id,
        },
      });

      console.log({ log });
    } catch (error) {
      // Log error but don't interrupt the request
      console.error("API logging failed:", error);
    }
  });

  app.onError(handleError);

  // The OpenAPI documentation will be available at /doc
  app.doc("/v1/doc", (c) => ({
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "Unsend API",
    },
    servers: [{ url: `${env.NEXTAUTH_URL}/api` }],
  }));

  app.openAPIRegistry.registerComponent("securitySchemes", "Bearer", {
    type: "http",
    scheme: "bearer",
  });

  app.get("/v1/ui", swaggerUI({ url: "/api/v1/doc" }));

  return app;
}

export type PublicAPIApp = ReturnType<typeof getApp>;
