import { Quote } from "lucide-react";
import { reviews } from "@/lib/content";
import { cn } from "@/lib/format";

type R = (typeof reviews)[number];

function Card({ r }: { r: R }) {
  return (
    <figure className="flex w-[300px] shrink-0 flex-col rounded-[var(--radius-lg)] border border-line bg-white p-6 shadow-soft sm:w-[340px]">
      <Quote className="size-7 text-lilac-300" aria-hidden="true" />
      <blockquote className="mt-3 flex-1 text-[0.95rem] leading-relaxed text-ink">{r.text}</blockquote>
      <figcaption className="mt-5 flex items-center gap-3 border-t border-line pt-4">
        <span className="grid size-10 place-items-center rounded-full bg-gradient-to-br from-berry-500 to-lilac-500 font-semibold text-white" aria-hidden="true">
          {r.name[0]}
        </span>
        <span className="min-w-0">
          <span className="block truncate text-sm font-semibold text-plum-900">{r.name}</span>
          <span className="block truncate text-xs text-ink-soft">{r.product}</span>
        </span>
      </figcaption>
    </figure>
  );
}

/** Two counter-scrolling rows of genuine customer messages; hover pauses. */
export function Testimonials() {
  const rows = [reviews.slice(0, 7), reviews.slice(7)];
  return (
    <div className="relative [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
      <ul className="sr-only">
        {reviews.map((r) => (
          <li key={r.text}>
            {r.text} — {r.name}, {r.product}
          </li>
        ))}
      </ul>
      <div className="space-y-5" aria-hidden="true">
        {rows.map((row, i) => (
          <div key={i} className="group flex overflow-hidden">
            <div className={cn("flex w-max animate-marquee gap-5 pr-5 group-hover:[animation-play-state:paused]", i === 1 && "[animation-direction:reverse]")} style={{ ["--marquee-duration" as string]: `${row.length * 9}s` }}>
              {[...row, ...row].map((r, k) => (
                <Card key={k} r={r} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
