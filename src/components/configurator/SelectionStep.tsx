"use client";

import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "motion/react";

export type SelectionOption = {
  id: string;
  title: string;
  description: string;
  available: boolean;
};

/**
 * Generic pre-flow selection screen (instrument family, guitar type, …).
 * One component serves every future branching choice — no per-instrument
 * screens to duplicate. Unavailable options stay selectable and lead to an
 * elegant coming-soon screen handled by the parent.
 */
export default function SelectionStep({
  title,
  intro,
  options,
  onSelect,
}: {
  title: string;
  intro: string;
  options: SelectionOption[];
  onSelect: (id: string) => void;
}) {
  const t = useTranslations("config");

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <h2 className="[font-family:var(--font-display)] text-3xl md:text-4xl mb-2">
        {title}
      </h2>
      <p className="text-muted text-sm md:text-base mb-8 max-w-2xl">{intro}</p>

      <div className="grid gap-4 sm:grid-cols-2">
        {options.map((opt, i) => (
          <motion.button
            key={opt.id}
            type="button"
            onClick={() => onSelect(opt.id)}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
            whileTap={{ scale: 0.985 }}
            className={`card-premium group relative rounded-lg p-6 md:p-7 text-left cursor-pointer transition-all duration-300 ${
              opt.available ? "" : "opacity-75 hover:opacity-95"
            }`}
          >
            <span className="flex items-start justify-between gap-3 mb-3">
              <span
                className={`[font-family:var(--font-display)] text-2xl transition-colors duration-300 ${
                  opt.available ? "text-cream group-hover:text-gold-light" : "text-cream/80"
                }`}
              >
                {opt.title}
              </span>
              <span
                className={`shrink-0 rounded-full border px-2.5 py-1 text-[0.6rem] uppercase tracking-[0.18em] ${
                  opt.available
                    ? "border-gold/50 text-gold"
                    : "border-line text-muted"
                }`}
              >
                {opt.available ? t("availableBadge") : t("soonBadge")}
              </span>
            </span>
            <span className="block text-sm text-muted leading-relaxed">
              {opt.description}
            </span>
            <span
              className={`mt-5 inline-block text-xs uppercase tracking-[0.15em] transition-colors duration-300 ${
                opt.available
                  ? "text-muted group-hover:text-gold-light"
                  : "text-muted/60"
              }`}
            >
              {opt.available ? `${t("selectCta")} →` : t("soonCta")}
            </span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

/** Elegant coming-soon screen, in the brand's visual language. */
export function ComingSoon({
  name,
  note,
  onBack,
}: {
  name: string;
  note: string;
  onBack: () => void;
}) {
  const t = useTranslations("config");

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="text-center py-16 md:py-24"
      >
        <p className="text-gold text-xs uppercase tracking-[0.4em] mb-6">
          {t("comingSoonKicker")}
        </p>
        <h2 className="[font-family:var(--font-display)] text-4xl md:text-6xl mb-6">
          {name}
        </h2>
        <div className="gold-line max-w-[160px] mx-auto mb-6" />
        <p className="text-muted max-w-md mx-auto mb-12">{note}</p>
        <button
          type="button"
          onClick={onBack}
          className="text-xs uppercase tracking-[0.2em] text-cream/80 hover:text-gold-light transition-colors cursor-pointer"
        >
          ← {t("comingSoonBack")}
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
