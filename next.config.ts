import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: '/prevenindocomarte',
  assetPrefix: '/prevenindocomarte',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
