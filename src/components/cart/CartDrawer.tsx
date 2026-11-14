"use client";

import Link from "next/link";
import { AnimatePresence } from "motion/react";
import { ArrowRight, Gift, ShoppingBag, X } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { orderLink } from "@/lib/whatsapp";
import { cartTotals, useCart } from "@/store/cart";
import { useHydrated, useUI } from "@/store/ui";
import { Overlay } from "@/components/ui/Overlay";
import { buttonClass } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/icons";
import { CartLineItem, FreeDeliveryBar } from "./CartLineItem";

export function CartDrawer() {
  const open = useUI((s) => s.cartOpen);
  const setCart = useUI((s) => s.setCart);
  const hydrated = useHydrated();
  const items = useCart((s) => s.items);
  const promo = useCart((s) => s.promo);
  const customer = useCart((s) => s.customer);
  const list = hydrated ? items : [];
  const t = cartTotals(list, promo);
  const close = () => setCart(false);

  return (
    <Overlay open={open} onClose={close} label="Shopping cart">
      <header className="flex items-center justify-between border-b border-line px-5 py-4">
        <h2 className="flex items-center gap-2.5 text-lg font-bold text-plum-900">
          <ShoppingBag className="size-5" aria-hidden="true" /> Your cart
          {t.count > 0 && <span className="rounded-full bg-berry-600 px-2 py-0.5 text-xs font-bold text-white">{t.count}</span>}
        </h2>
        <button type="button" onClick={close} aria-label="Close cart" className="grid size-11 place-items-center rounded-full hover:bg-cream-200">
          <X className="size-5" aria-hidden="true" />
        </button>
      </header>

      {list.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
          <span className="grid size-20 place-items-center rounded-full bg-gradient-to-br from-berry-100 to-lilac-100 text-berry-600">
            <Gift className="size-9" aria-hidden="true" />
          </span>
          <p className="display text-2xl text-plum-900">Your cart is empty</p>
          <p className="text-sm text-ink-soft">Browse our collections and find the perfect personalized gift.</p>
          <Link href="/shop/" onClick={close} className={buttonClass("primary", "md", "mt-2")}>
            Start shopping <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      ) : (
        <>
          <div className="border-b border-line bg-white/60 px-5 py-4">
            <FreeDeliveryBar remaining={t.toFreeDelivery} />
          </div>
          <ul className="flex-1 divide-y divide-line overflow-y-auto px-5">
            <AnimatePresence initial={false}>
              {list.map((it) => (
                <CartLineItem key={it.id} item={it} onNavigate={close} />
              ))}
            </AnimatePresence>
          </ul>
          <footer className="space-y-3 border-t border-line bg-white px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4">
            <dl className="space-y-1.5 text-sm">
              <div className="flex justify-between text-ink-soft">
                <dt>Subtotal</dt>
                <dd className="font-semibold text-plum-900">{formatPrice(t.subtotal)}</dd>
              </div>
              <div className="flex justify-between text-ink-soft">
                <dt>Delivery</dt>
                <dd className="font-semibold text-plum-900">{t.delivery ? formatPrice(t.delivery) : "Free"}</dd>
              </div>
              {t.savings > 0 && <p className="text-xs font-semibold text-wa-dark">You&rsquo;re saving {formatPrice(t.savings)} on sale prices</p>}
            </dl>
            <div className="grid grid-cols-2 gap-2.5">
              <Link href="/cart/" onClick={close} className={buttonClass("outline", "md", "px-3")}>
                View cart
              </Link>
              <a href={orderLink(list, promo, customer)} target="_blank" rel="noopener noreferrer" className={buttonClass("wa", "md", "px-3")}>
                <WhatsAppIcon className="size-5" /> Order · {formatPrice(t.total)}
              </a>
            </div>
            <p className="text-center text-xs text-ink-faint">Add delivery details and a promo code on the cart page.</p>
          </footer>
        </>
      )}
    </Overlay>
  );
}
