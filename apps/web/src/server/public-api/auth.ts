import { Context } from "hono";
import { hashToken } from "../auth";
import { db } from "../db";
import { UnsendApiError } from "./api-error";

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
  db.apiKey.update({
    where: {
      tokenHash: hashedToken,
    },
    data: {
      lastUsed: new Date(),
    },
  });

  return team;
};
