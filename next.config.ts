import type { NextConfig } from "next";
import { getDocRemotePattern } from "./src/utils/docUrl";

const docPattern = getDocRemotePattern();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: docPattern
      ? [docPattern]
      : [
          {
            protocol: "https",
            hostname: "nikicity.com",
          },
        ],
  },
};

export default nextConfig;
