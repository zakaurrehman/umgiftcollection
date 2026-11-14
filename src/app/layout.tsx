import type { Metadata, Viewport } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import { MotionConfig } from "motion/react";
import "./globals.css";
import { site } from "@/lib/site";
import { getCategory, navGroups } from "@/lib/catalog";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SearchOverlay } from "@/components/layout/SearchOverlay";
import { Toast, WhatsAppFab } from "@/components/layout/Toast";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { QuickView } from "@/components/product/QuickView";
import { JsonLd } from "@/components/JsonLd";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta", display: "swap" });
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  style: ["normal", "italic"],
  axes: ["SOFT", "WONK", "opsz"],
  display: "swap",
});

const title = "Best Customized Gift Shop in Pakistan 2026: Buy Custom Gifts";
const description =
  "Shop unique personalized gifts in Pakistan: custom mugs, cushions, frames, lamps & more. 100% customizable. Order on WhatsApp. Fast delivery.";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: title, template: "%s" },
  description,
  keywords: ["customized gifts Pakistan", "personalized gifts", "custom mugs Pakistan", "birthday gifts Pakistan"],
  authors: [{ name: site.name }],
  creator: site.name,
  publisher: site.name,
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_PK",
    title,
    description,
    url: "/",
  },
  twitter: { card: "summary_large_image", title, description },
};

export const viewport: Viewport = {
  themeColor: "#28152f",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const groups = navGroups();
  const groupImages = groups.map((g) => (g.items[0] ? getCategory(g.items[0].slug)?.image ?? null : null));

  return (
    <html lang="en" className={`${jakarta.variable} ${fraunces.variable}`}>
      <body className="min-h-dvh overflow-x-clip">
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "OnlineStore",
                "@id": `${site.url}/#store`,
                name: site.name,
                url: site.url,
                logo: `${site.url}/apple-icon.png`,
                image: `${site.url}/opengraph-image.png`,
                description: site.description,
                telephone: `+${site.whatsappNumber}`,
                foundingDate: String(site.foundedYear),
                alternateName: site.formerName,
                address: { "@type": "PostalAddress", streetAddress: site.addressParts.street, addressLocality: site.addressParts.city, addressCountry: site.addressParts.country },
                areaServed: { "@type": "Country", name: "Pakistan" },
                sameAs: site.socials.map((s) => s.url),
              },
              {
                "@type": "WebSite",
                "@id": `${site.url}/#website`,
                url: site.url,
                name: site.name,
                publisher: { "@id": `${site.url}/#store` },
                potentialAction: {
                  "@type": "SearchAction",
                  target: { "@type": "EntryPoint", urlTemplate: `${site.url}/shop/?q={search_term_string}` },
                  "query-input": "required name=search_term_string",
                },
              },
            ],
          }}
        />
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-plum-900 focus:px-5 focus:py-3 focus:text-white">
          Skip to content
        </a>
        <MotionConfig reducedMotion="user">
          <AnnouncementBar />
          <Header groups={groups} groupImages={groupImages} />
          <div id="main">{children}</div>
          <Footer />
          <CartDrawer />
          <SearchOverlay />
          <QuickView />
          <Toast />
          <WhatsAppFab />
        </MotionConfig>
      </body>
    </html>
  );
}
