import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "github.com",
      },
      {
        protocol: "https",
        hostname: "backend.betaisports.net",
      },
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    formats: ["image/webp"],
  },
};

export default nextConfig;
