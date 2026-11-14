export const formatPrice = (n: number) => `Rs ${Math.round(n).toLocaleString("en-PK")}`;

export const discountPercent = (price: number, compareAt: number | null | undefined) =>
  compareAt && compareAt > price ? Math.round(((compareAt - price) / compareAt) * 100) : 0;

/** Strip decorative emoji from product names used in compact UI and messages. */
export const cleanName = (s: string) =>
  s
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B50}\u{2728}\u{FE0F}\u{200D}]/gu, "")
    .replace(/\s{2,}/g, " ")
    .trim();

export const cn = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");
