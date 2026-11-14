import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Check, Flame, Palette, Shirt, Star, Truck, Users } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { site, whatsappLink } from "@/lib/site";
import { FULL_SLEEVE_EXTRA, SMALL_SQUAD_EXTRA, TEAM_RATE_QTY, gallery, type SportConfig } from "@/lib/teamkits";
import { Breadcrumbs } from "@/components/ui/bits";
import { Accordion } from "@/components/ui/Accordion";
import { buttonClass } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/icons";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/motion";
import { Aurora } from "@/components/home/Hero";
import { JsonLd } from "@/components/JsonLd";
import { KitBuilder } from "./KitBuilder";
import { DesignGrid } from "./DesignGrid";

function Head({ eyebrow, title, text, light }: { eyebrow: string; title: string; text?: string; light?: boolean }) {
  return (
    <Reveal className="mx-auto mb-10 max-w-3xl text-center">
      <p className={light ? "eyebrow mb-3 text-peach-300" : "eyebrow mb-3"}>{eyebrow}</p>
      <h2 className={`display text-[clamp(1.8rem,3.8vw,2.9rem)] font-medium leading-tight ${light ? "text-white" : "text-plum-900"}`}>{title}</h2>
      {text && <p className={`mt-4 leading-relaxed ${light ? "text-white/70" : "text-ink-soft"}`}>{text}</p>}
    </Reveal>
  );
}

