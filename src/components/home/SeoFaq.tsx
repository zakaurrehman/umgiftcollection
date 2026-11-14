"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/format";
import { Accordion } from "@/components/ui/Accordion";

/** FAQ accordion + the store's long-form SEO copy behind a "read more". The
 *  full text is always in the HTML for search engines; only its height is clamped. */
export function SeoFaq({ faqs, html, title }: { faqs: { q: string; a: string }[]; html: string; title: string }) {
  const [more, setMore] = useState(false);
  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16 [&>*]:min-w-0">
      <div>
        <p className="eyebrow mb-4">Questions, answered</p>
        <h2 className="display text-[clamp(1.9rem,4vw,3rem)] font-medium leading-[1.05] text-plum-900">
          Frequently asked <span className="accent-italic text-berry-600">questions</span>
        </h2>
        <Accordion className="mt-8" items={faqs.map((f) => ({ q: f.q, a: <div className="prose-tcs" dangerouslySetInnerHTML={{ __html: f.a }} /> }))} />
      </div>
      <div>
        <p className="eyebrow mb-4">About us</p>
        <h2 className="display text-[clamp(1.6rem,3vw,2.3rem)] font-medium leading-tight text-plum-900">{title}</h2>
        <div className="relative mt-6">
          <div id="seo-copy" className={cn("prose-tcs overflow-hidden transition-[max-height] duration-700 ease-[var(--ease-out-expo)]", more ? "max-h-[20000px]" : "max-h-[420px]")} dangerouslySetInnerHTML={{ __html: html }} />
          {!more && <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-cream-100 to-transparent" />}
        </div>
        <button
          type="button"
          aria-expanded={more}
          aria-controls="seo-copy"
          onClick={() => setMore(!more)}
          className="mt-4 inline-flex h-11 items-center gap-2 rounded-full border border-line bg-white px-5 text-sm font-semibold text-plum-900 hover:border-plum-900/40"
        >
          {more ? "Show less" : "Read more about us"}
          <ChevronDown className={cn("size-4 transition-transform", more && "rotate-180")} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
