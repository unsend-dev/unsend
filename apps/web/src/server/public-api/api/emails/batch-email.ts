import { createRoute, z } from "@hono/zod-openapi";
import { PublicAPIApp } from "~/server/public-api/hono";
import { getTeamFromToken } from "~/server/public-api/auth";
import { sendBulkEmails } from "~/server/service/email-service";
import { EmailContent } from "~/types";
import { emailSchema } from "../../schemas/email-schema"; // Corrected import path

// Define the schema for a single email within the bulk request
// This is similar to the schema in send-email.ts but without the top-level 'required'
// Removed inline emailSchema definition

const route = createRoute({
  method: "post",
  path: "/v1/emails/batch",
  request: {
    body: {
      required: true,
      content: {
        "application/json": {
          // Use the imported schema in an array
          schema: z.array(emailSchema).max(100, {
            message:
              "Cannot send more than 100 emails in a single bulk request",
          }),
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          // Return an array of objects with the created email IDs
          schema: z.object({
            data: z.array(z.object({ emailId: z.string() })),
          }),
        },
      },
      description: "List of successfully created email IDs",
    },
    // Add other potential error responses based on sendBulkEmails logic if needed
  },
});

function sendBatch(app: PublicAPIApp) {
  app.openapi(route, async (c) => {
    const team = await getTeamFromToken(c);
    const emailPayloads = c.req.valid("json");

    // Add teamId and apiKeyId to each email payload
    const emailsToSend: Array<
      EmailContent & { teamId: number; apiKeyId?: number }
    > = emailPayloads.map((payload) => ({
      ...payload,
      text: payload.text ?? undefined,
      html: payload.html ?? undefined,
      teamId: team.id,
      apiKeyId: team.apiKeyId,
    }));

    // Call the service function to send emails in bulk
    const createdEmails = await sendBulkEmails(emailsToSend);

    // Map the result to the response format
    const responseData = createdEmails.map((email) => ({
      emailId: email.id,
    }));

    return c.json({ data: responseData });
  });
}

export default sendBatch;
