import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    unoptimized: true, // Required for Cloudflare Pages as it doesn't support Next.js default image optimization
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts', 'framer-motion', 'date-fns'], // Reduces bundle size for Cloudflare Workers
  },
};

export default withNextIntl(nextConfig);
