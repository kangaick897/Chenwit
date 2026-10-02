import type { NextConfig } from "next";

const supabaseImageHostname = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : undefined;

const nextConfig: NextConfig = {
  agentRules: false,
  images: supabaseImageHostname
    ? {
        remotePatterns: [
          {
            protocol: "https",
            hostname: supabaseImageHostname,
            pathname: "/storage/v1/object/public/**",
          },
        ],
      }
    : undefined,
};

export default nextConfig;
