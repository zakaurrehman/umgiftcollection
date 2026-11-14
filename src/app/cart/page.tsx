import type { Metadata } from "next";
import { site } from "@/lib/site";
import { Breadcrumbs } from "@/components/ui/bits";
import { CartView } from "./CartView";

export const metadata: Metadata = {
  title: `My Cart | ${site.name}`,
  robots: { index: false, follow: true },
  alternates: { canonical: "/cart/" },
};

export default function CartPage() {
  return (
    <main className="container-x pb-20 pt-8">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "My Cart" }]} />
      <h1 className="display mb-8 mt-4 text-[clamp(2rem,4vw,3rem)] font-medium text-plum-900">
        Your <span className="accent-italic text-berry-600">cart</span>
      </h1>
      <CartView />
    </main>
  );
}
