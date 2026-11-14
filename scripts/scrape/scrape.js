// Scrape the public pages of thecustomizedshop.pk into structured JSON.
// Usage: node scripts/scrape/scrape.js scripts/scrape/raw [fetch|parse]
// Raw HTML is cached in <siteDir>/cache; delete it to force a fresh download.
// Afterwards run `node scripts/build-data.mjs` to regenerate src/data.
const fs = require("fs");
const path = require("path");
const { decode } = require("./rsc.js");
const J = require("./json.js");

const SITE = process.argv[2];
const MODE = process.argv[3] || "all";
const BASE = "https://thecustomizedshop.pk";
const CACHE = path.join(SITE, "cache");
fs.mkdirSync(path.join(CACHE, "product"), { recursive: true });
fs.mkdirSync(path.join(CACHE, "category"), { recursive: true });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function get(url, file) {
  if (fs.existsSync(file) && fs.statSync(file).size > 1000) return fs.readFileSync(file, "utf8");
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 (site redesign research)" } });
      if (!res.ok) throw new Error(res.status);
      const t = await res.text();
      fs.writeFileSync(file, t);
      return t;
    } catch (e) {
      console.error("retry", url, e.message);
      await sleep(1500 * (attempt + 1));
    }
  }
  return null;
}
async function pool(items, n, fn) {
  let i = 0;
  const workers = Array.from({ length: n }, async () => {
    while (i < items.length) {
      const k = i++;
      await fn(items[k], k);
      await sleep(150);
    }
  });
  await Promise.all(workers);
}
const locs = (xml) => [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const slugOf = (u, kind) => u.replace(BASE, "").replace(`/${kind}/`, "").replace(/\/$/, "");

// ---------- RSC helpers ----------
function textChunk(rsc, ref) {
  // ref like "$6d" -> find "6d:T<hexlen>," and take hexlen UTF-8 bytes
  const id = ref.slice(1);
  const re = new RegExp("(?:^|\\n|\\]|\\})" + id + ":T([0-9a-f]+),");
  const m = rsc.match(re);
  if (!m) return null;
  const start = m.index + m[0].length;
  const len = parseInt(m[1], 16);
  const buf = Buffer.from(rsc.slice(start, start + len + 100), "utf8");
  return buf.slice(0, len).toString("utf8");
}
function resolveHtml(rsc, v) {
  if (typeof v !== "string") return null;
  if (/^\$[0-9a-f]+$/.test(v)) return textChunk(rsc, v);
  return v;
}
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
function renderTree(node) {
  if (node == null || node === false || node === true) return "";
  if (typeof node === "string" || typeof node === "number") return esc(node);
  if (Array.isArray(node)) {
    if (node[0] === "$" && typeof node[1] === "string") {
      let tag = node[1];
      const props = node[3] || {};
      if (tag.startsWith("$L")) tag = props.href ? "a" : "span";
      const attrs = props.href ? ` href="${esc(props.href)}"` : "";
      return `<${tag}${attrs}>${renderTree(props.children)}</${tag}>`;
    }
    return node.map(renderTree).join("");
  }
  return "";
}
function plainText(node) {
  return renderTree(node).replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").trim();
}
function afterClass(rsc, cls, key) {
  const k = `"className":"${cls}",`;
  const i = rsc.indexOf(k);
  if (i < 0) return undefined;
  return J.after(rsc, key, i);
}
function head(html) {
  const t = (html.match(/<title>([^<]*)<\/title>/) || [])[1];
  const d = (html.match(/<meta name="description" content="([^"]*)"/) || [])[1];
  const dec = (s) => s && s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
  return { title: dec(t), metaDescription: dec(d) };
}
function jsonLd(html) {
  return [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)]
    .map((m) => { try { return JSON.parse(m[1]); } catch { return null; } })
    .filter(Boolean);
}
function productObjects(rsc) {
  return J.all(rsc, "product").map((r) => r.value).filter((p) => p && typeof p === "object" && p.slug);
}

function parseCategory(slug, html) {
  const rsc = decode(html);
  const { title, metaDescription } = head(html);
  const h1 = (html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/) || [])[1];
  const longRef = afterClass(rsc, "cat-long-desc-text", "__html");
  const subtitleIdx = rsc.indexOf('"className":"page-hero-title"');
  const products = productObjects(rsc);
  const ld = jsonLd(html).find((x) => x["@type"] === "CollectionPage");
  // other hero intro (string after h1 in hero)
  return {
    slug,
    title,
    metaDescription,
    h1: h1 && h1.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").trim(),
    longHtml: resolveHtml(rsc, longRef),
    numberOfItems: ld && ld.numberOfItems,
    productSlugs: products.map((p) => p.slug),
    products,
  };
}

