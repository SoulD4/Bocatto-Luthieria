"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { AnimatePresence, motion } from "motion/react";
import type { ChoiceField, Field } from "@/data/instruments/types";
import type { Locale } from "@/i18n/routing";
import { OTHER_OPTION_ID, useConfigurator } from "@/store/configurator";
import ImageUpload from "./ImageUpload";

const OTHER_IMAGE = "/refs/outro.webp";

/** Gold check badge that pops in when a card is selected. */
function SelectedBadge() {
  return (
    <motion.span
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: "spring", stiffness: 500, damping: 28 }}
      className="absolute top-2.5 right-2.5 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-gold text-ink shadow-[0_2px_10px_rgba(0,0,0,0.45)]"
      aria-hidden
    >
      <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none">
        <path d="M3 8.5 6.5 12 13 4.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </motion.span>
  );
}

/** Large photo card — the reference image is the protagonist. */
function ImageCard({
  image,
  label,
  sublabel,
  active,
  dashed,
  onClick,
}: {
  image: string;
  label: string;
  sublabel?: string;
  active: boolean;
  dashed?: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      whileTap={{ scale: 0.98 }}
      className={`group relative overflow-hidden rounded-lg text-left cursor-pointer transition-all duration-300 border ${
        active
          ? "border-gold shadow-[0_0_28px_rgba(201,162,39,0.22)]"
          : `${dashed ? "border-dashed" : ""} border-line hover:border-gold/50 hover:shadow-[0_0_18px_rgba(201,162,39,0.08)]`
      }`}
    >
      <span className="relative block aspect-[4/3] overflow-hidden bg-surface-2">
        <Image
          src={image}
          alt={label}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 280px"
          className={`object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05] ${
            active ? "scale-[1.03]" : ""
          }`}
        />
        {/* Legibility gradient behind the label */}
        <span
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/85 via-black/35 to-transparent"
        />
        <span className="absolute inset-x-0 bottom-0 px-3.5 pb-3 pt-6">
          <span
            className={`block text-sm leading-snug transition-colors duration-300 ${
              active ? "text-gold-light" : "text-cream"
            }`}
          >
            {label}
          </span>
          {sublabel && (
            <span className="block text-[0.7rem] text-cream/60 mt-0.5">{sublabel}</span>
          )}
        </span>
        <AnimatePresence>{active && <SelectedBadge />}</AnimatePresence>
      </span>
    </motion.button>
  );
}

/** Compact card for options without a photo (swatch / text only). */
function TextCard({
  label,
  swatch,
  description,
  active,
  dashed,
  onClick,
}: {
  label: string;
  swatch?: string;
  description?: string;
  active: boolean;
  dashed?: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      whileTap={{ scale: 0.98 }}
      className={`card-premium relative rounded-lg p-4 text-left transition-all duration-300 cursor-pointer ${
        dashed ? "border-dashed" : ""
      } ${active ? "!border-gold shadow-[0_0_20px_rgba(201,162,39,0.15)]" : ""}`}
    >
      <span className="flex items-start gap-3 pr-7">
        {swatch && (
          <span
            aria-hidden
            className="mt-0.5 h-5 w-5 shrink-0 rounded-full border border-line"
            style={{ background: swatch }}
          />
        )}
        <span>
          <span className={`block text-sm ${active ? "text-gold-light" : "text-cream/90"}`}>
            {label}
          </span>
          {description && (
            <span className="block text-xs text-muted mt-1 leading-relaxed">{description}</span>
          )}
        </span>
      </span>
      <AnimatePresence>{active && <SelectedBadge />}</AnimatePresence>
    </motion.button>
  );
}

