"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight, LoaderCircle, Search, SearchX, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { cleanName, cn, formatPrice } from "@/lib/format";
import { useUI } from "@/store/ui";
import { Overlay } from "@/components/ui/Overlay";

type Idx = {
  products: { s: string; n: string; p: number; c: number | null; i: string | null; k: string }[];
  categories: { s: string; n: string; c: number }[];
};
const IK = "https://ik.imagekit.io/gduf8ygq0/";
let indexPromise: Promise<Idx> | null = null;
const loadIndex = () => (indexPromise ??= fetch("/search-index.json").then((r) => r.json()));

const norm = (s: string) => cleanName(s).toLowerCase().normalize("NFKD").replace(/[^\w\s]/g, " ");
const popular = ["Name necklace", "Couple mug", "Photo cushion", "LED lamp", "Couple watch", "Wallet", "Real Madrid", "Crochet"];

/** Score: every query word must appear; earlier and whole-word hits rank higher. */
function score(hay: string, words: string[]) {
  let s = 0;
  for (const w of words) {
    const i = hay.indexOf(w);
    if (i < 0) return -1;
    s += 10 - Math.min(9, i / 6) + (hay[i - 1] === " " || i === 0 ? 4 : 0);
  }
  return s;
}

export function SearchOverlay() {
  const open = useUI((s) => s.searchOpen);
  const setSearch = useUI((s) => s.setSearch);
  const router = useRouter();
  const [q, setQ] = useState("");
  const [idx, setIdx] = useState<Idx | null>(null);
  const [cursor, setCursor] = useState(-1);
  const listRef = useRef<HTMLUListElement>(null);
  const close = () => setSearch(false);

  useEffect(() => {
    if (open) loadIndex().then(setIdx).catch(() => setIdx({ products: [], categories: [] }));
  }, [open]);

  const wordsKey = norm(q).split(/\s+/).filter(Boolean).join(" ");
  const words = useMemo(() => (wordsKey ? wordsKey.split(" ") : []), [wordsKey]);
  const results = useMemo(() => {
    if (!idx || !words.length) return { products: [], categories: [] };
    const products = idx.products
      .map((p) => ({ p, s: score(norm(p.n), words) }))
      .filter((x) => x.s >= 0)
      .sort((a, b) => b.s - a.s)
      .map((x) => x.p);
    const categories = idx.categories
      .map((c) => ({ c, s: score(norm(c.n), words) }))
      .filter((x) => x.s >= 0)
      .sort((a, b) => b.s - a.s || b.c.c - a.c.c)
      .slice(0, 5)
      .map((x) => x.c);
    return { products, categories };
  }, [idx, words]);

  const flat = [...results.categories.map((c) => `/category/${c.s}/`), ...results.products.slice(0, 8).map((p) => `/product/${p.s}/`)];

  const go = (href: string) => {
    close();
    router.push(href);
  };

  return (
    <Overlay open={open} onClose={close} label="Search products" side="top">
      <div className="container-x pb-6 pt-4">
        <form
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            if (cursor >= 0 && flat[cursor]) return go(flat[cursor]);
            if (q.trim()) go(`/shop/?q=${encodeURIComponent(q.trim())}`);
          }}
          className="flex items-center gap-3"
        >
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-5 top-1/2 size-5 -translate-y-1/2 text-plum-900" aria-hidden="true" />
            <input
              data-autofocus
              type="search"
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setCursor(-1);
              }}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setCursor((c) => Math.min(flat.length - 1, c + 1));
                }
                if (e.key === "ArrowUp") {
                  e.preventDefault();
                  setCursor((c) => Math.max(-1, c - 1));
                }
              }}
              placeholder="Search gifts: mugs, frames, lamps, name jewellery…"
              aria-label="Search products"
              aria-controls="search-results"
              aria-activedescendant={flat[cursor] ? `sr-${cursor}` : undefined}
              className="h-14 w-full rounded-full border border-line bg-white pl-14 pr-5 text-base text-ink shadow-soft placeholder:text-ink-faint focus:border-plum-900 focus:outline-none md:h-16 md:text-lg"
            />
          </div>
          <button type="button" onClick={close} aria-label="Close search" className="grid size-12 shrink-0 place-items-center rounded-full bg-plum-900 text-white hover:bg-plum-800">
            <X className="size-5" aria-hidden="true" />
          </button>
        </form>

        <div className="mt-5 max-h-[calc(92dvh-120px)] overflow-y-auto">
          {!words.length && (
            <div>
              <p className="eyebrow mb-3">Popular searches</p>
              <div className="flex flex-wrap gap-2">
                {popular.map((p) => (
                  <button key={p} type="button" onClick={() => setQ(p)} className="min-h-11 rounded-full border border-line bg-white px-4 text-sm font-medium text-plum-900 hover:border-plum-900/40">
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}
          {words.length > 0 && !idx && <LoaderCircle className="mx-auto my-10 size-7 animate-spin text-berry-500" aria-label="Loading" />}
          {words.length > 0 && idx && flat.length === 0 && (
            <div className="flex flex-col items-center gap-3 py-12 text-center text-ink-soft">
              <SearchX className="size-10 text-lilac-500" aria-hidden="true" />
              <p>
                No gifts match <strong className="text-plum-900">&ldquo;{q}&rdquo;</strong>. Try a simpler word like &ldquo;mug&rdquo; or &ldquo;locket&rdquo;.
              </p>
            </div>
          )}
          {flat.length > 0 && (
            <ul id="search-results" ref={listRef} role="listbox" aria-label="Search results" className="grid gap-x-8 md:grid-cols-[260px_1fr]">
              {results.categories.length > 0 && (
                <li className="mb-4 md:mb-0">
                  <p className="eyebrow mb-2">Collections</p>
                  <ul className="space-y-1">
                    {results.categories.map((c, i) => (
                      <li key={c.s} id={`sr-${i}`} role="option" aria-selected={cursor === i}>
                        <Link href={`/category/${c.s}/`} onClick={close} className={cn("flex min-h-11 items-center justify-between rounded-xl px-3 text-[0.95rem] font-medium text-plum-900", cursor === i ? "bg-white shadow-soft" : "hover:bg-white")}>
                          {c.n} <span className="text-xs text-ink-faint">{c.c}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              )}
              <li className={cn(!results.categories.length && "md:col-span-2")}>
                <p className="eyebrow mb-2">
                  Products <span className="text-ink-faint">({results.products.length})</span>
                </p>
                <ul className="grid gap-2 sm:grid-cols-2">
                  {results.products.slice(0, 8).map((p, j) => {
                    const i = results.categories.length + j;
                    return (
                      <li key={p.s} id={`sr-${i}`} role="option" aria-selected={cursor === i}>
                        <Link href={`/product/${p.s}/`} onClick={close} className={cn("flex items-center gap-3 rounded-[var(--radius-md)] p-2 transition-colors", cursor === i ? "bg-white shadow-soft" : "hover:bg-white")}>
                          <span className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-cream-200">
                            {p.i && <Image src={IK + p.i} alt="" fill sizes="56px" className="object-cover" />}
                          </span>
                          <span className="min-w-0">
                            <span className="line-clamp-1 text-sm font-semibold text-plum-900">{cleanName(p.n)}</span>
                            <span className="text-sm text-ink-soft">
                              {formatPrice(p.p)} {p.c && <s className="ml-1 text-ink-faint">{formatPrice(p.c)}</s>}
                            </span>
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
                {results.products.length > 8 && (
                  <Link href={`/shop/?q=${encodeURIComponent(q.trim())}`} onClick={close} className="mt-4 inline-flex items-center gap-2 font-semibold text-berry-700 hover:underline">
                    See all {results.products.length} results <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                )}
              </li>
            </ul>
          )}
        </div>
      </div>
    </Overlay>
  );
}
