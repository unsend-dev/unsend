import { createRoute, z } from "@hono/zod-openapi";
import { DomainSchema } from "~/lib/zod/domain-schema";
import { PublicAPIApp } from "~/server/public-api/hono";
import { db } from "~/server/db";
import { getTeamFromToken } from "~/server/public-api/auth";

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
    const team = c.var.team;

    // If API key is restricted to a specific domain, only return that domain
    let domains;
    if (team.apiKey.domainId) {
      domains = await db.domain.findMany({ 
        where: { 
          teamId: team.id,
          id: team.apiKey.domainId 
        } 
      });
    } else {
      // If API key has access to all domains, return all team domains
      domains = await db.domain.findMany({ where: { teamId: team.id } });
    }

    return c.json(domains);
  });
}

export default getDomains;
