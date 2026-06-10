"use client";

import { useLocale, useTranslations } from "next-intl";
import type { Step } from "@/data/instruments/types";
import type { Locale } from "@/i18n/routing";

export default function ProgressBar({
  steps,
  current,
  maxVisited,
  onJump,
}: {
  steps: Step[];
  current: number;
  maxVisited: number;
  onJump: (index: number) => void;
}) {
  const t = useTranslations("config");
  const lang = useLocale() as Locale;

  return (
    <div className="mb-10">
      <p className="text-xs uppercase tracking-[0.25em] text-muted mb-3">
        {t("stepLabel", { current: current + 1, total: steps.length })}
        <span className="text-gold ml-3">{steps[current].title[lang]}</span>
      </p>
      <div className="flex gap-1.5">
        {steps.map((step, i) => {
          const reachable = i <= maxVisited;
          return (
            <button
              key={step.id}
              type="button"
              disabled={!reachable}
              onClick={() => onJump(i)}
              aria-label={step.title[lang]}
              title={step.title[lang]}
              className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                i === current
                  ? "bg-gold"
                  : i <= maxVisited
                    ? "bg-gold/40 hover:bg-gold/70 cursor-pointer"
                    : "bg-line"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}
