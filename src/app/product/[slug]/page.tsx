import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BadgeCheck, Clock, MessageCircle, PackageCheck, RotateCcw, Truck } from "lucide-react";
import { categoryName, getProduct, products, relatedProducts, toCard } from "@/lib/catalog";
import { site } from "@/lib/site";
import { cleanName } from "@/lib/format";
import { reviews as storeReviews, howToFaqs } from "@/lib/content";
import { Breadcrumbs, Stars } from "@/components/ui/bits";
import { Accordion } from "@/components/ui/Accordion";
import { Reveal } from "@/components/ui/motion";
import { JsonLd } from "@/components/JsonLd";
import { ProductView } from "@/components/product/ProductView";
import { ProductRail } from "@/components/product/ProductRail";

export const dynamicParams = false;
export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = getProduct((await params).slug);
  if (!p) return {};
  const title = p.seoTitle || `${cleanName(p.name)} | ${site.name}`;
  const description = p.seoDescription || p.description.slice(0, 160);
  return {
    title,
    description,
    alternates: { canonical: `/product/${p.slug}/` },
    openGraph: { type: "website", title, description, url: `/product/${p.slug}/`, images: p.images.slice(0, 4).map((url, i) => ({ url, alt: p.imageAlts[i] || p.name })) },
  };
}

