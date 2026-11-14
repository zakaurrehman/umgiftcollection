"use client";

import Link from "next/link";
import { AnimatePresence } from "motion/react";
import { ArrowLeft, Check, Gift, ImageIcon, Info, Lock, Share2, Tag } from "lucide-react";
import { useState } from "react";
import { site } from "@/lib/site";
import { formatPrice } from "@/lib/format";
import { orderLink, orderMessage } from "@/lib/whatsapp";
import { cartTotals, useCart, usePhotos } from "@/store/cart";
import { useHydrated, useUI } from "@/store/ui";
import { CartLineItem, FreeDeliveryBar } from "@/components/cart/CartLineItem";
import { buttonClass } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/icons";

export function CartView() {
  const hydrated = useHydrated();
  const items = useCart((s) => s.items);
  const promo = useCart((s) => s.promo);
  const setPromo = useCart((s) => s.setPromo);
  const customer = useCart((s) => s.customer);
  const setCustomer = useCart((s) => s.setCustomer);
  const clear = useCart((s) => s.clear);
  const photos = usePhotos((s) => s.photos);
  const notify = useUI((s) => s.notify);
  const [code, setCode] = useState(promo);
  const [preview, setPreview] = useState(false);

  if (!hydrated) return <div className="h-96" />;
  const t = cartTotals(items, promo);
  const heldFiles = Object.values(photos).flat();
  const canShareFiles = typeof navigator !== "undefined" && !!navigator.canShare && heldFiles.length > 0 && navigator.canShare({ files: heldFiles });
  const pendingPhotoCount = items.reduce((n, i) => n + i.photoNames.length, 0);

  const sharePhotos = async () => {
    try {
      await navigator.share({ files: heldFiles, title: `${site.name} order photos`, text: "Photos for my order" });
    } catch {
      /* cancelled */
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-[var(--radius-2xl)] border border-dashed border-line bg-white/60 px-6 py-24 text-center">
        <span className="grid size-20 place-items-center rounded-full bg-gradient-to-br from-berry-100 to-lilac-100 text-berry-600">
          <Gift className="size-9" aria-hidden="true" />
        </span>
        <h2 className="display text-3xl text-plum-900">Your cart is empty</h2>
        <p className="max-w-sm text-ink-soft">Browse our collections and find the perfect personalized gift!</p>
        <Link href="/shop/" className={buttonClass("primary", "lg", "mt-3")}>
          Start shopping
        </Link>
      </div>
    );
  }

  const field = "h-12 w-full rounded-[var(--radius-md)] border border-line bg-white px-4 text-[0.95rem] focus:border-plum-900 focus:shadow-[0_0_0_4px_rgb(197_168_255/0.35)] focus:outline-none";

  return (
    <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:gap-12">
      <div className="min-w-0 space-y-6">
        <div className="rounded-[var(--radius-xl)] border border-line bg-white p-5 md:p-7">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-lg font-bold text-plum-900">
              {t.count} item{t.count > 1 ? "s" : ""}
            </h2>
            <button
              type="button"
              onClick={() => {
                if (confirm("Remove all items from your cart?")) clear();
              }}
              className="text-sm font-medium text-ink-faint hover:text-berry-700"
            >
              Clear cart
            </button>
          </div>
          <ul className="divide-y divide-line">
            <AnimatePresence initial={false}>
              {items.map((it) => (
                <CartLineItem key={it.id} item={it} roomy />
              ))}
            </AnimatePresence>
          </ul>
        </div>

        {pendingPhotoCount > 0 && (
          <div className="flex gap-4 rounded-[var(--radius-xl)] border border-lilac-200 bg-lilac-50 p-5 md:p-6">
            <ImageIcon className="mt-0.5 size-6 shrink-0 text-lilac-500" aria-hidden="true" />
            <div className="text-sm leading-relaxed text-plum-900">
              <p className="font-semibold">Your customization photos</p>
              <p className="mt-1 text-ink-soft">
                Photos never leave your device until you send them. After you tap &ldquo;Order on WhatsApp&rdquo;, send your {pendingPhotoCount} photo{pendingPhotoCount > 1 ? "s" : ""} in the same chat so we can design your gift.
              </p>
              {canShareFiles && (
                <button type="button" onClick={sharePhotos} className="mt-3 inline-flex h-10 items-center gap-2 rounded-full bg-plum-900 px-4 font-semibold text-white">
                  <Share2 className="size-4" aria-hidden="true" /> Share {heldFiles.length} photo{heldFiles.length > 1 ? "s" : ""} to WhatsApp
                </button>
              )}
            </div>
          </div>
        )}

        <form className="rounded-[var(--radius-xl)] border border-line bg-white p-5 md:p-7" onSubmit={(e) => e.preventDefault()}>
          <h2 className="text-lg font-bold text-plum-900">Delivery details</h2>
          <p className="mt-1 text-sm text-ink-soft">Optional. Fill these in to save time; they&rsquo;re added to your WhatsApp message.</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-plum-900">Full name</span>
              <input className={field} autoComplete="name" value={customer.name} onChange={(e) => setCustomer({ name: e.target.value })} />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-plum-900">Phone</span>
              <input className={field} type="tel" autoComplete="tel" inputMode="tel" placeholder="03XX XXXXXXX" value={customer.phone} onChange={(e) => setCustomer({ phone: e.target.value })} />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-plum-900">City</span>
              <input className={field} autoComplete="address-level2" value={customer.city} onChange={(e) => setCustomer({ city: e.target.value })} />
            </label>
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-sm font-semibold text-plum-900">Address</span>
              <input className={field} autoComplete="street-address" value={customer.address} onChange={(e) => setCustomer({ address: e.target.value })} />
            </label>
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-sm font-semibold text-plum-900">Order notes</span>
              <textarea rows={3} className={`${field} h-auto py-3`} placeholder="Delivery date, gift wrapping, anything else…" value={customer.notes} onChange={(e) => setCustomer({ notes: e.target.value })} />
            </label>
          </div>
        </form>
        <Link href="/shop/" className="inline-flex items-center gap-2 text-sm font-semibold text-plum-900 hover:text-berry-700">
          <ArrowLeft className="size-4" aria-hidden="true" /> Continue shopping
        </Link>
      </div>

      <aside className="lg:sticky lg:top-28 lg:self-start" aria-label="Order summary">
        <div className="overflow-hidden rounded-[var(--radius-xl)] border border-line bg-white shadow-soft">
          <div className="border-b border-line bg-cream-50 p-5 md:p-6">
            <FreeDeliveryBar remaining={t.toFreeDelivery} />
          </div>
          <div className="space-y-5 p-5 md:p-6">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setPromo(code.trim());
                if (code.trim().toUpperCase() === site.promo.code) notify({ title: `Code ${site.promo.code} applied`, body: site.promo.label });
              }}
            >
              <label htmlFor="promo" className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-plum-900">
                <Tag className="size-4 text-berry-600" aria-hidden="true" /> Promo code
              </label>
              <div className="flex gap-2">
                <input id="promo" value={code} onChange={(e) => setCode(e.target.value)} placeholder="e.g. TCS10" className="h-11 min-w-0 flex-1 rounded-full border border-line bg-white px-4 text-sm uppercase focus:border-plum-900 focus:outline-none" />
                <button type="submit" className="h-11 shrink-0 rounded-full bg-plum-900 px-5 text-sm font-semibold text-white">
                  Apply
                </button>
              </div>
              {promo && (
                <p className={`mt-2 flex items-center gap-1.5 text-xs ${t.promoValid ? "text-wa-dark" : "text-berry-700"}`} role="status">
                  {t.promoValid ? (
                    <>
                      <Check className="size-3.5" aria-hidden="true" /> {site.promo.label}, confirmed by our team on WhatsApp.
                    </>
                  ) : (
                    "That code isn't valid."
                  )}
                </p>
              )}
            </form>

            <dl className="space-y-2.5 border-t border-line pt-5 text-sm">
              <Row label="Subtotal" value={formatPrice(t.subtotal)} />
              {t.promoValid && <Row label={`Promo ${site.promo.code}`} value={`−${formatPrice(t.promoDiscount)}`} tone="berry" />}
              <Row label="Delivery" value={t.delivery ? formatPrice(t.delivery) : "Free"} />
              <div className="flex items-baseline justify-between border-t border-line pt-3">
                <dt className="font-semibold text-plum-900">Total</dt>
                <dd className="text-2xl font-bold text-plum-900">{formatPrice(t.total)}</dd>
              </div>
              {t.savings > 0 && <p className="text-right text-xs font-semibold text-wa-dark">You&rsquo;re saving {formatPrice(t.savings)} on sale prices</p>}
            </dl>

            <a href={orderLink(items, promo, customer)} target="_blank" rel="noopener noreferrer" className={buttonClass("wa", "lg", "w-full")}>
              <WhatsAppIcon className="size-5" /> Order on WhatsApp
            </a>
            <button type="button" onClick={() => setPreview(!preview)} aria-expanded={preview} className="w-full text-center text-xs font-semibold text-ink-soft underline-offset-2 hover:underline">
              {preview ? "Hide" : "Preview"} the message we&rsquo;ll receive
            </button>
            {preview && <pre className="max-h-72 overflow-auto whitespace-pre-wrap rounded-[var(--radius-md)] bg-cream-100 p-4 text-xs leading-relaxed text-ink-soft">{orderMessage(items, promo, customer)}</pre>}

            <ul className="space-y-2 border-t border-line pt-5 text-xs leading-relaxed text-ink-soft">
              <li className="flex gap-2">
                <Lock className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" /> Rs {site.advancePayment} is charged in advance to confirm your order.
              </li>
              <li className="flex gap-2">
                <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" /> We confirm pricing, customization and delivery with you on WhatsApp. Payment: {site.paymentMethods}.
              </li>
            </ul>
          </div>
        </div>
      </aside>
    </div>
  );
}

function Row({ label, value, tone }: { label: string; value: string; tone?: "berry" }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-ink-soft">{label}</dt>
      <dd className={tone === "berry" ? "font-semibold text-berry-700" : "font-semibold text-plum-900"}>{value}</dd>
    </div>
  );
}
