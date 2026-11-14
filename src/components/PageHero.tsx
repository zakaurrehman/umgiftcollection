import Image from "next/image";
import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/ui/bits";
import { Aurora } from "@/components/home/Hero";

/** Deep-plum banner used by listing and info pages, with optional fanned product collage. */
export function PageHero({
  crumbs,
  title,
  accent,
  intro,
  meta,
  images = [],
  children,
}: {
  crumbs: { href?: string; label: string }[];
  title: string;
  accent?: string;
  intro?: ReactNode;
  meta?: ReactNode;
  images?: string[];
  children?: ReactNode;
}) {
  const fan = images.slice(0, 3);
  return (
    <section className="grain relative isolate overflow-hidden bg-plum-950 text-white">
      <Aurora />
      <div className="container-x relative grid items-center gap-10 py-12 md:py-16 lg:grid-cols-[1.4fr_1fr]">
        <div className="max-w-2xl">
          <Breadcrumbs items={crumbs} dark />
          <h1 className="display mt-5 text-[clamp(2.2rem,5.5vw,4rem)] font-medium leading-[1.02]">
            {title} {accent && <span className="accent-italic text-gradient">{accent}</span>}
          </h1>
          {intro && <div className="mt-5 max-w-xl text-base leading-relaxed text-white/70 md:text-lg">{intro}</div>}
          {meta && <div className="mt-6 flex flex-wrap gap-2.5">{meta}</div>}
          {children}
        </div>
        {fan.length > 0 && (
          <div className="relative mx-auto hidden h-64 w-full max-w-sm sm:block lg:h-72" aria-hidden="true">
            {fan.map((src, i) => (
              <div
                key={src}
                className="absolute top-1/2 aspect-[4/5] w-[46%] overflow-hidden rounded-[var(--radius-lg)] border-4 border-white/90 bg-cream-200 shadow-lift transition-transform duration-700 hover:-translate-y-2"
                style={{
                  left: `${[2, 27, 52][i]}%`,
                  transform: `translateY(-50%) rotate(${[-8, 0, 8][i]}deg) translateY(${[14, -6, 14][i]}px)`,
                  zIndex: i === 1 ? 3 : 1,
                }}
              >
                <Image src={src} alt="" fill sizes="200px" priority className="object-cover" />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export function MetaPill({ children }: { children: ReactNode }) {
  return <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-3.5 py-1.5 text-sm text-white/85 backdrop-blur">{children}</span>;
}
