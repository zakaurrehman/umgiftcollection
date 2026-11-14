"use client";

import Link from "next/link";
import { Check, Copy, Gift } from "lucide-react";
import { useState } from "react";
import { site, whatsappLink, defaultWhatsappText } from "@/lib/site";
import { buttonClass } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/icons";
import { Magnetic, Reveal } from "@/components/ui/motion";
import { Aurora } from "./Hero";

export function PromoCta() {
  const [copied, setCopied] = useState(false);
  return (
    <section className="container-x py-16 md:py-24">
      <Reveal className="grain relative isolate overflow-hidden rounded-[var(--radius-2xl)] bg-plum-950 px-6 py-14 text-center text-white md:px-16 md:py-20">
        <Aurora />
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-white/10 text-peach-300 backdrop-blur">
          <Gift className="size-7" aria-hidden="true" />
        </span>
        <h2 className="display mx-auto mt-6 max-w-3xl text-[clamp(2rem,5vw,3.75rem)] font-medium leading-[1.04]">
          Make Their Next Moment <span className="accent-italic text-gradient">Unforgettable.</span>
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-white/70 md:text-lg">Find something meaningful, personalize it, and make someone smile.</p>

        <div className="mx-auto mt-8 inline-flex flex-wrap items-center justify-center gap-3 rounded-full border border-dashed border-white/30 bg-white/5 py-2 pl-5 pr-2 backdrop-blur">
          <span className="text-sm text-white/80">
            Use code <strong className="font-bold tracking-wider text-white">{site.promo.code}</strong> for {site.promo.label}
          </span>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard?.writeText(site.promo.code).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 1800);
              });
            }}
            className="inline-flex h-9 items-center gap-1.5 rounded-full bg-white px-3.5 text-xs font-bold text-plum-900"
            aria-live="polite"
          >
            {copied ? <Check className="size-3.5" aria-hidden="true" /> : <Copy className="size-3.5" aria-hidden="true" />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>

        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Magnetic>
            <Link href="/shop/" className={buttonClass("light", "lg")}>
              Start shopping
            </Link>
          </Magnetic>
          <Magnetic>
            <a href={whatsappLink(defaultWhatsappText)} target="_blank" rel="noopener noreferrer" className={buttonClass("wa", "lg")}>
              <WhatsAppIcon className="size-5" /> Order on WhatsApp
            </a>
          </Magnetic>
        </div>
      </Reveal>
    </section>
  );
}
