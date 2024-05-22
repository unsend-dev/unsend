import { createRoute, z } from "@hono/zod-openapi";
import { PublicAPIApp } from "~/server/public-api/hono";
import { getTeamFromToken } from "~/server/public-api/auth";
import { sendEmail } from "~/server/service/email-service";
import { db } from "~/server/db";
import { EmailStatus } from "@prisma/client";
import { UnsendApiError } from "../../api-error";

const route = createRoute({
  method: "get",
  path: "/v1/emails/{emailId}",
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
          schema: z.object({
            id: z.string(),
            teamId: z.number(),
            to: z.string(),
            from: z.string(),
            subject: z.string(),
            html: z.string().nullable(),
            text: z.string().nullable(),
            createdAt: z.string(),
            updatedAt: z.string(),
            emailEvents: z.array(
              z.object({
                emailId: z.string(),
                status: z.nativeEnum(EmailStatus),
                createdAt: z.string(),
                data: z.any().optional(),
              })
            ),
          }),
        },
      },
      description: "Retrieve the user",
    },
  },
});

function send(app: PublicAPIApp) {
  app.openapi(route, async (c) => {
    const team = await getTeamFromToken(c);

    const emailId = c.req.param("emailId");

    const email = await db.email.findUnique({
      where: {
        id: emailId,
        teamId: team.id,
      },
      select: {
        id: true,
        teamId: true,
        to: true,
        from: true,
        subject: true,
        html: true,
        text: true,
        createdAt: true,
        updatedAt: true,
        emailEvents: {
          select: {
            emailId: true,
            status: true,
            createdAt: true,
            data: true,
          },
        },
      },
    });

    if (!email) {
      throw new UnsendApiError({
        code: "NOT_FOUND",
        message: "Email not found",
      });
    }

    return c.json(email);
  });
}

export default send;
