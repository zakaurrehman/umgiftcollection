# UM Gift Collection — storefront

The redesigned storefront for **UM Gift Collection** (umgiftcollection.com), the
rebrand of The Customized Shop (thecustomizedshop.pk). It carries the full original
catalog: 583 products, 83 categories, every product photo, price, variant and
customization option, plus the store's real reviews, customer photos and policies.

Built with Next.js 16 (App Router, fully static), React 19, Tailwind CSS 4,
Motion and Lucide.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static build: ~1,270 pages
npm start
```

Set `NEXT_PUBLIC_SITE_URL` if you deploy somewhere other than
`https://umgiftcollection.com` (it's used for canonical URLs, the sitemap,
structured data and links in WhatsApp order messages).

## How ordering works

The original store has no payment gateway: orders are confirmed on WhatsApp.
This site keeps that flow and makes it better.

1. Shoppers customize a product (names, messages, photos, sizes, colours,
   add-ons, variants, quality and bulk tiers — exactly the options each product
   had on the original store) and see the price update live.
2. The cart (saved in the browser) holds every customization, recalculates bulk
   pricing when quantities change, applies the `TCS10` promo, and works out
   delivery against the free-delivery threshold.
3. "Order on WhatsApp" opens a chat with **0314 8337494** pre-filled with a
   formatted order: items, options, quantities, totals and optional delivery
   details. Shoppers can preview the message first.
4. Customization photos never leave the shopper's device. On phones that
   support it, the cart can share them straight into WhatsApp; otherwise the
   message tells the shopper to send them in the chat.

The bulk team-kit pages have a live kit designer that sends the design and
quote to WhatsApp the same way. Track Order sends a pre-filled status request.

## Where things live

| Path | What it is |
| --- | --- |
| `src/lib/site.ts` | **Business facts**: name, phone, address, delivery fee, free-delivery threshold, advance payment, promo, stats. Change them here and they update everywhere. |
| `src/lib/content.ts` | Reviews, review screenshots, real-order gallery, how-to-order steps, FAQs (verbatim from the original). |
| `src/lib/teamkits.ts` | Bulk football/cricket kit pricing, colours, designs, FAQs. |
| `src/lib/pricing.ts` | Customization pricing and validation rules. |
| `src/lib/whatsapp.ts` | Order message builder. |
| `src/data/*.json` | Generated catalog (don't edit by hand; see below). |
| `src/app/` | Routes. URLs match the original store exactly, including trailing slashes. |
| `public/` | The store's own photos (hero, real orders, review screenshots, team kits). |

Product photos load from the store's existing ImageKit CDN, resized per device
by `src/lib/image-loader.ts`.

## Refreshing the catalog

The catalog was read from the public pages of thecustomizedshop.pk. To pick up
new products or price changes:

```bash
rm -rf scripts/scrape/raw/cache   # force a fresh download
npm run scrape                    # reads sitemaps, product & category pages (polite, cached)
npm run data                      # rebuilds src/data and public/search-index.json
```

`npm run data` also applies the rebrand (old name and domain → UM Gift
Collection) to all product and category copy.

## SEO and moving domains

- Every URL from the original sitemaps (673) returns 200 on this site, with the
  same paths, so the old domain can 301-redirect to the new one path-for-path.
- Titles, meta descriptions and long-form category/product copy are the
  originals (rebranded).
- Structured data: Product (with offers, shipping and return policy),
  BreadcrumbList, CollectionPage/ItemList, FAQPage, HowTo, OnlineStore, WebSite
  search.
- `sitemap.xml` (with product images) and `robots.txt` are generated.

## Needs the owner's confirmation

The original site contradicts itself in a few places. The value in use is set
in `src/lib/site.ts`, with every source listed in comments there:

| Fact | Used | Conflicting value on the original |
| --- | --- | --- |
| Free-delivery threshold | Rs 3,000 (announcement bar, hero) | Rs 2,000 (perks strip, CTA, FAQ, SEO copy, return policy) |
| Delivery fee | Rs 250 (announcement bar) | Rs 249 (return policy, product data) |
| Advance payment | Rs 250 to confirm (most pages) | "No advance payment needed" (reviews page; omitted here) |
| Happy customers | 1,200+ (homepage stats band) | 500+ (several pages), 5,000+ (one SEO sentence) |
| Category count | 81 with products (actual) | "13" and "15+" in the SEO copy |

The original SEO copy and FAQ are reproduced verbatim, so they still mention
Rs 2,000. Once the right figures are confirmed, update `site.ts` and the copy.

Also to decide:

- **Logo**: the old logo reads "The Customized Shop", so a "UM" monogram
  (`src/components/ui/Logo.tsx`, `src/app/icon.svg`) stands in for it. Swap in
  the final logo when ready.
- **Instagram**: still `@thecustomizedshop1`, in `src/lib/site.ts`.
- **Promo code**: `TCS10` is kept as published.
- **Wishlist** is new (saved per browser); the original had none.