export default async function ProductPage({ params }: Props) {
  const p = getProduct((await params).slug);
  if (!p) notFound();
  const name = cleanName(p.name);
  const card = toCard(p);
  const catName = categoryName(p.category);
  const related = relatedProducts(p, 10).map(toCard);
  const avg = p.reviews.length ? p.reviews.reduce((n, r) => n + r.rating, 0) / p.reviews.length : 0;
  const url = `${site.url}/product/${p.slug}/`;

  const header = (
    <div>
      <Link href={`/category/${p.category}/`} className="inline-flex h-8 items-center rounded-full bg-lilac-100 px-3 text-xs font-bold uppercase tracking-[0.12em] text-plum-800 hover:bg-lilac-200">
        {catName}
      </Link>
      <h1 className="display mt-4 text-[clamp(1.9rem,3.6vw,2.9rem)] font-medium leading-[1.08] text-plum-900">{name}</h1>
      {p.reviews.length > 0 && (
        <a href="#reviews" className="mt-3 inline-flex items-center gap-2 text-sm text-ink-soft hover:text-plum-900">
          <Stars rating={avg} /> {p.reviews.length} review{p.reviews.length > 1 ? "s" : ""}
        </a>
      )}
      {p.shortLeadHtml && <div className="prose-tcs mt-4 text-[0.95rem] [&_ul]:hidden [&_p:nth-child(n+2)]:hidden" dangerouslySetInnerHTML={{ __html: p.shortLeadHtml }} />}
      {p.tags.length > 0 && (
        <ul className="mt-5 flex flex-wrap gap-2">
          {p.tags.map((t) => (
            <li key={t} className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5 text-xs font-medium text-ink-soft">
              <BadgeCheck className="size-3.5 text-wa" aria-hidden="true" /> {t}
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  const aside = (
    <ul className="mt-6 grid gap-3 sm:grid-cols-2">
      {[
        { Icon: Truck, t: "Delivery across Pakistan", d: `${site.delivery.localCity} ${site.delivery.local}, other cities ${site.delivery.elsewhere}.` },
        { Icon: PackageCheck, t: `Free over Rs ${site.freeDeliveryThreshold.toLocaleString("en-PK")}`, d: `Otherwise Rs ${site.deliveryFee} delivery.` },
        { Icon: Clock, t: `Rs ${site.advancePayment} advance`, d: "Confirms your order. Pay the balance on delivery." },
        { Icon: RotateCcw, t: "Free replacement", d: "If it arrives damaged, wrong or faulty." },
      ].map(({ Icon, t, d }) => (
        <li key={t} className="flex gap-3 rounded-[var(--radius-md)] border border-line bg-cream-50 p-4">
          <Icon className="mt-0.5 size-5 shrink-0 text-berry-600" aria-hidden="true" />
          <span>
            <span className="block text-sm font-semibold text-plum-900">{t}</span>
            <span className="block text-xs leading-relaxed text-ink-soft">{d}</span>
          </span>
        </li>
      ))}
    </ul>
  );

  const details = [
    ...(p.longHtml ? [{ q: "About this product", a: <div className="prose-tcs" dangerouslySetInnerHTML={{ __html: p.longHtml }} /> }] : []),
    ...(p.shortLines.length || p.shortLeadHtml
      ? [
          {
            q: "More details",
            a: (
              <div className="prose-tcs">
                {p.shortLines.map((l, i) => (
                  <p key={i} dangerouslySetInnerHTML={{ __html: l }} />
                ))}
                {p.shortLeadHtml && <div dangerouslySetInnerHTML={{ __html: p.shortLeadHtml }} />}
              </div>
            ),
          },
        ]
      : []),
    {
      q: "Delivery & returns",
      a: (
        <div className="prose-tcs">
          <p>
            We deliver everywhere in Pakistan. {site.delivery.localCity} orders typically arrive in {site.delivery.local}; other cities in {site.delivery.elsewhere}. Delivery is Rs {site.deliveryFee}, and free on orders over Rs{" "}
            {site.freeDeliveryThreshold.toLocaleString("en-PK")}.
          </p>
          <p>
            Every gift is made to order, so change-of-mind returns aren&rsquo;t possible. If your order arrives damaged, incorrect or faulty, message us on WhatsApp within 48 hours and we replace it free of charge.{" "}
            <Link href="/return-policy/">Read the full policy</Link>.
          </p>
        </div>
      ),
    },
    ...howToFaqs.slice(0, 4).map((f) => ({ q: f.q, a: <p>{f.a}</p> })),
  ];

  return (
    <main>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Product",
              name,
              description: p.description,
              image: p.images,
              url,
              sku: p.id,
              category: catName,
              brand: { "@type": "Brand", name: site.name },
              offers: {
                "@type": "Offer",
                price: p.price,
                priceCurrency: "PKR",
                availability: p.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
                itemCondition: "https://schema.org/NewCondition",
                url,
                shippingDetails: {
                  "@type": "OfferShippingDetails",
                  shippingRate: { "@type": "MonetaryAmount", value: site.deliveryFee, currency: "PKR" },
                  shippingDestination: { "@type": "DefinedRegion", addressCountry: "PK" },
                  deliveryTime: {
                    "@type": "ShippingDeliveryTime",
                    handlingTime: { "@type": "QuantitativeValue", minValue: 1, maxValue: 2, unitCode: "DAY" },
                    transitTime: { "@type": "QuantitativeValue", minValue: 1, maxValue: 5, unitCode: "DAY" },
                  },
                },
                hasMerchantReturnPolicy: {
                  "@type": "MerchantReturnPolicy",
                  applicableCountry: "PK",
                  returnPolicyCategory: "https://schema.org/MerchantReturnNotPermitted",
                  merchantReturnLink: `${site.url}/return-policy/`,
                },
              },
              ...(p.reviews.length
                ? {
                    aggregateRating: { "@type": "AggregateRating", ratingValue: avg.toFixed(1), reviewCount: p.reviews.length },
                    review: p.reviews.map((r) => ({ "@type": "Review", author: { "@type": "Person", name: r.name }, reviewRating: { "@type": "Rating", ratingValue: r.rating }, reviewBody: r.body, datePublished: r.date.slice(0, 10) })),
                  }
                : {}),
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: `${site.url}/` },
                { "@type": "ListItem", position: 2, name: "Shop", item: `${site.url}/shop/` },
                { "@type": "ListItem", position: 3, name: catName, item: `${site.url}/category/${p.category}/` },
                { "@type": "ListItem", position: 4, name, item: url },
              ],
            },
          ],
        }}
      />

      <div className="container-x pb-16 pt-6 md:pt-8">
        <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/shop/", label: "Shop" }, { href: `/category/${p.category}/`, label: catName }, { label: name }]} />
        <div className="mt-6">
          <ProductView
            product={{
              slug: p.slug,
              name: p.name,
              price: p.price,
              compareAtPrice: p.compareAtPrice,
              images: p.images,
              options: p.options,
              bulkTiers: p.bulkTiers,
              bulkUnit: p.bulkUnit,
              qualityTiers: p.qualityTiers,
              inStock: p.inStock,
            }}
            card={card}
            alts={p.imageAlts}
            header={header}
            aside={aside}
          />
        </div>
      </div>

      <section className="border-t border-line bg-cream-50 py-14 md:py-20">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <Reveal>
            <p className="eyebrow mb-4">The details</p>
            <h2 className="display text-[clamp(1.8rem,3.4vw,2.6rem)] font-medium leading-tight text-plum-900">
              Everything you need <span className="accent-italic text-berry-600">to know</span>
            </h2>
            <p className="mt-4 max-w-sm text-ink-soft">Still unsure? We reply fast on WhatsApp and will help you choose the right design, size and wording.</p>
            <a
              href={`https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(`Hi! I have a question about ${name}: ${url}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex h-12 items-center gap-2 rounded-full bg-wa px-6 text-sm font-semibold text-white hover:bg-wa-dark"
            >
              <MessageCircle className="size-[18px]" aria-hidden="true" /> Ask about this gift
            </a>
          </Reveal>
          <Accordion items={details} defaultOpen={0} />
        </div>
      </section>

      <section id="reviews" className="container-x scroll-mt-28 py-14 md:py-20">
        {p.reviews.length > 0 ? (
          <>
            <h2 className="display text-[clamp(1.6rem,3vw,2.3rem)] text-plum-900">Customer reviews</h2>
            <div className="mt-2 flex items-center gap-3 text-ink-soft">
              <Stars rating={avg} /> {avg.toFixed(1)} out of 5 · {p.reviews.length} review{p.reviews.length > 1 ? "s" : ""}
            </div>
            <ul className="mt-8 grid gap-4 md:grid-cols-2">
              {p.reviews.map((r, i) => (
                <li key={i} className="rounded-[var(--radius-lg)] border border-line bg-white p-6">
                  <Stars rating={r.rating} />
                  {r.title && <p className="mt-3 font-semibold text-plum-900">{r.title}</p>}
                  <p className="mt-2 text-ink">{r.body}</p>
                  <p className="mt-4 text-sm text-ink-soft">
                    {r.name} · {new Date(r.date).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                  {r.reply && <p className="mt-3 rounded-xl bg-cream-100 p-3 text-sm text-ink-soft">Reply from {site.name}: {r.reply}</p>}
                </li>
              ))}
            </ul>
          </>
        ) : (
          <>
            <p className="eyebrow mb-3">From our customers</p>
            <h2 className="display text-[clamp(1.6rem,3vw,2.3rem)] text-plum-900">
              What people say about <span className="accent-italic text-berry-600">{site.name}</span>
            </h2>
            <p className="mt-2 text-sm text-ink-soft">Store reviews from real customers. This product doesn&rsquo;t have its own reviews yet.</p>
            <ul className="mt-8 grid gap-4 md:grid-cols-3">
              {storeReviews.slice(3, 6).map((r) => (
                <li key={r.text} className="rounded-[var(--radius-lg)] border border-line bg-white p-6">
                  <p className="text-ink">{r.text}</p>
                  <p className="mt-4 text-sm text-ink-soft">
                    <span className="font-semibold text-plum-900">{r.name}</span> · {r.product}
                  </p>
                </li>
              ))}
            </ul>
            <Link href="/reviews/" className="mt-6 inline-flex text-sm font-semibold text-berry-700 hover:underline">
              Read all reviews →
            </Link>
          </>
        )}
      </section>

      {related.length > 0 && (
        <section className="bg-cream-50 py-14 md:py-20">
          <div className="container-x">
            <ProductRail title="You may" accent="also like" eyebrow={`More from ${catName}`} href={`/category/${p.category}/`} products={related} />
          </div>
        </section>
      )}
    </main>
  );
}
