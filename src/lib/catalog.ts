import "server-only";
import productsJson from "@/data/products.json";
import categoriesJson from "@/data/categories.json";
import menuJson from "@/data/menu.json";
import type { CardProduct, Category, MenuGroup, NavGroup, Product } from "./types";

export const products = productsJson as unknown as Product[];
export const categories = categoriesJson as Category[];
const menu = menuJson as MenuGroup[];

const productMap = new Map(products.map((p) => [p.slug, p]));
const categoryMap = new Map(categories.map((c) => [c.slug, c]));

export const getProduct = (slug: string) => productMap.get(slug);
export const getCategory = (slug: string) => categoryMap.get(slug);
export const categoryName = (slug: string) => categoryMap.get(slug)?.name ?? "";

export const isCustomizable = (p: Product) =>
  p.options.some((o) => o.type === "text" || o.type === "textarea" || o.type === "image") ||
  p.options.some((o) => o.type === "addon" && !!o.reveals?.length);

/** Card data for a product. */
export const toCard = (p: Product) => card(p, false);
/** Card data including category membership, needed by the shop/category filters. */
export const toFilterCard = (p: Product) => card(p, true);

function card(p: Product, withCategories: boolean): CardProduct {
  return {
    slug: p.slug,
    name: p.name,
    price: p.price,
    compareAtPrice: p.compareAtPrice,
    image: p.images[0] ?? null,
    hoverImage: p.images[1] ?? null,
    alt: p.imageAlts[0] || p.name,
    categoryName: categoryName(p.category),
    categorySlug: p.category,
    customizable: isCustomizable(p),
    needsOptions: p.options.some((o) => o.type !== "notice") || !!p.qualityTiers,
    createdAt: p.createdAt,
    categories: withCategories ? p.categories : [],
  };
}

/** Products of a category, in the order the original store lists them. */
export function productsIn(slug: string, limit?: number) {
  const c = categoryMap.get(slug);
  if (!c) return [];
  const list = c.productSlugs.map((s) => productMap.get(s)).filter(Boolean) as Product[];
  return typeof limit === "number" ? list.slice(0, limit) : list;
}

export const newArrivals = (n = 8) =>
  [...products].sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || "")).slice(0, n);

export const onSale = (n = 8) =>
  products
    .filter((p) => p.compareAtPrice)
    .sort((a, b) => (b.compareAtPrice! - b.price) / b.compareAtPrice! - (a.compareAtPrice! - a.price) / a.compareAtPrice!)
    .slice(0, n);

export function relatedProducts(p: Product, n = 8) {
  const fromStore = p.related.map((s) => productMap.get(s)).filter(Boolean) as Product[];
  const fill = productsIn(p.category).filter((x) => x.slug !== p.slug && !fromStore.includes(x));
  return [...fromStore, ...fill].slice(0, n);
}

/** Mega-menu groups from the original store's menu configuration. */
export function navGroups(): NavGroup[] {
  const inMenu = new Set(menu.flatMap((g) => g.items.map((i) => i.slug)));
  const leftovers = categories.filter((c) => c.count && !inMenu.has(c.slug));
  const groups: MenuGroup[] = leftovers.length
    ? [...menu, { label: "More to Explore", icon: "", items: leftovers.map((c) => ({ slug: c.slug })) }]
    : menu;
  return groups
    .map((g) => ({
      label: g.label,
      items: g.items
        .map((it) => {
          const c = categoryMap.get(it.slug);
          return c && c.count ? { slug: c.slug, label: it.label || c.name, count: c.count } : null;
        })
        .filter(Boolean) as NavGroup["items"],
    }))
    .filter((g) => g.items.length);
}

/** Every category with products, largest first (the original Shop page order). */
export const allCategoriesBySize = () => categories.filter((c) => c.count).sort((a, b) => b.count - a.count);

/** One cover image per category, never repeating an image already used in the set. */
export function distinctCovers(slugs: string[]) {
  const used = new Set<string>();
  const out: Record<string, string | null> = {};
  for (const slug of slugs) {
    const img = productsIn(slug).map((p) => p.images[0]).find((i) => i && !used.has(i)) ?? getCategory(slug)?.image ?? null;
    if (img) used.add(img);
    out[slug] = img;
  }
  return out;
}

export const minPrice = (slug: string) => {
  const list = productsIn(slug);
  return list.length ? Math.min(...list.map((p) => p.price)) : 0;
};
