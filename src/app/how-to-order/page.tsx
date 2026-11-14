import type { Metadata } from "next";
import Link from "next/link";
import { howToFaqs, howToStepsLong } from "@/lib/content";
import { site, whatsappLink } from "@/lib/site";
import { PageHero } from "@/components/PageHero";
import { Accordion } from "@/components/ui/Accordion";
import { buttonClass } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/icons";
import { HowToOrder } from "@/components/home/HowToOrder";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: `How to Order | ${site.name}`,
  description: "Ordering a personalized gift is easy! Browse, customize, add to cart and order via WhatsApp. We deliver across Pakistan.",
  alternates: { canonical: "/how-to-order/" },
};

export default function HowToOrderPage() {
  return (
    <main>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            { "@type": "HowTo", name: `How to order a personalized gift from ${site.name}`, step: howToStepsLong.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s.title, text: s.text })) },
            { "@type": "FAQPage", mainEntity: howToFaqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
          ],
        }}
      />
      <PageHero crumbs={[{ href: "/", label: "Home" }, { label: "How to Order" }]} title="How to" accent="order" intro="Getting your personalized gift is super easy: just 4 simple steps!" />

      <section className="container-x py-16 md:py-24">
        <HowToOrder steps={howToStepsLong} />
        <div className="mt-14 flex flex-col items-center gap-4 rounded-[var(--radius-2xl)] border border-line bg-white p-8 text-center md:p-12">
          <h2 className="display text-[clamp(1.6rem,3vw,2.4rem)] text-plum-900">Ready to order your personalized gift?</h2>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/shop/" className={buttonClass("primary", "lg")}>
              Browse products
            </Link>
            <a href={whatsappLink("Hi! I'd like to place an order 🎁")} target="_blank" rel="noopener noreferrer" className={buttonClass("wa", "lg")}>
              <WhatsAppIcon className="size-5" /> Order on WhatsApp
            </a>
          </div>
        </div>
      </section>

      <section className="bg-cream-50 py-16 md:py-24">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.5fr] lg:gap-16">
          <div>
            <p className="eyebrow mb-4">Got questions?</p>
            <h2 className="display text-[clamp(1.8rem,3.6vw,2.8rem)] leading-tight text-plum-900">
              Frequently asked <span className="accent-italic text-berry-600">questions</span>
            </h2>
            <p className="mt-4 text-ink-soft">Still have questions? We reply on WhatsApp {site.supportHours}.</p>
            <a href={whatsappLink("Hi! I'd like to place an order 🎁")} target="_blank" rel="noopener noreferrer" className={buttonClass("wa", "md", "mt-6")}>
              <WhatsAppIcon className="size-5" /> Chat with us
            </a>
          </div>
          <Accordion items={howToFaqs.map((f) => ({ q: f.q, a: <p>{f.a}</p> }))} />
        </div>
      </section>
    </main>
  );
}
