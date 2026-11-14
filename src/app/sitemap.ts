import type { MetadataRoute } from "next";
import { categories, products } from "@/lib/catalog";
import { site } from "@/lib/site";

// Same URL set as the original store's sitemap-main / -categories / -products.
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages = ["/", "/shop/", "/custom-football-jerseys-bulk/", "/custom-cricket-shirts-bulk/", "/reviews/", "/how-to-order/", "/return-policy/", "/track-order/"];
  return [
    ...pages.map((p) => ({ url: `${site.url}${p}`, lastModified: now, changeFrequency: "weekly" as const, priority: p === "/" ? 1 : 0.7 })),
    ...categories.map((c) => ({ url: `${site.url}/category/${c.slug}/`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.8, images: c.image ? [c.image] : undefined })),
    ...products.map((p) => ({
      url: `${site.url}/product/${p.slug}/`,
      lastModified: p.createdAt ? new Date(p.createdAt) : now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
      images: p.images.slice(0, 5),
    })),
  ];
}
