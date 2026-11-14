import { HeartHandshake, MessageCircle, Palette, Truck } from "lucide-react";
import { site } from "@/lib/site";
import { Stagger, StaggerItem } from "@/components/ui/motion";

const items = [
  { Icon: Truck, title: "Nationwide delivery", text: `Every city in Pakistan. ${site.delivery.localCity} in ${site.delivery.local}, elsewhere ${site.delivery.elsewhere}.` },
  { Icon: Palette, title: "100% customizable", text: "Add names, photos & messages to any gift." },
  { Icon: MessageCircle, title: "Order on WhatsApp", text: "Fast, friendly help confirming your order." },
  { Icon: HeartHandshake, title: `${site.stats.rating} rated`, text: `Free delivery on orders over Rs ${site.freeDeliveryThreshold.toLocaleString("en-PK")}.` },
];

export function Benefits() {
  return (
    <section aria-label="Why shop with us" className="relative border-b border-line bg-cream-50">
      <Stagger className="container-x grid grid-cols-2 gap-x-4 gap-y-8 py-10 md:py-12 lg:grid-cols-4">
        {items.map(({ Icon, title, text }) => (
          <StaggerItem key={title} className="group flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
            <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-berry-50 to-lilac-100 text-berry-600 ring-1 ring-berry-100 transition-transform duration-500 ease-[var(--ease-spring)] group-hover:-translate-y-1 group-hover:rotate-[-6deg]">
              <Icon className="size-[22px]" aria-hidden="true" />
            </span>
            <span>
              <span className="block font-semibold text-plum-900">{title}</span>
              <span className="mt-1 block text-sm leading-relaxed text-ink-soft">{text}</span>
            </span>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
