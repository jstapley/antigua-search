import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  generateBuildId: async () => Date.now().toString(),
  async redirects() {
    return [
      // Parish slug misspellings → canonical st-johns
      { source: '/parish/saint-johns',   destination: '/parish/st-johns', permanent: true },
      { source: '/parish/saint-john-s',  destination: '/parish/st-johns', permanent: true },
      { source: '/parish/st-john-s',     destination: '/parish/st-johns', permanent: true },
      { source: '/parish/stjohns',       destination: '/parish/st-johns', permanent: true },
      { source: '/parish/saint-john',    destination: '/parish/st-johns', permanent: true },
      { source: '/parish/st-john',       destination: '/parish/st-johns', permanent: true },
    ]
  },
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