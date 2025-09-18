import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL('https://png.pngtree.com/**')],
  }
};

export default nextConfig;
