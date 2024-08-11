// eslint-disable-next-line import/no-extraneous-dependencies
import { defineConfig, Options } from "tsup";

// eslint-disable-next-line import/no-default-export
export default defineConfig((options: Options) => ({
  entry: ["src/server.ts"],
  format: ["cjs"],
  dts: true,
  minify: true,
  clean: true,
  injectStyle: true,
  ...options,
}));
