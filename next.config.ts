import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow images from images.unsplash.com used by the demo data
    domains: ["images.unsplash.com"],
    // remotePatterns can also be used for more specific control
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
