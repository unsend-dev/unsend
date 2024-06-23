/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
  output: process.env.DOCKER_OUTPUT ? "standalone" : undefined,
  experimental: {
    instrumentationHook: true,
    esmExternals: "loose",
    serverComponentsExternalPackages: ["bullmq"],
  },
};

export default config;
