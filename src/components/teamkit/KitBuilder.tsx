"use client";

import { AnimatePresence, motion } from "motion/react";
import { Check, ChevronDown, Minus, Plus, Sparkles, X } from "lucide-react";
import { useId, useState } from "react";
import { create } from "zustand";
import { cn, formatPrice } from "@/lib/format";
import { site, whatsappLink } from "@/lib/site";
import { FULL_SLEEVE_EXTRA, MIN_QTY, SMALL_SQUAD_EXTRA, TEAM_RATE_QTY, patterns, swatches, type Pattern, type SportConfig } from "@/lib/teamkits";
import { WhatsAppIcon } from "@/components/ui/icons";

/** Ready-made design picked elsewhere on the page. */
export const useKitDesign = create<{ design: string | null; setDesign: (d: string | null) => void }>((set) => ({ design: null, setDesign: (design) => set({ design }) }));

const hexOf = (nameOrHex: string) => swatches.find((s) => s.name === nameOrHex)?.hex ?? nameOrHex;
const nameOf = (hex: string) => swatches.find((s) => s.hex.toLowerCase() === hex.toLowerCase())?.name ?? hex.toUpperCase();

export function KitBuilder({ cfg }: { cfg: Omit<SportConfig, "designs"> }) {
  const d = cfg.defaults;
  const [kit, setKit] = useState(d.kit);
  const [quality, setQuality] = useState<"standard" | "best">("standard");
  const [sleeves, setSleeves] = useState<"Half" | "Full">(d.sleeves);
  const [main, setMain] = useState(hexOf(d.main));
  const [accent, setAccent] = useState(hexOf(d.accent));
  const [text, setText] = useState(hexOf(d.text));
  const [pattern, setPattern] = useState<Pattern>("Fade");
  const [qty, setQty] = useState(15);
  const [name, setName] = useState(d.name);
  const [num, setNum] = useState(d.number);
  const [team, setTeam] = useState(d.team);
  const [roster, setRoster] = useState("");
  const design = useKitDesign((s) => s.design);
  const setDesign = useKitDesign((s) => s.setDesign);

  const k = cfg.kits.find((x) => x.id === kit)!;
  const per = k[quality] + (sleeves === "Full" ? FULL_SLEEVE_EXTRA : 0) + (qty < TEAM_RATE_QTY ? SMALL_SQUAD_EXTRA : 0);
  const total = per * qty;
  const sportEmoji = cfg.sport === "football" ? "⚽" : "🏏";

  const message = [
    `Hi ${site.name}! I'd like a free mockup and quote for custom ${cfg.sport} ${cfg.noun}s ${sportEmoji}`,
    "",
    `Kit: ${k.name}`,
    `Fabric: ${quality === "standard" ? "Standard" : "Best Quality"}`,
    `Sleeves: ${sleeves}`,
    `Colours: main ${nameOf(main)}, accent ${nameOf(accent)}, name & number ${nameOf(text)}`,
    `Pattern: ${pattern}`,
    ...(design ? [`Design style: ${design}`] : []),
    `Back print sample: ${name || "NAME"} ${num || ""} · ${team || "TEAM"}`,
    `Quantity: ${qty}`,
    `Price per piece: ${formatPrice(per)}`,
    `*Estimated total: ${formatPrice(total)}*`,
    ...(roster.trim() ? ["", "Player list (name, number, size):", roster.trim()] : []),
  ].join("\n");

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-12">
      {/* Preview */}
      <div className="lg:sticky lg:top-28 lg:self-start">
        <div className="relative overflow-hidden rounded-[var(--radius-2xl)] bg-gradient-to-br from-plum-900 to-plum-950 p-6 md:p-10">
          <p className="relative z-10 mb-2 text-center text-xs font-bold uppercase tracking-[0.16em] text-white/60">Live preview · back view</p>
          <KitSvg main={main} accent={accent} text={text} pattern={pattern} sleeves={sleeves} kit={kit} name={name} num={num} team={team} />
          <div aria-hidden="true" className="absolute -bottom-20 left-1/2 h-48 w-80 -translate-x-1/2 rounded-full blur-3xl" style={{ background: accent, opacity: 0.35 }} />
        </div>
        <div className="mt-4 grid grid-cols-[1fr_76px] gap-2 sm:grid-cols-[1fr_76px_1fr]">
          <TextIn label="Player name" value={name} onChange={(v) => setName(v.toUpperCase())} max={14} />
          <TextIn label="No." value={num} onChange={(v) => setNum(v.replace(/\D/g, ""))} max={3} numeric />
          <TextIn label="Team / sponsor" value={team} onChange={(v) => setTeam(v.toUpperCase())} max={18} className="col-span-2 sm:col-span-1" />
        </div>
        <p className="mt-2 text-xs text-ink-soft">A quick preview to play with. Our designer sends a proper mockup with your real logo.</p>
      </div>

      {/* Controls */}
      <div className="space-y-7">
        {design && (
          <div className="flex items-center gap-3 rounded-[var(--radius-md)] bg-lilac-50 p-3 pl-4 text-sm text-plum-900">
            <Sparkles className="size-4 shrink-0 text-lilac-500" aria-hidden="true" />
            <span className="flex-1">
              Design style: <strong>{design}</strong>
            </span>
            <button type="button" onClick={() => setDesign(null)} aria-label="Remove design style" className="grid size-9 place-items-center rounded-full hover:bg-white">
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>
        )}

        <Group label="1. Choose your kit">
          <div className="grid gap-2 sm:grid-cols-3">
            {cfg.kits.map((x) => (
              <button
                key={x.id}
                type="button"
                aria-pressed={kit === x.id}
                onClick={() => setKit(x.id)}
                className={cn("relative rounded-[var(--radius-md)] border p-4 text-left transition-all", kit === x.id ? "border-plum-900 bg-plum-900 text-white shadow-soft" : "border-line bg-white hover:border-plum-900/40")}
              >
                {x.popular && <span className="absolute -top-2.5 right-3 rounded-full bg-berry-600 px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide text-white">Popular</span>}
                <strong className="block text-sm">{x.name}</strong>
                <small className={cn("mt-1 block text-xs", kit === x.id ? "text-white/70" : "text-ink-soft")}>from {formatPrice(x.standard)}</small>
              </button>
            ))}
          </div>
        </Group>

        <div className="grid gap-7 sm:grid-cols-2">
          <Group label="2. Fabric quality">
            <Seg options={[["standard", "Standard"], ["best", "Best Quality"]]} value={quality} onChange={(v) => setQuality(v as "standard" | "best")} />
          </Group>
          <Group label="3. Sleeves">
            <Seg options={[["Half", "Half"], ["Full", `Full +${FULL_SLEEVE_EXTRA}`]]} value={sleeves} onChange={(v) => setSleeves(v as "Half" | "Full")} />
          </Group>
        </div>

        <details className="group rounded-[var(--radius-md)] border border-line bg-white" open>
          <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between px-4 font-semibold text-plum-900">
            4. Colours and style <ChevronDown className="size-4 transition-transform group-open:rotate-180" aria-hidden="true" />
          </summary>
          <div className="space-y-5 border-t border-line p-4">
            <Swatches label="Main colour" value={main} onChange={setMain} />
            <Swatches label="Accent colour" value={accent} onChange={setAccent} />
            <Swatches label="Name and number colour" value={text} onChange={setText} />
            <Group label="Pattern">
              <Seg options={patterns.map((p) => [p, p])} value={pattern} onChange={(v) => setPattern(v as Pattern)} />
            </Group>
          </div>
        </details>

        <Group label={`5. How many ${cfg.noun}s?`}>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex h-12 items-center rounded-full border border-line bg-white">
              <button type="button" aria-label="One less" disabled={qty <= MIN_QTY} onClick={() => setQty(Math.max(MIN_QTY, qty - 1))} className="grid size-12 place-items-center rounded-full hover:bg-cream-200 disabled:opacity-30">
                <Minus className="size-4" aria-hidden="true" />
              </button>
              <input
                type="number"
                min={MIN_QTY}
                max={999}
                aria-label="Quantity"
                value={qty}
                onChange={(e) => setQty(Math.max(MIN_QTY, Math.min(999, parseInt(e.target.value || "0", 10) || MIN_QTY)))}
                className="w-14 bg-transparent text-center font-semibold [appearance:textfield] focus:outline-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <button type="button" aria-label="One more" onClick={() => setQty(Math.min(999, qty + 1))} className="grid size-12 place-items-center rounded-full hover:bg-cream-200">
                <Plus className="size-4" aria-hidden="true" />
              </button>
            </div>
            {[12, 15, 20, 30].map((n) => (
              <button key={n} type="button" aria-pressed={qty === n} onClick={() => setQty(n)} className={cn("h-12 min-w-12 rounded-full border px-4 text-sm font-semibold", qty === n ? "border-plum-900 bg-plum-900 text-white" : "border-line bg-white hover:border-plum-900/40")}>
                {n}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-ink-soft">
            Minimum {MIN_QTY}. Team rate from {TEAM_RATE_QTY} pieces; 10 or 11 pieces are Rs {SMALL_SQUAD_EXTRA} more per piece.
          </p>
        </Group>

        <details className="group rounded-[var(--radius-md)] border border-line bg-white">
          <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between px-4 font-semibold text-plum-900">
            <span>
              Add your player list now <small className="font-normal text-ink-soft">(optional)</small>
            </span>
            <ChevronDown className="size-4 transition-transform group-open:rotate-180" aria-hidden="true" />
          </summary>
          <div className="border-t border-line p-4">
            <label htmlFor="roster" className="mb-2 block text-sm text-ink-soft">
              One player per line: name, number, size
            </label>
            <textarea id="roster" rows={5} value={roster} onChange={(e) => setRoster(e.target.value)} placeholder={"Zain, 10, M\nEbad, 4, L\nHunain, 11, XL"} className="w-full rounded-[var(--radius-md)] border border-line bg-cream-50 p-3 text-sm focus:border-plum-900 focus:outline-none" />
          </div>
        </details>

        <div className="rounded-[var(--radius-xl)] bg-plum-900 p-6 text-white">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm text-white/60">Your price per piece</p>
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.p key={per} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }} className="display text-4xl">
                  {formatPrice(per)}
                </motion.p>
              </AnimatePresence>
            </div>
            <div className="text-right">
              <p className="text-sm text-white/60">Total for {qty}</p>
              <p className="text-2xl font-bold">{formatPrice(total)}</p>
            </div>
          </div>
          <p className="mt-4 flex items-center gap-2 text-sm text-peach-300">
            <Check className="size-4" aria-hidden="true" />
            {qty >= TEAM_RATE_QTY ? "Team rate unlocked. Names, numbers and logo included free." : `Add ${TEAM_RATE_QTY - qty} more to unlock the team rate.`}
          </p>
          <a href={whatsappLink(message)} target="_blank" rel="noopener noreferrer" className="mt-5 flex h-14 items-center justify-center gap-2 rounded-full bg-wa font-semibold text-white hover:bg-wa-dark">
            <WhatsAppIcon className="size-5" /> Send my kit & get a free mockup
          </a>
          <p className="mt-3 text-center text-xs text-white/55">
            Mockup and quote are free. A 50% advance confirms your order once you approve the design. We reply on WhatsApp from {site.supportHours}.
          </p>
        </div>
      </div>
    </div>
  );
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <fieldset>
      <legend className="mb-2.5 text-sm font-semibold text-plum-900">{label}</legend>
      {children}
    </fieldset>
  );
}

