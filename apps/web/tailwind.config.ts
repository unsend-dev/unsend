import { type Config } from "tailwindcss";
import sharedConfig from "@unsend/tailwind-config/tailwind.config";
import path from "path";

export default {
  ...sharedConfig,
  content: [
    "./src/**/*.tsx",
    `${path.join(require.resolve("@unsend/ui"), "..")}/**/*.{ts,tsx}`,
    `${path.join(require.resolve("@unsend/email-editor"), "..")}/**/*.{ts,tsx}`,
  ],
} satisfies Config;
