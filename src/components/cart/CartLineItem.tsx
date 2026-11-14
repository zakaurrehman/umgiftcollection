"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { ImageIcon, Trash2, Truck } from "lucide-react";
import { cleanName, cn, formatPrice } from "@/lib/format";
import { site } from "@/lib/site";
import { itemTotal, itemUnitPrice, useCart, usePhotos, type CartItem } from "@/store/cart";
import { QtyStepper } from "@/components/product/Customizer";

export function CartLineItem({ item, onNavigate, roomy }: { item: CartItem; onNavigate?: () => void; roomy?: boolean }) {
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const dropPhotos = usePhotos((s) => s.drop);
  const held = usePhotos((s) => s.photos[item.id]?.length || 0);
  const name = cleanName(item.name);
  const href = `/product/${item.slug}/`;

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 40, transition: { duration: 0.25 } }}
      className={cn("flex gap-4", roomy ? "py-6" : "py-5")}
    >
      <Link href={href} onClick={onNavigate} className={cn("relative shrink-0 overflow-hidden rounded-[var(--radius-md)] bg-cream-200", roomy ? "size-28" : "size-[88px]")}>
        {item.image && <Image src={item.image} alt={name} fill sizes="112px" className="object-cover" />}
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <Link href={href} onClick={onNavigate} className="line-clamp-2 text-[0.95rem] font-semibold leading-snug text-plum-900 hover:text-berry-700">
            {name}
          </Link>
          <button
            type="button"
            onClick={() => {
              remove(item.id);
              dropPhotos(item.id);
            }}
            aria-label={`Remove ${name} from cart`}
            className="-mr-2 -mt-1.5 grid size-10 shrink-0 place-items-center rounded-full text-ink-faint transition-colors hover:bg-berry-50 hover:text-berry-700"
          >
            <Trash2 className="size-4" aria-hidden="true" />
          </button>
        </div>
        {item.lines.length > 0 && (
          <dl className="mt-1.5 space-y-0.5 text-[0.8rem] leading-snug text-ink-soft">
            {item.lines.map((l) => (
              <div key={l.label} className="flex gap-1.5">
                <dt className="shrink-0 text-ink-faint">{l.label}:</dt>
                <dd className="min-w-0 break-words">{l.value}</dd>
              </div>
            ))}
          </dl>
        )}
        {item.photoNames.length > 0 && (
          <p className={cn("mt-2 inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium", held ? "bg-lilac-100 text-plum-800" : "bg-peach-100 text-plum-900")}>
            <ImageIcon className="size-3.5" aria-hidden="true" />
            {held ? `${held} photo${held > 1 ? "s" : ""} ready to send` : `${item.photoNames.length} photo${item.photoNames.length > 1 ? "s" : ""} — send on WhatsApp`}
          </p>
        )}
        <div className="mt-auto flex items-end justify-between gap-3 pt-3">
          <QtyStepper value={item.qty} onChange={(n) => setQty(item.id, n)} small />
          <div className="text-right">
            <p className="font-bold text-plum-900">{formatPrice(itemTotal(item))}</p>
            {item.qty > 1 && <p className="text-xs text-ink-faint">{formatPrice(itemUnitPrice(item))} each</p>}
          </div>
        </div>
      </div>
    </motion.li>
  );
}

export function FreeDeliveryBar({ remaining }: { remaining: number }) {
  const pct = Math.min(100, ((site.freeDeliveryThreshold - remaining) / site.freeDeliveryThreshold) * 100);
  return (
    <div>
      <p className="mb-2 flex items-center gap-2 text-sm text-plum-900">
        <Truck className="size-4 text-berry-600" aria-hidden="true" />
        {remaining > 0 ? (
          <span>
            Add <strong>{formatPrice(remaining)}</strong> more for <strong>free delivery</strong>
          </span>
        ) : (
          <span className="font-semibold">You&rsquo;ve unlocked free delivery across Pakistan</span>
        )}
      </p>
      <div className="h-2 overflow-hidden rounded-full bg-cream-300" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(pct)} aria-label="Progress to free delivery">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-berry-500 via-lilac-300 to-peach-300"
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </div>
  );
}
