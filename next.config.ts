import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "oaidalleapiprodscus.blob.core.windows.net",
      },
      // github remote images
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },

      // google remote images
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "myghytvpplkeykyfaqit.supabase.co",
      },
    ],
  },
};

export default nextConfig;
