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

/**
 * Gallery of real instruments built by the workshop. Native scroll-snap does
 * the heavy lifting (fluid touch swipe on mobile, no carousel library);
 * arrows and the counter are progressive enhancements on top of it.
 */
export default function InstrumentCarousel({ alt }: { alt: string }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  const slideTo = useCallback((i: number) => {
    const track = trackRef.current;
    const slide = track?.children[Math.max(0, Math.min(i, SLIDES.length - 1))];
    (slide as HTMLElement | undefined)?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, []);

  // Keep the counter and the slide emphasis in sync with manual swipes too.
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
        [...track.children].forEach((el, i) => {
          const c = (el as HTMLElement).offsetLeft + (el as HTMLElement).clientWidth / 2;
          const d = Math.abs(c - center);
          if (d < bestDist) {
            bestDist = d;
            best = i;
          }
        });
        setIndex(best);
      });
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      track.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div className="relative">
      <div
        ref={trackRef}
        className="scrollbar-hidden flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory px-[12vw] md:px-[20vw] py-2"
        aria-label={alt}
      >
        {SLIDES.map((src, i) => (
          <figure
            key={src}
            className={`relative shrink-0 snap-center w-[68vw] max-w-[340px] aspect-[3/4] overflow-hidden rounded-lg border transition-all duration-500 ${
              i === index
                ? "border-gold/50 shadow-[0_18px_50px_rgba(0,0,0,0.55)]"
                : "border-line opacity-60 scale-[0.96]"
            }`}
          >
            <Image
              src={src}
              alt={`${alt} ${i + 1}`}
              fill
              sizes="(max-width: 768px) 68vw, 340px"
              className="object-cover"
              loading="lazy"
            />
          </figure>
        ))}
      </div>

      {/* Controls */}
      <div className="mt-6 flex items-center justify-center gap-6">
        <button
          type="button"
          onClick={() => slideTo(index - 1)}
          disabled={index === 0}
          aria-label="Anterior"
          className="h-10 w-10 rounded-full border border-line text-cream/80 hover:border-gold/60 hover:text-gold transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-default"
        >
          ←
        </button>
        <span className="text-xs tracking-[0.3em] text-muted tabular-nums">
          {String(index + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
        </span>
        <button
          type="button"
          onClick={() => slideTo(index + 1)}
          disabled={index === SLIDES.length - 1}
          aria-label="Próximo"
          className="h-10 w-10 rounded-full border border-line text-cream/80 hover:border-gold/60 hover:text-gold transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-default"
        >
          →
        </button>
      </div>
    </div>
  );
}
