import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  images: {
    unoptimized: true, // Required for Cloudflare Workers (no native image optimization)
  },
};

export default withNextIntl(nextConfig);
