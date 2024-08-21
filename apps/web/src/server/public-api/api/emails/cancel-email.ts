import { createRoute, z } from "@hono/zod-openapi";
import { PublicAPIApp } from "~/server/public-api/hono";
import { getTeamFromToken } from "~/server/public-api/auth";
import { cancelEmail } from "~/server/service/email-service";

const route = createRoute({
  method: "post",
  path: "/v1/emails/{emailId}/cancel",
  request: {
    params: z.object({
      emailId: z
        .string()
        .min(3)
        .openapi({
          param: {
            name: "emailId",
            in: "path",
          },
          example: "cuiwqdj74rygf74",
        }),
    }),
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.object({ emailId: z.string().optional() }),
        },
      },
      description: "Retrieve the user",
    },
  },
});

function cancelScheduledEmail(app: PublicAPIApp) {
  app.openapi(route, async (c) => {
    await getTeamFromToken(c);
    const emailId = c.req.param("emailId");

    await cancelEmail(emailId);

    return c.json({ emailId });
  });
}

export default cancelScheduledEmail;
