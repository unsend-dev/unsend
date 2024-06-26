import { customAlphabet } from "nanoid";

export const smallNanoid = customAlphabet(
  "1234567890abcdefghijklmnopqrstuvwxyz",
  10
);
