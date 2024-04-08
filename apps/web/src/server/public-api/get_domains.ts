import { createRoute, z } from "@hono/zod-openapi";
import { DomainSchema } from "~/lib/zod/domain-schema";
import { PublicAPIApp } from "./hono";
import { db } from "../db";

const route = createRoute({
  method: "get",
  path: "/domains",
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.array(DomainSchema),
        },
      },
      description: "Retrieve the user",
    },
  },
});

function getDomains(app: PublicAPIApp) {
  app.openapi(route, async (c) => {
    const domains = await db.domain.findMany({});

    return c.json(domains);
  });
}

export default getDomains;
