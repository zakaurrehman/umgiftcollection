"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { site } from "@/lib/site";

export type CartLine = { label: string; value: string };

export type CartItem = {
  id: string;
  slug: string;
  name: string;
  image: string | null;
  qty: number;
  /** Unit price before bulk tiers and without option extras. */
  baseUnit: number;
  /** Sum of add-on and option price deltas, added per unit. */
  extras: number;
  bulkTiers: { minQty: number; price: number }[] | null;
  /** Store's saving per unit (compare-at minus price), if any. */
  savingPerUnit: number;
  lines: CartLine[];
  photoNames: string[];
  addedAt: number;
};

export const itemUnitPrice = (it: CartItem) => {
  const tier = it.bulkTiers ? [...it.bulkTiers].sort((a, b) => b.minQty - a.minQty).find((t) => it.qty >= t.minQty) : null;
  return (tier ? tier.price : it.baseUnit) + it.extras;
};
export const itemTotal = (it: CartItem) => itemUnitPrice(it) * it.qty;

type CartState = {
  items: CartItem[];
  promo: string;
  customer: { name: string; phone: string; city: string; address: string; notes: string };
  add: (item: Omit<CartItem, "addedAt">) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  setPromo: (code: string) => void;
  setCustomer: (c: Partial<CartState["customer"]>) => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      promo: "",
      customer: { name: "", phone: "", city: "", address: "", notes: "" },
      add: (item) =>
        set((s) => {
          const existing = s.items.find((i) => i.id === item.id);
          if (existing) {
            return { items: s.items.map((i) => (i.id === item.id ? { ...i, qty: Math.min(999, i.qty + item.qty) } : i)) };
          }
          return { items: [...s.items, { ...item, addedAt: Date.now() }] };
        }),
      setQty: (id, qty) => set((s) => ({ items: s.items.map((i) => (i.id === id ? { ...i, qty: Math.max(1, Math.min(999, qty)) } : i)) })),
      remove: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      clear: () => set({ items: [], promo: "" }),
      setPromo: (promo) => set({ promo }),
      setCustomer: (c) => set((s) => ({ customer: { ...s.customer, ...c } })),
    }),
    { name: "tcs-cart-v1", storage: createJSONStorage(() => localStorage), version: 1 },
  ),
);

export function cartTotals(items: CartItem[], promoCode: string) {
  const subtotal = items.reduce((n, i) => n + itemTotal(i), 0);
  const savings = items.reduce((n, i) => n + i.savingPerUnit * i.qty, 0);
  const count = items.reduce((n, i) => n + i.qty, 0);
  const promoValid = promoCode.trim().toUpperCase() === site.promo.code;
  const promoDiscount = promoValid ? Math.round((subtotal * site.promo.percent) / 100) : 0;
  const afterPromo = subtotal - promoDiscount;
  const freeDelivery = afterPromo >= site.freeDeliveryThreshold;
  const delivery = items.length === 0 || freeDelivery ? 0 : site.deliveryFee;
  return {
    subtotal,
    savings,
    count,
    promoValid,
    promoDiscount,
    delivery,
    freeDelivery,
    toFreeDelivery: Math.max(0, site.freeDeliveryThreshold - afterPromo),
    total: afterPromo + delivery,
  };
}

/** Photos chosen for customization. Files can't be stored in localStorage, so
 *  they live in memory for this visit and are shared to WhatsApp from the cart. */
type PhotoState = {
  photos: Record<string, File[]>;
  setPhotos: (id: string, files: File[]) => void;
  drop: (id: string) => void;
};
export const usePhotos = create<PhotoState>()((set) => ({
  photos: {},
  setPhotos: (id, files) => set((s) => ({ photos: { ...s.photos, [id]: [...(s.photos[id] || []), ...files] } })),
  drop: (id) =>
    set((s) => {
      const next = { ...s.photos };
      delete next[id];
      return { photos: next };
    }),
}));
