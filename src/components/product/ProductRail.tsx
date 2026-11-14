"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { CardProduct } from "@/lib/types";
import { cn } from "@/lib/format";
import { ProductCard } from "./ProductCard";

/** Horizontal, snap-scrolling, touch-friendly product carousel. */
export function ProductRail({
  title,
  accent,
  eyebrow,
  href,
  count,
  products,
  dark,
}: {
  title: string;
  accent?: string;
  eyebrow?: string;
  href?: string;
  count?: number;
  products: CardProduct[];
  dark?: boolean;
}) {
  const scroller = useRef<HTMLDivElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });

  const update = () => {
    const el = scroller.current;
    if (!el) return;
    setEdge({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 8 });
  };
  useEffect(update, []);

  const scroll = (dir: 1 | -1) => {
    const el = scroller.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" });
  };

  return (
    <div>
      <div className="mb-7 flex items-end justify-between gap-6">
        <div>
          {eyebrow && <p className={cn("eyebrow mb-3", dark && "text-peach-300")}>{eyebrow}</p>}
          <h2 className={cn("display text-[clamp(1.6rem,3.2vw,2.5rem)] font-medium leading-tight", dark ? "text-white" : "text-plum-900")}>
            {title} {accent && <span className={cn("accent-italic", dark ? "text-lilac-300" : "text-berry-600")}>{accent}</span>}
          </h2>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {href && (
            <Link href={href} className={cn("mr-2 hidden items-center gap-1.5 text-sm font-semibold hover:underline sm:inline-flex", dark ? "text-peach-300" : "text-berry-700")}>
              View all{count ? ` (${count})` : ""} <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          )}
          {[-1, 1].map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => scroll(d as 1 | -1)}
              disabled={d === -1 ? edge.start : edge.end}
              aria-label={d === -1 ? `Scroll ${title} left` : `Scroll ${title} right`}
              className={cn(
                "hidden size-11 place-items-center rounded-full border transition-all disabled:opacity-30 md:grid",
                dark ? "border-white/20 text-white hover:bg-white hover:text-plum-900" : "border-line bg-white text-plum-900 hover:bg-plum-900 hover:text-white",
              )}
            >
              {d === -1 ? <ArrowLeft className="size-[18px]" aria-hidden="true" /> : <ArrowRight className="size-[18px]" aria-hidden="true" />}
            </button>
          ))}
        </div>
      </div>
      <div
        ref={scroller}
        onScroll={update}
        className="no-scrollbar -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:scroll-px-6 sm:gap-5 sm:px-6 lg:mx-0 lg:scroll-px-0 lg:px-0"
      >
        {products.map((p) => (
          <ProductCard key={p.slug} p={p} className="w-[46%] shrink-0 snap-start sm:w-[31%] lg:w-[calc((100%-60px)/4)]" />
        ))}
      </div>
      {href && (
        <Link href={href} className={cn("mt-6 inline-flex items-center gap-1.5 text-sm font-semibold sm:hidden", dark ? "text-peach-300" : "text-berry-700")}>
          View all{count ? ` ${count}` : ""} <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      )}
    </div>
  );
}
