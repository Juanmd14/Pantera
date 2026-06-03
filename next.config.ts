import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  productionBrowserSourceMaps: false,
  experimental: {
    turbopackUseSystemTlsCerts: true,
  },
};

export default nextConfig;
