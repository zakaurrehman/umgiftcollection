import type { Metadata } from "next";
import { site } from "@/lib/site";
import { PageHero } from "@/components/PageHero";
import { TrackForm } from "./TrackForm";

export const metadata: Metadata = {
  title: `Track Your Order | ${site.name}`,
  description: `Track your customized gift order from ${site.name}. Enter your order number or phone and get the latest delivery status instantly on WhatsApp.`,
  alternates: { canonical: "/track-order/" },
};

export default function TrackOrderPage() {
  return (
    <main>
      <PageHero
        crumbs={[{ href: "/", label: "Home" }, { label: "Track Order" }]}
        title="Track your"
        accent="order"
        intro="Enter your order number or the phone number you used, and we'll pull up the latest status for you on WhatsApp: fast, friendly, no account needed."
      />
      <section className="container-x py-14 md:py-20">
        <TrackForm />
      </section>
    </main>
  );
}
