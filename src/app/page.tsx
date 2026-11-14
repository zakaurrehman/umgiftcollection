import Link from "next/link";
import { ArrowRight, LayoutGrid } from "lucide-react";
import home from "@/data/home-content.json";
import { distinctCovers, getCategory, getProduct, minPrice, newArrivals, onSale, productsIn, toCard, allCategoriesBySize } from "@/lib/catalog";
import { howToSteps } from "@/lib/content";
import { site, whatsappLink, defaultWhatsappText } from "@/lib/site";
import { SectionHeading } from "@/components/ui/bits";
import { buttonClass } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/motion";
import { WhatsAppIcon } from "@/components/ui/icons";
import { JsonLd } from "@/components/JsonLd";
import { Hero } from "@/components/home/Hero";
import { Benefits } from "@/components/home/Benefits";
import { OccasionAccordion, type Occasion } from "@/components/home/OccasionAccordion";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { FeaturedTabs } from "@/components/home/FeaturedTabs";
import { Creations } from "@/components/home/Creations";
import { Testimonials } from "@/components/home/Testimonials";
import { HowToOrder } from "@/components/home/HowToOrder";
import { PromoCta } from "@/components/home/PromoCta";
import { SeoFaq } from "@/components/home/SeoFaq";
import { ProductRail } from "@/components/product/ProductRail";

const occasionDefs = [
  { slug: "birthday-gifts", title: "Birthday Gifts", kicker: "Make their day" },
  { slug: "anniversary-gifts", title: "Anniversary Gifts", kicker: "Celebrate together" },
  { slug: "marriage-gifts", title: "Marriage Gifts", kicker: "For the newlyweds" },
  { slug: "birthday-gifts-for-men", title: "Gifts for Him", kicker: "Husband · Brother · Dad" },
  { slug: "birthday-gifts-for-women", title: "Gifts for Her", kicker: "Wife · Sister · Mum" },
  { slug: "customize-gifts-under-1000", title: "Under Rs 1000", kicker: "Big love, small price" },
];

const gridSlugs = [
  "pillows-cushions",
  "mugs",
  "frames",
  "lockets",
  "couple-watches",
  "7-color-lamps",
  "bracelets",
  "wallets",
  "phone-cases",
  "football-jerseys-price-in-pakistan",
  "customize-t-shirts",
  "custom-crochet-gifts",
  "custom-hoodies-in-pakistan",
  "birthday-deals",
];

const rails = [
  { slug: "pillows-cushions", title: "Most-loved", accent: "cushions", eyebrow: "Photo & name cushions" },
  { slug: "mugs", title: "Customized", accent: "mugs", eyebrow: "Every morning, a smile" },
  { slug: "custom-football-shirts", title: "Personalized", accent: "football jerseys", eyebrow: "Your name, your number" },
  { slug: "lockets", title: "Name", accent: "lockets", eyebrow: "Jewellery with a story" },
  { slug: "customize-t-shirts", title: "Custom", accent: "T-shirts", eyebrow: "Printed your way" },
  { slug: "custom-crochet-gifts", title: "Handmade", accent: "crochet gifts", eyebrow: "Made stitch by stitch" },
  { slug: "7-color-lamps", title: "Personalized", accent: "LED lamps", eyebrow: "Glows in 7 colours" },
];

