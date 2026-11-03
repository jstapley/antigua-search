import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["geotiff", "pngjs"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "maps.googleapis.com",
      },
    ],
  },
};

export default nextConfig;
