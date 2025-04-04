import { createRoute, z } from "@hono/zod-openapi";
import { PublicAPIApp } from "~/server/public-api/hono";
import { getTeamFromToken } from "~/server/public-api/auth";
import { db } from "~/server/db";

const route = createRoute({
  method: "put",
  path: "/v1/domains/{id}/verify",
  request: {
    params: z.object({
      id: z.coerce.number().openapi({
        param: {
          name: "id",
          in: "path",
        },
        example: 1,
      }),
    }),
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
      description: "Create a new domain",
    },
  },
});

function verifyDomain(app: PublicAPIApp) {
  app.openapi(route, async (c) => {
    const team = await getTeamFromToken(c);

    await db.domain.update({
      where: { id: c.req.valid("param").id },
      data: { isVerifying: true },
    });

    return c.json({
      message: "Domain verification started",
    });
  });
}

export default verifyDomain;
