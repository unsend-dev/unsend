import TTLCache from "@isaacs/ttlcache";
import { Context } from "hono";
import { db } from "../db";
import { UnsendApiError } from "./api-error";
import { env } from "~/env";
import { getTeamAndApiKey } from "../service/api-service";
import { getRedis } from "../redis";
import { isSelfHosted } from "~/utils/common";

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

  await checkRateLimit(team.id.toString(), team.apiRateLimit ?? 2);

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

const checkRateLimit = async (key: string, limit: number) => {
  if (isSelfHosted()) {
    let rate = rateLimitCache.get<number>(key) ?? 0;
    if (rate >= env.API_RATE_LIMIT) {
      throw new UnsendApiError({
        code: "RATE_LIMITED",
        message: `Rate limit exceeded, ${env.API_RATE_LIMIT} requests per second`,
      });
    }
    rateLimitCache.set(key, rate + 1);
    return;
  }

  const redis = getRedis();
  const current = await redis.incr(key);
  if (current === 1) {
    await redis.expire(key, 1);
  }
  if (current > limit) {
    throw new UnsendApiError({
      code: "RATE_LIMITED",
      message: `Rate limit exceeded, ${limit} requests per second`,
    });
  }
};
