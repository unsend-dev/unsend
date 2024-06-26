import { ApiPermission } from "@prisma/client";
import { db } from "../db";
import { randomBytes } from "crypto";
import { smallNanoid } from "../nanoid";
import { createSecureHash, verifySecureHash } from "../crypto";

export async function addApiKey({
  name,
  permission,
  teamId,
}: {
  name: string;
  permission: ApiPermission;
  teamId: number;
}) {
  try {
    const clientId = smallNanoid(10);
    const token = randomBytes(16).toString("hex");
    const hashedToken = await createSecureHash(token);

    const apiKey = `us_${clientId}_${token}`;

    await db.apiKey.create({
      data: {
        name,
        permission: permission,
        teamId,
        tokenHash: hashedToken,
        partialToken: `${apiKey.slice(0, 6)}...${apiKey.slice(-3)}`,
        clientId,
      },
    });
    return apiKey;
  } catch (error) {
    console.error("Error adding API key:", error);
    throw error;
  }
}

export async function getTeamAndApiKey(apiKey: string) {
  const [, clientId, token] = apiKey.split("_") as [string, string, string];

  const apiKeyRow = await db.apiKey.findUnique({
    where: {
      clientId,
    },
  });

  if (!apiKeyRow) {
    return null;
  }

  try {
    const isValid = await verifySecureHash(token, apiKeyRow.tokenHash);
    if (!isValid) {
      return null;
    }

    const team = await db.team.findUnique({
      where: {
        id: apiKeyRow.teamId,
      },
    });

    return { team, apiKey: apiKeyRow };
  } catch (error) {
    console.error("Error verifying API key:", error);
    return null;
  }
}

export async function deleteApiKey(id: number) {
  try {
    await db.apiKey.delete({
      where: {
        id,
      },
    });
  } catch (error) {
    console.error("Error deleting API key:", error);
    throw error;
  }
}
