import { Context } from "hono";
import { hashToken } from "../auth";
import { db } from "../db";
import { UnsendApiError } from "./api-error";

export const getTeamFromToken = async (c: Context) => {
  const authHeader = c.req.header("Authorization");
  if (!authHeader) {
    throw new UnsendApiError({
      code: "UNAUTHORIZED",
      message: "No Authorization header provided",
    });
  }
  const token = authHeader.split(" ")[1]; // Assuming the Authorization header is in the format "Bearer <token>"
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

  return team;
};
