import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { formatPrice, cn } from "@/lib/format";
import { Img } from "@/components/ui/Img";
import { Stagger, StaggerItem } from "@/components/ui/motion";

export type CatTile = { slug: string; name: string; count: number; image: string | null; from: number };

/** Bento-style category grid: first two tiles are feature-sized on desktop. */
export function CategoryGrid({ items }: { items: CatTile[] }) {
  return (
    <Stagger className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:gap-4 lg:grid-cols-5" gap={0.05}>
      {items.map((c, i) => {
        const big = i < 2;
        return (
          <StaggerItem key={c.slug} className={cn(big && "col-span-2 lg:row-span-2")}>
            <Link
              href={`/category/${c.slug}/`}
              className={cn(
                "group relative block h-full overflow-hidden rounded-[var(--radius-lg)] bg-cream-200 shadow-soft",
                big ? "aspect-[4/3] lg:aspect-auto lg:min-h-[420px]" : "aspect-[4/5] lg:aspect-auto lg:min-h-[200px]",
              )}
            >
              {c.image && (
                <Img
                  src={c.image}
                  alt=""
                  fill
                  sizes={big ? "(min-width:1024px) 40vw, 100vw" : "(min-width:1024px) 20vw, 50vw"}
                  className="object-cover group-hover:scale-[1.07]"
                />
              )}
              <span className="absolute inset-0 bg-gradient-to-t from-plum-950/85 via-plum-950/20 to-transparent transition-opacity duration-500 group-hover:opacity-90" />
              <span className="absolute right-3 top-3 grid size-10 place-items-center rounded-full bg-white/90 text-plum-900 opacity-0 backdrop-blur transition-all duration-500 group-hover:rotate-45 group-hover:opacity-100 group-focus-visible:opacity-100">
                <ArrowUpRight className="size-5" aria-hidden="true" />
              </span>
              <span className={cn("absolute inset-x-4 bottom-4 text-white", big && "lg:inset-x-7 lg:bottom-7")}>
                <span className={cn("display block leading-tight", big ? "text-2xl lg:text-[2.1rem]" : "text-[1.05rem] lg:text-lg")}>{c.name}</span>
                <span className="mt-1 block text-xs text-white/75">
                  {c.count} design{c.count === 1 ? "" : "s"} · from {formatPrice(c.from)}
                </span>
              </span>
            </Link>
          </StaggerItem>
        );
      })}
    </Stagger>
  );
}
