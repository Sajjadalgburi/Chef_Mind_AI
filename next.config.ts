import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "oaidalleapiprodscus.blob.core.windows.net",
      },
    ],
    domains: [
      "localhost",
      "oaidalleapiprodscus.blob.core.windows.net",
      "chefmind.app",
    ],
  },
};

export default nextConfig;
