import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: '/prevenindocomarte',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
