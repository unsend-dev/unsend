import { z } from "zod";
import { WebhookEvent } from "@prisma/client";

export const webhookSchema = z.object({
  url: z.string().url(),
  domainId: z.number().optional(),
  events: z.array(z.nativeEnum(WebhookEvent)),
});

export const webhookSchemaForm = z.object({
  url: z.string().url(),
  domainId: z.string().optional(),
  events: z.array(z.nativeEnum(WebhookEvent)),
});
