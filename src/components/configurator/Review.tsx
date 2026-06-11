"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "motion/react";
import type { InstrumentDefinition } from "@/data/instruments/types";
import type { Locale } from "@/i18n/routing";
import { useConfigurator } from "@/store/configurator";
import { buildSummary } from "@/lib/summary";
import { Button } from "@/components/ui/Button";
import Turnstile from "@/components/ui/Turnstile";

const GuitarViewer = dynamic(() => import("./GuitarViewer"), {
  ssr: false,
  loading: () => (
    <div className="h-[420px] flex items-center justify-center text-muted text-sm animate-pulse">
      …
    </div>
  ),
});

const inputClass =
  "w-full bg-surface-2 border border-line rounded-sm px-4 py-3 text-sm text-cream placeholder:text-muted/60 focus:outline-none focus:border-gold/70 transition-colors";

export type OrderResult = {
  order: string;
  /** Null when file storage is unavailable — the PDF still goes by e-mail. */
  pdfUrl: string | null;
  whatsappUrl: string;
};

export default function Review({
  definition,
  onEdit,
  onSuccess,
}: {
  definition: InstrumentDefinition;
  onEdit: (stepIndex: number) => void;
  onSuccess: (result: OrderResult) => void;
}) {
  const t = useTranslations("config");
  const lang = useLocale() as Locale;
  const values = useConfigurator((s) => s.values);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<"generic" | "rate" | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [token, setToken] = useState("");
  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    whatsapp: "",
    notes: "",
    source: "",
  });

  const entries = useMemo(
    () => buildSummary(definition, values),
    [definition, values],
  );

  const grouped = useMemo(() => {
    const map = new Map<string, typeof entries>();
    for (const e of entries) {
      const list = map.get(e.stepId) ?? [];
      list.push(e);
      map.set(e.stepId, list);
    }
    return map;
  }, [entries]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (customer.name.trim().length < 2) newErrors.name = t("validationName");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email.trim()))
      newErrors.email = t("validationEmail");
    if (customer.whatsapp.replace(/\D/g, "").length < 10)
      newErrors.whatsapp = t("validationWhatsapp");
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setSubmitting(true);
    setSubmitError(null);
    try {
      const form = new FormData(e.currentTarget);
      const res = await fetch("/api/pedido", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locale: lang,
          instrumentId: definition.id,
          values,
          customer: {
            name: customer.name.trim(),
            email: customer.email.trim(),
            whatsapp: customer.whatsapp.trim(),
            notes: customer.notes.trim(),
            source: customer.source,
          },
          website: String(form.get("website") ?? ""),
          turnstileToken: token,
        }),
      });
      if (res.status === 429) {
        setSubmitError("rate");
        return;
      }
      if (!res.ok) throw new Error(String(res.status));
      const data = (await res.json()) as OrderResult;
      onSuccess(data);
    } catch {
      setSubmitError("generic");
    } finally {
      setSubmitting(false);
    }
  }

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
        <GuitarViewer values={values} />
        <p className="text-[0.7rem] text-muted text-center px-4 pb-4">
          {t("viewerHint")}
        </p>
      </div>

      {/* Summary grouped by step */}
      <div className="space-y-4 mb-12">
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
                  onClick={() => onEdit(stepIndex)}
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

      {/* Customer data + submit */}
      <form onSubmit={handleSubmit} noValidate className="card-premium rounded-md p-6 md:p-8">
        <h3 className="[font-family:var(--font-display)] text-2xl mb-1">
          {t("customerTitle")}
        </h3>
        <p className="text-muted text-sm mb-7">{t("customerSubtitle")}</p>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label htmlFor="c-name" className="block text-xs uppercase tracking-[0.2em] text-muted mb-2">
              {t("customerName")}
            </label>
            <input
              id="c-name"
              type="text"
              className={inputClass}
              value={customer.name}
              onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
            />
            {errors.name && <p className="text-red-400/90 text-xs mt-1.5">{errors.name}</p>}
          </div>
          <div>
            <label htmlFor="c-email" className="block text-xs uppercase tracking-[0.2em] text-muted mb-2">
              {t("customerEmail")}
            </label>
            <input
              id="c-email"
              type="email"
              className={inputClass}
              value={customer.email}
              onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
            />
            {errors.email && <p className="text-red-400/90 text-xs mt-1.5">{errors.email}</p>}
          </div>
          <div>
            <label htmlFor="c-wa" className="block text-xs uppercase tracking-[0.2em] text-muted mb-2">
              {t("customerWhatsapp")}
            </label>
            <input
              id="c-wa"
              type="tel"
              placeholder="(11) 99999-9999"
              className={inputClass}
              value={customer.whatsapp}
              onChange={(e) => setCustomer({ ...customer, whatsapp: e.target.value })}
            />
            {errors.whatsapp && <p className="text-red-400/90 text-xs mt-1.5">{errors.whatsapp}</p>}
          </div>
          <div>
            <label htmlFor="c-source" className="block text-xs uppercase tracking-[0.2em] text-muted mb-2">
              {t("customerSource")}
            </label>
            <select
              id="c-source"
              className={inputClass}
              value={customer.source}
              onChange={(e) => setCustomer({ ...customer, source: e.target.value })}
            >
              <option value="">—</option>
              <option value="referral">{t("sourceReferral")}</option>
              <option value="instagram">{t("sourceInstagram")}</option>
              <option value="google">{t("sourceGoogle")}</option>
              <option value="other">{t("sourceOther")}</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label htmlFor="c-notes" className="block text-xs uppercase tracking-[0.2em] text-muted mb-2">
              {t("customerNotes")}
            </label>
            <textarea
              id="c-notes"
              rows={4}
              maxLength={2000}
              placeholder={t("customerNotesPlaceholder")}
              className={inputClass}
              value={customer.notes}
              onChange={(e) => setCustomer({ ...customer, notes: e.target.value })}
            />
          </div>
        </div>

        {/* Honeypot */}
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute -left-[9999px] h-0 w-0 opacity-0"
        />

        <div className="mt-6">
          <Turnstile onToken={setToken} />
        </div>

        <div className="mt-8 flex flex-col items-start gap-3">
          <Button type="submit" disabled={submitting}>
            {submitting ? t("submitting") : t("submit")}
          </Button>
          {submitError === "generic" && (
            <p className="text-red-400/90 text-sm">{t("submitError")}</p>
          )}
          {submitError === "rate" && (
            <p className="text-red-400/90 text-sm">{t("rateLimited")}</p>
          )}
        </div>
      </form>
    </motion.div>
  );
}
