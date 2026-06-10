import { Link } from "@/i18n/navigation";

/**
 * Gold script wordmark recreating the official logo's calligraphy on dark
 * backgrounds (the PNG logo has a light marble background, so it is reserved
 * for light surfaces such as the PDF).
 */
export default function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="group inline-flex items-baseline gap-2">
      <span
        className="gold-text [font-family:var(--font-script)] leading-none"
        style={{ fontSize: compact ? "1.9rem" : "2.4rem" }}
      >
        Bocatto
      </span>
      <span className="text-cream/80 tracking-[0.35em] uppercase text-[0.65rem] group-hover:text-gold-light transition-colors">
        Luthieria
      </span>
    </Link>
  );
}
