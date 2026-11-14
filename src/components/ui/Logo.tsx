import { useId } from "react";
import { cn } from "@/lib/format";

/**
 * UM Gift Collection monogram. Keeps the crown and the neon lilac→berry ring
 * from the previous (The Customized Shop) logo for continuity. Replace with the
 * owner's final logo file when available.
 */
export function LogoMark({ className, title }: { className?: string; title?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 64 64" className={cn("shrink-0", className)} role={title ? "img" : undefined} aria-label={title} aria-hidden={title ? undefined : true}>
      <defs>
        <linearGradient id={`r${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7de3f0" />
          <stop offset="0.45" stopColor="#c5a8ff" />
          <stop offset="1" stopColor="#e94f87" />
        </linearGradient>
        <radialGradient id={`b${id}`} cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#3a1f44" />
          <stop offset="1" stopColor="#160a1b" />
        </radialGradient>
      </defs>
      <circle cx="32" cy="32" r="31" fill={`url(#b${id})`} />
      <circle cx="32" cy="32" r="27.5" fill="none" stroke={`url(#r${id})`} strokeWidth="1.6" />
      <path d="M24.5 17.2l2.6 2.6 4.9-4.5 4.9 4.5 2.6-2.6-1 6.1H25.5z" fill="#f3e9ff" />
      <text
        x="32"
        y="44.5"
        textAnchor="middle"
        fill="#fff"
        style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontStyle: "italic", fontWeight: 600, fontSize: 21, letterSpacing: "-0.5px" }}
      >
        UM
      </text>
      <path d="M21 48.5h22" stroke={`url(#r${id})`} strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

export function Wordmark({ dark, compact }: { dark?: boolean; compact?: boolean }) {
  return (
    <span className="leading-none">
      <span className={cn("display block font-semibold", compact ? "text-[1.05rem]" : "text-[1.05rem] lg:text-[1.2rem]", dark ? "text-white" : "text-plum-900")}>UM Gift Collection</span>
      <span className={cn("mt-1 block text-[0.62rem] font-bold uppercase tracking-[0.22em]", dark ? "text-peach-300" : "text-berry-700")}>Personalized Gifts</span>
    </span>
  );
}
