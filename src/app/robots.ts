import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

// Mirrors the original store's robots rules for the paths that still exist.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/cart/", "/wishlist/", "/api/", "/*?*sort=", "/*?*price=", "/*?*cat="] }],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