function Seg({ options, value, onChange }: { options: string[][]; value: string; onChange: (v: string) => void }) {
  const id = useId();
  return (
    <div className="flex flex-wrap gap-1 rounded-full border border-line bg-white p-1">
      {options.map(([v, l]) => (
        <button key={v} type="button" aria-pressed={value === v} onClick={() => onChange(v)} className={cn("relative h-10 flex-1 whitespace-nowrap rounded-full px-3 text-sm font-semibold transition-colors", value === v ? "text-white" : "text-ink-soft hover:text-plum-900")}>
          {value === v && <motion.span layoutId={`seg-${id}`} className="absolute inset-0 rounded-full bg-plum-900" transition={{ type: "spring", stiffness: 450, damping: 36 }} />}
          <span className="relative">{l}</span>
        </button>
      ))}
    </div>
  );
}

function Swatches({ label, value, onChange }: { label: string; value: string; onChange: (hex: string) => void }) {
  return (
    <Group label={`${label}: ${nameOf(value)}`}>
      <div className="flex flex-wrap gap-2">
        {swatches.map((s) => (
          <button
            key={s.name}
            type="button"
            title={s.name}
            aria-label={s.name}
            aria-pressed={value.toLowerCase() === s.hex}
            onClick={() => onChange(s.hex)}
            className={cn("size-9 rounded-full border border-black/10 transition-transform hover:scale-110", value.toLowerCase() === s.hex && "ring-2 ring-plum-900 ring-offset-2")}
            style={{ background: s.hex }}
          />
        ))}
        <label title="Custom colour" className="relative grid size-9 cursor-pointer place-items-center overflow-hidden rounded-full border border-dashed border-ink-faint bg-[conic-gradient(#e94f87,#c5a8ff,#38bdf8,#16a34a,#facc15,#e94f87)]">
          <input type="color" aria-label={`Custom ${label.toLowerCase()}`} value={value} onChange={(e) => onChange(e.target.value)} className="absolute inset-0 cursor-pointer opacity-0" />
        </label>
      </div>
    </Group>
  );
}

