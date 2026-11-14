"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Eye, Heart, ShoppingBag, Sparkles } from "lucide-react";
import type { CardProduct } from "@/lib/types";
import { cleanName, cn, discountPercent } from "@/lib/format";
import { Img } from "@/components/ui/Img";
import { Price } from "@/components/ui/bits";
import { useCart } from "@/store/cart";
import { useHydrated, useUI, useWishlist } from "@/store/ui";

export function ProductCard({ p, priority, className }: { p: CardProduct; priority?: boolean; className?: string }) {
  const href = `/product/${p.slug}/`;
  const off = discountPercent(p.price, p.compareAtPrice);
  const hydrated = useHydrated();
  const wished = useWishlist((s) => s.items.some((i) => i.slug === p.slug));
  const toggleWish = useWishlist((s) => s.toggle);
  const openQuickView = useUI((s) => s.openQuickView);
  const notify = useUI((s) => s.notify);
  const add = useCart((s) => s.add);
  const name = cleanName(p.name);

  const onBag = () => {
    if (p.needsOptions) return openQuickView(p.slug);
    add({
      id: p.slug,
      slug: p.slug,
      name: p.name,
      image: p.image,
      qty: 1,
      baseUnit: p.price,
      extras: 0,
      bulkTiers: null,
      savingPerUnit: p.compareAtPrice ? p.compareAtPrice - p.price : 0,
      lines: [],
      photoNames: [],
    });
    notify({ title: "Added to cart", body: name, image: p.image });
  };

  return (
    <article className={cn("group relative flex flex-col", className)}>
      <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-lg)] bg-cream-200 shadow-[inset_0_0_0_1px_rgb(40_21_47/0.04)]">
        <Link href={href} className="absolute inset-0 z-[1]" aria-label={name} tabIndex={-1}>
          {p.image && (
            <Img
              src={p.image}
              alt={p.alt}
              fill
              priority={priority}
              sizes="(min-width:1280px) 300px, (min-width:768px) 30vw, 48vw"
              className={cn("object-cover group-hover:scale-[1.06]", p.hoverImage && "group-hover:opacity-0")}
            />
          )}
          {p.hoverImage && (
            <Img
              src={p.hoverImage}
              alt=""
              fill
              sizes="(min-width:1280px) 300px, (min-width:768px) 30vw, 48vw"
              className="!opacity-0 object-cover group-hover:!opacity-100 group-hover:scale-[1.06]"
            />
          )}
        </Link>

        <div className="pointer-events-none absolute left-3 top-3 z-[2] flex flex-col items-start gap-1.5">
          {off > 0 && <span className="rounded-full bg-berry-600 px-2.5 py-1 text-[0.7rem] font-bold text-white shadow-sm">−{off}%</span>}
          {p.customizable && (
            <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[0.7rem] font-semibold text-plum-900 backdrop-blur">
              <Sparkles className="size-3 text-berry-500" aria-hidden="true" /> Personalize
            </span>
          )}
        </div>

        <motion.button
          type="button"
          whileTap={{ scale: 0.85 }}
          onClick={() => {
            const on = toggleWish(p);
            notify({ title: on ? "Saved to wishlist" : "Removed from wishlist", body: name, image: p.image });
          }}
          aria-pressed={hydrated && wished}
          aria-label={hydrated && wished ? `Remove ${name} from wishlist` : `Save ${name} to wishlist`}
          className="absolute right-2.5 top-2.5 z-[2] grid size-10 place-items-center rounded-full bg-white/90 text-plum-900 shadow-sm backdrop-blur transition-colors hover:text-berry-600"
        >
          <Heart className={cn("size-[18px] transition-all", hydrated && wished && "fill-berry-500 text-berry-500")} aria-hidden="true" />
        </motion.button>

        <div className="absolute inset-x-3 bottom-3 z-[2] hidden translate-y-3 opacity-0 transition-all duration-500 ease-[var(--ease-out-expo)] group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100 md:block">
          <button
            type="button"
            onClick={() => openQuickView(p.slug)}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-white/90 text-sm font-semibold text-plum-900 shadow-lift backdrop-blur-md transition-colors hover:bg-white"
          >
            <Eye className="size-4" aria-hidden="true" /> Quick view
          </button>
        </div>
      </div>

      <div className="flex flex-1 items-start gap-3 pt-3.5">
        <div className="min-w-0 flex-1">
          {p.categoryName && <p className="mb-1 truncate text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-ink-faint">{p.categoryName}</p>}
          <h3 className="line-clamp-2 text-[0.95rem] font-semibold leading-snug text-plum-900">
            <Link href={href} className="transition-colors hover:text-berry-700 focus-visible:outline-offset-2">
              {name}
            </Link>
          </h3>
          <Price price={p.price} compareAt={p.compareAtPrice} size="sm" className="mt-1.5" />
        </div>
        <button
          type="button"
          onClick={onBag}
          aria-label={p.needsOptions ? `Choose options for ${name}` : `Add ${name} to cart`}
          className="mt-1 grid size-11 shrink-0 place-items-center rounded-full bg-plum-900 text-white transition-[transform,background-color] duration-300 hover:-rotate-6 hover:bg-berry-600 active:scale-90"
        >
          <ShoppingBag className="size-[18px]" aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}
