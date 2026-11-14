import Link from "next/link";
import { cn } from "@/lib/format";

/** Horizontally scrollable category shortcuts. */
export function CategoryChips({ categories, current, title = "Browse categories" }: { categories: { slug: string; name: string; count: number }[]; current?: string; title?: string }) {
  return (
    <nav aria-label={title}>
      <ul className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:-mx-6 sm:px-6 lg:mx-0 lg:flex-wrap lg:px-0">
        {categories.map((c) => (
          <li key={c.slug} className="shrink-0">
            <Link
              href={`/category/${c.slug}/`}
              aria-current={current === c.slug ? "page" : undefined}
              className={cn(
                "inline-flex h-10 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors",
                current === c.slug ? "border-plum-900 bg-plum-900 text-white" : "border-line bg-white text-ink hover:border-plum-900/40 hover:text-plum-900",
              )}
            >
              {c.name}
              <span className={cn("text-xs", current === c.slug ? "text-white/60" : "text-ink-faint")}>{c.count}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
