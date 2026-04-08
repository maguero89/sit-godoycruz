import type { NextConfig } from "next";

const nextConfig = {
  // @ts-ignore: NextConfig typing bug
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
