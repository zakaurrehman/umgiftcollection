"use client";

import { animate, motion, useInView, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/format";

const EASE = [0.16, 1, 0.3, 1] as const;

/** Fade-and-rise when scrolled into view. */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article" | "span";
}) {
  const M = motion[as];
  return (
    <M
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.8, delay, ease: EASE }}
    >
      {children}
    </M>
  );
}

/** Staggers direct children (each child should be a <StaggerItem>). */
export function Stagger({ children, className, gap = 0.07 }: { children: ReactNode; className?: string; gap?: number }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: gap } } }}
    >
      {children}
    </motion.div>
  );
}
export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      variants={{ hidden: { opacity: 0, y: 22 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } } }}
    >
      {children}
    </motion.div>
  );
}

/** Word-by-word masked reveal for headlines (adapted from 21st.dev text reveal).
 *  Pure CSS so it plays from first paint, before hydration. */
export function WordReveal({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.12em] align-bottom">
          <span className="anim-word" style={{ ["--d" as string]: `${delay + i * 0.06}s` }}>
            {w}
            {i < words.length - 1 ? " " : ""}
          </span>
        </span>
      ))}
    </span>
  );
}

/** Element that leans toward the pointer (adapted from 21st.dev magnetic button). */
export function Magnetic({ children, strength = 0.28, className }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 18, mass: 0.4 });
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 18, mass: 0.4 });
  return (
    <motion.div
      ref={ref}
      className={cn("inline-flex", className)}
      style={{ x, y }}
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== "mouse" || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - r.left - r.width / 2) * strength);
        y.set((e.clientY - r.top - r.height / 2) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

/** Counts up to a verified figure when it enters the viewport. */
export function Counter({ to, decimals = 0, suffix = "", className }: { to: number; decimals?: number; suffix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const reduce = useReducedMotion();
  const [val, setVal] = useState(reduce ? to : 0);
  useEffect(() => {
    if (!inView || reduce) return;
    const c = animate(0, to, { duration: 1.8, ease: EASE, onUpdate: setVal });
    return () => c.stop();
  }, [inView, to, reduce]);
  const fmt = (n: number) => n.toLocaleString("en-PK", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix;
  return (
    <span ref={ref} className={className}>
      <span className="sr-only">{fmt(to)}</span>
      <span aria-hidden="true">{fmt(val)}</span>
    </span>
  );
}
