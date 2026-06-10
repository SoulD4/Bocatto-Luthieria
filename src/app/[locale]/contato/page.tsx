import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { use } from "react";
import Reveal from "@/components/ui/Reveal";
import ContactForm from "@/components/contact/ContactForm";
import { site } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return { title: t("contactTitle"), description: t("description") };
}

export default function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations("contact");

  return (
    <div className="pt-16">
      <section className="mx-auto max-w-5xl px-5 py-20 md:py-24">
        <Reveal>
          <p className="text-gold text-xs uppercase tracking-[0.35em] mb-6 text-center">
            {t("kicker")}
          </p>
          <h1 className="[font-family:var(--font-display)] text-4xl md:text-5xl text-center mb-4">
            {t("title")}
          </h1>
          <p className="text-muted text-center max-w-xl mx-auto mb-14">
            {t("intro")}
          </p>
        </Reveal>

        <div className="grid gap-10 md:grid-cols-[1.2fr_0.8fr]">
          <Reveal delay={0.05}>
            <ContactForm />
          </Reveal>

          <Reveal delay={0.15}>
            <div className="space-y-6">
              <div className="card-premium rounded-md p-7">
                <h2 className="[font-family:var(--font-display)] text-xl gold-text mb-2">
                  {t("whatsappTitle")}
                </h2>
                <p className="text-muted text-sm mb-5">{t("whatsappBody")}</p>
                <a
                  href={`https://wa.me/${site.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-gold/60 text-gold hover:bg-gold/10 transition-colors rounded-sm px-6 py-2.5 text-sm tracking-[0.12em] uppercase"
                >
                  {t("whatsappCta")}
                </a>
              </div>

              <div className="card-premium rounded-md p-7">
                <h2 className="[font-family:var(--font-display)] text-xl gold-text mb-2">
                  {t("emailTitle")}
                </h2>
                <a
                  href={`mailto:${site.contactEmail}`}
                  className="text-cream/85 hover:text-gold-light transition-colors text-sm"
                >
                  {site.contactEmail}
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
