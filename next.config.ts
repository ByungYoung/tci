import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["supabase.co", "supabase.vercel-storage.com"],
  },
  typescript: {
    // 빌드 시 타입 검사 비활성화
    ignoreBuildErrors: true,
  },
  eslint: {
    // 빌드 시 ESLint 검사 비활성화
    ignoreDuringBuilds: true,
  },
};

export default withNextIntl(nextConfig);
