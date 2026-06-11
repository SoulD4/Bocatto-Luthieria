import Image from "next/image";
import { Link } from "@/i18n/navigation";

/**
 * Official Bocatto logo (gold lettering on black). The artwork's black
 * background disappears over the site's dark theme via mix-blend screen,
 * preserving the logo exactly as delivered.
 */
export default function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="group inline-flex items-baseline gap-2.5">
      <Image
        src="/brand/logo-gold.png"
        alt="Bocatto"
        width={974}
        height={280}
        priority
        className="w-auto"
        style={{ height: compact ? "1.9rem" : "2.4rem" }}
      />
      <span className="text-cream/80 tracking-[0.35em] uppercase text-[0.65rem] group-hover:text-gold-light transition-colors">
        Luthieria
      </span>
    </Link>
  );
}
