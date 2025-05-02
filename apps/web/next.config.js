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
    serverComponentsExternalPackages: ["bullmq"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.gravatar.com",
      },
    ],
  },
};

export default config;
