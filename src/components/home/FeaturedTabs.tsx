"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import type { CardProduct } from "@/lib/types";
import { cn } from "@/lib/format";
import { ProductCard } from "@/components/product/ProductCard";

export type FeaturedTab = { id: string; label: string; href: string; products: CardProduct[] };

export function FeaturedTabs({ tabs }: { tabs: FeaturedTab[] }) {
  const [active, setActive] = useState(0);
  const tab = tabs[active];
  return (
    <div>
      <div className="no-scrollbar -mx-4 mb-8 flex items-center gap-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <div role="tablist" aria-label="Featured products" className="flex shrink-0 gap-1 rounded-full border border-line bg-white p-1.5 shadow-soft">
          {tabs.map((t, i) => (
            <button
              key={t.id}
              role="tab"
              id={`tab-${t.id}`}
              aria-selected={i === active}
              aria-controls={`panel-${t.id}`}
              onClick={() => setActive(i)}
              className={cn("relative h-10 whitespace-nowrap rounded-full px-4 text-sm font-semibold transition-colors sm:px-5", i === active ? "text-white" : "text-ink-soft hover:text-plum-900")}
            >
              {i === active && <motion.span layoutId="featured-pill" className="absolute inset-0 rounded-full bg-plum-900" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
              <span className="relative">{t.label}</span>
            </button>
          ))}
        </div>
        <Link href={tab.href} className="ml-auto hidden shrink-0 items-center gap-2 text-sm font-semibold text-berry-700 hover:underline md:inline-flex">
          View all <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab.id}
          id={`panel-${tab.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${tab.id}`}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 md:grid-cols-3 lg:grid-cols-4"
        >
          {tab.products.map((p) => (
            <ProductCard key={p.slug} p={p} />
          ))}
        </motion.div>
      </AnimatePresence>
      <div className="mt-10 text-center md:hidden">
        <Link href={tab.href} className="inline-flex h-12 items-center gap-2 rounded-full border border-line bg-white px-6 text-sm font-semibold text-plum-900">
          View all {tab.label.toLowerCase()} <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
