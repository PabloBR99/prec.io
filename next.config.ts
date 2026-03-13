import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.openfoodfacts.org",
      },
      {
        protocol: "https",
        hostname: "world.openfoodfacts.org",
      },
      {
        protocol: "https",
        hostname: "vaxypjgigcnyecydrych.supabase.co",
      },
      {
        protocol: "https",
        hostname: "prod-mercadona.imgix.net",
      },
    ],
  },
};

export default nextConfig;
