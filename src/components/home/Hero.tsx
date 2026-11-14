"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowRight, BadgeCheck, Sparkles, Star, Truck, Wand2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { site } from "@/lib/site";
import { cleanName, formatPrice } from "@/lib/format";
import { Counter, Magnetic, WordReveal } from "@/components/ui/motion";
import { buttonClass } from "@/components/ui/Button";

type Float = { slug: string; name: string; image: string; price: number };

export function Hero({ floats }: { floats: Float[] }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "12%"]);
  const floatY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -80]);

  return (
    <section ref={ref} className="grain relative isolate overflow-hidden bg-plum-950 text-white">
      <Aurora />
      <div className="container-x relative grid items-center gap-12 pb-10 pt-12 md:pt-16 lg:grid-cols-[1.08fr_1fr] lg:gap-8 lg:pb-16 lg:pt-20">
        <div className="relative z-10 max-w-2xl">
          <p
            className="anim-fade-up inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-[0.8rem] font-semibold backdrop-blur"
          >
            <Sparkles className="size-4 text-peach-300" aria-hidden="true" />
            <span className="text-shimmer text-white/90">Personalized gifts, delivered across Pakistan</span>
          </p>

          <h1 className="display mt-6 text-[clamp(2.6rem,6.2vw,4.9rem)] font-medium leading-[1]">
            <span className="block">
              <WordReveal text="Every Gift" delay={0.15} />
            </span>
            <span className="block">
              <WordReveal text="Tells a Story." delay={0.27} />
            </span>
            <span className="mt-1 block">
              <WordReveal text="Make Yours Personal." delay={0.45} className="accent-italic text-gradient pr-2" />
            </span>
          </h1>

          <p
            style={{ ["--d" as string]: "0.6s" }}
            className="anim-fade-up mt-6 max-w-xl text-[1.05rem] leading-relaxed text-white/72 md:text-lg"
          >
            Turn your favorite memories, names, and moments into beautiful personalized gifts. Thoughtfully customized and delivered across Pakistan.
          </p>

          <div style={{ ["--d" as string]: "0.75s" }} className="anim-fade-up mt-9 flex flex-wrap gap-3">
            <Magnetic>
              <Link href="#collections" className={buttonClass("primary", "lg")}>
                Explore Collections
                <ArrowRight className="size-[18px] transition-transform group-hover/btn:translate-x-1" aria-hidden="true" />
              </Link>
            </Magnetic>
            <Magnetic>
              <Link href="/shop/?personalize=1" className={buttonClass("glass", "lg")}>
                <Wand2 className="size-[18px]" aria-hidden="true" /> Customize Your Gift
              </Link>
            </Magnetic>
          </div>

          <ul
            style={{ ["--d" as string]: "0.9s" }}
            className="anim-fade-up mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/70"
            aria-label="Why shop with us"
          >
            <li className="flex items-center gap-2">
              <Truck className="size-4 text-peach-300" aria-hidden="true" /> Free delivery over Rs {site.freeDeliveryThreshold.toLocaleString("en-PK")}
            </li>
            <li className="flex items-center gap-2">
              <BadgeCheck className="size-4 text-peach-300" aria-hidden="true" /> Only Rs {site.advancePayment} advance to confirm
            </li>
            <li className="flex items-center gap-2">
              <Star className="size-4 fill-peach-300 text-peach-300" aria-hidden="true" /> {site.stats.rating} average rating
            </li>
          </ul>
        </div>

        {/* Image composition */}
        <div className="relative mx-auto w-full max-w-[540px] lg:mr-0">
          <div style={{ ["--d" as string]: "0.15s" }} className="anim-rise-in relative aspect-[4/5]">
            <div aria-hidden="true" className="absolute -inset-3 rounded-t-[999px] rounded-b-[44px] border border-white/10" />
            <div className="ring-gradient absolute inset-0 rounded-t-[999px] rounded-b-[40px]">
              <div className="absolute inset-0 overflow-hidden rounded-[inherit] bg-plum-800">
                <motion.div style={{ y: imgY }} className="absolute -inset-y-[8%] inset-x-0">
                  <Image
                    src="/home-hero/hero-gift.webp"
                    alt="A happy couple cuddling on a sofa with a personalized 'Better Together' photo cushion"
                    fill
                    priority
                    sizes="(min-width:1024px) 540px, 92vw"
                    className="object-cover object-[72%_50%]"
                  />
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-t from-plum-950/50 via-transparent to-transparent" />
              </div>
            </div>

            <NameTag />

            <div
              style={{ ["--d" as string]: "1.1s" }}
              className="anim-pop-in absolute -right-2 top-[14%] flex items-center gap-2.5 rounded-full bg-white px-4 py-2.5 text-plum-900 shadow-lift max-sm:hidden sm:-right-6"
            >
              <span className="display text-2xl font-semibold">{site.stats.rating}</span>
              <span className="flex flex-col leading-tight">
                <span className="flex text-peach-500" aria-hidden="true">
                  {"★★★★★"}
                </span>
                <span className="text-[0.7rem] font-medium text-ink-soft">Average rating</span>
              </span>
            </div>
          </div>

          {floats.slice(0, 2).map((f, i) => (
            <motion.div
              key={f.slug}
              style={{ y: floatY }}
              className={i === 0 ? "absolute -left-3 bottom-[16%] sm:-left-14" : "absolute -bottom-6 right-2 sm:-right-10"}
            >
              <Link
                href={`/product/${f.slug}/`}
                className="anim-fade-up flex w-[168px] items-center gap-3 rounded-[var(--radius-lg)] bg-white/95 p-2 pr-3 text-plum-900 shadow-lift backdrop-blur transition-transform hover:scale-105 sm:w-[200px]"
                style={{ ["--d" as string]: `${0.9 + i * 0.2}s` }}
              >
                <span className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-cream-200 sm:size-16">
                  <Image src={f.image} alt="" fill sizes="64px" className="object-cover" />
                </span>
                <span className="min-w-0">
                  <span className="line-clamp-2 text-xs font-semibold leading-snug">{cleanName(f.name)}</span>
                  <span className="mt-0.5 block text-xs font-bold text-berry-700">{formatPrice(f.price)}</span>
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Verified store figures */}
      <div className="container-x relative pb-10 pt-10 lg:pb-14">
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-[var(--radius-xl)] border border-white/10 bg-white/10 md:grid-cols-4">
          {[
            { v: <Counter to={site.stats.rating} decimals={1} suffix="★" />, l: "Average rating" },
            { v: <Counter to={site.stats.happyCustomers} suffix="+" />, l: "Happy customers" },
            { v: <Counter to={site.stats.giftsDelivered} suffix="+" />, l: "Gifts delivered" },
            { v: <span>{site.foundedYear}</span>, l: "Making gifts since" },
          ].map((s) => (
            <div key={s.l} className="bg-plum-950/70 px-5 py-6 text-center backdrop-blur md:py-7">
              <dd className="display text-3xl font-medium text-white md:text-[2.4rem]">{s.v}</dd>
              <dt className="mt-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-white/55">{s.l}</dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

/** Soft animated aurora (adapted from 21st.dev aurora background, CSS only). */
export function Aurora({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden ${className ?? ""}`}>
      <div className="absolute -left-[10%] -top-[20%] h-[70%] w-[60%] animate-aurora rounded-full bg-berry-500/35 blur-[110px]" />
      <div className="absolute -right-[10%] top-[10%] h-[65%] w-[55%] animate-aurora rounded-full bg-lilac-500/30 blur-[120px] [animation-delay:-6s]" />
      <div className="absolute bottom-[-30%] left-[25%] h-[60%] w-[50%] animate-aurora rounded-full bg-peach-500/20 blur-[120px] [animation-delay:-12s]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,transparent_0%,rgb(22_10_27/0.6)_70%)]" />
    </div>
  );
}

const names = ["Ayesha", "Hamza", "Fatima & Ali", "Mama", "Best Dad Ever"];

/** Typing personalization tag: shows the idea of a name printed on a gift. */
function NameTag() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const [len, setLen] = useState(reduce ? names[0].length : 0);
  const [del, setDel] = useState(false);
  useEffect(() => {
    if (reduce) return;
    const word = names[i];
    const t = setTimeout(
      () => {
        if (!del && len < word.length) setLen(len + 1);
        else if (!del) setDel(true);
        else if (len > 0) setLen(len - 1);
        else {
          setDel(false);
          setI((i + 1) % names.length);
        }
      },
      !del && len === word.length ? 1600 : del ? 45 : 95,
    );
    return () => clearTimeout(t);
  }, [i, len, del, reduce]);

  return (
    <div
      style={{ ["--d" as string]: "1.2s" }}
      className="anim-fade-up absolute -left-3 top-[24%] w-[62%] rounded-[var(--radius-lg)] max-sm:left-1/2 max-sm:top-[3%] max-sm:w-[80%] max-sm:-translate-x-1/2 border border-white/20 bg-plum-950/60 p-4 shadow-lift backdrop-blur-xl sm:-left-10"
      aria-hidden="true"
    >
      <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-peach-300">Name on your gift</p>
      <p className="accent-italic mt-1 h-9 text-[1.7rem] leading-9 text-white">
        {names[i].slice(0, len)}
        <span className="ml-0.5 inline-block h-6 w-[2px] translate-y-1 animate-pulse bg-berry-300" />
      </p>
    </div>
  );
}
