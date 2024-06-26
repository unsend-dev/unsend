import { randomBytes, scryptSync } from "crypto";

export const createSecureHash = async (key: string) => {
  const data = new TextEncoder().encode(key);
  const salt = randomBytes(16).toString("hex");

  const derivedKey = scryptSync(data, salt, 64);

  return `${salt}:${derivedKey.toString("hex")}`;
};

export const verifySecureHash = async (key: string, hash: string) => {
  const data = new TextEncoder().encode(key);

  const [salt, storedHash] = hash.split(":");
  const derivedKey = scryptSync(data, String(salt), 64);

  return storedHash === derivedKey.toString("hex");
};
