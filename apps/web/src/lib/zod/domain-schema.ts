import { DomainStatus } from "@prisma/client";
import { z } from "zod";

export const DomainStatusSchema = z.nativeEnum(DomainStatus);

export const DomainSchema = z.object({
  id: z.number().openapi({ description: "The ID of the domain", example: 1 }),
  name: z
    .string()
    .openapi({ description: "The name of the domain", example: "example.com" }),
  teamId: z.number().openapi({ description: "The ID of the team", example: 1 }),
  status: DomainStatusSchema,
  region: z.string().default("us-east-1"),
  clickTracking: z.boolean().default(false),
  openTracking: z.boolean().default(false),
  publicKey: z.string(),
  dkimStatus: z.string().optional().nullish(),
  spfDetails: z.string().optional().nullish(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const CreateDomainSchema = DomainSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  teamId: true,
  publicKey: true,
  dkimStatus: true,
  spfDetails: true,
});
