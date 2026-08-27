import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  images: {
    remotePatterns: [
      new URL("https://*.public.blob.vercel-storage.com/**"),
      new URL("https://upload.wikimedia.org/**"),
    ],
  },
};

export default nextConfig;
