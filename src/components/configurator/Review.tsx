"use client";

import { useMemo } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "motion/react";
import type { InstrumentDefinition } from "@/data/instruments/types";
import type { Locale } from "@/i18n/routing";
import { useConfigurator } from "@/store/configurator";
import { buildSummary, getModel, type SummaryEntry } from "@/lib/summary";

export type OrderResult = {
  order: string;
  /** Null when file storage is unavailable — the PDF still goes by e-mail. */
  pdfUrl: string | null;
  whatsappUrl: string;
};

/** Final review: model blueprint + visual spec sheet with edit jumps. */
export default function Review({
  definition,
  onEdit,
}: {
  definition: InstrumentDefinition;
  /** Jump to a flow step index (0=Modelo, 1..N=field steps, N+1=Referências). */
  onEdit: (stepIndex: number) => void;
}) {
  const t = useTranslations("config");
  const lang = useLocale() as Locale;
  const modelId = useConfigurator((s) => s.modelId);
  const values = useConfigurator((s) => s.values);
  const extra = useConfigurator((s) => s.extra);

  const model = getModel(definition, modelId);
  const entries = useMemo(
    () => buildSummary(definition, values),
    [definition, values],
  );

  const grouped = useMemo(() => {
    const map = new Map<string, SummaryEntry[]>();
    for (const e of entries) {
      const list = map.get(e.stepId) ?? [];
      list.push(e);
      map.set(e.stepId, list);
    }
    return map;
  }, [entries]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="[font-family:var(--font-display)] text-3xl md:text-4xl mb-2">
        {t("reviewTitle")}
      </h2>
      <p className="text-muted text-sm md:text-base mb-8">{t("reviewSubtitle")}</p>

      {/* Model hero — the official technical blueprint */}
      <section className="relative overflow-hidden rounded-lg border border-line mb-6 bg-ink">
        {model && (
          <div className="relative aspect-[4/3] sm:aspect-[16/9]">
            <Image
              src={model.image}
              alt={model.name}
              fill
              sizes="(max-width: 768px) 100vw, 896px"
              className="object-cover sm:object-contain"
              priority
            />
            <div
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/85 via-black/30 to-transparent"
            />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 md:p-6">
              <div>
                <p className="text-[0.65rem] uppercase tracking-[0.3em] text-gold mb-1">
                  {t("summaryModel")}
                </p>
                <p className="[font-family:var(--font-display)] text-2xl md:text-3xl text-cream leading-none">
                  {model.name}
                  <span className="text-muted text-sm ml-3 [font-family:var(--font-body)]">
                    {t("modelScale")} {model.scale}
                  </span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => onEdit(0)}
                className="text-xs uppercase tracking-[0.15em] text-cream/70 hover:text-gold transition-colors cursor-pointer whitespace-nowrap"
              >
                {t("edit")} →
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Visual spec sheet grouped by stage */}
      <div className="space-y-3 mb-6">
        {definition.steps.map((step, stepIndex) => {
          const stepEntries = grouped.get(step.id) ?? [];
          if (stepEntries.length === 0) return null;
          return (
            <motion.section
              key={step.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.35 }}
              className="card-premium rounded-lg p-5 md:p-6"
            >
              <header className="flex items-center justify-between mb-4">
                <h3 className="[font-family:var(--font-display)] text-xl gold-text">
                  {step.title[lang]}
                </h3>
                <button
                  type="button"
                  onClick={() => onEdit(stepIndex + 1)}
                  className="text-xs uppercase tracking-[0.15em] text-muted hover:text-gold transition-colors cursor-pointer"
                >
                  {t("edit")} →
                </button>
              </header>
              <dl className="space-y-3">
                {stepEntries.map((entry) => (
                  <div
                    key={entry.fieldId}
                    className="flex items-center gap-4 text-sm border-b border-line/40 pb-3 last:border-0 last:pb-0"
                  >
                    {/* Choice thumbnail keeps the photos protagonists up to the end */}
                    {entry.answered && entry.kind === "choice" && (
                      entry.isOther ? (
                        <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md border border-gold/40">
                          <Image src="/refs/outro.webp" alt="" fill sizes="56px" className="object-cover" />
                        </span>
                      ) : entry.image ? (
                        <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md border border-line">
                          <Image
                            src={entry.image}
                            alt={entry.valueLabel?.[lang] ?? ""}
                            fill
                            sizes="56px"
                            className="object-cover"
                          />
                        </span>
                      ) : entry.swatch ? (
                        <span
                          aria-hidden
                          className="h-14 w-14 shrink-0 rounded-md border border-line"
                          style={{ background: entry.swatch }}
                        />
                      ) : null
                    )}
                    <div className="min-w-0 flex-1">
                      <dt className="text-muted text-xs uppercase tracking-wider mb-0.5">
                        {entry.fieldLabel[lang]}
                      </dt>
                      <dd>
                        {!entry.answered ? (
                          <span className="text-muted/60">—</span>
                        ) : entry.kind === "text" ? (
                          <span className="text-cream/90">{entry.text}</span>
                        ) : entry.isOther ? (
                          <span>
                            <span className="text-[0.65rem] uppercase tracking-widest text-gold border border-gold/40 rounded-full px-2 py-0.5 mr-2">
                              {t("customBadge")}
                            </span>
                            <span className="text-cream/90">{entry.otherText}</span>
                            {entry.images.length > 0 && (
                              <span className="flex gap-2 mt-2">
                                {entry.images.map((img) => (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img
                                    key={img.url}
                                    src={img.url}
                                    alt={img.name}
                                    className="h-12 w-12 object-cover rounded-sm border border-line"
                                  />
                                ))}
                              </span>
                            )}
                          </span>
                        ) : (
                          <span className="text-cream/90">{entry.valueLabel?.[lang]}</span>
                        )}
                      </dd>
                    </div>
                  </div>
                ))}
              </dl>
            </motion.section>
          );
        })}
      </div>

      {/* References & notes */}
      {(extra.observations.trim() || extra.references.length > 0) && (
        <section className="card-premium rounded-lg p-5 md:p-6">
          <header className="flex items-center justify-between mb-4">
            <h3 className="[font-family:var(--font-display)] text-xl gold-text">
              {t("referencesTitle")}
            </h3>
            <button
              type="button"
              onClick={() => onEdit(definition.steps.length + 1)}
              className="text-xs uppercase tracking-[0.15em] text-muted hover:text-gold transition-colors cursor-pointer"
            >
              {t("edit")} →
            </button>
          </header>
          {extra.observations.trim() && (
            <p className="text-cream/90 text-sm whitespace-pre-wrap mb-4">
              {extra.observations}
            </p>
          )}
          {extra.references.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {extra.references.map((img) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={img.url}
                  src={img.url}
                  alt={img.name}
                  className="h-16 w-16 object-cover rounded-sm border border-line"
                />
              ))}
            </div>
          )}
        </section>
      )}
    </motion.div>
  );
}
