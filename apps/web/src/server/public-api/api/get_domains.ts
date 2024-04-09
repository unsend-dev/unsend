import { createRoute, z } from "@hono/zod-openapi";
import { DomainSchema } from "~/lib/zod/domain-schema";
import { PublicAPIApp } from "../hono";
import { db } from "../../db";
import { getTeamFromToken } from "../auth";

const route = createRoute({
  method: "get",
  path: "/v1/domains",
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
    const team = await getTeamFromToken(c);

    const domains = await db.domain.findMany({ where: { teamId: team.id } });

    return c.json(domains);
  });
}

export default getDomains;
