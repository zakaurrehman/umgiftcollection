import Link from "next/link";
import { Gift, Home } from "lucide-react";
import { buttonClass } from "@/components/ui/Button";
import { Aurora } from "@/components/home/Hero";

export default function NotFound() {
  return (
    <main className="grain relative isolate overflow-hidden bg-plum-950 text-white">
      <Aurora />
      <div className="container-x flex min-h-[70dvh] flex-col items-center justify-center py-24 text-center">
        <span className="grid size-20 place-items-center rounded-full bg-white/10 text-peach-300 backdrop-blur">
          <Gift className="size-9" aria-hidden="true" />
        </span>
        <p className="display mt-6 text-[clamp(5rem,14vw,9rem)] leading-none text-gradient">404</p>
        <h1 className="display mt-2 text-3xl md:text-4xl">This gift got lost in the mail</h1>
        <p className="mt-4 max-w-md text-white/70">The page you&rsquo;re looking for doesn&rsquo;t exist or has moved. Let&rsquo;s get you back to shopping!</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className={buttonClass("light", "lg")}>
            <Home className="size-[18px]" aria-hidden="true" /> Go home
          </Link>
          <Link href="/shop/" className={buttonClass("glass", "lg")}>
            Browse gifts
          </Link>
        </div>
      </div>
    </main>
  );
}
