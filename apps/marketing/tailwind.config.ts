import { type Config } from "tailwindcss";
import sharedConfig from "@unsend/tailwind-config/tailwind.config";
import path from "path";

export default {
  ...sharedConfig,
  content: ["./src/**/*.tsx"],
} satisfies Config;
