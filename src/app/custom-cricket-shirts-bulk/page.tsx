import type { Metadata } from "next";
import { cricket } from "@/lib/teamkits";
import { TeamKitPage } from "@/components/teamkit/TeamKitPage";

export const metadata: Metadata = {
  title: cricket.seoTitle,
  description: cricket.seoDescription,
  alternates: { canonical: cricket.path },
  openGraph: { title: cricket.seoTitle, description: cricket.seoDescription, url: cricket.path, images: ["/team-kits/custom-team-football-jerseys-pakistan-client.webp"] },
};

export default function Page() {
  return <TeamKitPage cfg={cricket} />;
}
