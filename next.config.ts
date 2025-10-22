import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: new URL(process.env.NEXT_PUBLIC_API_URL || 'https://nikicity.com').hostname,
      },
    ],
  },
};

export default nextConfig;
