"use client";

import { AnimatePresence, motion } from "motion/react";
import { Check, ImagePlus, Info, Minus, Plus, ShoppingBag, Sparkles, Tag, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Product, ProductOption } from "@/lib/types";
import { cn, formatPrice } from "@/lib/format";
import {
  QUALITY_KEY,
  bulkRows,
  compareUnitPrice,
  describeSelections,
  initialSelections,
  missingChoices,
  unitPrice,
  visibleOptions,
  type Selections,
} from "@/lib/pricing";
import { productMessage } from "@/lib/whatsapp";
import { useCart, usePhotos } from "@/store/cart";
import { useUI } from "@/store/ui";
import { WhatsAppIcon } from "@/components/ui/icons";

export type CustomizerProduct = Pick<
  Product,
  "slug" | "name" | "price" | "compareAtPrice" | "images" | "options" | "bulkTiers" | "bulkUnit" | "qualityTiers" | "inStock"
>;

const MAX_MB = 10;

function hash(s: string) {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
  return (h >>> 0).toString(36);
}

export function Customizer({
  product: p,
  onGalleryIndex,
  onAdded,
  compact,
}: {
  product: CustomizerProduct;
  onGalleryIndex?: (i: number) => void;
  onAdded?: () => void;
  compact?: boolean;
}) {
  const [sel, setSel] = useState<Selections>(() => initialSelections(p));
  const [qty, setQty] = useState(p.bulkTiers ? 1 : 1);
  const [files, setFiles] = useState<Record<string, File[]>>({});
  const [errors, setErrors] = useState<string[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);
  const add = useCart((s) => s.add);
  const setPhotos = usePhotos((s) => s.setPhotos);
  const setCart = useUI((s) => s.setCart);
  const rootRef = useRef<HTMLDivElement>(null);

  const unit = unitPrice(p, sel, qty);
  const compare = compareUnitPrice(p, unit);
  const visible = useMemo(() => visibleOptions(p.options, sel), [p.options, sel]);
  const photoCount = Object.fromEntries(Object.entries(files).map(([k, v]) => [k, v.length]));
  const lines = describeSelections(p, sel, photoCount);
  const totalPhotos = Object.values(files).reduce((n, f) => n + f.length, 0);
  const tiers = bulkRows(p);

  const set = (id: string, v: string | boolean | undefined) => {
    setSel((s) => ({ ...s, [id]: v }));
    setErrors((e) => e.filter((x) => x !== id));
  };

  const validate = () => {
    const miss = missingChoices(p, sel);
    setErrors(miss);
    if (miss.length) {
      rootRef.current?.querySelector<HTMLElement>(`[data-opt="${miss[0]}"]`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      return false;
    }
    return true;
  };

  const extras = unit - unitPrice({ ...p, options: p.options.filter((o) => o.type === "variant") }, sel, qty);

  const addToCart = () => {
    if (!validate()) return;
    const photoNames = Object.values(files).flat().map((f) => f.name);
    const id = `${p.slug}-${hash(JSON.stringify(sel) + photoNames.join("|"))}`;
    const baseUnit = unitPrice({ ...p, bulkTiers: null, options: p.options.filter((o) => o.type === "variant") }, sel, 1);
    add({
      id,
      slug: p.slug,
      name: p.name,
      image: p.images[0] ?? null,
      qty,
      baseUnit,
      extras,
      bulkTiers: p.bulkTiers,
      savingPerUnit: compare ? compare - unit : 0,
      lines,
      photoNames,
    });
    if (photoNames.length) setPhotos(id, Object.values(files).flat());
    onAdded?.();
    setCart(true);
  };

  const onFiles = (id: string, list: FileList | null) => {
    if (!list) return;
    const ok: File[] = [];
    let rejected = 0;
    for (const f of Array.from(list)) {
      const isImg = f.type.startsWith("image/") || /\.(heic|heif)$/i.test(f.name);
      if (isImg && f.size <= MAX_MB * 1024 * 1024) ok.push(f);
      else rejected++;
    }
    setFileError(rejected ? `${rejected} file${rejected > 1 ? "s" : ""} skipped — images up to ${MAX_MB} MB only.` : null);
    setFiles((s) => ({ ...s, [id]: [...(s[id] || []), ...ok] }));
  };

  return (
    <div ref={rootRef} className="flex flex-col gap-6">
      {/* Price */}
      <div className="flex flex-wrap items-end gap-x-3 gap-y-2">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={unit}
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -12, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className={cn("font-bold tracking-tight text-plum-900", compact ? "text-2xl" : "text-[2rem] leading-none")}
          >
            {formatPrice(unit)}
          </motion.span>
        </AnimatePresence>
        {compare && <span className="pb-0.5 text-lg text-ink-faint line-through">{formatPrice(compare)}</span>}
        {compare && (
          <span className="mb-0.5 rounded-full bg-berry-50 px-2.5 py-1 text-xs font-bold text-berry-700">
            Save {formatPrice(compare - unit)}
          </span>
        )}
        {p.bulkTiers && <span className="w-full text-sm text-ink-soft">per {p.bulkUnit}, price drops as you order more</span>}
      </div>

      {tiers.length > 0 && (
        <div className="rounded-[var(--radius-md)] border border-line bg-cream-50 p-4">
          <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-plum-900">
            <Tag className="size-4 text-berry-600" aria-hidden="true" /> Bulk pricing
          </p>
          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <li className={cn("rounded-xl border px-3 py-2 text-center text-sm", qty < tiers[0].minQty ? "border-plum-900 bg-white" : "border-line")}>
              <span className="block text-xs text-ink-faint">1–{tiers[0].minQty - 1}</span>
              <span className="font-semibold">{formatPrice(p.price)}</span>
            </li>
            {tiers.map((t, i) => {
              const active = qty >= t.minQty && (!tiers[i + 1] || qty < tiers[i + 1].minQty);
              return (
                <li key={t.minQty} className={cn("rounded-xl border px-3 py-2 text-center text-sm transition-colors", active ? "border-plum-900 bg-white" : "border-line")}>
                  <span className="block text-xs text-ink-faint">{t.minQty}+</span>
                  <span className="font-semibold">{formatPrice(t.price)}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Quality tiers */}
      {p.qualityTiers && (
        <Field label="Quality" id={QUALITY_KEY} error={false}>
          <div className="flex flex-wrap gap-2">
            {p.qualityTiers.map((t) => (
              <Chip key={t.label} active={sel[QUALITY_KEY] === t.label} onClick={() => set(QUALITY_KEY, t.label)}>
                {t.label}
              </Chip>
            ))}
          </div>
        </Field>
      )}

      {/* Options */}
      {visible.map(({ opt, parent }) => (
        <div key={opt.id} data-opt={opt.id} className={cn(parent && "-mt-2 border-l-2 border-berry-100 pl-4")}>
          <OptionField
            opt={opt}
            value={sel[opt.id]}
            error={errors.includes(opt.id)}
            files={files[opt.id] || []}
            onChange={(v) => {
              set(opt.id, v);
              if (opt.type === "chips" && opt.galleryImageOnSelect != null && p.images[opt.galleryImageOnSelect]) onGalleryIndex?.(opt.galleryImageOnSelect);
            }}
            onFiles={(l) => onFiles(opt.id, l)}
            onRemoveFile={(i) => setFiles((s) => ({ ...s, [opt.id]: (s[opt.id] || []).filter((_, k) => k !== i) }))}
          />
        </div>
      ))}
      {fileError && (
        <p role="alert" className="-mt-3 text-sm text-berry-700">
          {fileError}
        </p>
      )}

      {/* Summary of personalization */}
      <AnimatePresence initial={false}>
        {lines.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="rounded-[var(--radius-md)] bg-plum-900 p-4 text-white">
              <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-peach-300">
                <Sparkles className="size-3.5" aria-hidden="true" /> Your personalization
              </p>
              <dl className="grid gap-1.5 text-sm">
                {lines.map((l) => (
                  <div key={l.label} className="flex gap-3">
                    <dt className="w-2/5 shrink-0 text-white/60">{l.label}</dt>
                    <dd className="min-w-0 break-words font-medium">{l.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {errors.length > 0 && (
        <p role="alert" className="flex items-center gap-2 rounded-xl bg-berry-50 px-4 py-3 text-sm font-medium text-berry-700">
          <Info className="size-4 shrink-0" aria-hidden="true" /> Please choose the highlighted option{errors.length > 1 ? "s" : ""} before adding to cart.
        </p>
      )}

      {/* Quantity + actions */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <QtyStepper value={qty} onChange={setQty} />
          <button
            type="button"
            onClick={addToCart}
            disabled={!p.inStock}
            className="group/add relative flex h-14 flex-1 items-center justify-center gap-2 overflow-hidden rounded-full bg-berry-600 px-6 font-semibold text-white shadow-[0_12px_32px_-12px_rgb(233_79_135/0.8)] transition-[background-color,transform] duration-300 hover:bg-berry-700 active:scale-[0.98] disabled:opacity-50"
          >
            <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover/add:translate-x-full" />
            <ShoppingBag className="size-5" aria-hidden="true" />
            {p.inStock ? `Add to cart · ${formatPrice(unit * qty)}` : "Out of stock"}
          </button>
        </div>
        <a
          href={productMessage(p.name, p.slug, qty, unit, lines, totalPhotos)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => {
            if (!validate()) e.preventDefault();
          }}
          className="flex h-14 items-center justify-center gap-2 rounded-full border-2 border-wa/30 bg-white font-semibold text-wa-dark transition-colors hover:border-wa hover:bg-wa hover:text-white"
        >
          <WhatsAppIcon className="size-5" /> Order via WhatsApp
        </a>
        {totalPhotos > 0 && (
          <p className="text-center text-xs leading-relaxed text-ink-soft">
            Your {totalPhotos} photo{totalPhotos > 1 ? "s stay" : " stays"} on your device. You&rsquo;ll share {totalPhotos > 1 ? "them" : "it"} with us in the WhatsApp chat when you confirm.
          </p>
        )}
      </div>
    </div>
  );
}

function Field({ label, id, error, hint, children }: { label: string; id: string; error: boolean; hint?: string; children: React.ReactNode }) {
  return (
    <fieldset className="min-w-0">
      <legend id={`lbl-${id}`} className={cn("mb-2.5 text-sm font-semibold", error ? "text-berry-700" : "text-plum-900")}>
        {label}
        {error && <span className="ml-2 font-medium">· please choose one</span>}
      </legend>
      {children}
      {hint && <p className="mt-2 text-xs leading-relaxed text-ink-soft">{hint}</p>}
    </fieldset>
  );
}

function Chip({ active, onClick, children, error }: { active: boolean; onClick: () => void; children: React.ReactNode; error?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "relative inline-flex min-h-11 items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-[background-color,border-color,color,box-shadow] duration-200",
        active
          ? "border-plum-900 bg-plum-900 text-white shadow-soft"
          : cn("bg-white text-ink hover:border-plum-900/50", error ? "border-berry-500" : "border-line"),
      )}
    >
      {active && <Check className="size-3.5" aria-hidden="true" />}
      {children}
    </button>
  );
}

function OptionField({
  opt,
  value,
  error,
  files,
  onChange,
  onFiles,
  onRemoveFile,
}: {
  opt: ProductOption;
  value: string | boolean | undefined;
  error: boolean;
  files: File[];
  onChange: (v: string | boolean | undefined) => void;
  onFiles: (l: FileList | null) => void;
  onRemoveFile: (i: number) => void;
}) {
  const inputCls =
    "w-full rounded-[var(--radius-md)] border border-line bg-white px-4 py-3 text-[0.95rem] text-ink placeholder:text-ink-faint transition-[border-color,box-shadow] focus:border-plum-900 focus:shadow-[0_0_0_4px_rgb(197_168_255/0.35)] focus:outline-none";

  switch (opt.type) {
    case "notice":
      return (
        <div className="flex gap-3 rounded-[var(--radius-md)] bg-peach-100 px-4 py-3 text-sm leading-relaxed text-plum-900">
          <Tag className="mt-0.5 size-4 shrink-0 text-peach-500" aria-hidden="true" />
          <p>{opt.text}</p>
        </div>
      );
    case "chips":
      return (
        <Field label={opt.label} id={opt.id} error={error} hint={opt.hint}>
          <div className="flex flex-wrap gap-2">
            {opt.options.map((o) => {
              const d = opt.priceDeltas?.[o];
              return (
                <Chip key={o} active={value === o} onClick={() => onChange(value === o && !opt.required ? undefined : o)} error={error}>
                  {o}
                  {d ? <span className="opacity-70">{d > 0 ? `+${d}` : `−${Math.abs(d)}`}</span> : null}
                </Chip>
              );
            })}
          </div>
        </Field>
      );
    case "variant":
      return (
        <Field label={opt.label} id={opt.id} error={error} hint={opt.hint}>
          <div className="grid gap-2 sm:grid-cols-2">
            {opt.options.map((o) => (
              <button
                key={o.value}
                type="button"
                aria-pressed={value === o.value}
                onClick={() => onChange(o.value)}
                className={cn(
                  "flex min-h-14 items-center justify-between gap-3 rounded-[var(--radius-md)] border px-4 py-3 text-left text-sm transition-all",
                  value === o.value ? "border-plum-900 bg-plum-900 text-white shadow-soft" : "border-line bg-white hover:border-plum-900/50",
                )}
              >
                <span className="font-medium">{o.value}</span>
                <span className="font-bold">{formatPrice(o.price)}</span>
              </button>
            ))}
          </div>
        </Field>
      );
    case "select":
      return (
        <Field label={opt.label} id={opt.id} error={error}>
          <select
            aria-labelledby={`lbl-${opt.id}`}
            value={typeof value === "string" ? value : ""}
            onChange={(e) => onChange(e.target.value || undefined)}
            className={cn(inputCls, "h-12 appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%2328152f%22 stroke-width=%222.5%22><path d=%22m6 9 6 6 6-6%22/></svg>')] bg-[right_1rem_center] bg-no-repeat pr-10", error && "border-berry-500")}
          >
            <option value="">Select {opt.label.toLowerCase()}…</option>
            {opt.options.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </Field>
      );
    case "text":
    case "textarea": {
      const id = `opt-${opt.id}`;
      return (
        <div>
          <label htmlFor={id} className="mb-2.5 block text-sm font-semibold text-plum-900">
            {opt.label}
          </label>
          {opt.type === "text" ? (
            <input id={id} className={inputCls} placeholder={opt.placeholder} maxLength={120} value={typeof value === "string" ? value : ""} onChange={(e) => onChange(e.target.value)} />
          ) : (
            <textarea id={id} rows={3} className={cn(inputCls, "resize-y")} placeholder={opt.placeholder} maxLength={600} value={typeof value === "string" ? value : ""} onChange={(e) => onChange(e.target.value)} />
          )}
        </div>
      );
    }
    case "image": {
      const id = `opt-${opt.id}`;
      return (
        <div>
          <p className="mb-2.5 text-sm font-semibold text-plum-900">{opt.label}</p>
          <label
            htmlFor={id}
            className="group/up flex cursor-pointer flex-col items-center gap-2 rounded-[var(--radius-md)] border-2 border-dashed border-lilac-300 bg-lilac-50 px-4 py-6 text-center transition-colors hover:border-berry-500 hover:bg-berry-50 focus-within:border-berry-500"
          >
            <span className="grid size-12 place-items-center rounded-full bg-white text-berry-600 shadow-soft transition-transform group-hover/up:-translate-y-0.5">
              <ImagePlus className="size-5" aria-hidden="true" />
            </span>
            <span className="text-sm font-semibold text-plum-900">Choose photos</span>
            {opt.placeholder && <span className="max-w-sm text-xs leading-relaxed text-ink-soft">{opt.placeholder}</span>}
            <input id={id} type="file" accept="image/*,.heic,.heif" multiple className="sr-only" onChange={(e) => (onFiles(e.target.files), (e.target.value = ""))} />
          </label>
          {files.length > 0 && (
            <ul className="mt-3 flex flex-wrap gap-2">
              {files.map((f, i) => (
                <Thumb key={f.name + i} file={f} onRemove={() => onRemoveFile(i)} />
              ))}
            </ul>
          )}
        </div>
      );
    }
    case "addon":
      return (
        <label className={cn("flex min-h-14 cursor-pointer items-center gap-3 rounded-[var(--radius-md)] border px-4 py-3 transition-colors", value ? "border-plum-900 bg-lilac-50" : "border-line bg-white hover:border-plum-900/40")}>
          <input type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} className="size-5 accent-[var(--color-berry-500)]" />
          <span className="flex-1 text-sm font-medium text-plum-900">{opt.label}</span>
          <span className="text-sm font-bold text-berry-700">+{formatPrice(opt.price)}</span>
        </label>
      );
  }
}

function Thumb({ file, onRemove }: { file: File; onRemove: () => void }) {
  const url = useMemo(() => URL.createObjectURL(file), [file]);
  useEffect(() => () => URL.revokeObjectURL(url), [url]);
  return (
    <li className="relative size-20 overflow-hidden rounded-xl border border-line bg-cream-200">
      {url && (
        // eslint-disable-next-line @next/next/no-img-element -- local object URL preview
        <img src={url} alt={file.name} className="size-full object-cover" />
      )}
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${file.name}`}
        className="absolute right-1 top-1 grid size-7 place-items-center rounded-full bg-plum-900/80 text-white backdrop-blur hover:bg-berry-700"
      >
        <X className="size-3.5" aria-hidden="true" />
      </button>
    </li>
  );
}

export function QtyStepper({ value, onChange, small }: { value: number; onChange: (n: number) => void; small?: boolean }) {
  return (
    <div className={cn("flex items-center rounded-full border border-line bg-white", small ? "h-10" : "h-14")}>
      <button type="button" onClick={() => onChange(Math.max(1, value - 1))} disabled={value <= 1} aria-label="Decrease quantity" className={cn("grid place-items-center rounded-full text-plum-900 transition-colors hover:bg-cream-200 disabled:opacity-30", small ? "size-10" : "size-14")}>
        <Minus className="size-4" aria-hidden="true" />
      </button>
      <input
        aria-label="Quantity"
        inputMode="numeric"
        value={value}
        onChange={(e) => {
          const n = parseInt(e.target.value.replace(/\D/g, ""), 10);
          onChange(Number.isFinite(n) ? Math.max(1, Math.min(999, n)) : 1);
        }}
        className={cn("bg-transparent text-center font-semibold tabular-nums text-plum-900 focus:outline-none", small ? "w-8 text-sm" : "w-10")}
      />
      <button type="button" onClick={() => onChange(Math.min(999, value + 1))} aria-label="Increase quantity" className={cn("grid place-items-center rounded-full text-plum-900 transition-colors hover:bg-cream-200", small ? "size-10" : "size-14")}>
        <Plus className="size-4" aria-hidden="true" />
      </button>
    </div>
  );
}
