// Customization option schema, as defined by the original store's product data.
export type ShowIf = { optId: string; equals: string };

export type ChipsOption = {
  id: string;
  type: "chips";
  label: string;
  options: string[];
  required?: boolean;
  default?: string;
  hint?: string;
  priceDeltas?: Record<string, number>;
  galleryImageOnSelect?: number;
  showIf?: ShowIf;
};
export type SelectOption = { id: string; type: "select"; label: string; options: string[]; showIf?: ShowIf };
export type TextOption = { id: string; type: "text" | "textarea"; label: string; placeholder?: string; showIf?: ShowIf };
export type ImageOption = { id: string; type: "image"; label: string; placeholder?: string; showIf?: ShowIf };
export type NoticeOption = { id: string; type: "notice"; text: string };
export type AddonOption = {
  id: string;
  type: "addon";
  label: string;
  price: number;
  reveals?: (TextOption | ImageOption | ChipsOption | SelectOption)[];
};
export type VariantOption = {
  id: string;
  type: "variant";
  label: string;
  hint?: string;
  options: { value: string; price: number }[];
};
export type ProductOption =
  | ChipsOption
  | SelectOption
  | TextOption
  | ImageOption
  | NoticeOption
  | AddonOption
  | VariantOption;

export type Review = {
  name: string;
  rating: number;
  title: string | null;
  body: string;
  reply: string | null;
  date: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  price: number;
  compareAtPrice: number | null;
  images: string[];
  imageAlts: string[];
  category: string;
  categories: string[];
  badge: "custom" | "new" | "deal" | null;
  createdAt: string;
  inStock: boolean;
  description: string;
  seoTitle: string | null;
  seoDescription: string | null;
  shortLeadHtml: string | null;
  shortLines: string[];
  longHtml: string | null;
  tags: string[];
  options: ProductOption[];
  bulkTiers: { minQty: number; price: number }[] | null;
  bulkUnit: string;
  qualityTiers: { label: string; price: number }[] | null;
  reviews: Review[];
  related: string[];
};

/** The subset of a product needed to render a card (keeps client payloads small). */
export type CardProduct = {
  slug: string;
  name: string;
  price: number;
  compareAtPrice: number | null;
  image: string | null;
  hoverImage: string | null;
  alt: string;
  categoryName: string;
  categorySlug: string;
  customizable: boolean;
  needsOptions: boolean;
  createdAt: string;
  categories: string[];
};

export type Category = {
  id: string;
  slug: string;
  name: string;
  emoji: string;
  seoTitle: string | null;
  seoDescription: string | null;
  longHtml: string | null;
  productSlugs: string[];
  count: number;
  image: string | null;
};

export type MenuGroup = {
  label: string;
  icon: string;
  items: { slug: string; label?: string; icon?: string }[];
};

export type NavGroup = {
  label: string;
  items: { slug: string; label: string; count: number }[];
};
