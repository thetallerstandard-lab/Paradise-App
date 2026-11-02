import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
};

export default nextConfig;

// Gives `next dev` access to Cloudflare bindings (vars, secrets) through
// getCloudflareContext(). Has no effect on production builds.
// https://opennext.js.org/cloudflare/get-started
void initOpenNextCloudflareForDev();
