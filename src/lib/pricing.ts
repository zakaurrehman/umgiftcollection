import type { Product, ProductOption } from "./types";

/** Selections keyed by option id: string for choices/text, boolean for add-ons. */
export type Selections = Record<string, string | boolean | undefined>;
export const QUALITY_KEY = "__quality";

type PricedProduct = Pick<Product, "price" | "compareAtPrice" | "options" | "bulkTiers" | "qualityTiers">;

export function isVisible(opt: ProductOption, sel: Selections) {
  if ("showIf" in opt && opt.showIf) return sel[opt.showIf.optId] === opt.showIf.equals;
  return true;
}

/** Options to render, in order, including fields revealed by ticked add-ons. */
export function visibleOptions(options: ProductOption[], sel: Selections) {
  const out: { opt: ProductOption; parent?: string }[] = [];
  for (const opt of options) {
    if (!isVisible(opt, sel)) continue;
    out.push({ opt });
    if (opt.type === "addon" && sel[opt.id] && opt.reveals) {
      for (const r of opt.reveals) if (isVisible(r, sel)) out.push({ opt: r, parent: opt.id });
    }
  }
  return out;
}

export function initialSelections(p: PricedProduct): Selections {
  const sel: Selections = {};
  for (const o of p.options) {
    if (o.type === "chips" && o.default) sel[o.id] = o.default;
    if (o.type === "variant" && o.options[0]) sel[o.id] = o.options[0].value;
  }
  if (p.qualityTiers?.[0]) sel[QUALITY_KEY] = p.qualityTiers[0].label;
  return sel;
}

/** Unit price for the current selections and quantity. */
export function unitPrice(p: PricedProduct, sel: Selections, qty: number) {
  let base = p.price;
  for (const o of p.options) {
    if (o.type === "variant") {
      const v = o.options.find((x) => x.value === sel[o.id]);
      if (v) base = v.price;
    }
  }
  if (p.qualityTiers) {
    const q = p.qualityTiers.find((t) => t.label === sel[QUALITY_KEY]);
    if (q) base = q.price;
  }
  if (p.bulkTiers) {
    const tier = [...p.bulkTiers].sort((a, b) => b.minQty - a.minQty).find((t) => qty >= t.minQty);
    if (tier) base = tier.price;
  }
  let extra = 0;
  for (const o of p.options) {
    if (o.type === "chips" && o.priceDeltas && isVisible(o, sel)) {
      const v = sel[o.id];
      if (typeof v === "string") extra += o.priceDeltas[v] || 0;
    }
    if (o.type === "addon" && sel[o.id]) extra += o.price;
  }
  return base + extra;
}

/** Strike-through price that keeps the store's absolute saving across options. */
export function compareUnitPrice(p: PricedProduct, unit: number) {
  if (!p.compareAtPrice || p.compareAtPrice <= p.price) return null;
  return unit + (p.compareAtPrice - p.price);
}

/** Options the shopper must choose before adding to cart. */
export function missingChoices(p: PricedProduct, sel: Selections) {
  return visibleOptions(p.options, sel)
    .map(({ opt }) => opt)
    .filter((o) => (o.type === "chips" || o.type === "select" || o.type === "variant") && !sel[o.id])
    .map((o) => o.id);
}

/** Human-readable lines describing the selections (for cart + WhatsApp). */
export function describeSelections(p: PricedProduct, sel: Selections, photoCount: Record<string, number> = {}) {
  const lines: { label: string; value: string }[] = [];
  if (p.qualityTiers && sel[QUALITY_KEY]) lines.push({ label: "Quality", value: String(sel[QUALITY_KEY]) });
  for (const { opt } of visibleOptions(p.options, sel)) {
    if (opt.type === "notice") continue;
    if (opt.type === "image") {
      const n = photoCount[opt.id] || 0;
      if (n) lines.push({ label: opt.label, value: `${n} photo${n > 1 ? "s" : ""} (to send on WhatsApp)` });
      continue;
    }
    if (opt.type === "addon") {
      if (sel[opt.id]) lines.push({ label: opt.label, value: `Yes (+Rs ${opt.price})` });
      continue;
    }
    const v = sel[opt.id];
    if (typeof v === "string" && v.trim()) lines.push({ label: opt.label, value: v.trim() });
  }
  return lines;
}

/** Bulk tiers as display rows, e.g. "3+ pieces: Rs 350 each". */
export const bulkRows = (p: PricedProduct) =>
  p.bulkTiers ? [...p.bulkTiers].sort((a, b) => a.minQty - b.minQty) : [];
