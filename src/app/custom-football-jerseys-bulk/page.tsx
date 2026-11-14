import type { Metadata } from "next";
import { football } from "@/lib/teamkits";
import { TeamKitPage } from "@/components/teamkit/TeamKitPage";

export const metadata: Metadata = {
  title: football.seoTitle,
  description: football.seoDescription,
  alternates: { canonical: football.path },
  openGraph: { title: football.seoTitle, description: football.seoDescription, url: football.path, images: ["/team-kits/custom-team-football-jerseys-pakistan-client.webp"] },
};

export default function Page() {
  return <TeamKitPage cfg={football} />;
}
