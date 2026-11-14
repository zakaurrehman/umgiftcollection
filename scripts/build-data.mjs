// Transforms the scraped store data (scripts/scrape/raw) into the app's data files.
//   node scripts/build-data.mjs
// Outputs:
//   src/data/products.json    full product records (server-only)
//   src/data/categories.json  categories with SEO copy and product membership
//   src/data/menu.json        mega-menu configuration from the original store
//   src/data/home-seo.html    homepage long-form SEO content
//   public/search-index.json  lightweight index for client-side search
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const J = require("./scrape/json.js");
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const RAW = path.join(ROOT, "scripts/scrape/raw");
const OUT = path.join(ROOT, "src/data");
fs.mkdirSync(OUT, { recursive: true });

const SUPABASE = "https://euhgzhfdrrhlweffjolg.supabase.co/storage/v1/object/public/product-images/";
const IK = "https://ik.imagekit.io/gduf8ygq0/";
const ORIGIN = "https://thecustomizedshop.pk";

const toCdn = (u) => {
  if (!u) return u;
  if (u.startsWith(SUPABASE)) return IK + u.slice(SUPABASE.length);
  if (u.startsWith(IK)) return u.split("?")[0];
  return u;
};
const decodeEntities = (s) =>
  s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ");

// Light sanitizer for the store's own CMS HTML: drops scripts, styles, event
// handlers, classes, inline styles; rewrites absolute store links to relative.
function cleanHtml(html) {
  if (!html) return null;
  let h = html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<(colgroup|col)\b[^>]*>(<\/colgroup>)?/gi, "")
    .replace(/<\/colgroup>/gi, "")
    .replace(/<[a-z][a-z0-9]*\s[^>]*>/gi, (tag) =>
      tag.replace(/\s(on[a-z]+|class|style|colwidth|target|rel)="[^"]*"/gi, "").replace(/\s(colspan|rowspan)="1"/gi, ""))
    .replace(/<img\b[^>]*>/gi, (tag) => {
      const src = (tag.match(/src="([^"]*)"/) || [])[1];
      const alt = (tag.match(/alt="([^"]*)"/) || [])[1] || "";
      return src ? `<img src="${toCdn(src)}" alt="${alt}" loading="lazy">` : "";
    })
    .replace(/href="(?:https?:\/\/)?(?:www\.)?thecustomizedshop\.pk(\/[^"]*)?"/gi, (_, p) => `href="${p || "/"}"`)
    .replace(/href="(\/(?:product|category)\/[^"?#]*[^/"?#])"/g, 'href="$1/"')
    .replace(/<p>\s*<\/p>/g, "")
    .replace(/<(\w+)>\s*<\/\1>/g, "")
    // Wide tables scroll horizontally; make them keyboard-focusable.
    .replace(/<table>/g, '<table tabindex="0">');
  // external links open in a new tab safely
  h = h.replace(/<a href="(https?:\/\/[^"]+)"/g, '<a href="$1" target="_blank" rel="noopener noreferrer"');
  return h.trim();
}
const stripEmoji = (s) => s.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B50}\u{2728}\u{FE0F}]/gu, "").replace(/\s{2,}/g, " ").trim();

// ---------- categories ----------
const home = fs.readFileSync(path.join(RAW, "home.rsc"), "utf8");
const menuCategories = J.after(home, "menuCategories");
const menuConfig = J.after(home, "menuConfig");
const rawCats = JSON.parse(fs.readFileSync(path.join(RAW, "out-categories.json"), "utf8"));
const rawProducts = JSON.parse(fs.readFileSync(path.join(RAW, "out-products.json"), "utf8"));
const byId = Object.fromEntries(menuCategories.map((c) => [c.id, c]));
const bySlug = Object.fromEntries(menuCategories.map((c) => [c.slug, c]));

const products = rawProducts.map((p) => {
  const images = (p.images || p.listImages || []).map(toCdn);
  const primary = p.primaryCategory?.slug || p.breadcrumbCategory;
  const extra = (p.extraCategoryIds || []).map((id) => byId[id]?.slug).filter(Boolean);
  return {
    id: p.id,
    slug: p.slug,
    name: p.name || p.ld.name,
    price: p.price,
    compareAtPrice: p.compareAtPrice && p.compareAtPrice > p.price ? p.compareAtPrice : null,
    images,
    imageAlts: p.imageAlts || [],
    category: primary,
    categories: [...new Set([primary, ...extra])].filter(Boolean),
    badge: p.primaryCategory?.badge || null,
    createdAt: p.createdAt,
    inStock: (p.ld.availability || "").endsWith("InStock"),
    description: p.ld.description || "",
    seoTitle: p.title,
    seoDescription: p.metaDescription,
    shortLeadHtml: cleanHtml(p.shortLeadHtml),
    shortLines: (p.shortLines || []).map(cleanHtml),
    longHtml: cleanHtml(p.longHtml),
    tags: (p.tags || []).map(stripEmoji),
    options: p.customOptions || [],
    bulkTiers: p.bulkTiers || null,
    bulkUnit: p.bulkUnit || "piece",
    qualityTiers: p.qualityTiers || null,
    reviews: (p.dbReviews || []).map((r) => ({
      name: r.customer_name,
      rating: r.rating,
      title: r.title,
      body: r.body,
      reply: r.admin_reply,
      date: r.created_at,
    })),
    related: p.relatedSlugs || [],
  };
});
const productBySlug = Object.fromEntries(products.map((p) => [p.slug, p]));

