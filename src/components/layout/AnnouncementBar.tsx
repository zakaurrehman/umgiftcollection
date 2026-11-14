import { CreditCard, Gift, Megaphone, Truck } from "lucide-react";
import { announcements } from "@/lib/site";

const icons = [Megaphone, Truck, Gift, CreditCard];

/** Slow CSS marquee; pauses on hover/focus and stops for reduced motion. */
export function AnnouncementBar() {
  const row = announcements.map((t, i) => ({ t, Icon: icons[i % icons.length] }));
  return (
    <div className="group relative z-[51] overflow-hidden bg-plum-900 text-[0.8rem] text-white/90" role="region" aria-label="Store announcements">
      <ul className="sr-only">
        {announcements.map((a) => (
          <li key={a}>{a}</li>
        ))}
      </ul>
      <div className="flex w-max animate-marquee py-2.5 [--marquee-duration:46s] group-hover:[animation-play-state:paused]" aria-hidden="true">
        {[0, 1].map((k) => (
          <div key={k} className="flex shrink-0">
            {[...row, ...row].map(({ t, Icon }, i) => (
              <span key={i} className="flex items-center gap-2 px-7 font-medium">
                <Icon className="size-3.5 text-peach-300" />
                {t}
                <span className="ml-7 text-lilac-300">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
