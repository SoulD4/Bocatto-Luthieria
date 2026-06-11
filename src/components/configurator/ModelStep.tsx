"use client";

import { useLocale, useTranslations } from "next-intl";
import { motion } from "motion/react";
import type { InstrumentDefinition } from "@/data/instruments/types";
import type { Locale } from "@/i18n/routing";
import { useConfigurator } from "@/store/configurator";

/** Etapa 1 — model selection. Each model defines scale and the base of the build. */
export default function ModelStep({
  definition,
  error,
}: {
  definition: InstrumentDefinition;
  error?: string;
}) {
  const t = useTranslations("config");
  const lang = useLocale() as Locale;
  const modelId = useConfigurator((s) => s.modelId);
  const setModel = useConfigurator((s) => s.setModel);

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <h2 className="[font-family:var(--font-display)] text-3xl md:text-4xl mb-2">
        {t("modelTitle")}
      </h2>
      <p className="text-muted text-sm md:text-base mb-8 max-w-2xl">
        {t("modelIntro")}
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {definition.models.map((model) => {
          const active = modelId === model.id;
          return (
            <button
              key={model.id}
              type="button"
              onClick={() => setModel(model.id)}
              aria-pressed={active}
              className={`card-premium rounded-md p-6 text-left transition-all duration-200 cursor-pointer ${
                active ? "!border-gold shadow-[0_0_24px_rgba(201,162,39,0.18)]" : ""
              }`}
            >
              <div className="flex items-baseline justify-between gap-3 mb-2">
                <h3
                  className={`[font-family:var(--font-display)] text-2xl ${active ? "gold-text" : "text-cream"}`}
                >
                  {model.name}
                </h3>
                <span className="text-[0.7rem] uppercase tracking-widest text-muted whitespace-nowrap">
                  {t("modelScale")} {model.scale}
                </span>
              </div>
              <p className="text-sm text-muted leading-relaxed mb-4">
                {model.description[lang]}
              </p>
              <ul className="space-y-1.5">
                {model.characteristics.map((c, i) => (
                  <li
                    key={i}
                    className="text-xs text-cream/80 flex items-start gap-2"
                  >
                    <span className="text-gold mt-0.5">·</span>
                    {c[lang]}
                  </li>
                ))}
              </ul>
              <span
                className={`mt-5 inline-block text-xs uppercase tracking-[0.15em] ${active ? "text-gold-light" : "text-muted"}`}
              >
                {active ? `✓ ${t("modelSelected")}` : t("modelSelect")}
              </span>
            </button>
          );
        })}
      </div>

      {error && <p className="text-red-400/90 text-sm mt-4">{error}</p>}
    </motion.div>
  );
}
