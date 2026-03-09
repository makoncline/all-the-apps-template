import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@hello/contracts", "@hello/sdk"]
};

export default nextConfig;
