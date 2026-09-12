import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // assets are pre-optimised to webp in public/img, so the built-in
    // optimiser only ever needs to resize, never transcode
    formats: ["image/webp"],
    deviceSizes: [375, 640, 768, 1024, 1280, 1440, 1920, 2560, 3000],
  },
};

export default nextConfig;
