import { createRoute, z } from "@hono/zod-openapi";
import { PublicAPIApp } from "~/server/public-api/hono";
import { getTeamFromToken } from "~/server/public-api/auth";
import { sendEmail } from "~/server/service/email-service";

const route = createRoute({
  method: "post",
  path: "/v1/emails",
  request: {
    body: {
      required: true,
      content: {
        "application/json": {
          schema: z.object({
            to: z.string().email(),
            from: z.string().email(),
            subject: z.string(),
            replyTo: z.string().optional(),
            text: z.string().optional(),
            html: z.string().optional(),
            attachments: z
              .array(
                z.object({
                  filename: z.string(),
                  content: z.string(),
                })
              )
              .optional(),
          }),
        },
      },
    },
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

function send(app: PublicAPIApp) {
  app.openapi(route, async (c) => {
    const team = await getTeamFromToken(c);

    const email = await sendEmail({
      ...c.req.valid("json"),
      teamId: team.id,
    });

    return c.json({ emailId: email?.id });
  });
}

export default send;
