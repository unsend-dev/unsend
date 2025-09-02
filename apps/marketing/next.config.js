/** @type {import("next").NextConfig} */
const config = {
  // Static export for marketing site
  output: "export",
  images: {
    // Required for static export if using images
    unoptimized: true,
  },
};

export default config;

