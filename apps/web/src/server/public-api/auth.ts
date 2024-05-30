import TTLCache from "@isaacs/ttlcache";
import { Context } from "hono";
import { hashToken } from "../auth";
import { db } from "../db";
import { UnsendApiError } from "./api-error";
import { env } from "~/env";

const rateLimitCache = new TTLCache({
  ttl: 1000, // 1 second
  max: env.API_RATE_LIMIT,
});

/**
 * Gets the team from the token. Also will check if the token is valid.
 */
export const getTeamFromToken = async (c: Context) => {
  const authHeader = c.req.header("Authorization");

  if (!authHeader) {
    throw new UnsendApiError({
      code: "UNAUTHORIZED",
      message: "No Authorization header provided",
    });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    throw new UnsendApiError({
      code: "UNAUTHORIZED",
      message: "No Authorization header provided",
    });
  }

  checkRateLimit(token);

  const hashedToken = hashToken(token);

  const team = await db.team.findFirst({
    where: {
      apiKeys: {
        some: {
          tokenHash: hashedToken,
        },
      },
    },
  });

  if (!team) {
    throw new UnsendApiError({
      code: "FORBIDDEN",
      message: "Invalid API token",
    });
  }

  // No await so it won't block the request. Need to be moved to a queue in future
  db.apiKey
    .update({
      where: {
        tokenHash: hashedToken,
      },
      data: {
        lastUsed: new Date(),
      },
    })
    .catch(console.error);

  return team;
};

const checkRateLimit = (token: string) => {
  let rateLimit = rateLimitCache.get<number>(token);

  rateLimit = rateLimit ?? 0;

  if (rateLimit >= 2) {
    throw new UnsendApiError({
      code: "RATE_LIMITED",
      message: `Rate limit exceeded, ${env.API_RATE_LIMIT} requests per second`,
    });
  }

  rateLimitCache.set(token, rateLimit + 1);
};
