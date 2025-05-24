import { createRoute, z } from "@hono/zod-openapi";
import { PublicAPIApp } from "~/server/public-api/hono";
import { sendEmail } from "~/server/service/email-service";
import { emailSchema } from "../../schemas/email-schema";

const route = createRoute({
  method: "post",
  path: "/v1/emails",
  request: {
    body: {
      required: true,
      content: {
        "application/json": {
          schema: emailSchema,
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
    const team = c.var.team;

    let html = undefined;

    const _html = c.req.valid("json")?.html?.toString();

    if (_html && _html !== "true" && _html !== "false") {
      html = _html;
    }

    const email = await sendEmail({
      ...c.req.valid("json"),
      teamId: team.id,
      apiKeyId: team.apiKeyId,
      text: c.req.valid("json").text ?? undefined,
      html: html,
    });

    return c.json({ emailId: email?.id });
  });
}

export default send;
