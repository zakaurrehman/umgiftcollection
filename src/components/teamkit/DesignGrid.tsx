"use client";

import Image from "next/image";
import { BadgeCheck, Wand2 } from "lucide-react";
import { TEAM_RATE_QTY } from "@/lib/teamkits";
import { useKitDesign } from "./KitBuilder";

export function DesignGrid({ designs, sport }: { designs: { title: string; image: string; real?: boolean }[]; sport: string }) {
  const setDesign = useKitDesign((s) => s.setDesign);
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-5 lg:grid-cols-5">
      {designs.map((d) => (
        <li key={d.title} className="group overflow-hidden rounded-[var(--radius-lg)] border border-line bg-white">
          <div className="relative aspect-square overflow-hidden bg-cream-200">
            <Image src={d.image} alt={`${d.title} custom team ${sport} kit printed in bulk in Pakistan`} fill sizes="(min-width:1024px) 20vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
            {d.real && (
              <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-[0.65rem] font-semibold text-plum-900">
                <BadgeCheck className="size-3 text-wa" aria-hidden="true" /> Real team order
              </span>
            )}
          </div>
          <div className="p-3.5">
            <h3 className="text-sm font-semibold text-plum-900">{d.title}</h3>
            <p className="mt-0.5 text-xs text-ink-soft">
              From <b className="text-plum-900">Rs 1,000</b> · Min {TEAM_RATE_QTY} pcs
            </p>
            <button
              type="button"
              onClick={() => {
                setDesign(d.title);
                document.getElementById("design-your-kit")?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className="mt-3 flex h-10 w-full items-center justify-center gap-1.5 rounded-full bg-plum-900 text-xs font-semibold text-white transition-colors hover:bg-berry-600"
            >
              <Wand2 className="size-3.5" aria-hidden="true" /> Use this design
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
