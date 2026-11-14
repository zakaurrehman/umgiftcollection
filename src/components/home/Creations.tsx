"use client";

import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { BadgeCheck, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useState } from "react";
import { creations, creationsQuote } from "@/lib/content";
import { Stars } from "@/components/ui/bits";

/** Masonry of real customer orders with hover captions and a lightbox. */
export function Creations() {
  const [open, setOpen] = useState<number | null>(null);
  // Bento: row 1 = two photos + quote (spans 2); row 2 = four photos.
  const tiles = [...creations.slice(0, 2).map((c, i) => ({ c, i })), null, ...creations.slice(2).map((c, i) => ({ c, i: i + 2 }))];

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen((o) => (o === null ? o : (o + 1) % creations.length));
      if (e.key === "ArrowLeft") setOpen((o) => (o === null ? o : (o - 1 + creations.length) % creations.length));
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
        {tiles.map((t, k) =>
          t === null ? (
            <motion.figure
              key="quote"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="col-span-2 flex flex-col justify-center rounded-[var(--radius-lg)] bg-plum-900 p-6 text-white max-lg:order-first md:p-10"
            >
              <Stars rating={5} />
              <blockquote className="accent-italic mt-4 text-xl leading-snug md:text-[1.9rem] md:leading-tight">&ldquo;{creationsQuote.text}&rdquo;</blockquote>
              <figcaption className="mt-5 text-sm text-white/65">
                <span className="font-semibold text-white">{creationsQuote.name}</span> · {creationsQuote.product}
              </figcaption>
            </motion.figure>
          ) : (
            <motion.figure
              key={t.c.src}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-5%" }}
              transition={{ duration: 0.9, delay: (k % 4) * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="group relative aspect-square overflow-hidden rounded-[var(--radius-lg)] bg-cream-200"
            >
              <button type="button" onClick={() => setOpen(t.i)} className="absolute inset-0 block" aria-label={`View ${t.c.title}, a real customer order`}>
                <Image src={t.c.src} alt={`${t.c.title}, a customized ${t.c.kind} made by UM Gift Collection`} fill sizes="(min-width:1024px) 25vw, 50vw" className="object-cover transition-transform duration-[1200ms] ease-[var(--ease-out-expo)] group-hover:scale-105" />
              </button>
              <span className="pointer-events-none absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[0.7rem] font-semibold text-plum-900 backdrop-blur">
                <BadgeCheck className="size-3.5 text-wa" aria-hidden="true" /> Real order
              </span>
              <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-plum-950/85 to-transparent p-4 pt-10 text-white opacity-100 transition-all duration-500 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100">
                <span className="block font-semibold">{t.c.title}</span>
                <span className="text-xs text-white/70">{t.c.kind}</span>
              </figcaption>
            </motion.figure>
          ),
        )}
      </div>

      <AnimatePresence>
        {open !== null && (
          <motion.div className="fixed inset-0 z-[85] flex items-center justify-center bg-plum-950/90 p-4 backdrop-blur" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="dialog" aria-modal="true" aria-label={creations[open].title} onClick={() => setOpen(null)}>
            <motion.div key={open} initial={{ scale: 0.94, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.4 }} className="relative w-full max-w-xl" onClick={(e) => e.stopPropagation()}>
              <Image src={creations[open].src} alt={creations[open].title} width={900} height={1100} sizes="600px" className="max-h-[78dvh] w-full rounded-[var(--radius-xl)] object-contain" />
              <div className="mt-4 flex items-center justify-between gap-4 text-white">
                <div>
                  <p className="font-semibold">{creations[open].title}</p>
                  <p className="text-sm text-white/60">{creations[open].kind}</p>
                </div>
                <Link href={creations[open].href} onClick={() => setOpen(null)} className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-plum-900">
                  Shop similar
                </Link>
              </div>
            </motion.div>
            <button type="button" aria-label="Close" onClick={() => setOpen(null)} className="absolute right-4 top-4 grid size-12 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20">
              <X className="size-6" aria-hidden="true" />
            </button>
            <button type="button" aria-label="Previous" onClick={(e) => (e.stopPropagation(), setOpen((open - 1 + creations.length) % creations.length))} className="absolute left-3 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20">
              <ChevronLeft className="size-6" aria-hidden="true" />
            </button>
            <button type="button" aria-label="Next" onClick={(e) => (e.stopPropagation(), setOpen((open + 1) % creations.length))} className="absolute right-3 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20">
              <ChevronRight className="size-6" aria-hidden="true" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
