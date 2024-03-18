import { PrismaClient } from "@prisma/client";

declare global {
  // We need `var` to declare a global variable in TypeScript
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

if (!globalThis.prisma) {
  globalThis.prisma = new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL,
  });
}

export const prisma =
  globalThis.prisma ||
  new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL,
  });

export const getPrismaClient = () => prisma;
