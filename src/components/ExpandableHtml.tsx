"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/format";

/** Long-form store copy, height-clamped with a "read more". All text stays in the DOM for SEO. */
export function ExpandableHtml({ html, clamp = 460 }: { html: string; clamp?: number }) {
  const [open, setOpen] = useState(false);
  const long = html.length > 1400;
  return (
    <div>
      <div className="relative">
        <div
          id="expandable-copy"
          className={cn("prose-tcs overflow-hidden transition-[max-height] duration-700 ease-[var(--ease-out-expo)]")}
          style={{ maxHeight: !long || open ? 40000 : clamp }}
          dangerouslySetInnerHTML={{ __html: html }}
        />
        {long && !open && <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-cream-50 to-transparent" />}
      </div>
      {long && (
        <button
          type="button"
          aria-expanded={open}
          aria-controls="expandable-copy"
          onClick={() => setOpen(!open)}
          className="mt-5 inline-flex h-11 items-center gap-2 rounded-full border border-line bg-white px-5 text-sm font-semibold text-plum-900 hover:border-plum-900/40"
        >
          {open ? "Show less" : "Read more"}
          <ChevronDown className={cn("size-4 transition-transform", open && "rotate-180")} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