export function TeamKitPage({ cfg }: { cfg: SportConfig }) {
  const wa = whatsappLink(`Hi ${site.name}! I'd like custom ${cfg.sport} ${cfg.noun}s for my team.`);
  const { designs, ...builderCfg } = cfg;
  return (
    <main>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Product",
              name: cfg.seoTitle,
              description: cfg.seoDescription,
              image: `${site.url}/team-kits/custom-team-football-jerseys-pakistan-client.webp`,
              brand: { "@type": "Brand", name: site.name },
              offers: { "@type": "AggregateOffer", priceCurrency: "PKR", lowPrice: Math.min(...cfg.kits.map((k) => k.standard)), highPrice: Math.max(...cfg.kits.map((k) => k.best)) + FULL_SLEEVE_EXTRA + SMALL_SQUAD_EXTRA, availability: "https://schema.org/InStock" },
            },
            { "@type": "FAQPage", mainEntity: cfg.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
          ],
        }}
      />

      {/* Hero */}
      <section className="grain relative isolate overflow-hidden bg-plum-950 text-white">
        <Aurora />
        <div className="container-x grid items-center gap-12 py-12 md:py-16 lg:grid-cols-[1.15fr_1fr]">
          <div>
            <Breadcrumbs dark items={[{ href: "/", label: "Home" }, { label: `Custom ${cfg.sport === "football" ? "Football Jerseys" : "Cricket Shirts"} in Bulk` }]} />
            <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-sm font-semibold">
              <Users className="size-4 text-peach-300" aria-hidden="true" /> Team kits · Bulk orders from {TEAM_RATE_QTY} pieces
            </p>
            <h1 className="display mt-5 text-[clamp(2.2rem,5.4vw,4.2rem)] font-medium leading-[1.02]">
              {cfg.h1} <span className="accent-italic text-gradient">{cfg.h1Accent}</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/72">{cfg.heroText}</p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <a href="#design-your-kit" className={buttonClass("primary", "lg")}>
                <Palette className="size-[18px]" aria-hidden="true" /> Design your kit
              </a>
              <a href={wa} target="_blank" rel="noopener noreferrer" className={buttonClass("glass", "lg")}>
                <WhatsAppIcon className="size-5" /> Chat on WhatsApp
              </a>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/70">
              {[`Free name and number on every ${cfg.noun}`, "Free design mockup before printing", "Delivery all over Pakistan"].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <Check className="size-4 text-peach-300" aria-hidden="true" /> {t}
                </li>
              ))}
            </ul>
          </div>
          <figure className="relative mx-auto w-full max-w-md">
            <div className="ring-gradient relative aspect-[4/5] overflow-hidden rounded-[var(--radius-2xl)]">
              <Image src="/team-kits/custom-team-football-jerseys-pakistan-client.webp" alt={cfg.heroAlt} fill priority sizes="(min-width:1024px) 440px, 90vw" className="rounded-[inherit] object-cover" />
            </div>
            <div className="absolute -left-4 bottom-8 rounded-[var(--radius-lg)] bg-white p-4 text-plum-900 shadow-lift">
              <p className="text-xs text-ink-soft">Team rate from</p>
              <p className="display text-3xl">
                Rs 1,000<span className="text-base text-ink-soft">/pc</span>
              </p>
              <p className="text-xs text-ink-soft">Minimum {TEAM_RATE_QTY} pieces</p>
            </div>
          </figure>
        </div>
        <div className="overflow-hidden border-t border-white/10 bg-white/[0.04] py-3" aria-hidden="true">
          <div className="flex w-max animate-marquee gap-8 text-sm font-semibold text-white/80 [--marquee-duration:30s]">
            {[0, 1].flatMap((k) => ["Names free", "Numbers free", "Logo free", "Sponsor free", "Free mockup", "Any colours", "Delivery across Pakistan"].map((t) => <span key={k + t} className="flex items-center gap-8">{t}<span className="text-lilac-300">✦</span></span>))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="prices" className="container-x scroll-mt-24 py-16 md:py-24">
        <Head eyebrow="Simple team pricing" title={cfg.pricingTitle} text={cfg.pricingText} />
        <Stagger className="grid gap-4 md:grid-cols-3">
          {cfg.kits.map((k) => (
            <StaggerItem key={k.id} className={k.popular ? "ring-gradient rounded-[var(--radius-xl)]" : ""}>
              <article className={`flex h-full flex-col rounded-[var(--radius-xl)] border p-7 ${k.popular ? "border-transparent bg-plum-900 text-white" : "border-line bg-white"}`}>
                {k.popular && (
                  <span className="mb-3 inline-flex w-fit items-center gap-1 rounded-full bg-berry-600 px-3 py-1 text-xs font-bold">
                    <Flame className="size-3.5" aria-hidden="true" /> Most popular
                  </span>
                )}
                <h3 className="display text-2xl">{k.name}</h3>
                <p className={`mt-2 text-sm ${k.popular ? "text-white/70" : "text-ink-soft"}`}>{k.text}</p>
                <dl className="mt-6 space-y-2">
                  <div className="flex items-baseline justify-between">
                    <dt className={k.popular ? "text-white/70" : "text-ink-soft"}>Standard</dt>
                    <dd className="text-2xl font-bold">{formatPrice(k.standard)}</dd>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <dt className={`flex items-center gap-1.5 ${k.popular ? "text-white/70" : "text-ink-soft"}`}>
                      <Star className="size-3.5 fill-current text-peach-300" aria-hidden="true" /> Best Quality
                    </dt>
                    <dd className="text-2xl font-bold">{formatPrice(k.best)}</dd>
                  </div>
                </dl>
                <p className={`mt-2 text-xs ${k.popular ? "text-white/50" : "text-ink-faint"}`}>per piece · {TEAM_RATE_QTY}+ pieces</p>
                <a href="#design-your-kit" className={`mt-auto pt-6`}>
                  <span className={buttonClass(k.popular ? "primary" : "outline", "md", "w-full")}>Customize this kit</span>
                </a>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
        <ul className="mt-8 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
          {[
            `Full sleeves + Rs ${FULL_SLEEVE_EXTRA} per piece`,
            `10 or 11 pieces + Rs ${SMALL_SQUAD_EXTRA} per piece`,
            "Names, numbers and logo included free",
            "50% advance confirms your order",
          ].map((t) => (
            <li key={t} className="flex items-center gap-2 rounded-full border border-line bg-white px-4 py-3 text-plum-900">
              <BadgeCheck className="size-4 shrink-0 text-wa" aria-hidden="true" /> {t}
            </li>
          ))}
        </ul>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-[var(--radius-lg)] bg-cream-50 p-6">
            <h3 className="font-semibold text-plum-900">Standard Quality</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{cfg.quality.standard}</p>
          </div>
          <div className="rounded-[var(--radius-lg)] bg-lilac-50 p-6">
            <h3 className="font-semibold text-plum-900">Best Quality</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{cfg.quality.best}</p>
          </div>
        </div>
      </section>

      {/* Builder */}
      <section id="design-your-kit" className="scroll-mt-20 bg-cream-50 py-16 md:py-24">
        <div className="container-x">
          <Head eyebrow="Design your kit" title={cfg.builderTitle} text={cfg.builderText} />
          <KitBuilder cfg={builderCfg} />
        </div>
      </section>

      {/* Ready-made designs */}
      <section className="container-x py-16 md:py-24">
        <Head eyebrow="Ready made designs" title={cfg.designsTitle} text={cfg.designsText} />
        <DesignGrid designs={designs} sport={cfg.sport} />
      </section>

      {/* Studio gallery */}
      <section className="bg-cream-50 py-16 md:py-24">
        <div className="container-x">
          <Head eyebrow="Real photos, real teams" title={cfg.galleryTitle} text={cfg.galleryText} />
          <Stagger className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">
            {gallery.map((g) => (
              <StaggerItem key={g.src}>
                <figure className="group overflow-hidden rounded-[var(--radius-lg)] bg-white">
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <Image src={g.src} alt={`${g.title}: ${g.text}, custom team ${cfg.sport} kit printed by ${site.name} in Pakistan`} fill sizes="(min-width:768px) 33vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  </div>
                  <figcaption className="p-4">
                    <b className="block text-sm text-plum-900">{g.title}</b>
                    <span className="text-xs text-ink-soft">{g.text}</span>
                  </figcaption>
                </figure>
              </StaggerItem>
            ))}
          </Stagger>
          <div className="mt-10 text-center">
            <a href={wa} target="_blank" rel="noopener noreferrer" className={buttonClass("wa", "lg")}>
              <WhatsAppIcon className="size-5" /> I want a kit like this
            </a>
          </div>
        </div>
      </section>

      {/* Client */}
      <section className="grain relative isolate overflow-hidden bg-plum-950 py-16 text-white md:py-24">
        <Aurora />
        <div className="container-x grid items-center gap-10 lg:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-2xl)]">
            <Image src="/team-kits/purple-fade-custom-team-jersey-back-name-number.webp" alt="Real team kit with player name and number printed in gold" fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
          </div>
          <div>
            <p className="eyebrow mb-3 text-peach-300">Real team, real order</p>
            <h2 className="display text-[clamp(1.8rem,3.6vw,2.8rem)] leading-tight">{cfg.clientTitle}</h2>
            {cfg.clientText.map((t) => (
              <p key={t} className="mt-4 leading-relaxed text-white/70">
                {t}
              </p>
            ))}
            <dl className="mt-8 grid grid-cols-3 gap-4 border-t border-white/10 pt-6">
              <div>
                <dd className="display text-3xl">{site.stats.rating}/5</dd>
                <dt className="text-xs text-white/60">customer rating</dt>
              </div>
              <div>
                <dd className="display text-3xl">{site.stats.happyCustomers.toLocaleString("en-PK")}+</dd>
                <dt className="text-xs text-white/60">happy customers</dt>
              </div>
              <div>
                <dd className="display text-3xl">Since {site.foundedYear}</dd>
                <dt className="text-xs text-white/60">printing in Pakistan</dt>
              </div>
            </dl>
            <a href="https://www.instagram.com/p/DfhWHfxkzMZ/" target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex items-center gap-2 font-semibold text-peach-300 hover:underline">
              Watch this client&rsquo;s review on Instagram <ArrowRight className="size-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      {/* Included */}
      <section className="container-x py-16 md:py-24">
        <Head eyebrow="No hidden charges" title={`Everything Included Free With Your Team ${cfg.sport === "football" ? "Football Jerseys" : "Cricket Shirts"}`} />
        <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cfg.included.map((x) => (
            <StaggerItem key={x.t} className="flex gap-4 rounded-[var(--radius-lg)] border border-line bg-white p-6">
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-lilac-100 text-plum-800">
                <Shirt className="size-5" aria-hidden="true" />
              </span>
              <span>
                <h3 className="font-semibold text-plum-900">{x.t}</h3>
                <p className="mt-1 text-sm leading-relaxed text-ink-soft">{x.d}</p>
              </span>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* Steps */}
      <section className="bg-cream-50 py-16 md:py-24">
        <div className="container-x">
          <Head eyebrow="Easy as 1, 2, 3, 4" title={cfg.stepsTitle} />
          <ol className="grid gap-4 md:grid-cols-4">
            {cfg.steps.map((s, i) => (
              <li key={s.t} className="rounded-[var(--radius-lg)] bg-white p-6">
                <span className="display text-5xl text-berry-500">{i + 1}</span>
                <h3 className="mt-3 font-semibold text-plum-900">{s.t}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{s.d}</p>
              </li>
            ))}
          </ol>
          <div className="mt-10 text-center">
            <a href={wa} target="_blank" rel="noopener noreferrer" className={buttonClass("wa", "lg")}>
              <WhatsAppIcon className="size-5" /> Start my team order
            </a>
          </div>
        </div>
      </section>

      {/* Who */}
      <section className="container-x py-16 md:py-20">
        <Head eyebrow="Who orders from us" title={cfg.whoTitle} />
        <ul className="flex flex-wrap justify-center gap-2.5">
          {cfg.who.map((w) => (
            <li key={w} className="rounded-full border border-line bg-white px-5 py-3 text-sm font-medium text-plum-900">
              {w}
            </li>
          ))}
        </ul>
      </section>

      {/* FAQ */}
      <section className="bg-cream-50 py-16 md:py-24">
        <div className="container-x max-w-3xl">
          <Head eyebrow={cfg.sport === "football" ? "Questions captains ask" : "Questions captains ask"} title="Frequently Asked Questions" />
          <Accordion items={cfg.faqs.map((f) => ({ q: f.q, a: <p>{f.a}</p> }))} />
        </div>
      </section>

      {/* Guide */}
      <section className="container-x py-16 md:py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="display text-[clamp(1.6rem,3vw,2.3rem)] leading-tight text-plum-900">{cfg.guideTitle}</h2>
          <div className="prose-tcs mt-6">
            {cfg.guide.map((g) => (
              <p key={g}>{g}</p>
            ))}
            <p>
              {cfg.guideLinkIntro[0]} <Link href={cfg.otherSport.href}>{cfg.otherSport.label}</Link>. {cfg.guideLinkIntro[1]}{" "}
              {cfg.guideLinks.map((l, i) => (
                <span key={l.href}>
                  <Link href={l.href}>{l.label}</Link>
                  {i < cfg.guideLinks.length - 2 ? ", " : i === cfg.guideLinks.length - 2 ? " and " : "."}
                </span>
              ))}
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="container-x pb-20">
        <div className="grain relative isolate overflow-hidden rounded-[var(--radius-2xl)] bg-plum-950 px-6 py-14 text-center text-white md:py-20">
          <Aurora />
          <h2 className="display text-[clamp(2rem,4.5vw,3.4rem)]">Your Team Deserves to Look Like a Team</h2>
          <p className="mx-auto mt-4 max-w-lg text-white/70">Send us your colours today and we&rsquo;ll get your free {cfg.sport} kit mockup started.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href="#design-your-kit" className={buttonClass("light", "lg")}>
              <Palette className="size-[18px]" aria-hidden="true" /> Design your kit
            </a>
            <a href={wa} target="_blank" rel="noopener noreferrer" className={buttonClass("wa", "lg")}>
              <WhatsAppIcon className="size-5" /> WhatsApp
            </a>
          </div>
          <p className="mt-6 flex items-center justify-center gap-2 text-sm text-white/60">
            <Truck className="size-4" aria-hidden="true" /> Rs 1,000/pc · Min {TEAM_RATE_QTY} · Delivered across Pakistan
          </p>
        </div>
      </section>
    </main>
  );
}
