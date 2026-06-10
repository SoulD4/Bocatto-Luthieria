"use client";

import { useLocale, useTranslations } from "next-intl";
import type { Field } from "@/data/instruments/types";
import type { Locale } from "@/i18n/routing";
import {
  OTHER_OPTION_ID,
  useConfigurator,
} from "@/store/configurator";
import ImageUpload from "./ImageUpload";

/** Renders one configurator field: a choice grid (with "Other") or free text. */
export default function FieldView({
  field,
  error,
}: {
  field: Field;
  error?: string;
}) {
  const t = useTranslations("config");
  const lang = useLocale() as Locale;
  const value = useConfigurator((s) => s.values[field.id]);
  const setValue = useConfigurator((s) => s.setValue);
  const patchValue = useConfigurator((s) => s.patchValue);

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

  const allowOther = field.allowOther !== false;
  const selected = value?.optionId;

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

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {field.options.map((opt) => {
          const active = selected === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() =>
                setValue(field.id, { optionId: active ? undefined : opt.id })
              }
              aria-pressed={active}
              className={`card-premium rounded-md p-4 text-left transition-all duration-200 cursor-pointer ${
                active
                  ? "!border-gold shadow-[0_0_20px_rgba(201,162,39,0.15)]"
                  : ""
              }`}
            >
              <span className="flex items-start gap-3">
                {opt.swatch && (
                  <span
                    aria-hidden
                    className="mt-0.5 h-5 w-5 shrink-0 rounded-full border border-line"
                    style={{ background: opt.swatch }}
                  />
                )}
                <span>
                  <span
                    className={`block text-sm ${active ? "text-gold-light" : "text-cream/90"}`}
                  >
                    {opt.label[lang]}
                  </span>
                  {opt.description && (
                    <span className="block text-xs text-muted mt-1 leading-relaxed">
                      {opt.description[lang]}
                    </span>
                  )}
                </span>
              </span>
            </button>
          );
        })}

        {allowOther && (
          <button
            type="button"
            onClick={() =>
              setValue(
                field.id,
                selected === OTHER_OPTION_ID
                  ? { optionId: undefined }
                  : {
                      optionId: OTHER_OPTION_ID,
                      otherText: value?.otherText ?? "",
                      images: value?.images ?? [],
                    },
              )
            }
            aria-pressed={selected === OTHER_OPTION_ID}
            className={`card-premium rounded-md p-4 text-left transition-all duration-200 cursor-pointer border-dashed ${
              selected === OTHER_OPTION_ID
                ? "!border-gold shadow-[0_0_20px_rgba(201,162,39,0.15)]"
                : ""
            }`}
          >
            <span
              className={`block text-sm ${selected === OTHER_OPTION_ID ? "text-gold-light" : "text-cream/90"}`}
            >
              ✦ {t("otherLabel")}
            </span>
            <span className="block text-xs text-muted mt-1">
              {t("otherHelp")}
            </span>
          </button>
        )}
      </div>

      {/* "Other" expansion: free text + reference photos */}
      {allowOther && selected === OTHER_OPTION_ID && (
        <div className="mt-4 card-premium !border-gold/40 rounded-md p-5 space-y-4">
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
      )}

      {error && <p className="text-red-400/90 text-xs mt-2">{error}</p>}
    </fieldset>
  );
}
