import path from "node:path";
import type { NextConfig } from "next";

// wagmi's optional connectors dynamically import packages we don't install
// (e.g. the Tempo "accounts" SDK). Alias the bare specifiers to a local stub
// so both Turbopack and webpack can resolve them without the dependency.
const nextConfig: NextConfig = {
  reactStrictMode: true,
  turbopack: {
    resolveAlias: {
      accounts: "./src/lib/web3/empty-module.ts",
    },
  },
  webpack: (config) => {
    config.resolve = config.resolve ?? {};
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
      accounts: path.resolve("./src/lib/web3/empty-module.ts"),
    };
    return config;
  },
};

export default nextConfig;

import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
