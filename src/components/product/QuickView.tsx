"use client";

import Link from "next/link";
import { ArrowUpRight, LoaderCircle, X } from "lucide-react";
import { useEffect, useState } from "react";
import { cleanName } from "@/lib/format";
import { useUI } from "@/store/ui";
import { Overlay } from "@/components/ui/Overlay";
import { Gallery } from "./Gallery";
import { Customizer, type CustomizerProduct } from "./Customizer";

type QV = CustomizerProduct & { imageAlts: string[]; description: string };
const cache = new Map<string, QV>();

export function QuickView() {
  const slug = useUI((s) => s.quickView);
  const close = useUI((s) => s.openQuickView);
  const onClose = () => close(null);
  return (
    <Overlay open={!!slug} onClose={onClose} label="Quick view" side="center" className="overflow-hidden">
      <button type="button" onClick={onClose} aria-label="Close quick view" className="absolute right-3 top-3 z-20 grid size-11 place-items-center rounded-full bg-white/90 text-plum-900 shadow-soft backdrop-blur hover:bg-white">
        <X className="size-5" aria-hidden="true" />
      </button>
      {slug && <QuickViewBody key={slug} slug={slug} onClose={onClose} />}
    </Overlay>
  );
}

/** Remounted per product (keyed by slug), so gallery position and form state start fresh. */
function QuickViewBody({ slug, onClose }: { slug: string; onClose: () => void }) {
  const [data, setData] = useState<QV | null>(() => cache.get(slug) ?? null);
  const [error, setError] = useState(false);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (cache.has(slug)) return;
    let alive = true;
    fetch(`/api/product/${slug}/`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((d: QV) => {
        cache.set(slug, d);
        if (alive) setData(d);
      })
      .catch(() => alive && setError(true));
    return () => {
      alive = false;
    };
  }, [slug]);

  if (error) {
    return (
      <div className="grid h-60 place-items-center p-8 text-center text-ink-soft">
        <p>
          We couldn&rsquo;t load this product.{" "}
          <Link href={`/product/${slug}/`} onClick={onClose} className="font-semibold text-berry-700 underline">
            Open the product page
          </Link>
        </p>
      </div>
    );
  }
  if (!data) {
    return (
      <div className="grid h-80 place-items-center text-ink-soft">
        <LoaderCircle className="size-7 animate-spin text-berry-500" aria-label="Loading product" />
      </div>
    );
  }
  return (
    <div className="grid min-h-0 flex-1 overflow-y-auto md:grid-cols-[1fr_1.05fr] md:overflow-hidden">
      <div className="bg-cream-200/60 p-4 md:p-6">
        <Gallery images={data.images} alts={data.imageAlts} name={data.name} index={idx} onIndex={setIdx} compact />
      </div>
      <div className="p-5 md:overflow-y-auto md:p-8">
        <h2 className="display pr-10 text-2xl font-medium leading-tight text-plum-900 md:text-[1.85rem]">{cleanName(data.name)}</h2>
        {data.description && <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-ink-soft">{data.description}</p>}
        <Link href={`/product/${data.slug}/`} onClick={onClose} className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-berry-700 hover:underline">
          Full details <ArrowUpRight className="size-4" aria-hidden="true" />
        </Link>
        <div className="mt-6">
          <Customizer product={data} onGalleryIndex={setIdx} onAdded={onClose} compact />
        </div>
      </div>
    </div>
  );
}
