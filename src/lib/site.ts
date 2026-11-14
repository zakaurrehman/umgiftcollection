/**
 * Business facts for UM Gift Collection (formerly The Customized Shop),
 * taken from thecustomizedshop.pk.
 *
 * Where the original site contradicts itself, the value used here is marked
 * CONFLICT with every source listed, so the owner can confirm the right one.
 * Change a value here and it updates everywhere in the UI, the cart maths and
 * the WhatsApp order message.
 */
export const site = {
  /** Rebrand of The Customized Shop (thecustomizedshop.pk), confirmed by the owner. */
  name: "UM Gift Collection",
  formerName: "The Customized Shop",
  tagline: "Personalized Gifts",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://umgiftcollection.com",
  description:
    "Customized gifts in Pakistan: photo mugs, frames, cushions, lamps & name gifts, personalized for birthdays, anniversaries and every occasion, delivered across Pakistan.",

  phoneDisplay: "03148337494",
  whatsappNumber: "923148337494",
  address: "Jamshed Road, Karachi, Pakistan",
  instagramHandle: "@thecustomizedshop1",
  instagramUrl: "https://www.instagram.com/thecustomizedshop1/",
  supportHours: "9 AM to 11 PM, every day", // from the bulk-order pages
  foundedYear: 2020,

  /**
   * CONFLICT — delivery fee.
   *   Rs 250: announcement bar ("Delivery Charges Just Rs 250").
   *   Rs 249: Return & Refund Policy page and the product structured data.
   */
  deliveryFee: 250,

  /**
   * CONFLICT — free delivery threshold.
   *   Rs 3,000: announcement bar and homepage hero.
   *   Rs 2,000: homepage perks strip, homepage CTA, SEO copy, FAQ, Return Policy.
   * The announcement bar is the store's admin-managed banner, so its value is
   * used. Confirm with the owner.
   */
  freeDeliveryThreshold: 3000,

  /**
   * CONFLICT — advance payment.
   *   "Rs 250 charged in advance to confirm your order": announcement bar,
   *   hero, SEO copy, Track Order page, Return Policy.
   *   "No advance payment needed. Cash on Delivery available.": Reviews page.
   */
  advancePayment: 250,

  /** Homepage CTA: "Use code TCS10 for 10% off your first order." */
  promo: { code: "TCS10", percent: 10, label: "10% off your first order" },

  /** Delivery times from the homepage FAQ and How to Order page. */
  delivery: { karachi: "1–2 days", elsewhere: "3–5 days" },
  paymentMethods: "EasyPaisa, JazzCash, bank transfer, and cash on delivery (COD) in select areas",

  /**
   * CONFLICT — customer counts.
   *   1,200+ happy customers: homepage stats band, reviews CTA, bulk pages.
   *   500+: homepage hero, perks strip, reviews stats, SEO copy, FAQ.
   *   5,000+: one sentence in the homepage SEO copy.
   * The homepage stats band is reproduced as published.
   */
  stats: {
    rating: 4.9,
    happyCustomers: 1200,
    giftsDelivered: 1000,
    wouldRecommend: 98, // reviews page
  },
} as const;

export const whatsappLink = (text?: string) =>
  `https://wa.me/${site.whatsappNumber}${text ? `?text=${encodeURIComponent(text)}` : ""}`;

export const defaultWhatsappText = "Hi! I'd love to order a customized gift 🎁";

export const announcements = [
  `Delivery charges just Rs ${site.deliveryFee}`,
  `Shop for Rs ${site.freeDeliveryThreshold.toLocaleString("en-PK")}+ and get FREE delivery across Pakistan`,
  "Customized gifts for your loved ones, delivered anywhere in Pakistan",
  `Rs ${site.advancePayment} charged in advance to confirm your order`,
];
