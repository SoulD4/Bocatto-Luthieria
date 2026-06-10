"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "motion/react";
import type { InstrumentDefinition } from "@/data/instruments/types";
import { useConfigurator } from "@/store/configurator";
import { validateStep } from "@/lib/summary";
import { Button } from "@/components/ui/Button";
import ProgressBar from "./ProgressBar";
import StepView from "./StepView";
import Review, { type OrderResult } from "./Review";
import Success from "./Success";

type Phase = "welcome" | "steps" | "review" | "success";

export default function ConfiguratorClient({
  definition,
}: {
  definition: InstrumentDefinition;
}) {
  const t = useTranslations("config");
  const values = useConfigurator((s) => s.values);
  const reset = useConfigurator((s) => s.reset);

  const [phase, setPhase] = useState<Phase>("welcome");
  const [stepIndex, setStepIndex] = useState(0);
  const [maxVisited, setMaxVisited] = useState(0);
  const [errors, setErrors] = useState<Record<string, "required" | "otherText">>({});
  const [result, setResult] = useState<OrderResult | null>(null);

  const steps = definition.steps;
  const hasProgress = Object.keys(values).length > 0;

  // Warn before leaving with an unsent configuration in progress.
  useEffect(() => {
    if (!hasProgress || phase === "success") return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [hasProgress, phase]);

  function goNext() {
    const stepErrors = validateStep(steps[stepIndex], values);
    setErrors(stepErrors);
    if (Object.keys(stepErrors).length > 0) return;

    if (stepIndex === steps.length - 1) {
      setPhase("review");
    } else {
      const next = stepIndex + 1;
      setStepIndex(next);
      setMaxVisited((m) => Math.max(m, next));
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goBack() {
    setErrors({});
    if (stepIndex === 0) {
      setPhase("welcome");
    } else {
      setStepIndex(stepIndex - 1);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function jumpTo(index: number) {
    setErrors({});
    setStepIndex(index);
    setPhase("steps");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function restart() {
    reset();
    setResult(null);
    setStepIndex(0);
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
            <Button onClick={() => setPhase("steps")}>{t("welcomeStart")}</Button>
          </motion.div>
        )}

        {phase === "steps" && (
          <motion.div
            key="steps"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ProgressBar
              steps={steps}
              current={stepIndex}
              maxVisited={maxVisited}
              onJump={jumpTo}
            />
            <StepView step={steps[stepIndex]} errors={errors} />
            <div className="flex justify-between items-center mt-12 pt-6 border-t border-line/50">
              <Button variant="ghost" onClick={goBack}>
                ← {t("back")}
              </Button>
              <Button onClick={goNext}>
                {stepIndex === steps.length - 1 ? t("review") : t("next")} →
              </Button>
            </div>
          </motion.div>
        )}

        {phase === "review" && (
          <motion.div
            key="review"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Review
              definition={definition}
              onEdit={jumpTo}
              onSuccess={(r) => {
                setResult(r);
                setPhase("success");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
            <div className="mt-8">
              <Button variant="ghost" onClick={() => jumpTo(steps.length - 1)}>
                ← {t("back")}
              </Button>
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
