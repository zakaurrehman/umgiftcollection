"use client";

import { motion, useScroll, useSpring } from "motion/react";
import { MessageCircle, MousePointerClick, Palette, ShoppingBag } from "lucide-react";
import { useRef } from "react";

const icons = [MousePointerClick, Palette, ShoppingBag, MessageCircle];

/** Four-step timeline; the connecting line draws as you scroll. */
export function HowToOrder({ steps }: { steps: { title: string; text: string }[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 60%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <div ref={ref} className="relative">
      <div aria-hidden="true" className="absolute left-[27px] top-6 bottom-6 w-px bg-line md:left-[12%] md:right-[12%] md:top-[27px] md:bottom-auto md:h-px md:w-auto">
        <motion.div style={{ scaleX: progress }} className="hidden h-px origin-left bg-gradient-to-r from-berry-500 via-lilac-300 to-peach-300 md:block" />
        <motion.div style={{ scaleY: progress }} className="h-full w-px origin-top bg-gradient-to-b from-berry-500 via-lilac-300 to-peach-300 md:hidden" />
      </div>
      <ol className="relative grid gap-5 md:grid-cols-4 md:gap-6">
      {steps.map((s, i) => {
        const Icon = icons[i];
        return (
          <motion.li
            key={s.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.7, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex gap-5 md:flex-col md:items-center md:text-center"
          >
            <span className="relative z-10 grid size-14 shrink-0 place-items-center rounded-full bg-plum-900 text-white shadow-[0_0_0_6px_var(--color-cream-100)]">
              <Icon className="size-6" aria-hidden="true" />
              <span className="absolute -right-1 -top-1 grid size-6 place-items-center rounded-full bg-berry-600 text-xs font-bold">{i + 1}</span>
            </span>
            <div className="pt-1 md:pt-3">
              <h3 className="text-lg font-semibold text-plum-900">{s.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-soft md:mx-auto md:max-w-[240px]">{s.text}</p>
            </div>
          </motion.li>
        );
      })}
      </ol>
    </div>
  );
}
