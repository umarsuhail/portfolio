import type { NextConfig } from "next";

// Sanity-check NODE_ENV early to help catch non-standard values that cause
// Next.js runtime inconsistencies (see: https://nextjs.org/docs/messages/non-standard-node-env)
const _allowedNodeEnvs = ["development", "production", "test"];
if (
  typeof process !== "undefined" &&
  process.env.NODE_ENV &&
  !_allowedNodeEnvs.includes(process.env.NODE_ENV)
) {
  // Use console.warn so this is visible during local dev / CI logs without failing builds
  // The Next.js runtime will still emit its own message; this makes the origin easier to find.
  // eslint-disable-next-line no-console
  console.warn(
    `Warning: non-standard NODE_ENV=\"${process.env.NODE_ENV}\" detected. Use one of ${_allowedNodeEnvs.join(
      ", "
    )}. See https://nextjs.org/docs/messages/non-standard-node-env`
  );
}

const nextConfig: NextConfig = {
  // Enables Partial Prerendering and the "use cache" runtime in Next 16.
  cacheComponents: true,

  experimental: {
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
