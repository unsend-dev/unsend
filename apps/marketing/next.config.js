/** @type {import("next").NextConfig} */
const config = {
  // Use static export in production by default; keep dev server dynamic
  output: process.env.NEXT_OUTPUT ?? (process.env.NODE_ENV === "production" ? "export" : undefined),
  images: {
    // Required for static export if using images
    unoptimized: true,
  },
};

export default config;
