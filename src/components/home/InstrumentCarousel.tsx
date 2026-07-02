"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

const SLIDES = [
  "/gallery/instrumento-1.webp",
  "/gallery/instrumento-2.webp",
  "/gallery/instrumento-3.webp",
  "/gallery/instrumento-4.webp",
  "/gallery/instrumento-5.webp",
];

const AUTOPLAY_MS = 4500;

/**
 * Hero gallery of real instruments built by the workshop. Native scroll-snap
 * gives fluid swiping on mobile; the arrows drive the scroll position with
 * explicit math (scrollIntoView proved unreliable across desktop browsers).
 * A gentle autoplay runs until the visitor interacts.
 */
export default function InstrumentCarousel({ alt }: { alt: string }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const indexRef = useRef(0);
  const interacted = useRef(false);
  const animRef = useRef(0);

  // Chromium cancels smooth scrollTo on snap-mandatory containers, so the
  // arrows animate scrollLeft by hand (snap is suspended during the tween).
  const slideTo = useCallback((i: number) => {
    const track = trackRef.current;
    if (!track) return;
    const n = track.children.length;
    const el = track.children[((i % n) + n) % n] as HTMLElement;
    const target = el.offsetLeft - (track.clientWidth - el.clientWidth) / 2;
    const start = track.scrollLeft;
    const dist = target - start;
    if (Math.abs(dist) < 1) return;

    cancelAnimationFrame(animRef.current);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      track.scrollLeft = target;
      return;
    }
    const t0 = performance.now();
    const DURATION = 450;
    track.style.scrollSnapType = "none";
    const step = (now: number) => {
      const p = Math.min(1, (now - t0) / DURATION);
      const ease = p < 0.5 ? 2 * p * p : 1 - (-2 * p + 2) ** 2 / 2;
      track.scrollLeft = start + dist * ease;
      if (p < 1) {
        animRef.current = requestAnimationFrame(step);
      } else {
        track.style.scrollSnapType = "";
      }
    };
    animRef.current = requestAnimationFrame(step);
  }, []);

  // Counter + emphasis follow whatever scrolls the track (arrows or swipe).
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const center = track.scrollLeft + track.clientWidth / 2;
        let best = 0;
        let bestDist = Infinity;
        [...track.children].forEach((node, i) => {
          const el = node as HTMLElement;
          const c = el.offsetLeft + el.clientWidth / 2;
          const d = Math.abs(c - center);
          if (d < bestDist) {
            bestDist = d;
            best = i;
          }
        });
        indexRef.current = best;
        setIndex(best);
      });
    };
    const stop = () => {
      interacted.current = true;
      // A real swipe takes over: drop any arrow animation and restore snap.
      cancelAnimationFrame(animRef.current);
      track.style.scrollSnapType = "";
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    track.addEventListener("pointerdown", stop, { passive: true });
    track.addEventListener("wheel", stop, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      track.removeEventListener("scroll", onScroll);
      track.removeEventListener("pointerdown", stop);
      track.removeEventListener("wheel", stop);
    };
  }, []);

  // Gentle autoplay until the first interaction; respects reduced motion.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(() => {
      if (interacted.current || document.hidden) return;
      slideTo(indexRef.current + 1);
    }, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [slideTo]);

  const arrow = (dir: -1 | 1, label: string, disabled: boolean) => (
    <button
      type="button"
      onClick={() => {
        interacted.current = true;
        // Step the index explicitly — the scroll listener only confirms it.
        const target = Math.max(0, Math.min(indexRef.current + dir, SLIDES.length - 1));
        indexRef.current = target;
        setIndex(target);
        slideTo(target);
      }}
      disabled={disabled}
      aria-label={label}
      className="h-10 w-10 rounded-full border border-line bg-ink/60 backdrop-blur-sm text-cream/80 hover:border-gold/60 hover:text-gold transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-default"
    >
      {dir === -1 ? "←" : "→"}
    </button>
  );

  return (
    <div className="relative select-none">
      <div
        ref={trackRef}
        className="scrollbar-hidden relative flex gap-3 overflow-x-auto snap-x snap-mandatory rounded-lg"
        aria-label={alt}
      >
        {SLIDES.map((src, i) => (
          <figure
            key={src}
            className={`relative shrink-0 snap-center w-[86%] aspect-[3/4] overflow-hidden rounded-lg border transition-all duration-500 ${
              i === index
                ? "border-gold/50 shadow-[0_18px_50px_rgba(0,0,0,0.55)]"
                : "border-line opacity-55 scale-[0.97]"
            }`}
          >
            <Image
              src={src}
              alt={`${alt} ${i + 1}`}
              fill
              sizes="(max-width: 768px) 86vw, 420px"
              className="object-cover"
              priority={i === 0}
              // The second slide peeks into view — eager avoids an LCP warning.
              loading={i <= 1 ? "eager" : "lazy"}
            />
          </figure>
        ))}
      </div>

      {/* Controls */}
      <div className="mt-5 flex items-center justify-center gap-5">
        {arrow(-1, "Anterior", index === 0)}
        <span className="text-xs tracking-[0.3em] text-muted tabular-nums">
          {String(index + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
        </span>
        {arrow(1, "Próximo", index === SLIDES.length - 1)}
      </div>
    </div>
  );
}
