import Link from "next/link";
import { MapPin, Phone } from "lucide-react";
import { site, whatsappLink, defaultWhatsappText } from "@/lib/site";
import { LogoMark } from "@/components/ui/Logo";
import { SocialIcon, WhatsAppIcon } from "@/components/ui/icons";

// Link columns mirror the original store's footer.
const cols = [
  {
    title: "Collections",
    links: [
      ["/category/customize-gifts-under-1000/", "Gifts Under Rs 1000"],
      ["/category/birthday-gifts/", "Birthday Gifts"],
      ["/category/anniversary-gifts/", "Anniversary Gifts"],
      ["/category/marriage-gifts/", "Marriage Gifts"],
      ["/category/pillows-cushions/", "Pillows & Cushions"],
      ["/category/mugs/", "Customized Mugs"],
      ["/category/frames/", "Customized Frames"],
    ],
  },
  {
    title: "More",
    links: [
      ["/category/bracelets/", "Bracelets"],
      ["/category/birthday-deals/", "Birthday Deals"],
      ["/category/couple-watches/", "Couple Watches"],
      ["/category/phone-cases/", "Customized Phone Cases"],
      ["/category/lockets/", "Lockets with Box"],
      ["/category/wallets/", "Wallet with Keychain"],
      ["/category/7-color-lamps/", "7-Color Lamps"],
    ],
  },
  {
    title: "Jerseys & Crochet",
    links: [
      ["/custom-football-jerseys-bulk/", "Team Football Jerseys (Bulk)"],
      ["/custom-cricket-shirts-bulk/", "Team Cricket Shirts (Bulk)"],
      ["/category/custom-hoodies-in-pakistan/", "Custom Hoodies"],
      ["/category/custom-football-shirts/", "Custom Football Shirts"],
      ["/category/mens-football-jersey-price-in-pakistan/", "Mens Football Jersey"],
      ["/category/girls-football-jersey-price-in-pakistan/", "Girls Football Jersey"],
      ["/category/men-sports-jersey-price-in-pakistan/", "Men Sports Jersey"],
      ["/category/girls-sports-jersey-price-in-pakistan/", "Girls Sports Jersey"],
      ["/category/custom-crochet-gifts/", "Custom Crochet Gifts"],
    ],
  },
];

const help = [
  ["/shop/", "Shop All"],
  ["/how-to-order/", "How to Order"],
  ["/track-order/", "Track Order"],
  ["/reviews/", "Reviews"],
  ["/return-policy/", "Return & Refund Policy"],
  ["/wishlist/", "Wishlist"],
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-plum-950 text-white/75">
      <div aria-hidden="true" className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[60rem] -translate-x-1/2 rounded-full bg-berry-500/20 blur-[120px]" />
      <div className="container-x relative pb-10 pt-16 md:pt-20">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_2.7fr]">
          <div>
            <Link href="/" className="flex items-center gap-3">
              <LogoMark className="size-16" title="UM Gift Collection logo" />
              <span>
                <span className="display block text-2xl text-white">UM Gift Collection</span>
                <span className="text-xs font-bold uppercase tracking-[0.22em] text-peach-300">Personalized Gifts</span>
              </span>
            </Link>
            <p className="mt-6 max-w-sm leading-relaxed">
              Creating memorable personalized gifts since {site.foundedYear}. We turn your ideas into beautiful, one-of-a-kind presents for every occasion.
            </p>
            <ul className="mt-7 space-y-3 text-sm">
              <li>
                <a href={whatsappLink(defaultWhatsappText)} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-3 hover:text-white">
                  <span className="grid size-9 place-items-center rounded-full bg-wa text-white">
                    <WhatsAppIcon className="size-[18px]" />
                  </span>
                  <span>
                    <span className="block text-xs text-white/50">WhatsApp orders</span>
                    <span className="font-semibold text-white">{site.phoneDisplay}</span>
                  </span>
                </a>
              </li>
              <li className="flex items-center gap-3">
                <span className="grid size-9 place-items-center rounded-full bg-white/10">
                  <MapPin className="size-[18px]" aria-hidden="true" />
                </span>
                {site.address}
              </li>
              <li className="flex items-center gap-3">
                <span className="grid size-9 place-items-center rounded-full bg-white/10">
                  <Phone className="size-[18px]" aria-hidden="true" />
                </span>
                <a href={`tel:+${site.whatsappNumber}`} className="hover:text-white">
                  {site.phoneDisplay}
                </a>
              </li>
            </ul>
            <p className="mb-3 mt-8 text-xs font-bold uppercase tracking-[0.14em] text-white">Follow us</p>
            <ul className="flex flex-wrap gap-2">
              {site.socials.map((s) => (
                <li key={s.id}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${site.name} on ${s.label}`}
                    title={s.label}
                    className="grid size-11 place-items-center rounded-full bg-white/10 text-white transition-[background-color,transform] duration-300 hover:-translate-y-0.5 hover:bg-berry-600"
                  >
                    <SocialIcon id={s.id} className="size-[18px]" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
            {cols.map((c) => (
              <nav key={c.title} aria-label={c.title}>
                <h2 className="mb-4 text-sm font-bold uppercase tracking-[0.14em] text-white">{c.title}</h2>
                <ul className="space-y-1">
                  {c.links.map(([href, label]) => (
                    <li key={href}>
                      <Link href={href} className="inline-flex min-h-9 items-center text-sm transition-colors hover:text-peach-300">
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
            <nav aria-label="Help">
              <h2 className="mb-4 text-sm font-bold uppercase tracking-[0.14em] text-white">Help</h2>
              <ul className="space-y-1">
                {help.map(([href, label]) => (
                  <li key={href}>
                    <Link href={href} className="inline-flex min-h-9 items-center text-sm transition-colors hover:text-peach-300">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-white/50 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} UM Gift Collection (formerly The Customized Shop). All rights reserved.</p>
          <p>
            Delivering personalized gifts across Pakistan · Free delivery on orders over Rs {site.freeDeliveryThreshold.toLocaleString("en-PK")}
          </p>
        </div>
      </div>
    </footer>
  );
}
