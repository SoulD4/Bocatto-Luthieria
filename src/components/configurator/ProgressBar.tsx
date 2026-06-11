"use client";

import { useTranslations } from "next-intl";

/** Linear progress for the 7-stage creation. Visited stages are clickable. */
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

  return (
    <div className="mb-10">
      <p className="text-xs uppercase tracking-[0.25em] text-muted mb-3">
        {t("stepLabel", { current: current + 1, total: labels.length })}
        <span className="text-gold ml-3">{labels[current]}</span>
      </p>
      <div className="flex gap-1.5">
        {labels.map((label, i) => {
          const reachable = i <= maxVisited;
          return (
            <button
              key={label + i}
              type="button"
              disabled={!reachable}
              onClick={() => onJump(i)}
              aria-label={label}
              title={label}
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
