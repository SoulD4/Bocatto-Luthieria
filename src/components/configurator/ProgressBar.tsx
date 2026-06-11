"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { motion } from "motion/react";

/**
 * Progress for the multi-stage creation: step counter, a continuous gold
 * bar and a scrollable rail of stage chips (visited ones are clickable).
 * Scales from 7 to 20+ stages without crowding, especially on mobile.
 */
export default function ProgressBar({
  labels,
  current,
  maxVisited,
  onJump,
}: {
  labels: string[];
  current: number;
  maxVisited: number;
  onJump: (index: number) => void;
}) {
  const t = useTranslations("config");
  const railRef = useRef<HTMLDivElement>(null);
  const currentChipRef = useRef<HTMLButtonElement>(null);

  // Keep the active chip visible as the customer advances.
  useEffect(() => {
    const rail = railRef.current;
    const chip = currentChipRef.current;
    if (!rail || !chip) return;
    const target = chip.offsetLeft - rail.clientWidth / 2 + chip.clientWidth / 2;
    rail.scrollTo({ left: target, behavior: "smooth" });
  }, [current]);

  const progress = (current + 1) / labels.length;

  return (
    <div className="mb-10">
      <div className="flex items-baseline justify-between gap-4 mb-3">
        <p className="text-xs uppercase tracking-[0.25em] text-muted">
          {t("stepLabel", { current: current + 1, total: labels.length })}
        </p>
        <p className="[font-family:var(--font-display)] text-lg gold-text leading-none">
          {labels[current]}
        </p>
      </div>

      {/* Continuous progress bar */}
      <div className="h-[3px] rounded-full bg-line overflow-hidden mb-4">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-gold-deep via-gold to-gold-light"
          initial={false}
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>

      {/* Stage rail */}
      <div
        ref={railRef}
        className="scrollbar-hidden flex gap-1.5 overflow-x-auto pb-1 -mb-1"
      >
        {labels.map((label, i) => {
          const isCurrent = i === current;
          const reachable = i <= maxVisited;
          const done = i < current || (i <= maxVisited && i !== current);
          return (
            <button
              key={label + i}
              ref={isCurrent ? currentChipRef : undefined}
              type="button"
              disabled={!reachable}
              onClick={() => onJump(i)}
              className={`shrink-0 whitespace-nowrap rounded-full border px-3 py-1 text-[0.65rem] uppercase tracking-[0.12em] transition-colors duration-300 ${
                isCurrent
                  ? "border-gold/70 bg-gold/10 text-gold-light"
                  : done
                    ? "border-line text-cream/65 hover:border-gold/40 hover:text-gold-light cursor-pointer"
                    : "border-transparent text-muted/40"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
