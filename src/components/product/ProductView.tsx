"use client";

import { AnimatePresence, motion } from "motion/react";
import { Heart, Share2, Wand2 } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import type { CardProduct } from "@/lib/types";
import { cleanName, cn, formatPrice } from "@/lib/format";
import { useHydrated, useUI, useWishlist } from "@/store/ui";
import { Gallery } from "./Gallery";
import { Customizer, type CustomizerProduct } from "./Customizer";

export function ProductView({
  product,
  card,
  alts,
  header,
  aside,
}: {
  product: CustomizerProduct;
  card: CardProduct;
  alts: string[];
  header: ReactNode;
  aside: ReactNode;
}) {
  const [idx, setIdx] = useState(0);
  const formRef = useRef<HTMLDivElement>(null);
  const [showBar, setShowBar] = useState(false);
  const hydrated = useHydrated();
  const wished = useWishlist((s) => s.items.some((i) => i.slug === product.slug));
  const toggle = useWishlist((s) => s.toggle);
  const notify = useUI((s) => s.notify);
  const name = cleanName(product.name);

  // Mobile sticky CTA appears once the customizer has scrolled out of view.
  useEffect(() => {
    const el = formRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setShowBar(!e.isIntersecting && e.boundingClientRect.top < 0), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    document.body.classList.toggle("has-sticky-cta", showBar);
    return () => document.body.classList.remove("has-sticky-cta");
  }, [showBar]);

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title: name, url });
      else {
        await navigator.clipboard.writeText(url);
        notify({ title: "Link copied", body: name });
      }
    } catch {
      /* user cancelled */
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
      <div className="min-w-0">
        <div className="lg:sticky lg:top-28">
          <Gallery images={product.images} alts={alts} name={name} index={idx} onIndex={setIdx} />
        </div>
      </div>

      <div className="min-w-0">
        {header}
        <div className="mt-2 flex gap-2">
          <button
            type="button"
            onClick={() => {
              const on = toggle(card);
              notify({ title: on ? "Saved to wishlist" : "Removed from wishlist", body: name, image: card.image });
            }}
            aria-pressed={hydrated && wished}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-line bg-white px-4 text-sm font-medium text-plum-900 hover:border-plum-900/40"
          >
            <Heart className={cn("size-4", hydrated && wished && "fill-berry-500 text-berry-500")} aria-hidden="true" />
            {hydrated && wished ? "Saved" : "Save"}
          </button>
          <button type="button" onClick={share} className="inline-flex h-10 items-center gap-2 rounded-full border border-line bg-white px-4 text-sm font-medium text-plum-900 hover:border-plum-900/40">
            <Share2 className="size-4" aria-hidden="true" /> Share
          </button>
        </div>

        <div ref={formRef} id="customize" className="mt-7 scroll-mt-28 rounded-[var(--radius-xl)] border border-line bg-white p-5 shadow-soft md:p-7">
          <p className="mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-berry-700">
            <Wand2 className="size-4" aria-hidden="true" /> Personalize & order
          </p>
          <Customizer product={product} onGalleryIndex={setIdx} />
        </div>

        {aside}
      </div>

      <AnimatePresence>
        {showBar && (
          <motion.div
            initial={{ y: "110%" }}
            animate={{ y: 0 }}
            exit={{ y: "110%" }}
            transition={{ type: "spring", stiffness: 380, damping: 36 }}
            className="fixed inset-x-0 bottom-0 z-[55] border-t border-line bg-cream-50/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-lg lg:hidden"
          >
            <div className="flex items-center gap-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-plum-900">{name}</p>
                <p className="text-sm font-bold text-berry-700">{formatPrice(product.price)}</p>
              </div>
              <button
                type="button"
                onClick={() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
                className="h-12 shrink-0 rounded-full bg-berry-600 px-6 text-sm font-semibold text-white shadow-glow"
              >
                Customize & add
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
