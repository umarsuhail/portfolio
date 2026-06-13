import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Partial Pre-Rendering — pages opt in with `export const experimental_ppr = true`
    ppr: "incremental",

    // "use cache" directive + cacheLife / cacheTag APIs
    useCache: true,

    // Router cache: how long prefetched static/dynamic pages stay fresh in the client
    staleTimes: {
      dynamic: 30,   // 30 s for dynamically-rendered pages
      static: 300,   // 5 min for statically-rendered pages
    },

    // Inline critical CSS to eliminate render-blocking stylesheet requests
    inlineCss: true,

    // Incremental prefetch — only prefetch visible links, not the whole page
    optimisticClientCache: true,
  },

  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },

  // Log all fetch() calls + their cache status during builds
  logging: {
    fetches: {
      fullUrl: true,
    },
  },

  // Compress responses
  compress: true,

  // Power-by header removal
  poweredByHeader: false,

  // Strong cache headers for static assets
  async headers() {
    return [
      {
        source: "/umar-suhail-resume-2026.pdf",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=3600",
          },
        ],
      },
      {
        source: "/(fonts|images|sounds)/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
