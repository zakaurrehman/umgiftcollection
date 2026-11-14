"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { useEffect, useState } from "react";
import { reviewShots } from "@/lib/content";

/** Masonry of real WhatsApp/Instagram review screenshots with a zoom lightbox. */
export function ScreenshotWall() {
  const [open, setOpen] = useState<number | null>(null);
  const n = reviewShots.length;

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen((o) => (o === null ? o : (o + 1) % n));
      if (e.key === "ArrowLeft") setOpen((o) => (o === null ? o : (o - 1 + n) % n));
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, n]);

  return (
    <>
      <ul className="columns-2 gap-3 sm:columns-3 md:gap-4 lg:columns-4 [&>li]:mb-3 md:[&>li]:mb-4">
        {reviewShots.map((s, i) => (
          <motion.li
            key={s.src}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-5%" }}
            transition={{ duration: 0.7, delay: (i % 4) * 0.06 }}
            className="break-inside-avoid"
          >
            <button type="button" onClick={() => setOpen(i)} className="group relative block w-full overflow-hidden rounded-[var(--radius-lg)] bg-white shadow-soft" aria-label={`Zoom screenshot: ${s.alt}`}>
              <Image src={s.src} alt={s.alt} width={600} height={1000} sizes="(min-width:1024px) 25vw, 50vw" className="h-auto w-full transition-transform duration-700 group-hover:scale-[1.03]" />
              <span className="absolute left-2.5 top-2.5 rounded-full bg-plum-900/85 px-2.5 py-1 text-[0.7rem] font-semibold text-white backdrop-blur">{s.label}</span>
              <span className="absolute inset-0 grid place-items-center bg-plum-950/0 opacity-0 transition-all group-hover:bg-plum-950/30 group-hover:opacity-100">
                <ZoomIn className="size-8 text-white" aria-hidden="true" />
              </span>
            </button>
          </motion.li>
        ))}
      </ul>
      <AnimatePresence>
        {open !== null && (
          <motion.div className="fixed inset-0 z-[85] flex items-center justify-center bg-plum-950/92 p-4 backdrop-blur" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="dialog" aria-modal="true" aria-label="Review screenshot" onClick={() => setOpen(null)}>
            <motion.div key={open} initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative h-[86dvh] w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
              <Image src={reviewShots[open].src} alt={reviewShots[open].alt} fill sizes="520px" className="object-contain" />
            </motion.div>
            <p className="absolute inset-x-4 bottom-4 text-center text-sm text-white/80">{reviewShots[open].alt}</p>
            <button type="button" aria-label="Close" onClick={() => setOpen(null)} className="absolute right-4 top-4 grid size-12 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20">
              <X className="size-6" aria-hidden="true" />
            </button>
            <button type="button" aria-label="Previous screenshot" onClick={(e) => (e.stopPropagation(), setOpen((open - 1 + n) % n))} className="absolute left-3 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20">
              <ChevronLeft className="size-6" aria-hidden="true" />
            </button>
            <button type="button" aria-label="Next screenshot" onClick={(e) => (e.stopPropagation(), setOpen((open + 1) % n))} className="absolute right-3 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20">
              <ChevronRight className="size-6" aria-hidden="true" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
