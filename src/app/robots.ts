import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/revalidate"],
      },
    ],
    sitemap: "https://umar.website/sitemap.xml",
    host: "https://umar.website",
  };
}
