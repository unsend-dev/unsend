import { Context } from "hono";
import { bearerAuth } from "hono/bearer-auth";
import { hashToken } from "../auth";
import { db } from "../db";

export const getTeamFromToken = async (c: Context) => {
  const authHeader = c.req.header("Authorization");
  if (!authHeader) {
    throw new Error("No Authorization header provided");
  }
  const token = authHeader.split(" ")[1]; // Assuming the Authorization header is in the format "Bearer <token>"
  if (!token) {
    throw new Error("No bearer token provided");
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
    throw new Error("No team found for this token");
  }

  return team;
};