export default function HomePage() {
  const floats = ["golden-bloom-name-necklace", "acrylic-3d-illusion-led-lamp", "rose-gold-heart-photo-cushion"]
    .map(getProduct)
    .filter(Boolean)
    .map((p) => ({ slug: p!.slug, name: p!.name, image: p!.images[0], price: p!.price }));

  const covers = distinctCovers([...occasionDefs.map((o) => o.slug), ...gridSlugs]);
  const occasions: Occasion[] = occasionDefs
    .map((o) => {
      const c = getCategory(o.slug);
      return c ? { ...o, image: covers[o.slug], count: c.count } : null;
    })
    .filter(Boolean) as Occasion[];

  const tiles = gridSlugs
    .map(getCategory)
    .filter((c) => c && c.count)
    .map((c) => ({ slug: c!.slug, name: c!.name, count: c!.count, image: covers[c!.slug], from: minPrice(c!.slug) }));

  const tabs = [
    { id: "new", label: "New arrivals", href: "/shop/?sort=newest", products: newArrivals(8).map(toCard) },
    { id: "sale", label: "On sale", href: "/shop/?sort=discount", products: onSale(8).map(toCard) },
    { id: "u1000", label: "Under Rs 1000", href: "/category/customize-gifts-under-1000/", products: productsIn("customize-gifts-under-1000", 8).map(toCard) },
    { id: "deals", label: "Birthday deals", href: "/category/birthday-deals/", products: productsIn("birthday-deals", 8).map(toCard) },
  ];

  // The SEO copy opens with its own H2; use it as the block title.
  const titleMatch = home.seoHtml.match(/^<h2>([\s\S]*?)<\/h2>/);
  const seoTitle = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, "") : `About ${site.name}`;
  const seoBody = titleMatch ? home.seoHtml.slice(titleMatch[0].length) : home.seoHtml;
  const totalCategories = allCategoriesBySize().length;

  return (
    <main>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: home.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a.replace(/<[^>]+>/g, "") } })),
        }}
      />
      <Hero floats={floats} />
      <Benefits />

      {/* Shop by occasion */}
      <section className="container-x py-16 md:py-24">
        <Reveal>
          <SectionHeading
            eyebrow="Shop by occasion"
            title="A gift for every"
            accent="moment that matters"
            intro="Birthdays, anniversaries, weddings or just because. Pick the moment and we'll help you make it personal."
            action={
              <Link href="/shop/" className="inline-flex items-center gap-2 text-sm font-semibold text-berry-700 hover:underline">
                Browse everything <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            }
          />
        </Reveal>
        <div className="mt-10">
          <OccasionAccordion items={occasions} />
        </div>
      </section>

      {/* Categories */}
      <section id="collections" className="scroll-mt-24 bg-cream-50 py-16 md:py-24">
        <div className="container-x">
          <Reveal>
            <SectionHeading
              eyebrow="Browse by category"
              title="Gift collections,"
              accent="made to be personal"
              intro="Imagine and gift anything you want. Every design is 100% customizable, with delivery anywhere in Pakistan."
            />
          </Reveal>
          <div className="mt-10">
            <CategoryGrid items={tiles} />
          </div>
          <div className="mt-10 flex justify-center">
            <Link href="/shop/" className={buttonClass("dark", "lg")}>
              <LayoutGrid className="size-[18px]" aria-hidden="true" /> Explore all {totalCategories} collections
            </Link>
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="container-x py-16 md:py-24">
        <Reveal>
          <SectionHeading eyebrow="Handpicked for you" title="Featured" accent="gifts" intro="Fresh designs, best deals and little luxuries, all ready for your personal touch." />
        </Reveal>
        <div className="mt-10">
          <FeaturedTabs tabs={tabs} />
        </div>
      </section>

      {/* Collection rails */}
      {rails.map((r, i) => {
        const c = getCategory(r.slug);
        if (!c?.count) return null;
        return (
          <section key={r.slug} className={i % 2 === 0 ? "bg-cream-50 py-14 md:py-20" : "py-14 md:py-20"} aria-label={c.name}>
            <div className="container-x">
              <ProductRail title={r.title} accent={r.accent} eyebrow={r.eyebrow} href={`/category/${c.slug}/`} count={c.count} products={productsIn(c.slug, 10).map(toCard)} />
            </div>
          </section>
        );
      })}

      {/* Real orders */}
      <section className="container-x py-16 md:py-24">
        <Reveal>
          <SectionHeading
            eyebrow="Real orders, real people"
            title="Made with love,"
            accent="delivered with care"
            intro="A few keepsakes we've recently made for customers across Pakistan."
          />
        </Reveal>
        <div className="mt-10">
          <Creations />
        </div>
      </section>

      {/* Testimonials */}
      <section className="overflow-hidden bg-lilac-50 py-16 md:py-24">
        <div className="container-x">
          <Reveal>
            <SectionHeading
              eyebrow="In their own words"
              title="Loved by gift-givers"
              accent="all over Pakistan"
              intro="Real, unedited messages from customers who received their personalized gifts."
              action={
                <Link href="/reviews/" className={buttonClass("outline", "md")}>
                  See WhatsApp screenshots <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              }
            />
          </Reveal>
        </div>
        <div className="mt-12">
          <Testimonials />
        </div>
      </section>

      {/* How to order */}
      <section id="how-to-order" className="container-x scroll-mt-24 py-16 md:py-24">
        <Reveal>
          <SectionHeading eyebrow="Simple process" title="How to" accent="order" intro="Getting your personalized gift is super easy." align="center" />
        </Reveal>
        <div className="mt-14">
          <HowToOrder steps={howToSteps} />
        </div>
        <div className="mt-12 flex flex-wrap justify-center gap-3">
          <a href={whatsappLink(defaultWhatsappText)} target="_blank" rel="noopener noreferrer" className={buttonClass("wa", "md")}>
            <WhatsAppIcon className="size-5" /> {site.phoneDisplay}
          </a>
          <Link href="/how-to-order/" className={buttonClass("outline", "md")}>
            Ordering details
          </Link>
        </div>
      </section>

      <PromoCta />

      <section className="container-x pb-20 md:pb-28" aria-label="Frequently asked questions and about us">
        <SeoFaq faqs={home.faqs} html={seoBody} title={seoTitle} />
      </section>
    </main>
  );
}
