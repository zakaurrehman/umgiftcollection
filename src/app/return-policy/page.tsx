import type { Metadata } from "next";
import Link from "next/link";
import { Ban, Camera, CircleX, PackageX, PenLine, RefreshCcw, Truck, Wrench } from "lucide-react";
import { returnFaqs } from "@/lib/content";
import { site, whatsappLink } from "@/lib/site";
import { PageHero } from "@/components/PageHero";
import { Accordion } from "@/components/ui/Accordion";
import { buttonClass } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/icons";
import { Stagger, StaggerItem } from "@/components/ui/motion";

export const metadata: Metadata = {
  title: `Return & Refund Policy | ${site.name}`,
  description: "Our personalized gifts are made to order, so we do not accept change-of-mind returns. But if your order arrives damaged, incorrect or faulty, we replace it free of charge.",
  alternates: { canonical: "/return-policy/" },
};

const covered = [
  { Icon: PackageX, t: "Damaged in delivery", d: "Your item arrives broken, cracked or damaged in transit." },
  { Icon: RefreshCcw, t: "Wrong item received", d: "You received a product you did not order." },
  { Icon: PenLine, t: "We got the personalization wrong", d: "We misspelled a name, used the wrong photo, or printed something different from the details you approved." },
  { Icon: Wrench, t: "Manufacturing fault", d: "The print is peeling, stitching has come undone, or an electronic item (like a lamp) does not switch on." },
];
const notCovered = [
  "A change of mind after the order is confirmed.",
  "Spelling mistakes, wrong dates, or low-quality photos supplied by you.",
  "A size or colour you selected yourself that you later decided against.",
  "Slight colour variation between your screen and the printed product, since screens display colours differently.",
  "Normal wear and tear after use.",
];

export default function ReturnPolicyPage() {
  const wa = whatsappLink("Hi! I need help with my order.");
  return (
    <main>
      <PageHero
        crumbs={[{ href: "/", label: "Home" }, { label: "Return & Refund Policy" }]}
        title="Return &"
        accent="refund policy"
        intro="Your gift is made to order, so we do not accept change-of-mind returns, but if we get it wrong, we make it right, free of charge."
      />

      <section className="container-x py-14 md:py-20">
        <div className="mx-auto max-w-3xl rounded-[var(--radius-xl)] border border-line bg-white p-6 md:p-10">
          <p className="eyebrow mb-3">The short version</p>
          <p className="text-lg leading-relaxed text-ink">
            Every item we make is personalized with your names, photos or messages, which means it cannot be resold to anyone else. For that reason{" "}
            <strong>we do not accept returns or exchanges once an order is confirmed and in production</strong>. What we do promise is this: if your order arrives damaged, incorrect or faulty, we replace it free of charge. Just message us on WhatsApp within 48 hours of delivery.
          </p>
        </div>

        <h2 className="display mt-16 text-center text-[clamp(1.8rem,3.6vw,2.8rem)] text-plum-900">
          We replace it free <span className="accent-italic text-berry-600">if something is wrong</span>
        </h2>
        <p className="mt-3 text-center text-ink-soft">If any of these apply, you pay nothing: not for the replacement, not for the delivery.</p>
        <Stagger className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {covered.map(({ Icon, t, d }, i) => (
            <StaggerItem key={t} className="relative rounded-[var(--radius-lg)] border border-line bg-white p-6">
              <span className="absolute right-5 top-5 text-sm font-bold text-ink-faint">0{i + 1}</span>
              <Icon className="size-7 text-berry-600" aria-hidden="true" />
              <h3 className="mt-4 font-semibold text-plum-900">{t}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{d}</p>
            </StaggerItem>
          ))}
        </Stagger>

        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          <div className="rounded-[var(--radius-lg)] bg-plum-900 p-7 text-white lg:col-span-2">
            <h3 className="flex items-center gap-2 text-lg font-semibold">
              <Camera className="size-5 text-peach-300" aria-hidden="true" /> How to make a claim
            </h3>
            <p className="mt-3 leading-relaxed text-white/75">
              Message us on WhatsApp <strong className="text-white">within 48 hours of delivery</strong> with your order number and clear photos or a video showing the problem. An unboxing video helps us a lot with transit damage claims. We review every claim quickly and, once approved, remake and reship your item on priority at no cost to you. If we cannot remake it, we refund you in full.
            </p>
          </div>
          <div className="rounded-[var(--radius-lg)] border border-line bg-white p-7">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-plum-900">
              <Ban className="size-5 text-berry-600" aria-hidden="true" /> Cancellations
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">
              You can cancel free of charge any time <strong>before production starts</strong>, and your Rs {site.advancePayment} advance is refunded in full. Once your item is in production it cannot be cancelled, because it is already being made specifically for you.
            </p>
          </div>
          <div className="rounded-[var(--radius-lg)] border border-line bg-white p-7 lg:col-span-3">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-plum-900">
              <Truck className="size-5 text-berry-600" aria-hidden="true" /> Delivery charges
            </h3>
            {/* Original page: "Delivery is Rs 249 anywhere in Pakistan, and free on orders over Rs 2,000." Values now come from site config (see src/lib/site.ts conflicts). */}
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">
              Delivery is <strong>Rs {site.deliveryFee}</strong> anywhere in Pakistan, and <strong>free on orders over Rs {site.freeDeliveryThreshold.toLocaleString("en-PK")}</strong>. Where a replacement is our fault, we cover the delivery cost entirely.
            </p>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="display text-center text-[clamp(1.6rem,3vw,2.4rem)] text-plum-900">What is not covered</h2>
          <p className="mt-3 text-center text-ink-soft">Because personalized pieces cannot be resold, these are not eligible for a return, exchange or refund.</p>
          <ul className="mx-auto mt-8 max-w-2xl space-y-3">
            {notCovered.map((n) => (
              <li key={n} className="flex gap-3 rounded-[var(--radius-md)] border border-line bg-white p-4 text-ink">
                <CircleX className="mt-0.5 size-5 shrink-0 text-berry-500" aria-hidden="true" /> {n}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-14 flex flex-col items-center gap-4 text-center">
          <p className="text-lg font-semibold text-plum-900">Something wrong with your order? We will sort it out.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href={wa} target="_blank" rel="noopener noreferrer" className={buttonClass("wa", "md")}>
              <WhatsAppIcon className="size-5" /> Message us on WhatsApp
            </a>
            <Link href="/how-to-order/" className={buttonClass("outline", "md")}>
              How to order
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-cream-50 py-16 md:py-20">
        <div className="container-x max-w-3xl">
          <p className="eyebrow mb-3 text-center">Got questions?</p>
          <h2 className="display mb-8 text-center text-[clamp(1.6rem,3vw,2.4rem)] text-plum-900">Returns & refunds FAQ</h2>
          <Accordion items={returnFaqs.map((f) => ({ q: f.q, a: <p>{f.a}</p> }))} />
        </div>
      </section>
    </main>
  );
}