function TextIn({ label, value, onChange, max, numeric, className }: { label: string; value: string; onChange: (v: string) => void; max: number; numeric?: boolean; className?: string }) {
  return (
    <label className={cn("block rounded-[var(--radius-md)] border border-line bg-white px-3 py-2 focus-within:border-plum-900", className)}>
      <span className="block text-[0.7rem] font-semibold uppercase tracking-wide text-ink-faint">{label}</span>
      <input value={value} maxLength={max} inputMode={numeric ? "numeric" : undefined} onChange={(e) => onChange(e.target.value)} className="w-full bg-transparent font-semibold text-plum-900 focus:outline-none" />
    </label>
  );
}

/** Illustrative kit drawing, back view. */
function KitSvg({ main, accent, text, pattern, sleeves, kit, name, num, team }: { main: string; accent: string; text: string; pattern: Pattern; sleeves: "Half" | "Full"; kit: string; name: string; num: string; team: string }) {
  const id = useId().replace(/:/g, "");
  const body = "M100 30 Q150 44 200 30 L246 46 L240 108 L240 300 Q150 308 60 300 L60 108 L54 46 Z";
  const fill = pattern === "Solid" ? main : pattern === "Fade" ? `url(#fade${id})` : pattern === "Stripes" ? `url(#stripes${id})` : main;
  const full = sleeves === "Full";
  const bottoms = kit !== "jersey" && kit !== "shirt";
  const long = kit === "trouser";
  return (
    <svg viewBox={`0 0 300 ${bottoms ? (long ? 520 : 404) : 320}`} className="relative z-10 mx-auto h-auto w-full max-w-[300px] drop-shadow-[0_30px_40px_rgba(0,0,0,0.45)]" role="img" aria-label={`Preview of a ${pattern.toLowerCase()} kit with ${name || "NAME"} ${num} on the back`}>
      <defs>
        <linearGradient id={`fade${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0.38" stopColor={main} />
          <stop offset="1" stopColor={accent} />
        </linearGradient>
        <pattern id={`stripes${id}`} width="40" height="10" patternUnits="userSpaceOnUse">
          <rect width="40" height="10" fill={main} />
          <rect x="22" width="14" height="10" fill={accent} />
        </pattern>
        <linearGradient id={`shade${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#000" stopOpacity=".22" />
          <stop offset=".2" stopColor="#000" stopOpacity="0" />
          <stop offset=".8" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity=".22" />
        </linearGradient>
        <clipPath id={`clip${id}`}>
          <path d={body} />
        </clipPath>
      </defs>
      {bottoms && (
        <g>
          {long ? (
            <path d="M66 312 L234 312 L240 510 L168 512 L150 380 L132 512 L60 510 Z" fill={main} />
          ) : (
            <path d="M66 314 L234 314 L244 396 L160 400 L150 356 L140 400 L56 396 Z" fill={main} />
          )}
          <path d="M66 314 L234 314 L235 324 L65 324 Z" fill={accent} />
          <path d={long ? "M228 330 L236 500 L228 500 L220 331 Z" : "M228 330 L238 392 L230 393 L221 331 Z"} fill={accent} />
          <path d={long ? "M72 330 L64 500 L72 500 L80 331 Z" : "M72 330 L62 392 L70 393 L79 331 Z"} fill={accent} />
        </g>
      )}
      {full ? (
        <>
          <path d="M54 46 L14 196 L42 204 L60 108 Z" fill={main} />
          <path d="M246 46 L286 196 L258 204 L240 108 Z" fill={main} />
          <path d="M14 196 L42 204 L44 192 L17 184 Z" fill={accent} />
          <path d="M286 196 L258 204 L256 192 L283 184 Z" fill={accent} />
        </>
      ) : (
        <>
          <path d="M54 46 L18 104 L46 124 L60 108 Z" fill={accent} />
          <path d="M246 46 L282 104 L254 124 L240 108 Z" fill={accent} />
          <path d="M18 104 L46 124 L50 116 L24 96 Z" fill={main} opacity=".9" />
          <path d="M282 104 L254 124 L250 116 L276 96 Z" fill={main} opacity=".9" />
        </>
      )}
      <path d={body} fill={fill} />
      <g clipPath={`url(#clip${id})`}>
        {pattern === "Sash" && <path d="M40 60 L120 40 L280 260 L200 300 Z" fill={accent} opacity=".95" />}
        <path d="M74 118 Q96 210 72 300" stroke={accent} strokeWidth="5" fill="none" opacity=".85" />
        <path d="M226 118 Q204 210 228 300" stroke={accent} strokeWidth="5" fill="none" opacity=".85" />
        <rect x="0" y="0" width="300" height="320" fill={`url(#shade${id})`} />
      </g>
      <path d="M100 30 Q150 44 200 30 L198 37 Q150 52 102 37 Z" fill={accent} />
      <text x="150" y="104" textAnchor="middle" fill={text} fontFamily="var(--font-jakarta), system-ui, sans-serif" fontWeight="800" fontSize="26" letterSpacing="2">
        {name || "NAME"}
      </text>
      <text x="150" y="214" textAnchor="middle" fill={text} fontFamily="var(--font-jakarta), system-ui, sans-serif" fontWeight="900" fontSize="104" letterSpacing="-2" stroke={main} strokeWidth="2" paintOrder="stroke">
        {num || "0"}
      </text>
      <text x="150" y="270" textAnchor="middle" fill={text} fontFamily="var(--font-jakarta), system-ui, sans-serif" fontWeight="800" fontSize="15" letterSpacing="2.5" opacity=".95">
        {team}
      </text>
    </svg>
  );
}
