"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { AnimatePresence, motion } from "motion/react";
import type { InstrumentDefinition } from "@/data/instruments/types";
import type { Locale } from "@/i18n/routing";
import { useConfigurator } from "@/store/configurator";
import { validateStep } from "@/lib/summary";
import { Button } from "@/components/ui/Button";
import ProgressBar from "./ProgressBar";
import ModelStep from "./ModelStep";
import StepView from "./StepView";
import ReferencesStep from "./ReferencesStep";
import Review, { type OrderResult } from "./Review";
import SendStep from "./SendStep";
import Success from "./Success";

type Phase = "welcome" | "flow" | "success";

/**
 * Seven-stage creation flow: Modelo → (field steps) → Referências → Revisão →
 * Envio. Field steps come from `definition.steps`, so the same flow serves any
 * future instrument family (nylon, guitar, bass, viola) unchanged.
 */
export default function ConfiguratorClient({
  definition,
}: {
  definition: InstrumentDefinition;
}) {
  const t = useTranslations("config");
  const lang = useLocale() as Locale;
  const modelId = useConfigurator((s) => s.modelId);
  const values = useConfigurator((s) => s.values);
  const reset = useConfigurator((s) => s.reset);

  const fieldSteps = definition.steps;
  const N = fieldSteps.length;
  // Indices: 0=Modelo, 1..N=field steps, N+1=Referências, N+2=Revisão, N+3=Envio
  const REFERENCES = N + 1;
  const REVIEW = N + 2;
  const SEND = N + 3;

  const labels = useMemo(
    () => [
      t("stepModel"),
      ...fieldSteps.map((s) => s.title[lang]),
      t("stepReferences"),
      t("stepReview"),
      t("stepSend"),
    ],
    [t, fieldSteps, lang],
  );

  const [phase, setPhase] = useState<Phase>("welcome");
  const [step, setStep] = useState(0);
  const [maxVisited, setMaxVisited] = useState(0);
  const [errors, setErrors] = useState<Record<string, "required" | "otherText">>({});
  const [modelError, setModelError] = useState<string | undefined>();
  const [result, setResult] = useState<OrderResult | null>(null);

  const hasProgress = modelId !== null || Object.keys(values).length > 0;

  // Warn before leaving with an unsent creation in progress.
  useEffect(() => {
    if (!hasProgress || phase === "success") return;
    const handler = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [hasProgress, phase]);

  function scrollTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function validateCurrent(): boolean {
    if (step === 0) {
      if (!modelId) {
        setModelError(t("modelRequired"));
        return false;
      }
      return true;
    }
    if (step >= 1 && step <= N) {
      const stepErrors = validateStep(fieldSteps[step - 1], values);
      setErrors(stepErrors);
      return Object.keys(stepErrors).length === 0;
    }
    return true;
  }

  function goNext() {
    if (!validateCurrent()) return;
    setStep((s) => {
      const next = Math.min(s + 1, SEND);
      setMaxVisited((m) => Math.max(m, next));
      return next;
    });
    scrollTop();
  }

  function goBack() {
    setErrors({});
    setModelError(undefined);
    if (step === 0) {
      setPhase("welcome");
    } else {
      setStep((s) => s - 1);
    }
    scrollTop();
  }

  function jumpTo(index: number) {
    setErrors({});
    setModelError(undefined);
    setStep(index);
    setMaxVisited((m) => Math.max(m, index));
    setPhase("flow");
    scrollTop();
  }

  function restart() {
    reset();
    setResult(null);
    setStep(0);
    setMaxVisited(0);
    setPhase("welcome");
    window.scrollTo({ top: 0 });
  }

  return (
    <div className="mx-auto max-w-4xl px-5 py-12 md:py-16 w-full">
      <AnimatePresence mode="wait">
        {phase === "welcome" && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center py-12"
          >
            <p className="text-gold text-xs uppercase tracking-[0.35em] mb-6">
              {t("welcomeKicker")}
            </p>
            <h1 className="[font-family:var(--font-display)] text-4xl md:text-6xl mb-6">
              {t("welcomeTitle")}
            </h1>
            <p className="text-muted max-w-xl mx-auto mb-4">{t("welcomeBody")}</p>
            <p className="text-cream/70 text-sm max-w-md mx-auto mb-12">
              {t("welcomeNote")}
            </p>
            <Button
              onClick={() => {
                setPhase("flow");
                setMaxVisited((m) => Math.max(m, 0));
              }}
            >
              {t("welcomeStart")}
            </Button>
          </motion.div>
        )}

        {phase === "flow" && (
          <motion.div
            key="flow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ProgressBar
              labels={labels}
              current={step}
              maxVisited={maxVisited}
              onJump={jumpTo}
            />

            {step === 0 && (
              <ModelStep definition={definition} error={modelError} />
            )}
            {step >= 1 && step <= N && (
              <StepView step={fieldSteps[step - 1]} errors={errors} />
            )}
            {step === REFERENCES && <ReferencesStep />}
            {step === REVIEW && (
              <Review definition={definition} onEdit={jumpTo} />
            )}
            {step === SEND && (
              <SendStep
                definition={definition}
                onSuccess={(r) => {
                  setResult(r);
                  setPhase("success");
                  scrollTop();
                }}
              />
            )}

            {/* Navigation (the Send step submits on its own) */}
            <div className="flex justify-between items-center mt-12 pt-6 border-t border-line/50">
              <Button variant="ghost" onClick={goBack}>
                ← {t("back")}
              </Button>
              {step < SEND && (
                <Button onClick={goNext}>
                  {step === REVIEW ? t("reviewToSend") : t("next")} →
                </Button>
              )}
            </div>
          </motion.div>
        )}

        {phase === "success" && result && (
          <Success key="success" result={result} onRestart={restart} />
        )}
      </AnimatePresence>
    </div>
  );
}
