"use client";

import { useLocale, useTranslations } from "next-intl";
import { motion } from "motion/react";
import type { Step } from "@/data/instruments/types";
import type { Locale } from "@/i18n/routing";
import { useConfigurator } from "@/store/configurator";
import { visibleFields } from "@/lib/summary";
import FieldView from "./FieldView";

export default function StepView({
  step,
  errors,
}: {
  step: Step;
  errors: Record<string, "required" | "otherText">;
}) {
  const t = useTranslations("config");
  const lang = useLocale() as Locale;
  const values = useConfigurator((s) => s.values);

  return (
    <motion.div
      key={step.id}
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <h2 className="[font-family:var(--font-display)] text-3xl md:text-4xl mb-2">
        {step.title[lang]}
      </h2>
      {step.intro && (
        <p className="text-muted text-sm md:text-base mb-8 max-w-2xl">
          {step.intro[lang]}
        </p>
      )}

      <div className="space-y-10">
        {visibleFields(step, values).map((field) => (
          <FieldView
            key={field.id}
            field={field}
            error={
              errors[field.id] === "required"
                ? t("requiredField")
                : errors[field.id] === "otherText"
                  ? t("otherRequired")
                  : undefined
            }
          />
        ))}
      </div>
    </motion.div>
  );
}
