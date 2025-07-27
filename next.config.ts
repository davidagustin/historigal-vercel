import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  serverExternalPackages: [],
  // Optimize for Vercel deployment
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
};

export default nextConfig;
