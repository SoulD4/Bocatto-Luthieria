"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { Button } from "@/components/ui/Button";
import type { OrderResult } from "./Review";

export default function Success({
  result,
  onRestart,
}: {
  result: OrderResult;
  onRestart: () => void;
}) {
  const t = useTranslations("config");
  const opened = useRef(false);

  // Open WhatsApp automatically with the ready-to-send message. If the
  // browser blocks the popup, the highlighted button below is the fallback.
  useEffect(() => {
    if (opened.current) return;
    opened.current = true;
    const timer = setTimeout(() => {
      window.open(result.whatsappUrl, "_blank", "noopener,noreferrer");
    }, 900);
    return () => clearTimeout(timer);
  }, [result.whatsappUrl]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.45 }}
      className="text-center py-10"
    >
      <div className="mx-auto mb-8 h-16 w-16 rounded-full border border-gold/60 flex items-center justify-center">
        <span className="text-gold text-2xl">✓</span>
      </div>

      <h2 className="[font-family:var(--font-display)] text-3xl md:text-5xl mb-4">
        {t("successTitle")}
      </h2>
      <p className="text-muted max-w-xl mx-auto mb-2">{t("successBody")}</p>
      <p className="text-xs uppercase tracking-[0.25em] text-gold mb-10">
        {t("successOrder")}: {result.order}
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-3">
        <a
          href={result.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-sm px-7 py-3 text-sm tracking-[0.12em] uppercase bg-gradient-to-br from-gold-light via-gold to-gold-deep text-ink font-medium hover:brightness-110 transition-all"
        >
          {t("successWhatsapp")}
        </a>
        {result.pdfUrl && (
          <a
            href={result.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-sm px-7 py-3 text-sm tracking-[0.12em] uppercase border border-gold/60 text-gold hover:bg-gold/10 transition-all"
          >
            {t("successDownload")}
          </a>
        )}
      </div>
      <p className="text-[0.7rem] text-muted mb-12">{t("successWhatsappHint")}</p>

      <Button variant="ghost" onClick={onRestart}>
        {t("successNew")} →
      </Button>
    </motion.div>
  );
}
