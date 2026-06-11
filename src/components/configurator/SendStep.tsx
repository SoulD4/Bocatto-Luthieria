"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "motion/react";
import type { InstrumentDefinition } from "@/data/instruments/types";
import type { Locale } from "@/i18n/routing";
import { useConfigurator } from "@/store/configurator";
import { Button } from "@/components/ui/Button";
import Turnstile from "@/components/ui/Turnstile";
import type { OrderResult } from "./Review";

const inputClass =
  "w-full bg-surface-2 border border-line rounded-sm px-4 py-3 text-sm text-cream placeholder:text-muted/60 focus:outline-none focus:border-gold/70 transition-colors";

/** Etapa 7 — customer data + submit. Sends the full order to /api/pedido. */
export default function SendStep({
  definition,
  onSuccess,
}: {
  definition: InstrumentDefinition;
  onSuccess: (result: OrderResult) => void;
}) {
  const t = useTranslations("config");
  const lang = useLocale() as Locale;
  const modelId = useConfigurator((s) => s.modelId);
  const values = useConfigurator((s) => s.values);
  const extra = useConfigurator((s) => s.extra);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<"generic" | "rate" | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [token, setToken] = useState("");
  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    whatsapp: "",
    source: "",
  });

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
          modelId,
          values,
          extra: {
            observations: extra.observations.trim(),
            references: extra.references,
          },
          customer: {
            name: customer.name.trim(),
            email: customer.email.trim(),
            whatsapp: customer.whatsapp.trim(),
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
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <h2 className="[font-family:var(--font-display)] text-3xl md:text-4xl mb-2">
        {t("customerTitle")}
      </h2>
      <p className="text-muted text-sm md:text-base mb-8">
        {t("customerSubtitle")}
      </p>

      <form onSubmit={handleSubmit} noValidate className="card-premium rounded-md p-6 md:p-8">
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
