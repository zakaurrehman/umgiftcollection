"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useHydrated, useWishlist } from "@/store/ui";
import { ProductCard } from "@/components/product/ProductCard";
import { buttonClass } from "@/components/ui/Button";

export function WishlistView() {
  const hydrated = useHydrated();
  const items = useWishlist((s) => s.items);
  if (!hydrated) return <div className="h-80" />;
  if (!items.length) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-[var(--radius-2xl)] border border-dashed border-line bg-white/60 px-6 py-24 text-center">
        <span className="grid size-20 place-items-center rounded-full bg-berry-50 text-berry-500">
          <Heart className="size-9" aria-hidden="true" />
        </span>
        <h2 className="display text-3xl text-plum-900">Nothing saved yet</h2>
        <p className="max-w-sm text-ink-soft">Tap the heart on any gift to keep it here for later.</p>
        <Link href="/shop/" className={buttonClass("primary", "lg", "mt-3")}>
          Discover gifts
        </Link>
      </div>
    );
  }
  return (
    <ul className="grid grid-cols-2 gap-x-3 gap-y-9 sm:gap-x-5 md:grid-cols-3 lg:grid-cols-4">
      {items.map((p) => (
        <li key={p.slug}>
          <ProductCard p={p} />
        </li>
      ))}
    </ul>
  );
}
