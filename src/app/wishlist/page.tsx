import type { Metadata } from "next";
import { site } from "@/lib/site";
import { Breadcrumbs } from "@/components/ui/bits";
import { WishlistView } from "./WishlistView";

export const metadata: Metadata = {
  title: `My Wishlist | ${site.name}`,
  robots: { index: false, follow: true },
  alternates: { canonical: "/wishlist/" },
};

export default function WishlistPage() {
  return (
    <main className="container-x pb-20 pt-8">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Wishlist" }]} />
      <h1 className="display mb-2 mt-4 text-[clamp(2rem,4vw,3rem)] font-medium text-plum-900">
        Your <span className="accent-italic text-berry-600">wishlist</span>
      </h1>
      <p className="mb-10 text-ink-soft">Gifts you&rsquo;ve saved on this device.</p>
      <WishlistView />
    </main>
  );
}
