import type { NextConfig } from "next";
import createMDX from "@next/mdx";

import "./src/env.app";

// Check if we're building for Tauri (static export for desktop)
const isTauriBuild = process.env.TAURI_BUILD === "true";

const config: NextConfig = {
  /* config options here */
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    config.externals.push("pino-pretty", "encoding");
    return config;
  },
  devIndicators: false,
  // Enable static export only for Tauri builds
  ...(isTauriBuild && {
    output: "export",
    images: {
      unoptimized: true,
    },
  }),
};

const withMDX = createMDX({});

export default withMDX(config);