function parseProduct(slug, html) {
  const rsc = decode(html);
  const { title, metaDescription } = head(html);
  const ld = jsonLd(html).find((x) => x["@type"] === "Product") || {};
  const out = { slug, title, metaDescription };
  out.ld = {
    name: ld.name,
    description: ld.description,
    image: ld.image,
    price: ld.offers && ld.offers.price,
    availability: ld.offers && ld.offers.availability,
    category: ld.category,
  };
  // gallery
  const gi = rsc.indexOf('"imageAlts":');
  if (gi >= 0) {
    const g = J.enclosingObject(rsc, gi);
    out.images = g.images;
    out.imageAlts = g.imageAlts;
    out.emoji = g.emoji;
  }
  // options component
  const oi = rsc.indexOf('"customOptions":');
  if (oi >= 0) {
    const o = J.enclosingObject(rsc, oi);
    out.name = o.productName;
    out.price = o.price;
    out.compareAtPrice = o.compareAtPrice;
    out.customOptions = o.customOptions;
    out.bulkTiers = o.bulkTiers;
    out.bulkUnit = o.bulkUnit;
    out.qualityTiers = o.qualityTiers;
    const extra = Object.keys(o).filter((k) => !["productName", "productSlug", "price", "compareAtPrice", "images", "customOptions", "bulkTiers", "bulkUnit", "qualityTiers"].includes(k));
    if (extra.length) out.optionExtras = Object.fromEntries(extra.map((k) => [k, o[k]]));
  }
  // breadcrumb category
  const bc = html.match(/<nav class="breadcrumb"[\s\S]*?<\/nav>/);
  if (bc) {
    const cats = [...bc[0].matchAll(/href="\/category\/([^"/]+)\/?"/g)].map((m) => m[1]);
    out.breadcrumbCategory = cats[cats.length - 1];
  }
  out.shortLeadHtml = resolveHtml(rsc, afterClass(rsc, "product-short-desc-lead", "__html"));
  const sd = afterClass(rsc, "product-short-desc", "children");
  if (sd) out.shortLines = (Array.isArray(sd) ? sd : [sd]).map((n) => renderTree(n && n[3] ? n[3].children : n)).filter(Boolean);
  out.longHtml = resolveHtml(rsc, afterClass(rsc, "product-long-desc-text", "__html"));
  const tags = afterClass(rsc, "product-long-desc-tags", "children");
  if (tags) out.tags = tags.map(plainText).filter(Boolean);
  out.dbReviews = J.after(rsc, "dbReviews");
  const rel = rsc.indexOf('"related-heading"');
  out.relatedSlugs = rel >= 0 ? productObjects(rsc.slice(rel)).map((p) => p.slug) : [];
  // product id from reviews component
  out.id = J.after(rsc, "productId");
  return out;
}

(async () => {
  const catXml = await get(`${BASE}/sitemap-categories.xml`, path.join(SITE, "sitemap-categories.xml"));
  const prodXml = await get(`${BASE}/sitemap-products.xml`, path.join(SITE, "sitemap-products.xml"));
  const homeHtml = await get(`${BASE}/`, path.join(SITE, "home.html"));
  if (homeHtml) fs.writeFileSync(path.join(SITE, "home.rsc"), decode(homeHtml));
  const catSlugs = locs(catXml).map((u) => slugOf(u, "category"));
  const prodSlugs = locs(prodXml).map((u) => slugOf(u, "product"));
  console.log("categories", catSlugs.length, "products", prodSlugs.length);

  if (MODE !== "parse") {
    let done = 0;
    await pool(catSlugs, 4, async (s) => {
      await get(`${BASE}/category/${s}/`, path.join(CACHE, "category", s + ".html"));
      if (++done % 20 === 0) console.log("cat", done);
    });
    done = 0;
    await pool(prodSlugs, 5, async (s) => {
      await get(`${BASE}/product/${s}/`, path.join(CACHE, "product", s + ".html"));
      if (++done % 50 === 0) console.log("prod", done);
    });
  }
  if (MODE === "fetch") return;

  const cats = [], summaries = {}, products = [], errors = [];
  for (const s of catSlugs) {
    const f = path.join(CACHE, "category", s + ".html");
    if (!fs.existsSync(f)) { errors.push("missing cat " + s); continue; }
    try {
      const c = parseCategory(s, fs.readFileSync(f, "utf8"));
      for (const p of c.products) summaries[p.slug] = summaries[p.slug] || p;
      delete c.products;
      cats.push(c);
    } catch (e) { errors.push("cat " + s + " " + e.message); }
  }
  for (const s of prodSlugs) {
    const f = path.join(CACHE, "product", s + ".html");
    if (!fs.existsSync(f)) { errors.push("missing prod " + s); continue; }
    try {
      const p = parseProduct(s, fs.readFileSync(f, "utf8"));
      const sum = summaries[s];
      if (sum) {
        p.id = p.id || sum.id;
        p.createdAt = sum.created_at;
        p.categoryId = sum.category_id;
        p.extraCategoryIds = sum.extra_category_ids || [];
        p.primaryCategory = sum.categories;
        p.listImages = sum.images;
      } else errors.push("no summary " + s);
      products.push(p);
    } catch (e) { errors.push("prod " + s + " " + e.message); }
  }
  fs.writeFileSync(path.join(SITE, "out-categories.json"), JSON.stringify(cats, null, 1));
  fs.writeFileSync(path.join(SITE, "out-products.json"), JSON.stringify(products, null, 1));
  console.log("parsed cats", cats.length, "products", products.length, "errors", errors.length);
  console.log(errors.slice(0, 30).join("\n"));
})();
