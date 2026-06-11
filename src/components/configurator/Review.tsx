"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "motion/react";
import type { InstrumentDefinition } from "@/data/instruments/types";
import type { Locale } from "@/i18n/routing";
import { useConfigurator } from "@/store/configurator";
import { buildSummary, getModel, type SummaryEntry } from "@/lib/summary";

const GuitarViewer = dynamic(() => import("./GuitarViewer"), {
  ssr: false,
  loading: () => (
    <div className="h-[420px] flex items-center justify-center text-muted text-sm animate-pulse">
      …
    </div>
  ),
});

export type OrderResult = {
  order: string;
  /** Null when file storage is unavailable — the PDF still goes by e-mail. */
  pdfUrl: string | null;
  whatsappUrl: string;
};

/** Etapa 6 — final review: 3D + spec sheet with edit jumps to each step. */
export default function Review({
  definition,
  onEdit,
}: {
  definition: InstrumentDefinition;
  /** Jump to a flow step index (0=Modelo, 1..3=field steps, 4=Referências). */
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

      {/* 3D visualization */}
      <div className="card-premium rounded-md mb-10 overflow-hidden">
        <GuitarViewer modelId={modelId} values={values} />
        <p className="text-[0.7rem] text-muted text-center px-4 pb-4">
          {t("viewerHint")}
        </p>
      </div>

      {/* Model */}
      <section className="card-premium rounded-md p-6 mb-4">
        <header className="flex items-center justify-between mb-4">
          <h3 className="[font-family:var(--font-display)] text-xl gold-text">
            {t("summaryModel")}
          </h3>
          <button
            type="button"
            onClick={() => onEdit(0)}
            className="text-xs uppercase tracking-[0.15em] text-muted hover:text-gold transition-colors cursor-pointer"
          >
            {t("edit")} →
          </button>
        </header>
        {model ? (
          <p className="text-cream/90 text-sm">
            <span className="[font-family:var(--font-display)] text-lg">
              {model.name}
            </span>
            <span className="text-muted"> · {t("modelScale")} {model.scale}</span>
          </p>
        ) : (
          <p className="text-muted/60 text-sm">—</p>
        )}
      </section>

      {/* Spec sheet grouped by step */}
      <div className="space-y-4 mb-4">
        {definition.steps.map((step, stepIndex) => {
          const stepEntries = grouped.get(step.id) ?? [];
          return (
            <section key={step.id} className="card-premium rounded-md p-6">
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
                    className="flex flex-col sm:flex-row sm:justify-between gap-1 text-sm border-b border-line/40 pb-3 last:border-0 last:pb-0"
                  >
                    <dt className="text-muted">{entry.fieldLabel[lang]}</dt>
                    <dd className="sm:text-right sm:max-w-[60%]">
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
                            <span className="flex gap-2 mt-2 sm:justify-end">
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
                        <span className="text-cream/90 inline-flex items-center gap-2">
                          {entry.swatch && (
                            <span
                              className="h-3.5 w-3.5 rounded-full border border-line inline-block"
                              style={{ background: entry.swatch }}
                            />
                          )}
                          {entry.valueLabel?.[lang]}
                        </span>
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          );
        })}
      </div>

      {/* References & notes */}
      {(extra.observations.trim() || extra.references.length > 0) && (
        <section className="card-premium rounded-md p-6">
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
