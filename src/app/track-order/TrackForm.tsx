"use client";

import { motion } from "motion/react";
import { Gift, Palette, Receipt, Truck } from "lucide-react";
import { useState } from "react";
import { site, whatsappLink } from "@/lib/site";
import { WhatsAppIcon } from "@/components/ui/icons";

const stages = [
  { Icon: Receipt, t: "Confirmed", d: `We've received your order and Rs ${site.advancePayment} advance.` },
  { Icon: Palette, t: "In Production", d: "Your gift is being personalized by hand." },
  { Icon: Truck, t: "On The Way", d: `Handed to the courier, ${site.delivery.elsewhere} across Pakistan.` },
  { Icon: Gift, t: "Delivered", d: "Enjoy! Pay the balance on delivery." },
];

/** Order status is held by the store team, so tracking opens a pre-filled WhatsApp request (same as the original site). */
export function TrackForm() {
  const [ref, setRef] = useState("");
  const [error, setError] = useState(false);

  return (
    <div className="mx-auto max-w-4xl">
      <form
        className="rounded-[var(--radius-2xl)] border border-line bg-white p-6 shadow-lift md:p-10"
        onSubmit={(e) => {
          e.preventDefault();
          if (ref.trim().length < 4) return setError(true);
          window.open(whatsappLink(`Hi ${site.name}! Could you share the status of my order? 📦\nOrder number / phone: ${ref.trim()}`), "_blank", "noopener,noreferrer");
        }}
        noValidate
      >
        <label htmlFor="track-ref" className="block font-semibold text-plum-900">
          Order number or the phone number you ordered with
        </label>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
          <input
            id="track-ref"
            value={ref}
            onChange={(e) => {
              setRef(e.target.value);
              setError(false);
            }}
            placeholder="e.g. TCS-1234 or 03XX-XXXXXXX"
            autoComplete="off"
            aria-invalid={error}
            aria-describedby={error ? "track-err" : undefined}
            className="h-14 min-w-0 flex-1 rounded-full border border-line bg-cream-50 px-6 text-base focus:border-plum-900 focus:bg-white focus:outline-none aria-[invalid=true]:border-berry-500"
          />
          <button type="submit" className="flex h-14 shrink-0 items-center justify-center gap-2 rounded-full bg-wa px-7 font-semibold text-white hover:bg-wa-dark">
            <WhatsAppIcon className="size-5" /> Track on WhatsApp
          </button>
        </div>
        {error && (
          <p id="track-err" role="alert" className="mt-2 text-sm text-berry-700">
            Please enter your order number or phone number.
          </p>
        )}
      </form>

      <ol className="mt-14 grid gap-4 md:grid-cols-4">
        {stages.map(({ Icon, t, d }, i) => (
          <motion.li
            key={t}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.6 }}
            className="relative rounded-[var(--radius-lg)] border border-line bg-white p-6"
          >
            <span className="grid size-12 place-items-center rounded-full bg-gradient-to-br from-berry-50 to-lilac-100 text-berry-600">
              <Icon className="size-5" aria-hidden="true" />
            </span>
            <h3 className="mt-4 font-semibold text-plum-900">
              <span className="mr-1.5 text-ink-faint">{i + 1}.</span>
              {t}
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{d}</p>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}
