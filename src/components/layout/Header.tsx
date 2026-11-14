"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { ArrowRight, ChevronDown, Heart, Menu, Search, ShoppingBag, Users } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { NavGroup } from "@/lib/types";
import { cn } from "@/lib/format";
import { useCart } from "@/store/cart";
import { useHydrated, useUI, useWishlist } from "@/store/ui";
import { LogoMark, Wordmark } from "@/components/ui/Logo";
import { MobileNav } from "./MobileNav";

const quick = [
  { href: "/category/birthday-gifts/", label: "Birthday", hide: "" },
  { href: "/category/anniversary-gifts/", label: "Anniversary", hide: "" },
  { href: "/category/mugs/", label: "Mugs", hide: "max-xl:hidden" },
  { href: "/category/pillows-cushions/", label: "Cushions", hide: "max-xl:hidden" },
  { href: "/category/frames/", label: "Frames", hide: "max-2xl:hidden" },
  { href: "/category/football-jerseys-price-in-pakistan/", label: "Jerseys", hide: "" },
  { href: "/reviews/", label: "Reviews", hide: "max-2xl:hidden" },
  { href: "/track-order/", label: "Track Order", hide: "" },
];

export function Header({ groups, groupImages }: { groups: NavGroup[]; groupImages: (string | null)[] }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mega, setMega] = useState(false);
  const [hover, setHover] = useState<string | null>(null);
  const [active, setActive] = useState(0);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 24));

  const hydrated = useHydrated();
  const count = useCart((s) => s.items.reduce((n, i) => n + i.qty, 0));
  const wishCount = useWishlist((s) => s.items.length);
  const setCart = useUI((s) => s.setCart);
  const setSearch = useUI((s) => s.setSearch);
  const setNav = useUI((s) => s.setNav);

  useEffect(() => {
    if (!mega) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMega(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mega]);

  const openMega = () => {
    clearTimeout(closeTimer.current);
    setMega(true);
  };
  const scheduleClose = () => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setMega(false), 160);
  };

  const g = groups[active];

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 transition-[background-color,box-shadow,border-color] duration-500",
          scrolled || mega ? "border-b border-line/80 bg-cream-100/85 shadow-[0_8px_30px_-20px_rgb(40_21_47/0.35)] backdrop-blur-xl" : "border-b border-transparent bg-cream-100",
        )}
        onMouseLeave={scheduleClose}
      >
        <div className={cn("container-x flex items-center gap-3 transition-[height] duration-500 ease-[var(--ease-out-expo)]", scrolled ? "h-16" : "h-[72px] lg:h-20")}>
          <button type="button" onClick={() => setNav(true)} aria-label="Open menu" className="-ml-2 grid size-11 place-items-center rounded-full text-plum-900 hover:bg-plum-900/5 lg:hidden">
            <Menu className="size-6" aria-hidden="true" />
          </button>

          <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label="UM Gift Collection — home">
            <LogoMark className={cn("transition-all duration-500", scrolled ? "size-10" : "size-11 lg:size-12")} />
            <span className="max-[360px]:hidden">
              <Wordmark />
            </span>
          </Link>

          <nav aria-label="Main" className="ml-4 hidden min-w-0 flex-1 items-center lg:flex xl:ml-6" onMouseLeave={() => setHover(null)}>
            <ul className="flex items-center">
              <li onMouseEnter={() => setHover("shop")}>
                <button
                  type="button"
                  aria-expanded={mega}
                  aria-controls="mega-menu"
                  onClick={() => (mega ? setMega(false) : openMega())}
                  onMouseEnter={openMega}
                  className="relative flex h-10 items-center gap-1 rounded-full px-3.5 text-[0.9rem] font-semibold text-plum-900"
                >
                  {hover === "shop" && <NavPill />}
                  <span className="relative">Shop</span>
                  <ChevronDown className={cn("relative size-4 transition-transform duration-300", mega && "rotate-180")} aria-hidden="true" />
                </button>
              </li>
              {quick.map((q) => {
                const isActive = pathname.startsWith(q.href);
                return (
                  <li key={q.href} className={q.hide} onMouseEnter={() => setHover(q.href)}>
                    <Link
                      href={q.href}
                      onMouseEnter={scheduleClose}
                      aria-current={isActive ? "page" : undefined}
                      className={cn("relative flex h-10 items-center whitespace-nowrap rounded-full px-3 text-[0.9rem] font-medium transition-colors", isActive ? "text-berry-700" : "text-ink-soft hover:text-plum-900")}
                    >
                      {hover === q.href && <NavPill />}
                      <span className="relative">{q.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-0.5 sm:gap-1.5">
            <button
              type="button"
              onClick={() => setSearch(true)}
              className="hidden h-11 items-center gap-2.5 rounded-full border border-line bg-white/70 pl-4 pr-5 text-sm text-ink-faint transition-colors hover:border-plum-900/30 hover:text-ink-soft md:flex 2xl:w-60"
            >
              <Search className="size-4 text-plum-900" aria-hidden="true" />
              <span className="max-2xl:hidden">Search gifts…</span>
              <span className="2xl:hidden">Search</span>
            </button>
            <IconBtn label="Search" onClick={() => setSearch(true)} className="md:hidden">
              <Search className="size-[21px]" aria-hidden="true" />
            </IconBtn>
            <IconBtn label={`Wishlist${hydrated && wishCount ? `, ${wishCount} items` : ""}`} href="/wishlist/" className="max-sm:hidden">
              <Heart className="size-[21px]" aria-hidden="true" />
              {hydrated && wishCount > 0 && <Badge n={wishCount} tone="lilac" />}
            </IconBtn>
            <IconBtn label={`Cart${hydrated && count ? `, ${count} items` : ""}`} onClick={() => setCart(true)}>
              <ShoppingBag className="size-[21px]" aria-hidden="true" />
              {hydrated && count > 0 && <Badge n={count} />}
            </IconBtn>
          </div>
        </div>

        <AnimatePresence>
          {mega && (
            <motion.div
              id="mega-menu"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8, transition: { duration: 0.18 } }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              onMouseEnter={openMega}
              onClick={(e) => {
                if ((e.target as HTMLElement).closest("a")) setMega(false);
              }}
              className="absolute inset-x-0 top-full hidden border-b border-line bg-cream-50 shadow-[0_40px_80px_-40px_rgb(40_21_47/0.45)] backdrop-blur-xl lg:block"
            >
              <div className="container-x grid grid-cols-[260px_1fr_300px] gap-10 py-8">
                <ul className="space-y-0.5 border-r border-line pr-6" role="tablist" aria-orientation="vertical" aria-label="Shop by">
                  {groups.map((grp, i) => (
                    <li key={grp.label}>
                      <button
                        type="button"
                        role="tab"
                        aria-selected={i === active}
                        onMouseEnter={() => setActive(i)}
                        onFocus={() => setActive(i)}
                        onClick={() => setActive(i)}
                        className={cn("relative flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-left text-[0.9rem] font-semibold transition-colors", i === active ? "text-white" : "text-plum-900 hover:bg-plum-900/5")}
                      >
                        {i === active && <motion.span layoutId="mega-tab" className="absolute inset-0 rounded-xl bg-plum-900" transition={{ type: "spring", stiffness: 420, damping: 36 }} />}
                        <span className="relative">{grp.label}</span>
                        <ArrowRight className={cn("relative size-4 transition-all", i === active ? "translate-x-0 opacity-100" : "-translate-x-1 opacity-0")} aria-hidden="true" />
                      </button>
                    </li>
                  ))}
                </ul>
                <div role="tabpanel" aria-label={g?.label}>
                  <p className="eyebrow mb-4">{g?.label}</p>
                  <motion.ul key={active} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }} className="grid grid-cols-2 gap-x-6 gap-y-1">
                    {g?.items.map((it) => (
                      <li key={it.slug}>
                        <Link href={`/category/${it.slug}/`} className="group/l flex items-baseline justify-between gap-3 rounded-lg py-2 text-[0.95rem] text-ink transition-colors hover:text-berry-700">
                          <span className="relative">
                            {it.label}
                            <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-berry-600 transition-all duration-300 group-hover/l:w-full" />
                          </span>
                          <span className="text-xs tabular-nums text-ink-faint">{it.count}</span>
                        </Link>
                      </li>
                    ))}
                  </motion.ul>
                </div>
                <div className="flex flex-col gap-3">
                  {g?.items[0] && (
                    <Link href={`/category/${g.items[0].slug}/`} className="group/f relative aspect-[4/3] overflow-hidden rounded-[var(--radius-lg)] bg-plum-900">
                      {groupImages[active] && <Image key={groupImages[active]} src={groupImages[active]!} alt="" fill sizes="300px" className="object-cover opacity-90 transition-transform duration-700 group-hover/f:scale-105" />}
                      <span className="absolute inset-0 bg-gradient-to-t from-plum-950/85 via-plum-950/10 to-transparent" />
                      <span className="absolute inset-x-4 bottom-4 text-white">
                        <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-peach-300">Featured</span>
                        <span className="display mt-1 block text-xl">{g.items[0].label}</span>
                      </span>
                    </Link>
                  )}
                  <Link href="/custom-football-jerseys-bulk/" className="flex items-center gap-3 rounded-[var(--radius-md)] border border-line bg-white p-3.5 text-sm transition-colors hover:border-plum-900/30">
                    <span className="grid size-10 place-items-center rounded-full bg-lilac-100 text-plum-800">
                      <Users className="size-5" aria-hidden="true" />
                    </span>
                    <span>
                      <span className="block font-semibold text-plum-900">Team kits in bulk</span>
                      <span className="text-ink-soft">Football & cricket from Rs 1,000</span>
                    </span>
                  </Link>
                  <Link href="/shop/" className="flex items-center justify-between rounded-[var(--radius-md)] bg-berry-600 px-4 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-berry-700">
                    Browse all products <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      <MobileNav groups={groups} />
    </>
  );
}

function NavPill() {
  return <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-full bg-plum-900/[0.06]" transition={{ type: "spring", stiffness: 500, damping: 40 }} />;
}

function Badge({ n, tone = "berry" }: { n: number; tone?: "berry" | "lilac" }) {
  return (
    <motion.span
      key={n}
      initial={{ scale: 0.4 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 600, damping: 15 }}
      className={cn("absolute right-0.5 top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full px-1 text-[0.65rem] font-bold", tone === "berry" ? "bg-berry-600 text-white" : "bg-lilac-300 text-plum-900")}
      aria-hidden="true"
    >
      {n > 99 ? "99+" : n}
    </motion.span>
  );
}

function IconBtn({ label, children, onClick, href, className }: { label: string; children: React.ReactNode; onClick?: () => void; href?: string; className?: string }) {
  const cls = cn("relative grid size-11 place-items-center rounded-full text-plum-900 transition-colors hover:bg-plum-900/5", className);
  return href ? (
    <Link href={href} aria-label={label} className={cls}>
      {children}
    </Link>
  ) : (
    <button type="button" onClick={onClick} aria-label={label} className={cls}>
      {children}
    </button>
  );
}
