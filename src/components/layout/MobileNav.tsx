"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoMark, Wordmark } from "@/components/ui/Logo";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, Heart, Package, Phone, Search, Star, Users, X, BookOpen, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import type { NavGroup } from "@/lib/types";
import { cn } from "@/lib/format";
import { site, whatsappLink, defaultWhatsappText } from "@/lib/site";
import { useUI } from "@/store/ui";
import { Overlay } from "@/components/ui/Overlay";
import { SocialIcon, WhatsAppIcon } from "@/components/ui/icons";

const featured = [
  { href: "/category/birthday-gifts/", label: "Birthday Gifts" },
  { href: "/category/anniversary-gifts/", label: "Anniversary Gifts" },
  { href: "/category/marriage-gifts/", label: "Marriage Gifts" },
  { href: "/category/mugs/", label: "Customized Mugs" },
  { href: "/category/pillows-cushions/", label: "Pillows & Cushions" },
  { href: "/category/frames/", label: "Customized Frames" },
  { href: "/category/football-jerseys-price-in-pakistan/", label: "Football Jerseys" },
  { href: "/category/customize-gifts-under-1000/", label: "Gifts Under Rs 1000" },
];

const help = [
  { href: "/custom-football-jerseys-bulk/", label: "Team Kits (Bulk)", icon: Users },
  { href: "/reviews/", label: "Reviews", icon: Star },
  { href: "/how-to-order/", label: "How to Order", icon: BookOpen },
  { href: "/track-order/", label: "Track Order", icon: Package },
  { href: "/return-policy/", label: "Return & Refund Policy", icon: RotateCcw },
  { href: "/wishlist/", label: "Wishlist", icon: Heart },
];

export function MobileNav({ groups }: { groups: NavGroup[] }) {
  const open = useUI((s) => s.navOpen);
  const setNav = useUI((s) => s.setNav);
  const setSearch = useUI((s) => s.setSearch);
  const pathname = usePathname();
  const [expanded, setExpanded] = useState<number | null>(null);
  const close = () => setNav(false);
  useEffect(() => setNav(false), [pathname, setNav]);

  return (
    <Overlay open={open} onClose={close} label="Menu" side="left">
      <div className="flex items-center justify-between border-b border-line px-4 py-3">
        <Link href="/" onClick={close} className="flex items-center gap-2.5">
          <LogoMark className="size-10" />
          <Wordmark compact />
        </Link>
        <button type="button" onClick={close} aria-label="Close menu" className="grid size-11 place-items-center rounded-full hover:bg-cream-200">
          <X className="size-5" aria-hidden="true" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-8 pt-4">
        <button
          type="button"
          onClick={() => setSearch(true)}
          className="flex h-12 w-full items-center gap-3 rounded-full border border-line bg-white px-4 text-left text-ink-faint"
        >
          <Search className="size-[18px] text-plum-900" aria-hidden="true" /> Search mugs, frames, lamps…
        </button>

        <p className="eyebrow mb-3 mt-7">Popular</p>
        <ul className="grid grid-cols-2 gap-2">
          {featured.map((f) => (
            <li key={f.href}>
              <Link href={f.href} onClick={close} className="flex min-h-12 items-center rounded-[var(--radius-md)] bg-white px-3.5 py-2.5 text-sm font-semibold text-plum-900 shadow-[0_0_0_1px_var(--color-line)] active:scale-[0.98]">
                {f.label}
              </Link>
            </li>
          ))}
        </ul>

        <p className="eyebrow mb-2 mt-8">Shop by</p>
        <ul className="divide-y divide-line">
          {groups.map((g, i) => (
            <li key={g.label}>
              <button
                type="button"
                aria-expanded={expanded === i}
                onClick={() => setExpanded(expanded === i ? null : i)}
                className="flex min-h-13 w-full items-center justify-between py-3.5 text-left font-semibold text-plum-900"
              >
                {g.label}
                <ChevronDown className={cn("size-5 transition-transform duration-300", expanded === i && "rotate-180")} aria-hidden="true" />
              </button>
              <AnimatePresence initial={false}>
                {expanded === i && (
                  <motion.ul initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }} className="overflow-hidden">
                    {g.items.map((it) => (
                      <li key={it.slug}>
                        <Link href={`/category/${it.slug}/`} onClick={close} className="flex min-h-11 items-center justify-between py-2 pl-3 text-[0.95rem] text-ink-soft hover:text-berry-700">
                          {it.label}
                          <span className="text-xs text-ink-faint">{it.count}</span>
                        </Link>
                      </li>
                    ))}
                    <li className="h-3" />
                  </motion.ul>
                )}
              </AnimatePresence>
            </li>
          ))}
        </ul>

        <ul className="mt-6 space-y-1">
          {help.map(({ href, label, icon: Icon }) => (
            <li key={href}>
              <Link href={href} onClick={close} className="flex min-h-11 items-center gap-3 rounded-xl px-2 text-[0.95rem] text-plum-900 hover:bg-white">
                <Icon className="size-[18px] text-berry-600" aria-hidden="true" /> {label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-8 grid grid-cols-2 gap-2">
          <a href={whatsappLink(defaultWhatsappText)} target="_blank" rel="noopener noreferrer" className="flex h-12 items-center justify-center gap-2 rounded-full bg-wa font-semibold text-white">
            <WhatsAppIcon className="size-5" /> WhatsApp
          </a>
          <a href={`tel:+${site.whatsappNumber}`} className="flex h-12 items-center justify-center gap-2 rounded-full bg-plum-900 font-semibold text-white">
            <Phone className="size-[18px]" aria-hidden="true" /> Call
          </a>
        </div>
        <p className="mt-3 text-center text-sm text-ink-soft">
          {site.phoneDisplay} · {site.address}
        </p>
        <ul className="mt-5 flex justify-center gap-2">
          {site.socials.map((s) => (
            <li key={s.id}>
              <a href={s.url} target="_blank" rel="noopener noreferrer" aria-label={`${site.name} on ${s.label}`} className="grid size-11 place-items-center rounded-full border border-line bg-white text-plum-900 hover:bg-plum-900 hover:text-white">
                <SocialIcon id={s.id} className="size-[18px]" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </Overlay>
  );
}
