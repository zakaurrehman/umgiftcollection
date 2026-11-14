"use client";

import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/format";

export function Gallery({
  images,
  alts,
  name,
  index,
  onIndex,
  compact,
}: {
  images: string[];
  alts: string[];
  name: string;
  index: number;
  onIndex: (i: number) => void;
  compact?: boolean;
}) {
  const [dir, setDir] = useState(1);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const n = images.length;
  const go = (i: number) => {
    setDir(i > index ? 1 : -1);
    onIndex((i + n) % n);
  };

  return (
    <div className={cn("flex gap-3", compact ? "flex-col" : "flex-col-reverse lg:flex-row")}>
      {n > 1 && (
        <ul className={cn("no-scrollbar flex gap-2.5 overflow-x-auto", !compact && "lg:max-h-[640px] lg:w-20 lg:flex-col lg:overflow-y-auto")} aria-label="Product images">
          {images.map((src, i) => (
            <li key={src} className="shrink-0">
              <button
                type="button"
                onClick={() => go(i)}
                aria-label={`Show image ${i + 1} of ${n}`}
                aria-current={i === index}
                className={cn(
                  "relative block size-[72px] overflow-hidden rounded-[var(--radius-sm)] border-2 bg-cream-200 transition-all lg:size-20",
                  i === index ? "border-plum-900" : "border-transparent opacity-70 hover:opacity-100",
                )}
              >
                <Image src={src} alt="" fill sizes="80px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div
        className="group relative aspect-square flex-1 overflow-hidden rounded-[var(--radius-xl)] bg-cream-200 lg:aspect-[4/5]"
        onPointerMove={(e) => {
          if (e.pointerType !== "mouse" || compact) return;
          const r = e.currentTarget.getBoundingClientRect();
          setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
        }}
        onPointerLeave={() => setZoom(null)}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") go(index + 1);
          if (e.key === "ArrowLeft") go(index - 1);
        }}
        tabIndex={n > 1 ? 0 : -1}
        role={n > 1 ? "region" : undefined}
        aria-roledescription={n > 1 ? "carousel" : undefined}
        aria-label={n > 1 ? `${name} images, use arrow keys to browse` : undefined}
      >
        <AnimatePresence initial={false} custom={dir} mode="popLayout">
          <motion.div
            key={images[index]}
            custom={dir}
            className="absolute inset-0 touch-pan-y"
            initial={{ opacity: 0, x: dir * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir * -40 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            drag={n > 1 ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.25}
            onDragEnd={(_, info) => {
              if (info.offset.x < -60) go(index + 1);
              else if (info.offset.x > 60) go(index - 1);
            }}
          >
            <Image
              src={images[index]}
              alt={alts[index] || `${name} — image ${index + 1}`}
              fill
              priority={index === 0}
              sizes="(min-width:1024px) 50vw, 100vw"
              className="pointer-events-none object-cover transition-transform duration-300 ease-out"
              style={zoom ? { transform: "scale(1.8)", transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined}
              draggable={false}
            />
          </motion.div>
        </AnimatePresence>

        {n > 1 && (
          <>
            <button type="button" onClick={() => go(index - 1)} aria-label="Previous image" className="absolute left-3 top-1/2 z-10 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/85 text-plum-900 shadow-soft backdrop-blur transition-opacity hover:bg-white md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100">
              <ChevronLeft className="size-5" aria-hidden="true" />
            </button>
            <button type="button" onClick={() => go(index + 1)} aria-label="Next image" className="absolute right-3 top-1/2 z-10 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/85 text-plum-900 shadow-soft backdrop-blur transition-opacity hover:bg-white md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100">
              <ChevronRight className="size-5" aria-hidden="true" />
            </button>
            <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-1.5" aria-hidden="true">
              {images.map((_, i) => (
                <span key={i} className={cn("h-1.5 rounded-full bg-white shadow transition-all duration-500", i === index ? "w-6" : "w-1.5 opacity-60")} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
