"use client";

import { AnimatePresence, motion } from "motion/react";
import { Plus } from "lucide-react";
import { useId, useState, type ReactNode } from "react";
import { cn } from "@/lib/format";

export type AccordionItem = { q: string; a: ReactNode };

/** Accessible accordion: buttons with aria-expanded/controls, animated height. */
export function Accordion({ items, defaultOpen = 0, className }: { items: AccordionItem[]; defaultOpen?: number | null; className?: string }) {
  const [open, setOpen] = useState<number | null>(defaultOpen);
  const uid = useId();
  return (
    <div className={cn("divide-y divide-line rounded-[var(--radius-xl)] border border-line bg-white/70", className)}>
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <div key={i}>
            <h3>
              <button
                type="button"
                id={`${uid}-q${i}`}
                aria-expanded={isOpen}
                aria-controls={`${uid}-a${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-6 px-5 py-5 text-left text-[1.02rem] font-semibold text-plum-900 transition-colors hover:text-berry-700 md:px-7"
              >
                {it.q}
                <span
                  className={cn(
                    "grid size-9 shrink-0 place-items-center rounded-full border border-line transition-[transform,background-color,color] duration-500 ease-[var(--ease-out-expo)]",
                    isOpen ? "rotate-45 bg-plum-900 text-white" : "bg-cream-100 text-plum-900",
                  )}
                  aria-hidden="true"
                >
                  <Plus className="size-4" />
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={`${uid}-a${i}`}
                  role="region"
                  aria-labelledby={`${uid}-q${i}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-6 leading-relaxed text-ink-soft md:px-7">{it.a}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
