import type { Metadata } from "next";
import { Suspense } from "react";
import { Package, Truck } from "lucide-react";
import { allCategoriesBySize, newArrivals, products, toFilterCard } from "@/lib/catalog";
import { site } from "@/lib/site";
import { PageHero, MetaPill } from "@/components/PageHero";
import { ShopBrowser } from "@/components/shop/ShopBrowser";
import { CategoryChips } from "@/components/shop/CategoryChips";

export const metadata: Metadata = {
  title: `Shop All Products | ${site.name}`,
  description: "Browse all personalized gifts: mugs, frames, cushions, lockets, bracelets and more. 100% customizable, delivered across Pakistan.",
  alternates: { canonical: "/shop/" },
};

export default function ShopPage() {
  // Newest first is the default "featured" order for the full catalog.
  const list = [...products].sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || "")).map(toFilterCard);
  const cats = allCategoriesBySize();
  const facets = cats.map((c) => ({ slug: c.slug, name: c.name, count: c.count }));
  const fan = newArrivals(12)
    .map((p) => p.images[0])
    .filter((x, i, a) => x && a.indexOf(x) === i)
    .slice(1, 4);

  return (
    <main>
      <PageHero
        crumbs={[{ href: "/", label: "Home" }, { label: "Shop" }]}
        title="All"
        accent="products"
        intro="Every personalized gift in our store, from photo mugs and cushions to name jewellery, lamps and jerseys. Filter, sort and find the one that feels right."
        meta={
          <>
            <MetaPill>
              <Package className="size-4 text-peach-300" aria-hidden="true" /> {products.length} designs
            </MetaPill>
            <MetaPill>{cats.length} categories</MetaPill>
            <MetaPill>
              <Truck className="size-4 text-peach-300" aria-hidden="true" /> Free delivery over Rs {site.freeDeliveryThreshold.toLocaleString("en-PK")}
            </MetaPill>
          </>
        }
        images={fan}
      />
      <div className="container-x py-10 md:py-14">
        <CategoryChips categories={cats.slice(0, 24).map((c) => ({ slug: c.slug, name: c.name, count: c.count }))} />
        <div className="mt-10">
          <Suspense fallback={<div className="h-96" />}>
            <ShopBrowser products={list} facets={facets} />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
