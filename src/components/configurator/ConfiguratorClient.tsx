"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { AnimatePresence, motion } from "motion/react";
import type { InstrumentDefinition } from "@/data/instruments/types";
import { families, type InstrumentFamily } from "@/data/instruments/families";
import type { Locale } from "@/i18n/routing";
import { useConfigurator } from "@/store/configurator";
import { validateStep } from "@/lib/summary";
import { Button } from "@/components/ui/Button";
import ProgressBar from "./ProgressBar";
import SelectionStep, { ComingSoon } from "./SelectionStep";
import ModelStep from "./ModelStep";
import StepView from "./StepView";
import ReferencesStep from "./ReferencesStep";
import Review, { type OrderResult } from "./Review";
import SendStep from "./SendStep";
import Success from "./Success";

/**
 * Creation flow: Welcome → Instrument family → (variant, e.g. steel/nylon) →
 * field steps → References → Review → Send. Families and variants come from
 * `families`; unavailable branches show an elegant coming-soon screen. Field
 * steps come from the chosen InstrumentDefinition, so new instruments plug in
 * by data alone (see src/data/instruments/families.ts).
 */
type Phase = "welcome" | "family" | "variant" | "coming-soon" | "flow" | "success";

export default function ConfiguratorClient() {
  const t = useTranslations("config");
  const lang = useLocale() as Locale;
  const modelId = useConfigurator((s) => s.modelId);
  const values = useConfigurator((s) => s.values);
  const reset = useConfigurator((s) => s.reset);

  const [phase, setPhase] = useState<Phase>("welcome");
  const [family, setFamily] = useState<InstrumentFamily | null>(null);
  const [definition, setDefinition] = useState<InstrumentDefinition | null>(null);
  const lastDefinitionId = useRef<string | null>(null);
  const [comingSoon, setComingSoon] = useState<{
    name: string;
    note: string;
    backTo: "family" | "variant";
  } | null>(null);

  const fieldSteps = useMemo(() => definition?.steps ?? [], [definition]);
  const N = fieldSteps.length;
  // Flow indices: 0=Modelo, 1..N=field steps, N+1=Referências, N+2=Revisão, N+3=Envio
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

  function chooseFamily(id: string) {
    const fam = families.find((f) => f.id === id);
    if (!fam) return;
    setFamily(fam);
    if (!fam.variants?.some((v) => v.definition)) {
      setComingSoon({
        name: fam.name[lang],
        note: (fam.comingSoonNote ?? { pt: "", en: "" })[lang],
        backTo: "family",
      });
      setPhase("coming-soon");
    } else {
      setPhase("variant");
    }
    scrollTop();
  }

  function chooseVariant(id: string) {
    const variant = family?.variants?.find((v) => v.id === id);
    if (!variant) return;
    if (!variant.definition) {
      setComingSoon({
        name: variant.name[lang],
        note: (variant.comingSoonNote ?? { pt: "", en: "" })[lang],
        backTo: "variant",
      });
      setPhase("coming-soon");
    } else {
      // Fresh sheet when switching to a different instrument definition.
      if (lastDefinitionId.current !== variant.definition.id) {
        reset();
        setStep(0);
        setMaxVisited(0);
        lastDefinitionId.current = variant.definition.id;
      }
      setDefinition(variant.definition);
      setPhase("flow");
    }
    scrollTop();
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
      setPhase(family?.variants ? "variant" : "family");
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
    setFamily(null);
    setDefinition(null);
    lastDefinitionId.current = null;
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
            <Button onClick={() => setPhase("family")}>{t("welcomeStart")}</Button>
          </motion.div>
        )}

        {phase === "family" && (
          <motion.div key="family" exit={{ opacity: 0 }}>
            <SelectionStep
              title={t("familyTitle")}
              intro={t("familyIntro")}
              options={families.map((f) => ({
                id: f.id,
                title: f.name[lang],
                description: f.description[lang],
                available: Boolean(f.variants?.some((v) => v.definition)),
              }))}
              onSelect={chooseFamily}
            />
            <div className="mt-12 pt-6 border-t border-line/50">
              <Button variant="ghost" onClick={() => setPhase("welcome")}>
                ← {t("back")}
              </Button>
            </div>
          </motion.div>
        )}

        {phase === "variant" && family?.variants && (
          <motion.div key="variant" exit={{ opacity: 0 }}>
            <SelectionStep
              title={t("variantTitle", { family: family.name[lang] })}
              intro={t("variantIntro")}
              options={family.variants.map((v) => ({
                id: v.id,
                title: v.name[lang],
                description: v.description[lang],
                available: Boolean(v.definition),
              }))}
              onSelect={chooseVariant}
            />
            <div className="mt-12 pt-6 border-t border-line/50">
              <Button variant="ghost" onClick={() => setPhase("family")}>
                ← {t("back")}
              </Button>
            </div>
          </motion.div>
        )}

        {phase === "coming-soon" && comingSoon && (
          <ComingSoon
            key="coming-soon"
            name={comingSoon.name}
            note={comingSoon.note}
            onBack={() => {
              setPhase(comingSoon.backTo);
              setComingSoon(null);
            }}
          />
        )}

        {phase === "flow" && definition && (
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
