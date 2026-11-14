import Link from "next/link";
import type { ReactNode } from "react";
import { cn, discountPercent, formatPrice } from "@/lib/format";

export function SectionHeading({
  eyebrow,
  title,
  accent,
  intro,
  align = "left",
  action,
  className,
  dark,
  as: H = "h2",
}: {
  eyebrow?: string;
  title: string;
  accent?: string;
  intro?: ReactNode;
  align?: "left" | "center";
  action?: ReactNode;
  className?: string;
  dark?: boolean;
  as?: "h1" | "h2";
}) {
  return (
    <div className={cn("flex flex-col gap-5 md:flex-row md:items-end md:justify-between", align === "center" && "items-center text-center md:flex-col md:items-center", className)}>
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        {eyebrow && <p className={cn("eyebrow mb-4", dark && "text-peach-300")}>{eyebrow}</p>}
        <H className={cn("display text-[clamp(1.9rem,4.2vw,3.25rem)] leading-[1.05] font-medium", dark ? "text-white" : "text-plum-900")}>
          {title} {accent && <span className={cn("accent-italic", dark ? "text-lilac-300" : "text-berry-600")}>{accent}</span>}
        </H>
        {intro && <p className={cn("mt-4 text-base leading-relaxed md:text-[1.05rem]", dark ? "text-white/70" : "text-ink-soft")}>{intro}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function Price({ price, compareAt, size = "md", className }: { price: number; compareAt?: number | null; size?: "sm" | "md" | "lg"; className?: string }) {
  const off = discountPercent(price, compareAt);
  return (
    <div className={cn("flex flex-wrap items-baseline gap-x-2 gap-y-1", className)}>
      <span className={cn("font-bold tracking-tight text-plum-900", size === "lg" ? "text-3xl" : size === "md" ? "text-[1.05rem]" : "text-[0.95rem]")}>{formatPrice(price)}</span>
      {off > 0 && (
        <>
          <span className={cn("text-ink-faint line-through", size === "lg" ? "text-lg" : "text-sm")}>{formatPrice(compareAt!)}</span>
          {size === "lg" && <span className="rounded-full bg-berry-50 px-2.5 py-1 text-xs font-bold text-berry-700">Save {off}%</span>}
        </>
      )}
    </div>
  );
}

export function Stars({ rating = 5, className }: { rating?: number; className?: string }) {
  return (
    <span className={cn("inline-flex gap-0.5 text-peach-500", className)} aria-label={`${rating} out of 5 stars`} role="img">
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} viewBox="0 0 20 20" className={cn("size-4", i < Math.round(rating) ? "fill-current" : "fill-cream-300")} aria-hidden="true">
          <path d="M10 1.6l2.6 5.3 5.8.8-4.2 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.6 7.7l5.8-.8z" />
        </svg>
      ))}
    </span>
  );
}

export function Breadcrumbs({ items, dark }: { items: { href?: string; label: string }[]; dark?: boolean }) {
  return (
    <nav aria-label="Breadcrumb" className={cn("text-sm", dark ? "text-white/60" : "text-ink-faint")}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {items.map((it, i) => (
          <li key={i} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden="true">/</span>}
            {it.href ? (
              <Link href={it.href} className={cn("transition-colors", dark ? "hover:text-white" : "hover:text-plum-900")}>
                {it.label}
              </Link>
            ) : (
              <span aria-current="page" className={cn("line-clamp-1", dark ? "text-white" : "text-plum-900")}>
                {it.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