const categories = menuCategories.map((m) => {
  const raw = rawCats.find((c) => c.slug === m.slug) || { productSlugs: [] };
  const slugs = raw.productSlugs.filter((s) => productBySlug[s]);
  const cover = slugs.map((s) => productBySlug[s].images[0]).find(Boolean) || null;
  return {
    id: m.id,
    slug: m.slug,
    name: decodeEntities(m.name),
    emoji: m.emoji,
    seoTitle: raw.title || null,
    seoDescription: raw.metaDescription || null,
    longHtml: cleanHtml(raw.longHtml),
    productSlugs: slugs,
    count: slugs.length,
    image: cover,
  };
});
// Any category referenced by a product but missing from menuCategories
for (const c of rawCats) if (!bySlug[c.slug]) console.warn("category not in menu list:", c.slug);

// ---------- home SEO ----------
let seo = fs.readFileSync(path.join(RAW, "home-seo.html"), "utf8");
seo = seo.replace(/^\s*<div[^>]*>\s*<div[^>]*>\s*<div[^>]*>\s*<div[^>]*>/, "");
seo = cleanHtml(seo).replace(/(<\/div>\s*)+$/, "");

// ---------- rebrand ----------
// The owner is rebranding The Customized Shop as UM Gift Collection
// (umgiftcollection.com). URL paths are unchanged, so only names/domains move.
const rebrand = (s) =>
  s
    .replace(/thecustomizedshop\.pk/gi, (m) => (m[0] === "T" ? "UMGiftCollection.com" : "umgiftcollection.com"))
    .replace(/TheCustomizedShop/g, "UMGiftCollection")
    .replace(/the customized shop/gi, "UM Gift Collection");

// ---------- write ----------
fs.writeFileSync(path.join(OUT, "products.json"), rebrand(JSON.stringify(products)));
fs.writeFileSync(path.join(OUT, "categories.json"), rebrand(JSON.stringify(categories)));
fs.writeFileSync(path.join(OUT, "menu.json"), JSON.stringify(menuConfig, null, 1));
// Split the FAQ block (h4 "Q: …" + answer paragraphs) out of the SEO copy.
const faqStart = seo.search(/<h3>(?:<strong>)?FAQs/i);
const faqs = [];
let seoBody = seo;
if (faqStart >= 0) {
  const block = seo.slice(faqStart);
  seoBody = seo.slice(0, faqStart);
  for (const m of block.matchAll(/<h4>([\s\S]*?)<\/h4>([\s\S]*?)(?=<h4>|$)/g)) {
    const q = m[1].replace(/<[^>]+>/g, "").replace(/^\s*Q:\s*/, "").trim();
    const a = m[2].replace(/<\/?(div|label|input)[^>]*>/g, "").trim();
    if (q && a) faqs.push({ q: decodeEntities(rebrand(q)), a: rebrand(a) });
  }
}
fs.writeFileSync(path.join(OUT, "home-content.json"), JSON.stringify({ seoHtml: rebrand(seoBody), faqs }));
if (fs.existsSync(path.join(OUT, "home-seo.html"))) fs.unlinkSync(path.join(OUT, "home-seo.html"));
console.log("home faqs", faqs.length);

const index = products.map((p) => ({
  s: p.slug,
  n: p.name,
  p: p.price,
  c: p.compareAtPrice,
  i: p.images[0] ? p.images[0].replace(IK, "") : null,
  k: p.category,
}));
fs.writeFileSync(path.join(ROOT, "public/search-index.json"), JSON.stringify({ products: index, categories: categories.filter((c) => c.count).map((c) => ({ s: c.slug, n: c.name, c: c.count })) }));

console.log("products", products.length, "categories", categories.length, "with products", categories.filter((c) => c.count).length);
console.log("sizes", ["products.json", "categories.json"].map((f) => f + " " + Math.round(fs.statSync(path.join(OUT, f)).size / 1024) + "KB").join(", "), "index", Math.round(fs.statSync(path.join(ROOT, "public/search-index.json")).size / 1024) + "KB");
