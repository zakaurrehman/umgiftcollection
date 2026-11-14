"use client";

import { useSyncExternalStore } from "react";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CardProduct } from "@/lib/types";

type UIState = {
  cartOpen: boolean;
  searchOpen: boolean;
  navOpen: boolean;
  quickView: string | null;
  toast: { id: number; title: string; body?: string; image?: string | null } | null;
  setCart: (v: boolean) => void;
  setSearch: (v: boolean) => void;
  setNav: (v: boolean) => void;
  openQuickView: (slug: string | null) => void;
  notify: (t: { title: string; body?: string; image?: string | null }) => void;
  dismissToast: () => void;
};

export const useUI = create<UIState>()((set) => ({
  cartOpen: false,
  searchOpen: false,
  navOpen: false,
  quickView: null,
  toast: null,
  setCart: (cartOpen) => set({ cartOpen, searchOpen: false, navOpen: false }),
  setSearch: (searchOpen) => set({ searchOpen, cartOpen: false, navOpen: false }),
  setNav: (navOpen) => set({ navOpen }),
  openQuickView: (quickView) => set({ quickView }),
  notify: (t) => set({ toast: { id: Date.now(), ...t } }),
  dismissToast: () => set({ toast: null }),
}));

type WishState = {
  items: CardProduct[];
  toggle: (p: CardProduct) => boolean;
  has: (slug: string) => boolean;
  remove: (slug: string) => void;
};

export const useWishlist = create<WishState>()(
  persist(
    (set, get) => ({
      items: [],
      toggle: (p) => {
        const on = get().items.some((i) => i.slug === p.slug);
        set({ items: on ? get().items.filter((i) => i.slug !== p.slug) : [p, ...get().items] });
        return !on;
      },
      has: (slug) => get().items.some((i) => i.slug === slug),
      remove: (slug) => set({ items: get().items.filter((i) => i.slug !== slug) }),
    }),
    { name: "tcs-wishlist-v1", storage: createJSONStorage(() => localStorage) },
  ),
);

/** True after the first client render, so persisted state never causes a hydration mismatch. */
const noopSubscribe = () => () => {};
export function useHydrated() {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}
