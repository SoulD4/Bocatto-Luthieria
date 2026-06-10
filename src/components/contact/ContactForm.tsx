"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import Turnstile from "@/components/ui/Turnstile";

const inputClass =
  "w-full bg-surface-2 border border-line rounded-sm px-4 py-3 text-sm text-cream placeholder:text-muted/60 focus:outline-none focus:border-gold/70 transition-colors";

type Status = "idle" | "sending" | "success" | "error";

export default function ContactForm() {
  const t = useTranslations("contact");
  const [status, setStatus] = useState<Status>("idle");
  const [token, setToken] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    const website = String(data.get("website") ?? "");

    const newErrors: Record<string, string> = {};
    if (name.length < 2) newErrors.name = t("validationName");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = t("validationEmail");
    if (message.length < 5) newErrors.message = t("validationMessage");
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setStatus("sending");
    try {
      const res = await fetch("/api/contato", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          message,
          website,
          turnstileToken: token,
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div>
        <label htmlFor="name" className="block text-xs uppercase tracking-[0.2em] text-muted mb-2">
          {t("nameLabel")}
        </label>
        <input id="name" name="name" type="text" className={inputClass} />
        {errors.name && <p className="text-red-400/90 text-xs mt-1.5">{errors.name}</p>}
      </div>

      <div>
        <label htmlFor="email" className="block text-xs uppercase tracking-[0.2em] text-muted mb-2">
          {t("emailLabel")}
        </label>
        <input id="email" name="email" type="email" className={inputClass} />
        {errors.email && <p className="text-red-400/90 text-xs mt-1.5">{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="message" className="block text-xs uppercase tracking-[0.2em] text-muted mb-2">
          {t("messageLabel")}
        </label>
        <textarea id="message" name="message" rows={6} className={inputClass} />
        {errors.message && <p className="text-red-400/90 text-xs mt-1.5">{errors.message}</p>}
      </div>

      {/* Honeypot — invisible to humans */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
      />

      <Turnstile onToken={setToken} />

      <Button type="submit" disabled={status === "sending"}>
        {status === "sending" ? t("sending") : t("send")}
      </Button>

      {status === "success" && (
        <p className="text-gold-light text-sm">{t("success")}</p>
      )}
      {status === "error" && (
        <p className="text-red-400/90 text-sm">{t("error")}</p>
      )}
    </form>
  );
}
