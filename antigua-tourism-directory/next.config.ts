import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  generateBuildId: async () => Date.now().toString(),
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'rhlketnpjazbwpzirkew.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'places.googleapis.com',
        pathname: '/v1/places/**',
      },
    ],
  },
};

export default nextConfig;