function ChoiceFieldView({ field, error }: { field: ChoiceField; error?: string }) {
  const t = useTranslations("config");
  const lang = useLocale() as Locale;
  const value = useConfigurator((s) => s.values[field.id]);
  const setValue = useConfigurator((s) => s.setValue);
  const patchValue = useConfigurator((s) => s.patchValue);

  const allowOther = field.allowOther !== false;
  const selected = value?.optionId;
  const hasImages = field.options.some((o) => o.image);

  const toggle = (id: string) =>
    setValue(
      field.id,
      selected === id
        ? { optionId: undefined }
        : id === OTHER_OPTION_ID
          ? { optionId: id, otherText: value?.otherText ?? "", images: value?.images ?? [] }
          : { optionId: id },
    );

  return (
    <fieldset>
      <legend className="text-sm text-cream/90 mb-3 flex items-center gap-2 flex-wrap">
        {field.label[lang]}
        {!field.required && (
          <span className="text-[0.65rem] uppercase tracking-widest text-muted border border-line rounded-full px-2 py-0.5">
            {t("optionalBadge")}
          </span>
        )}
      </legend>

      {hasImages ? (
        <div className="grid gap-3 md:gap-4 grid-cols-2 lg:grid-cols-3">
          {field.options.map((opt) => (
            <ImageCard
              key={opt.id}
              image={opt.image ?? OTHER_IMAGE}
              label={opt.label[lang]}
              sublabel={opt.description?.[lang]}
              active={selected === opt.id}
              onClick={() => toggle(opt.id)}
            />
          ))}
          {allowOther && (
            <ImageCard
              image={OTHER_IMAGE}
              label={`✦ ${t("otherLabel")}`}
              sublabel={t("otherHelp")}
              active={selected === OTHER_OPTION_ID}
              dashed
              onClick={() => toggle(OTHER_OPTION_ID)}
            />
          )}
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {field.options.map((opt) => (
            <TextCard
              key={opt.id}
              label={opt.label[lang]}
              swatch={opt.swatch}
              description={opt.description?.[lang]}
              active={selected === opt.id}
              onClick={() => toggle(opt.id)}
            />
          ))}
          {allowOther && (
            <TextCard
              label={`✦ ${t("otherLabel")}`}
              description={t("otherHelp")}
              active={selected === OTHER_OPTION_ID}
              dashed
              onClick={() => toggle(OTHER_OPTION_ID)}
            />
          )}
        </div>
      )}

      {/* "Other" expansion: free text + reference photos */}
      <AnimatePresence>
        {allowOther && selected === OTHER_OPTION_ID && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-4 card-premium !border-gold/40 rounded-lg p-5 space-y-4">
              <textarea
                rows={3}
                autoFocus
                value={value?.otherText ?? ""}
                onChange={(e) => patchValue(field.id, { otherText: e.target.value })}
                placeholder={t("otherPlaceholder")}
                maxLength={500}
                className="w-full bg-surface-2 border border-line rounded-sm px-4 py-3 text-sm text-cream placeholder:text-muted/60 focus:outline-none focus:border-gold/70 transition-colors"
              />
              <ImageUpload
                images={value?.images ?? []}
                onChange={(images) => patchValue(field.id, { images })}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && <p className="text-red-400/90 text-xs mt-2">{error}</p>}
    </fieldset>
  );
}

/** Renders one configurator field: a choice grid (with "Other") or free text. */
export default function FieldView({ field, error }: { field: Field; error?: string }) {
  const t = useTranslations("config");
  const lang = useLocale() as Locale;
  const value = useConfigurator((s) => s.values[field.id]);
  const setValue = useConfigurator((s) => s.setValue);

  if (field.kind === "text") {
    return (
      <fieldset>
        <legend className="text-sm text-cream/90 mb-1 flex items-center gap-2 flex-wrap">
          {field.label[lang]}
          <span className="text-[0.65rem] uppercase tracking-widest text-muted border border-line rounded-full px-2 py-0.5">
            {t("optionalBadge")}
          </span>
        </legend>
        <textarea
          rows={2}
          value={value?.text ?? ""}
          onChange={(e) => setValue(field.id, { text: e.target.value })}
          placeholder={field.placeholder?.[lang] ?? t("freeTextPlaceholder")}
          maxLength={500}
          className="mt-2 w-full bg-surface-2 border border-line rounded-sm px-4 py-3 text-sm text-cream placeholder:text-muted/60 focus:outline-none focus:border-gold/70 transition-colors"
        />
      </fieldset>
    );
  }

  return <ChoiceFieldView field={field} error={error} />;
}
