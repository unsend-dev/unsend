import { PrismaClient } from "@prisma/client";
import { withOptimize } from "@prisma/extension-optimize";
import { env } from "~/env";

const createPrismaClient = () => {
  const client = new PrismaClient({
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });
  if (env.ENABLE_PRISMA_CLIENT) {
    return client.$extends(withOptimize());
  }

  return client;
};

// eslint-disable-next-line no-undef
const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (env.NODE_ENV !== "production") globalForPrisma.prisma = db;
