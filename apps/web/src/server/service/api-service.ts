import { ApiPermission } from "@prisma/client";
import { db } from "../db";
import { randomBytes } from "crypto";
import { hashToken } from "../auth";

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
    const token = `us_${randomBytes(20).toString("hex")}`;
    const hashedToken = hashToken(token);

    await db.apiKey.create({
      data: {
        name,
        permission: permission,
        teamId,
        tokenHash: hashedToken,
        partialToken: `${token.slice(0, 8)}...${token.slice(-5)}`,
      },
    });
    return token;
  } catch (error) {
    console.error("Error adding API key:", error);
    throw error;
  }
}

export async function retrieveApiKey(token: string) {
  const hashedToken = hashToken(token);

  try {
    const apiKey = await db.apiKey.findUnique({
      where: {
        tokenHash: hashedToken,
      },
      select: {
        id: true,
        name: true,
        permission: true,
        teamId: true,
        partialToken: true,
      },
    });
    if (!apiKey) {
      throw new Error("API Key not found");
    }
    return apiKey;
  } catch (error) {
    console.error("Error retrieving API key:", error);
    throw error;
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
