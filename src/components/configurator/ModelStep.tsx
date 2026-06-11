"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { AnimatePresence, motion } from "motion/react";
import type { InstrumentDefinition } from "@/data/instruments/types";
import type { Locale } from "@/i18n/routing";
import { useConfigurator } from "@/store/configurator";

/** Etapa 1 — model selection over the official technical blueprints. */
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

      <div className="grid gap-4 md:gap-5 sm:grid-cols-2">
        {definition.models.map((model, i) => {
          const active = modelId === model.id;
          return (
            <motion.button
              key={model.id}
              type="button"
              onClick={() => setModel(model.id)}
              aria-pressed={active}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
              whileTap={{ scale: 0.985 }}
              className={`group relative overflow-hidden rounded-lg text-left cursor-pointer border transition-all duration-300 bg-surface ${
                active
                  ? "border-gold shadow-[0_0_32px_rgba(201,162,39,0.22)]"
                  : "border-line hover:border-gold/50 hover:shadow-[0_0_18px_rgba(201,162,39,0.08)]"
              }`}
            >
              {/* Official technical blueprint */}
              <span className="relative block aspect-[4/3] overflow-hidden bg-ink">
                <Image
                  src={model.image}
                  alt={model.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 440px"
                  className={`object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] ${
                    active ? "scale-[1.02]" : ""
                  }`}
                />
                <AnimatePresence>
                  {active && (
                    <motion.span
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 28 }}
                      className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-gold text-ink shadow-[0_2px_12px_rgba(0,0,0,0.5)]"
                      aria-hidden
                    >
                      <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none">
                        <path d="M3 8.5 6.5 12 13 4.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </motion.span>
                  )}
                </AnimatePresence>
              </span>

              <span className="block p-5 md:p-6">
                <span className="flex items-baseline justify-between gap-3 mb-2">
                  <span
                    className={`[font-family:var(--font-display)] text-2xl ${active ? "gold-text" : "text-cream"}`}
                  >
                    {model.name}
                  </span>
                  <span className="text-[0.7rem] uppercase tracking-widest text-muted whitespace-nowrap">
                    {t("modelScale")} {model.scale}
                  </span>
                </span>
                <span className="block text-sm text-muted leading-relaxed mb-4">
                  {model.description[lang]}
                </span>
                <span className="block space-y-1.5">
                  {model.characteristics.map((c, j) => (
                    <span key={j} className="text-xs text-cream/80 flex items-start gap-2">
                      <span className="text-gold mt-0.5">·</span>
                      {c[lang]}
                    </span>
                  ))}
                </span>
                <span
                  className={`mt-5 inline-block text-xs uppercase tracking-[0.15em] transition-colors duration-300 ${
                    active ? "text-gold-light" : "text-muted group-hover:text-cream/80"
                  }`}
                >
                  {active ? `✓ ${t("modelSelected")}` : t("modelSelect")}
                </span>
              </span>
            </motion.button>
          );
        })}
      </div>

      {error && <p className="text-red-400/90 text-sm mt-4">{error}</p>}
    </motion.div>
  );
}
