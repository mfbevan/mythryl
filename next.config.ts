import type { NextConfig } from "next";
import createMDX from "@next/mdx";

import "./src/env.app";

// Check if we're building for Tauri (static export for desktop)
const isTauriBuild = process.env.TAURI_BUILD === "true";

const config: NextConfig = {
  /* config options here */
  serverExternalPackages: ["@xmtp/browser-sdk"],
  pageExtensions: isTauriBuild
    ? ["jsx", "tsx"] // Exclude .ts files (API routes) for static export
    : ["js", "jsx", "mdx", "ts", "tsx"],
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    config.externals.push("pino-pretty", "encoding");

    // WASM support for XMTP
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    };

    // Ensure WASM files are properly handled with absolute URLs for workers
    config.module.rules.push({
      test: /\.wasm$/,
      type: "asset/resource",
      generator: {
        filename: "static/wasm/[hash][ext]",
      },
    });

    // Set public path for worker context
    config.output = {
      ...config.output,
      publicPath: "/_next/",
      workerPublicPath: "/_next/",
    };

    return config;
  },
  devIndicators: false,
  // COOP/COEP headers for XMTP OPFS support
  // headers: async () => [
  //   {
  //     source: "/(.*)",
  //     headers: [
  //       { key: "Cross-Origin-Embedder-Policy", value: "require-corp" },
  //       { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  //     ],
  //   },
  // ],
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
