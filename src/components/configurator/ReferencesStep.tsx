"use client";

import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { useConfigurator } from "@/store/configurator";
import ImageUpload from "./ImageUpload";

/** Etapa 5 — general notes and reference images (not tied to a single field). */
export default function ReferencesStep() {
  const t = useTranslations("config");
  const observations = useConfigurator((s) => s.extra.observations);
  const references = useConfigurator((s) => s.extra.references);
  const setObservations = useConfigurator((s) => s.setObservations);
  const setReferences = useConfigurator((s) => s.setReferences);

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <h2 className="[font-family:var(--font-display)] text-3xl md:text-4xl mb-2">
        {t("referencesTitle")}
      </h2>
      <p className="text-muted text-sm md:text-base mb-8 max-w-2xl">
        {t("referencesIntro")}
      </p>

      <div className="card-premium rounded-md p-6 space-y-6">
        <div>
          <label
            htmlFor="observations"
            className="block text-sm text-cream/90 mb-2"
          >
            {t("observationsLabel")}
          </label>
          <textarea
            id="observations"
            rows={5}
            maxLength={2000}
            value={observations}
            onChange={(e) => setObservations(e.target.value)}
            placeholder={t("observationsPlaceholder")}
            className="w-full bg-surface-2 border border-line rounded-sm px-4 py-3 text-sm text-cream placeholder:text-muted/60 focus:outline-none focus:border-gold/70 transition-colors"
          />
        </div>

        <div>
          <p className="text-sm text-cream/90 mb-1">{t("generalRefsLabel")}</p>
          <p className="text-xs text-muted mb-3">{t("generalRefsHint")}</p>
          <ImageUpload images={references} onChange={setReferences} max={4} />
        </div>
      </div>
    </motion.div>
  );
}
