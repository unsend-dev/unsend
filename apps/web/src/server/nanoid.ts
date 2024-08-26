import { customAlphabet } from "nanoid";

export const smallNanoid = customAlphabet(
  "1234567890abcdefghijklmnopqrstuvwxyz",
  10
);

export const nanoid = customAlphabet(
  "1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
  21
);
