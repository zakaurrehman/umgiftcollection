import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArrowRight, Package, Tag } from "lucide-react";
import { allCategoriesBySize, categories, categoryName, getCategory, minPrice, productsIn, toFilterCard } from "@/lib/catalog";
import { site } from "@/lib/site";
import { formatPrice } from "@/lib/format";
import { PageHero, MetaPill } from "@/components/PageHero";
import { ShopBrowser } from "@/components/shop/ShopBrowser";
import { CategoryChips } from "@/components/shop/CategoryChips";
import { ExpandableHtml } from "@/components/ExpandableHtml";
import { JsonLd } from "@/components/JsonLd";
import { buttonClass } from "@/components/ui/Button";

export const dynamicParams = false;
export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = getCategory((await params).slug);
  if (!c) return {};
  const title = c.seoTitle || `${c.name} | ${site.name}`;
  const description = c.seoDescription || `Shop ${c.name} in Pakistan. 100% customizable, delivered across Pakistan.`;
  return {
    title,
    description,
    alternates: { canonical: `/category/${c.slug}/` },
    openGraph: { title, description, url: `/category/${c.slug}/`, images: c.image ? [{ url: c.image }] : undefined },
  };
}

export default async function CategoryPage({ params }: Props) {
  const c = getCategory((await params).slug);
  if (!c) notFound();
  const list = productsIn(c.slug);
  const cards = list.map(toFilterCard);

  // Refinement facets: other categories these products also belong to.
  const overlap = new Map<string, number>();
  for (const p of list) for (const s of p.categories) if (s !== c.slug) overlap.set(s, (overlap.get(s) || 0) + 1);
  const facets = [...overlap.entries()]
    .filter(([s]) => getCategory(s)?.count)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 16)
    .map(([slug, count]) => ({ slug, name: categoryName(slug), count }));

  const fan = [...new Set(list.map((p) => p.images[0]).filter(Boolean))].slice(0, 3);
  const onSale = list.filter((p) => p.compareAtPrice).length;
  const others = allCategoriesBySize().filter((x) => x.slug !== c.slug);

  return (
    <main>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "CollectionPage",
              name: c.name,
              description: c.seoDescription,
              url: `${site.url}/category/${c.slug}/`,
              numberOfItems: list.length,
              mainEntity: {
                "@type": "ItemList",
                itemListElement: list.slice(0, 30).map((p, i) => ({ "@type": "ListItem", position: i + 1, url: `${site.url}/product/${p.slug}/`, name: p.name })),
              },
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: `${site.url}/` },
                { "@type": "ListItem", position: 2, name: "Shop", item: `${site.url}/shop/` },
                { "@type": "ListItem", position: 3, name: c.name, item: `${site.url}/category/${c.slug}/` },
              ],
            },
          ],
        }}
      />
      <PageHero
        crumbs={[{ href: "/", label: "Home" }, { href: "/shop/", label: "Shop" }, { label: c.name }]}
        title={c.name}
        intro={c.seoDescription}
        images={fan}
        meta={
          list.length > 0 && (
            <>
              <MetaPill>
                <Package className="size-4 text-peach-300" aria-hidden="true" /> {list.length} design{list.length === 1 ? "" : "s"}
              </MetaPill>
              <MetaPill>From {formatPrice(minPrice(c.slug))}</MetaPill>
              {onSale > 0 && (
                <MetaPill>
                  <Tag className="size-4 text-peach-300" aria-hidden="true" /> {onSale} on sale
                </MetaPill>
              )}
            </>
          )
        }
      />

      <div className="container-x py-10 md:py-14">
        {list.length === 0 ? (
          <div className="flex flex-col items-center gap-4 rounded-[var(--radius-xl)] border border-dashed border-line bg-white/60 px-6 py-20 text-center">
            <p className="display text-3xl text-plum-900">New designs coming soon</p>
            <p className="max-w-md text-ink-soft">There are no products in {c.name} right now. Browse our other collections, or message us on WhatsApp for a custom request.</p>
            <Link href="/shop/" className={buttonClass("dark", "md", "mt-2")}>
              Browse all gifts <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        ) : (
          <Suspense fallback={<div className="h-96" />}>
            <ShopBrowser products={cards} facets={facets} facetLabel="Refine by" />
          </Suspense>
        )}
      </div>

      {c.longHtml && (
        <section className="border-t border-line bg-cream-50 py-14 md:py-20">
          <div className="container-x max-w-4xl">
            <p className="eyebrow mb-4">About this collection</p>
            <ExpandableHtml html={c.longHtml} />
          </div>
        </section>
      )}

      <section className="container-x py-14 md:py-16">
        <h2 className="display mb-6 text-2xl text-plum-900 md:text-3xl">Browse all gift categories</h2>
        <CategoryChips categories={others.map((x) => ({ slug: x.slug, name: x.name, count: x.count }))} title="All gift categories" />
      </section>
    </main>
  );
}
