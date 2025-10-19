import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/external/:path*',
        destination: 'https://nikicity.com/api/:path*',
      },
    ];
  },
};

export default nextConfig;
