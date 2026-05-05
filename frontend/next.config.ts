import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // Linting is handled in a separate CI step — don't fail the build on warnings
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
