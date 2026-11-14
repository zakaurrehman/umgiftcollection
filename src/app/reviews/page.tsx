import type { Metadata } from "next";
import Link from "next/link";
import { HeartHandshake, MessageCircle, Sparkles, Truck } from "lucide-react";
import { reviews, shortQuotes } from "@/lib/content";
import { site, whatsappLink, defaultWhatsappText } from "@/lib/site";
import { PageHero } from "@/components/PageHero";
import { SectionHeading } from "@/components/ui/bits";
import { buttonClass } from "@/components/ui/Button";
import { Counter, Reveal, Stagger, StaggerItem } from "@/components/ui/motion";
import { WhatsAppIcon } from "@/components/ui/icons";
import { Testimonials } from "@/components/home/Testimonials";
import { ScreenshotWall } from "./ScreenshotWall";

export const metadata: Metadata = {
  title: `Customer Reviews | 5★ Rated Customized Gifts in Pakistan | ${site.name}`,
  description: `Read real customer reviews & WhatsApp screenshots for ${site.name}. ${site.stats.happyCustomers.toLocaleString("en-PK")}+ happy customers across Pakistan love our personalized mugs, cushions, frames, lamps & gift sets.`,
  alternates: { canonical: "/reviews/" },
};

export default function ReviewsPage() {
  return (
    <main>
      <PageHero
        crumbs={[{ href: "/", label: "Home" }, { label: "Reviews" }]}
        title="Loved by gift-givers"
        accent="all over Pakistan"
        intro={
          <>
            Don&rsquo;t just take our word for it. Here are <strong className="text-white">real, unedited messages</strong> from customers who received their personalized gifts, from Karachi to Larkana and beyond.
          </>
        }
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <a href={whatsappLink(defaultWhatsappText)} target="_blank" rel="noopener noreferrer" className={buttonClass("wa", "md")}>
            <WhatsAppIcon className="size-5" /> Order yours on WhatsApp
          </a>
          <Link href="/shop/" className={buttonClass("glass", "md")}>
            Browse gifts
          </Link>
        </div>
      </PageHero>

      <section className="border-b border-line bg-cream-50">
        <dl className="container-x grid grid-cols-2 gap-6 py-10 text-center md:grid-cols-4">
          {[
            { v: <Counter to={site.stats.happyCustomers} suffix="+" />, l: "Happy customers" },
            { v: <Counter to={site.stats.rating} decimals={1} suffix="/5" />, l: "Average rating" },
            { v: <Counter to={site.stats.giftsDelivered} suffix="+" />, l: "Gifts delivered" },
            { v: <Counter to={site.stats.wouldRecommend} suffix="%" />, l: "Would recommend" },
          ].map((s) => (
            <div key={s.l}>
              <dd className="display text-4xl text-plum-900">{s.v}</dd>
              <dt className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-ink-soft">{s.l}</dt>
            </div>
          ))}
        </dl>
      </section>

      <section className="overflow-hidden py-16 md:py-24">
        <div className="container-x">
          <Reveal>
            <SectionHeading eyebrow="In their own words" title="What our customers" accent="are saying" intro="Genuine feedback from real orders. Hover to pause." />
          </Reveal>
        </div>
        <div className="mt-12">
          <Testimonials />
        </div>
        <ul className="sr-only">
          {reviews.map((r) => (
            <li key={r.text}>{r.text}</li>
          ))}
        </ul>
      </section>

      <section className="bg-lilac-50 py-16 md:py-24">
        <div className="container-x">
          <Reveal>
            <SectionHeading eyebrow="100% real & verified" title="Screenshots from" accent="our chats" intro="Straight from our WhatsApp & Instagram inbox. Tap any screenshot to zoom in." />
          </Reveal>
          <div className="mt-10">
            <ScreenshotWall />
          </div>
        </div>
      </section>

      <section className="container-x py-16 md:py-24">
        <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { Icon: Sparkles, t: "Handmade to order", d: "Every piece is personalized just for you: names, photos, dates & more." },
            { Icon: Truck, t: "Fast nationwide delivery", d: `Delivered across Pakistan, usually within ${site.delivery.elsewhere}.` },
            { Icon: HeartHandshake, t: "Quality you can feel", d: "Customers keep coming back. One ordered 18 times and counting!" },
            { Icon: MessageCircle, t: "Friendly support", d: "Chat with a real person on WhatsApp from browse to delivery." },
          ].map(({ Icon, t, d }) => (
            <StaggerItem key={t} className="rounded-[var(--radius-lg)] border border-line bg-white p-6">
              <Icon className="size-7 text-berry-600" aria-hidden="true" />
              <h3 className="mt-4 font-semibold text-plum-900">{t}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{d}</p>
            </StaggerItem>
          ))}
        </Stagger>

        <div className="mt-16 grid gap-4 md:grid-cols-2">
          {shortQuotes.map((q) => (
            <blockquote key={q} className="accent-italic rounded-[var(--radius-lg)] bg-plum-900 p-7 text-xl leading-snug text-white md:text-2xl">
              &ldquo;{q}&rdquo;
            </blockquote>
          ))}
        </div>

        <div className="mt-16 rounded-[var(--radius-2xl)] bg-gradient-to-br from-berry-500 to-lilac-500 p-10 text-center text-white md:p-14">
          <h2 className="display text-[clamp(1.8rem,4vw,3rem)]">Your gift could be the next 5-star review.</h2>
          <p className="mx-auto mt-3 max-w-lg text-white/85">
            Join {site.stats.happyCustomers.toLocaleString("en-PK")}+ happy customers. Personalized and delivered across Pakistan, usually within {site.delivery.elsewhere}.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link href="/shop/" className={buttonClass("light", "lg")}>
              Start my order
            </Link>
            <a href={whatsappLink(defaultWhatsappText)} target="_blank" rel="noopener noreferrer" className={buttonClass("glass", "lg")}>
              <WhatsAppIcon className="size-5" /> WhatsApp us
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
