"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/format";

export type Occasion = { slug: string; title: string; kicker: string; image: string | null; count: number };

/** Interactive image accordion (adapted from 21st.dev): panels expand on hover/focus. */
export function OccasionAccordion({ items }: { items: Occasion[] }) {
  const [active, setActive] = useState(0);
  return (
    <>
      {/* Desktop: expanding panels */}
      <div className="hidden h-[520px] gap-3 lg:flex">
        {items.map((o, i) => {
          const on = i === active;
          return (
            <motion.div
              key={o.slug}
              layout
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              animate={{ flex: on ? 4.2 : 1 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="relative min-w-0 overflow-hidden rounded-[var(--radius-xl)] bg-plum-900"
            >
              <Link href={`/category/${o.slug}/`} className="group absolute inset-0 block" aria-label={`${o.title} — ${o.count} designs`}>
                {o.image && (
                  <Image src={o.image} alt="" fill sizes="(min-width:1024px) 50vw, 100vw" className={cn("object-cover transition-[transform,filter] duration-[1200ms] ease-[var(--ease-out-expo)]", on ? "scale-100" : "scale-110 saturate-[0.7]")} />
                )}
                <span className={cn("absolute inset-0 transition-colors duration-700", on ? "bg-gradient-to-t from-plum-950/90 via-plum-950/25 to-transparent" : "bg-plum-950/55")} />
                <span className={cn("absolute inset-0 flex items-center justify-center transition-opacity duration-500", on ? "pointer-events-none opacity-0" : "opacity-100")}>
                  <span className="rotate-180 whitespace-nowrap text-sm font-semibold uppercase tracking-[0.18em] text-white [writing-mode:vertical-rl]">{o.title}</span>
                </span>
                <motion.span
                  initial={false}
                  animate={{ opacity: on ? 1 : 0, y: on ? 0 : 20 }}
                  transition={{ duration: 0.5, delay: on ? 0.2 : 0 }}
                  className="absolute inset-x-8 bottom-8 flex items-end justify-between gap-6 text-white"
                >
                  <span>
                    <span className="text-xs font-bold uppercase tracking-[0.18em] text-peach-300">{o.kicker}</span>
                    <span className="display mt-2 block text-[2.4rem] leading-none">{o.title}</span>
                    <span className="mt-3 block text-sm text-white/70">{o.count} designs to personalize</span>
                  </span>
                  <span className="grid size-14 shrink-0 place-items-center rounded-full bg-white text-plum-900 transition-transform duration-500 group-hover:rotate-45">
                    <ArrowUpRight className="size-6" aria-hidden="true" />
                  </span>
                </motion.span>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Mobile/tablet: swipeable cards */}
      <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6 lg:hidden">
        {items.map((o) => (
          <Link key={o.slug} href={`/category/${o.slug}/`} className="relative aspect-[3/4] w-[72%] shrink-0 snap-start overflow-hidden rounded-[var(--radius-xl)] bg-plum-900 sm:w-[42%]">
            {o.image && <Image src={o.image} alt="" fill sizes="72vw" className="object-cover" />}
            <span className="absolute inset-0 bg-gradient-to-t from-plum-950/90 via-plum-950/10 to-transparent" />
            <span className="absolute inset-x-5 bottom-5 text-white">
              <span className="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-peach-300">{o.kicker}</span>
              <span className="display mt-1 block text-2xl">{o.title}</span>
              <span className="mt-1 block text-xs text-white/70">{o.count} designs</span>
            </span>
          </Link>
        ))}
      </div>
    </>
  );
}
