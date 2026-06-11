import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { site } from "@/lib/site";
import Brand from "./Brand";

export default function Footer() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");

  return (
    <footer className="border-t border-line/60 bg-surface/40 mt-auto">
      <div className="mx-auto max-w-6xl px-5 py-12 grid gap-10 md:grid-cols-3">
        <div className="space-y-3">
          <Brand />
          <p className="text-sm text-muted max-w-xs">{t("craft")}</p>
        </div>

        <div>
          <h3 className="text-xs uppercase tracking-[0.25em] text-gold mb-4">
            {t("navTitle")}
          </h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="text-cream/75 hover:text-gold-light transition-colors">{nav("home")}</Link></li>
            <li><Link href="/sobre" className="text-cream/75 hover:text-gold-light transition-colors">{nav("about")}</Link></li>
            <li><Link href="/criacao" className="text-cream/75 hover:text-gold-light transition-colors">{nav("create")}</Link></li>
            <li><Link href="/contato" className="text-cream/75 hover:text-gold-light transition-colors">{nav("contact")}</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs uppercase tracking-[0.25em] text-gold mb-4">
            {t("contactTitle")}
          </h3>
          <ul className="space-y-2 text-sm text-cream/75">
            <li>
              <a
                href={`mailto:${site.contactEmail}`}
                className="hover:text-gold-light transition-colors"
              >
                {site.contactEmail}
              </a>
            </li>
            <li>
              <a
                href={`https://wa.me/${site.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gold-light transition-colors"
              >
                WhatsApp
              </a>
            </li>
            {site.instagram && (
              <li>
                <a
                  href={site.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gold-light transition-colors"
                >
                  Instagram
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="border-t border-line/40">
        <p className="mx-auto max-w-6xl px-5 py-5 text-xs text-muted">
          © {new Date().getFullYear()} Bocatto Luthieria. {t("rights")}
        </p>
      </div>
    </footer>
  );
}
