import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/format";

type Variant = "primary" | "dark" | "light" | "outline" | "ghost" | "wa" | "glass";
type Size = "sm" | "md" | "lg";

const base =
  "group/btn relative inline-flex select-none items-center justify-center gap-2 rounded-full font-semibold tracking-[-0.01em] transition-[transform,background-color,box-shadow,color,border-color] duration-300 ease-[var(--ease-out-expo)] active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 whitespace-nowrap";

const variants: Record<Variant, string> = {
  primary:
    "bg-berry-600 text-white shadow-[0_10px_30px_-10px_rgb(233_79_135/0.7)] hover:bg-berry-700 hover:shadow-[0_16px_40px_-12px_rgb(233_79_135/0.8)]",
  dark: "bg-plum-900 text-white hover:bg-plum-800 shadow-soft",
  light: "bg-white text-plum-900 hover:bg-cream-100 shadow-soft",
  outline: "border border-plum-900/15 bg-white/60 text-plum-900 hover:border-plum-900/40 hover:bg-white",
  ghost: "text-plum-900 hover:bg-plum-900/5",
  wa: "bg-wa text-white hover:bg-wa-dark shadow-[0_10px_30px_-12px_rgb(14_122_59/0.6)]",
  glass: "border border-white/25 bg-white/10 text-white backdrop-blur-md hover:bg-white/20",
};
const sizes: Record<Size, string> = {
  sm: "h-10 px-4 text-sm",
  md: "h-12 px-6 text-[0.95rem]",
  lg: "h-14 px-8 text-base",
};

type Common = { variant?: Variant; size?: Size; className?: string; children: ReactNode };

export function buttonClass(variant: Variant = "primary", size: Size = "md", className?: string) {
  return cn(base, variants[variant], sizes[size], className);
}

export function Button({ variant, size, className, children, ...rest }: Common & ComponentProps<"button">) {
  return (
    <button className={buttonClass(variant, size, className)} {...rest}>
      {children}
    </button>
  );
}

export function ButtonLink({
  variant,
  size,
  className,
  children,
  href,
  external,
  ...rest
}: Common & { href: string; external?: boolean } & Omit<ComponentProps<"a">, "href">) {
  if (external || href.startsWith("http")) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={buttonClass(variant, size, className)} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={buttonClass(variant, size, className)} {...rest}>
      {children}
    </Link>
  );
}
