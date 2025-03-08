import TTLCache from "@isaacs/ttlcache";
import { Context } from "hono";
import { db } from "../db";
import { UnsendApiError } from "./api-error";
import { env } from "~/env";
import { getTeamAndApiKey } from "../service/api-service";

const rateLimitCache = new TTLCache({
  ttl: 1000, // 1 second
  max: 10000,
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

  const teamAndApiKey = await getTeamAndApiKey(token);

  if (!teamAndApiKey) {
    throw new UnsendApiError({
      code: "FORBIDDEN",
      message: "Invalid API token",
    });
  }

  const { team, apiKey } = teamAndApiKey;

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
        id: apiKey.id,
      },
      data: {
        lastUsed: new Date(),
      },
    })
    .catch(console.error);

  return { ...team, apiKeyId: apiKey.id };
};

const checkRateLimit = (token: string) => {
  let rateLimit = rateLimitCache.get<number>(token);

  rateLimit = rateLimit ?? 0;

  if (rateLimit >= env.API_RATE_LIMIT) {
    throw new UnsendApiError({
      code: "RATE_LIMITED",
      message: `Rate limit exceeded, ${env.API_RATE_LIMIT} requests per second`,
    });
  }

  rateLimitCache.set(token, rateLimit + 1);
};
