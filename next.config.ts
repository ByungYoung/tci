import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["supabase.co", "supabase.vercel-storage.com"],
  },
  webpack: (config: import("webpack").Configuration) => {
    config.resolve = config.resolve || {};
    config.resolve.fallback = { fs: false, path: false };
    return config;
  },
};

export default withNextIntl(nextConfig);
