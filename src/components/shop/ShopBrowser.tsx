"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Check, ChevronDown, Search, SearchX, SlidersHorizontal, Sparkles, Tag, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { CardProduct } from "@/lib/types";
import { cleanName, cn } from "@/lib/format";
import { ProductCard } from "@/components/product/ProductCard";
import { Overlay } from "@/components/ui/Overlay";

type Facet = { slug: string; name: string; count: number };
const PAGE = 24;
const sorts = [
  { id: "featured", label: "Featured" },
  { id: "newest", label: "Newest" },
  { id: "price-asc", label: "Price: low to high" },
  { id: "price-desc", label: "Price: high to low" },
  { id: "discount", label: "Biggest discount" },
] as const;
const priceBands = [
  { id: "0-500", label: "Under Rs 500", min: 0, max: 499 },
  { id: "500-1000", label: "Rs 500 – 1,000", min: 500, max: 1000 },
  { id: "1000-2000", label: "Rs 1,000 – 2,000", min: 1000, max: 2000 },
  { id: "2000-3000", label: "Rs 2,000 – 3,000", min: 2000, max: 3000 },
  { id: "3000-", label: "Rs 3,000+", min: 3000, max: Infinity },
];

const norm = (s: string) => cleanName(s).toLowerCase();

export function ShopBrowser({ products, facets, facetLabel = "Category" }: { products: CardProduct[]; facets: Facet[]; facetLabel?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const [q, setQ] = useState(params.get("q") ?? "");
  const sort = (params.get("sort") ?? "featured") as (typeof sorts)[number]["id"];
  const cats = useMemo(() => (params.get("cat") ? params.get("cat")!.split(",") : []), [params]);
  const band = params.get("price") ?? "";
  const sale = params.get("sale") === "1";
  const personalize = params.get("personalize") === "1";
  const [shown, setShown] = useState(PAGE);
  const [sheet, setSheet] = useState(false);
  const gridTop = useRef<HTMLDivElement>(null);

  const setParam = (patch: Record<string, string | null>) => {
    const next = new URLSearchParams(params.toString());
    for (const [k, v] of Object.entries(patch)) {
      if (v) next.set(k, v);
      else next.delete(k);
    }
    const s = next.toString();
    router.replace(`${pathname}${s ? `?${s}` : ""}`, { scroll: false });
    setShown(PAGE);
  };

  // debounce search text into the URL
  useEffect(() => {
    const t = setTimeout(() => {
      if ((params.get("q") ?? "") !== q.trim()) setParam({ q: q.trim() || null });
    }, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const result = useMemo(() => {
    const words = norm(q).split(/\s+/).filter(Boolean);
    const b = priceBands.find((x) => x.id === band);
    let list = products.filter((p) => {
      if (words.length) {
        const hay = norm(p.name + " " + p.categoryName);
        if (!words.every((w) => hay.includes(w))) return false;
      }
      if (cats.length && !cats.some((c) => p.categories.includes(c))) return false;
      if (b && (p.price < b.min || p.price > b.max)) return false;
      if (sale && !p.compareAtPrice) return false;
      if (personalize && !p.customizable) return false;
      return true;
    });
    const disc = (p: CardProduct) => (p.compareAtPrice ? (p.compareAtPrice - p.price) / p.compareAtPrice : 0);
    if (sort === "newest") list = [...list].sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "discount") list = [...list].sort((a, b) => disc(b) - disc(a));
    return list;
  }, [products, q, cats, band, sale, personalize, sort]);

  const active: { label: string; clear: () => void }[] = [
    ...cats.map((c) => ({ label: facets.find((f) => f.slug === c)?.name ?? c, clear: () => setParam({ cat: cats.filter((x) => x !== c).join(",") || null }) })),
    ...(band ? [{ label: priceBands.find((x) => x.id === band)?.label ?? band, clear: () => setParam({ price: null }) }] : []),
    ...(sale ? [{ label: "On sale", clear: () => setParam({ sale: null }) }] : []),
    ...(personalize ? [{ label: "Personalizable", clear: () => setParam({ personalize: null }) }] : []),
    ...(q.trim() ? [{ label: `“${q.trim()}”`, clear: () => setQ("") }] : []),
  ];
  const clearAll = () => {
    setQ("");
    router.replace(pathname, { scroll: false });
    setShown(PAGE);
  };

  const filters = (
    <div className="space-y-8">
      <FilterGroup title="Price">
        <div className="flex flex-wrap gap-2 lg:flex-col lg:items-stretch">
          {priceBands.map((b) => (
            <Pill key={b.id} on={band === b.id} onClick={() => setParam({ price: band === b.id ? null : b.id })}>
              {b.label}
            </Pill>
          ))}
        </div>
      </FilterGroup>
      <FilterGroup title="Show only">
        <div className="flex flex-wrap gap-2 lg:flex-col lg:items-stretch">
          <Pill on={sale} onClick={() => setParam({ sale: sale ? null : "1" })}>
            <Tag className="size-3.5" aria-hidden="true" /> On sale
          </Pill>
          <Pill on={personalize} onClick={() => setParam({ personalize: personalize ? null : "1" })}>
            <Sparkles className="size-3.5" aria-hidden="true" /> Personalizable
          </Pill>
        </div>
      </FilterGroup>
      {facets.length > 1 && (
        <FilterGroup title={facetLabel}>
          <FacetList facets={facets} selected={cats} onToggle={(slug) => setParam({ cat: (cats.includes(slug) ? cats.filter((c) => c !== slug) : [...cats, slug]).join(",") || null })} />
        </FilterGroup>
      )}
    </div>
  );

  return (
    <div className="grid gap-10 lg:grid-cols-[250px_1fr]">
      <aside className="hidden lg:block" aria-label="Filters">
        <div className="sticky top-28 max-h-[calc(100dvh-8rem)] overflow-y-auto pb-6 pr-2">{filters}</div>
      </aside>

      <div ref={gridTop} className="min-w-0 scroll-mt-28">
        {/* toolbar */}
        <div className="sticky top-16 z-20 -mx-4 mb-5 flex items-center gap-2 border-b border-line/70 bg-cream-100/90 px-4 py-3 backdrop-blur-lg sm:-mx-6 sm:px-6 lg:static lg:mx-0 lg:border-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
          <label className="relative min-w-0 flex-1">
            <span className="sr-only">Search in these products</span>
            <Search className="pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-ink-faint" aria-hidden="true" />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search in these gifts…"
              className="h-12 w-full rounded-full border border-line bg-white pl-11 pr-4 text-[0.95rem] focus:border-plum-900 focus:outline-none"
            />
          </label>
          <button type="button" onClick={() => setSheet(true)} className="flex h-12 shrink-0 items-center gap-2 rounded-full border border-line bg-white px-4 text-sm font-semibold text-plum-900 lg:hidden">
            <SlidersHorizontal className="size-4" aria-hidden="true" /> Filters
            {active.length > 0 && <span className="grid size-5 place-items-center rounded-full bg-berry-600 text-[0.65rem] text-white">{active.length}</span>}
          </button>
          <label className="relative shrink-0">
            <span className="sr-only">Sort by</span>
            <select
              value={sort}
              onChange={(e) => setParam({ sort: e.target.value === "featured" ? null : e.target.value })}
              className="h-12 appearance-none rounded-full border border-line bg-white pl-4 pr-10 text-sm font-semibold text-plum-900 focus:border-plum-900 focus:outline-none max-sm:w-[7.5rem]"
            >
              {sorts.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-plum-900" aria-hidden="true" />
          </label>
        </div>

        <div className="mb-6 flex flex-wrap items-center gap-2">
          <p className="mr-2 text-sm text-ink-soft" aria-live="polite">
            <strong className="text-plum-900">{result.length}</strong> {result.length === 1 ? "gift" : "gifts"}
          </p>
          <AnimatePresence initial={false}>
            {active.map((a) => (
              <motion.button
                key={a.label}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                type="button"
                onClick={a.clear}
                className="inline-flex h-8 items-center gap-1.5 rounded-full bg-plum-900 pl-3 pr-2 text-xs font-semibold text-white"
                aria-label={`Remove filter ${a.label}`}
              >
                {a.label} <X className="size-3.5" aria-hidden="true" />
              </motion.button>
            ))}
          </AnimatePresence>
          {active.length > 1 && (
            <button type="button" onClick={clearAll} className="h-8 px-2 text-xs font-semibold text-berry-700 hover:underline">
              Clear all
            </button>
          )}
        </div>

        {result.length === 0 ? (
          <div className="flex flex-col items-center gap-4 rounded-[var(--radius-xl)] border border-dashed border-line bg-white/50 px-6 py-20 text-center">
            <SearchX className="size-10 text-lilac-500" aria-hidden="true" />
            <p className="display text-2xl text-plum-900">No gifts match these filters</p>
            <p className="max-w-sm text-sm text-ink-soft">Try removing a filter or searching for something simpler.</p>
            <button type="button" onClick={clearAll} className="mt-2 h-11 rounded-full bg-plum-900 px-6 text-sm font-semibold text-white">
              Clear all filters
            </button>
          </div>
        ) : (
          <>
            <ul className="grid grid-cols-2 gap-x-3 gap-y-9 sm:gap-x-5 md:grid-cols-3 xl:grid-cols-4">
              {result.slice(0, shown).map((p, i) => (
                <motion.li
                  key={p.slug}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: Math.min(i % PAGE, 12) * 0.03, ease: [0.16, 1, 0.3, 1] }}
                >
                  <ProductCard p={p} priority={i < 4} />
                </motion.li>
              ))}
            </ul>
            {shown < result.length && (
              <div className="mt-14 flex flex-col items-center gap-3">
                <div className="h-1 w-48 overflow-hidden rounded-full bg-cream-300" aria-hidden="true">
                  <div className="h-full rounded-full bg-plum-900" style={{ width: `${(shown / result.length) * 100}%` }} />
                </div>
                <p className="text-sm text-ink-soft">
                  Showing {shown} of {result.length}
                </p>
                <button type="button" onClick={() => setShown((s) => s + PAGE)} className="mt-1 h-12 rounded-full border border-plum-900 bg-white px-8 text-sm font-semibold text-plum-900 transition-colors hover:bg-plum-900 hover:text-white">
                  Load more gifts
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <Overlay open={sheet} onClose={() => setSheet(false)} label="Filters" side="left">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="text-lg font-bold text-plum-900">Filters</h2>
          <button type="button" onClick={() => setSheet(false)} aria-label="Close filters" className="grid size-11 place-items-center rounded-full hover:bg-cream-200">
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-6">{filters}</div>
        <div className="grid grid-cols-2 gap-2 border-t border-line bg-white p-4">
          <button type="button" onClick={clearAll} className="h-12 rounded-full border border-line font-semibold text-plum-900">
            Clear
          </button>
          <button type="button" onClick={() => setSheet(false)} className="h-12 rounded-full bg-plum-900 font-semibold text-white">
            Show {result.length}
          </button>
        </div>
      </Overlay>
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset>
      <legend className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-plum-900">{title}</legend>
      {children}
    </fieldset>
  );
}

function Pill({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={cn(
        "inline-flex min-h-10 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors lg:justify-start lg:rounded-xl",
        on ? "border-plum-900 bg-plum-900 text-white" : "border-line bg-white text-ink hover:border-plum-900/40",
      )}
    >
      {on && <Check className="size-3.5" aria-hidden="true" />}
      {children}
    </button>
  );
}

function FacetList({ facets, selected, onToggle }: { facets: Facet[]; selected: string[]; onToggle: (s: string) => void }) {
  const [all, setAll] = useState(false);
  const [filter, setFilter] = useState("");
  const list = facets.filter((f) => !filter || f.name.toLowerCase().includes(filter.toLowerCase()));
  const visible = all || filter ? list : list.slice(0, 10);
  return (
    <div>
      {facets.length > 10 && (
        <input
          type="search"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Find a category…"
          aria-label="Find a category"
          className="mb-3 h-10 w-full rounded-xl border border-line bg-white px-3 text-sm focus:border-plum-900 focus:outline-none"
        />
      )}
      <ul className="space-y-0.5">
        {visible.map((f) => {
          const on = selected.includes(f.slug);
          return (
            <li key={f.slug}>
              <button type="button" aria-pressed={on} onClick={() => onToggle(f.slug)} className="group flex min-h-10 w-full items-center gap-3 rounded-lg px-1 text-left text-sm text-ink hover:text-plum-900">
                <span className={cn("grid size-5 shrink-0 place-items-center rounded-md border transition-colors", on ? "border-plum-900 bg-plum-900 text-white" : "border-line bg-white group-hover:border-plum-900/50")}>
                  {on && <Check className="size-3.5" aria-hidden="true" />}
                </span>
                <span className="flex-1">{f.name}</span>
                <span className="text-xs tabular-nums text-ink-faint">{f.count}</span>
              </button>
            </li>
          );
        })}
      </ul>
      {!filter && list.length > 10 && (
        <button type="button" onClick={() => setAll(!all)} className="mt-2 text-sm font-semibold text-berry-700 hover:underline">
          {all ? "Show fewer" : `Show all ${list.length}`}
        </button>
      )}
    </div>
  );
}

