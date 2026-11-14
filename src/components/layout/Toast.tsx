"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { CircleCheck, X } from "lucide-react";
import { useEffect } from "react";
import { cleanName } from "@/lib/format";
import { useUI } from "@/store/ui";
import { whatsappLink, defaultWhatsappText } from "@/lib/site";
import { WhatsAppIcon } from "@/components/ui/icons";

export function Toast() {
  const toast = useUI((s) => s.toast);
  const dismiss = useUI((s) => s.dismissToast);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(dismiss, 3200);
    return () => clearTimeout(t);
  }, [toast, dismiss]);

  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-3 bottom-24 z-[90] flex justify-center md:inset-x-auto md:bottom-8 md:left-8">
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 420, damping: 30 }}
            className="pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-[var(--radius-lg)] bg-plum-900 p-3 pr-2 text-white shadow-lift"
            role="status"
          >
            {toast.image ? (
              <span className="relative size-12 shrink-0 overflow-hidden rounded-xl bg-white/10">
                <Image src={toast.image} alt="" fill sizes="48px" className="object-cover" />
              </span>
            ) : (
              <CircleCheck className="size-6 text-peach-300" aria-hidden="true" />
            )}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">{toast.title}</p>
              {toast.body && <p className="truncate text-xs text-white/70">{cleanName(toast.body)}</p>}
            </div>
            <button type="button" onClick={dismiss} aria-label="Dismiss notification" className="grid size-9 shrink-0 place-items-center rounded-full hover:bg-white/10">
              <X className="size-4" aria-hidden="true" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function WhatsAppFab() {
  return (
    <a
      href={whatsappLink(defaultWhatsappText)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="group fixed bottom-5 right-4 z-[60] flex h-14 items-center gap-2 rounded-full bg-wa pl-4 pr-4 text-white shadow-[0_14px_36px_-10px_rgb(31_174_91/0.75)] transition-[padding,transform] duration-500 ease-[var(--ease-out-expo)] hover:-translate-y-0.5 md:bottom-8 md:right-8 max-md:[.has-sticky-cta_&]:bottom-24"
    >
      <span className="absolute inset-0 animate-ping rounded-full bg-wa opacity-20 [animation-duration:2.6s]" aria-hidden="true" />
      <WhatsAppIcon className="relative size-6" />
      <span className="relative hidden max-w-0 overflow-hidden whitespace-nowrap text-sm font-semibold transition-[max-width] duration-500 group-hover:max-w-40 md:inline">Chat with us</span>
    </a>
  );
}
