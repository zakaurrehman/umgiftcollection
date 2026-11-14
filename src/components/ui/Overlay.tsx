"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/format";

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * Modal surface: drawer from the right/left, a centered dialog, or a top sheet.
 * Handles Escape, scroll lock, focus trap and focus restore.
 */
export function Overlay({
  open,
  onClose,
  label,
  side = "right",
  children,
  className,
}: {
  open: boolean;
  onClose: () => void;
  label: string;
  side?: "right" | "left" | "center" | "top";
  children: ReactNode;
  className?: string;
}) {
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    const sbw = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${sbw}px`;
    const t = setTimeout(() => {
      const first = panel.current?.querySelector<HTMLElement>("[data-autofocus]") || panel.current?.querySelector<HTMLElement>(FOCUSABLE);
      first?.focus();
    }, 60);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && panel.current) {
        const els = Array.from(panel.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => el.offsetParent !== null);
        if (!els.length) return;
        const first = els[0];
        const last = els[els.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
      prev?.focus?.();
    };
  }, [open, onClose]);

  const variants = {
    right: { initial: { x: "100%" }, animate: { x: 0 }, exit: { x: "100%" } },
    left: { initial: { x: "-100%" }, animate: { x: 0 }, exit: { x: "-100%" } },
    top: { initial: { y: "-100%" }, animate: { y: 0 }, exit: { y: "-100%" } },
    center: { initial: { opacity: 0, y: 30, scale: 0.97 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: 20, scale: 0.98 } },
  }[side];

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[80]" role="presentation">
          <motion.div
            className="absolute inset-0 bg-plum-950/55 backdrop-blur-[3px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />
          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-label={label}
            {...variants}
            transition={{ type: "spring", stiffness: 320, damping: 34, mass: 0.9 }}
            className={cn(
              "absolute flex flex-col bg-cream-100 shadow-2xl",
              side === "right" && "inset-y-0 right-0 w-full max-w-[460px]",
              side === "left" && "inset-y-0 left-0 w-full max-w-[400px]",
              side === "top" && "inset-x-0 top-0 max-h-[92dvh]",
              side === "center" && "inset-x-3 bottom-3 top-auto max-h-[92dvh] rounded-[var(--radius-xl)] md:inset-x-auto md:left-1/2 md:top-1/2 md:bottom-auto md:w-[min(1040px,94vw)] md:-translate-x-1/2 md:-translate-y-1/2",
              className,
            )}
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
