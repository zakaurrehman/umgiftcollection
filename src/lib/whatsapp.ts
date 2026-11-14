import { site, whatsappLink } from "./site";
import { cleanName, formatPrice } from "./format";
import { cartTotals, itemTotal, itemUnitPrice, type CartItem, type useCart } from "@/store/cart";

type Customer = ReturnType<typeof useCart.getState>["customer"];

/** Builds the order message sent to the store's WhatsApp, matching the
 *  original flow: the cart is reviewed, then confirmed on WhatsApp. */
export function orderMessage(items: CartItem[], promo: string, customer: Customer) {
  const t = cartTotals(items, promo);
  const out: string[] = [`Hi ${site.name}! I'd like to place an order 🎁`, ""];

  items.forEach((it, i) => {
    out.push(`*${i + 1}. ${cleanName(it.name)}*`);
    out.push(`Qty: ${it.qty} × ${formatPrice(itemUnitPrice(it))} = ${formatPrice(itemTotal(it))}`);
    for (const l of it.lines) out.push(`• ${l.label}: ${l.value}`);
    out.push(`${site.url}/product/${it.slug}/`);
    out.push("");
  });

  out.push(`Subtotal: ${formatPrice(t.subtotal)}`);
  if (t.promoValid) out.push(`Promo ${site.promo.code} (${site.promo.label}): −${formatPrice(t.promoDiscount)}`);
  out.push(`Delivery: ${t.delivery === 0 ? "FREE" : formatPrice(t.delivery)}`);
  out.push(`*Total: ${formatPrice(t.total)}*`);

  const photos = items.reduce((n, i) => n + i.photoNames.length, 0);
  if (photos) {
    out.push("");
    out.push(`📷 I have ${photos} photo${photos > 1 ? "s" : ""} for customization and will send ${photos > 1 ? "them" : "it"} in this chat.`);
  }

  const info = [
    ["Name", customer.name],
    ["Phone", customer.phone],
    ["City", customer.city],
    ["Address", customer.address],
    ["Notes", customer.notes],
  ].filter(([, v]) => v.trim());
  if (info.length) {
    out.push("", "*My details*");
    for (const [k, v] of info) out.push(`${k}: ${v.trim()}`);
  }
  return out.join("\n");
}

export const orderLink = (items: CartItem[], promo: string, customer: Customer) =>
  whatsappLink(orderMessage(items, promo, customer));

/** Single product "Order via WhatsApp" from the product page. */
export function productMessage(name: string, slug: string, qty: number, unit: number, lines: { label: string; value: string }[], photos: number) {
  const out = [
    `Hi ${site.name}! I'd like to order this 🎁`,
    "",
    `*${cleanName(name)}*`,
    `Qty: ${qty} × ${formatPrice(unit)} = ${formatPrice(unit * qty)}`,
    ...lines.map((l) => `• ${l.label}: ${l.value}`),
    `${site.url}/product/${slug}/`,
  ];
  if (photos) out.push("", `📷 I'll send ${photos} photo${photos > 1 ? "s" : ""} in this chat.`);
  return whatsappLink(out.join("\n"));
}
