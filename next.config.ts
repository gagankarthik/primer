import type { NextConfig } from "next";

const config: NextConfig = {
  images: {
    // Photography is hotlinked from Unsplash's CDN. Scoped to the exact host so
    // the optimiser can't be pointed at arbitrary remote origins.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

export default config;
