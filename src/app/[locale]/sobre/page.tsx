import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { useTranslations, useLocale } from "next-intl";
import { use } from "react";
import { ButtonLink } from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import GuitarArt from "@/components/art/GuitarArt";
import { catalog } from "@/data/catalog";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return { title: t("aboutTitle"), description: t("description") };
}

export default function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations("about");
  const lang = useLocale() as Locale;

  return (
    <div className="pt-16">
      {/* História */}
      <section className="mx-auto max-w-4xl px-5 py-20 md:py-24">
        <Reveal>
          <p className="text-gold text-xs uppercase tracking-[0.35em] mb-6 text-center">
            {t("kicker")}
          </p>
          <h1 className="[font-family:var(--font-display)] text-4xl md:text-5xl text-center mb-12">
            {t("historyTitle")}
          </h1>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="space-y-6 text-lg text-cream/85 leading-relaxed">
            <p>{t("historyBody1")}</p>
            <p>{t("historyBody2")}</p>
          </div>
        </Reveal>
      </section>

      <div className="gold-line mx-auto max-w-3xl" />

      {/* Filosofia */}
      <section className="mx-auto max-w-4xl px-5 py-20">
        <Reveal>
          <h2 className="[font-family:var(--font-display)] text-3xl md:text-4xl mb-6 text-center">
            {t("philosophyTitle")}
          </h2>
          <p className="text-muted text-lg leading-relaxed text-center max-w-2xl mx-auto">
            {t("philosophyBody")}
          </p>
        </Reveal>
      </section>

      {/* Catálogo de exemplos */}
      <section className="border-t border-line/60 bg-surface/30">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <Reveal>
            <h2 className="[font-family:var(--font-display)] text-3xl md:text-4xl text-center mb-4">
              {t("catalogTitle")}
            </h2>
            <p className="text-muted text-center mb-14 max-w-xl mx-auto">
              {t("catalogIntro")}
            </p>
          </Reveal>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {catalog.map((item, idx) => (
              <Reveal key={item.id} delay={idx * 0.08}>
                <article className="card-premium rounded-md p-6 h-full flex flex-col transition-colors duration-300">
                  <div className="h-56 flex items-center justify-center mb-6">
                    <GuitarArt
                      woodFrom={item.woodFrom}
                      woodTo={item.woodTo}
                      className="h-full"
                    />
                  </div>
                  <h3 className="[font-family:var(--font-display)] text-2xl gold-text mb-3">
                    {item.name}
                  </h3>
                  <dl className="text-xs space-y-1.5 mb-4">
                    <div className="flex justify-between gap-2">
                      <dt className="text-muted uppercase tracking-wider">{t("specTop")}</dt>
                      <dd className="text-cream/85 text-right">{item.top[lang]}</dd>
                    </div>
                    <div className="flex justify-between gap-2">
                      <dt className="text-muted uppercase tracking-wider">{t("specBody")}</dt>
                      <dd className="text-cream/85 text-right">{item.backSides[lang]}</dd>
                    </div>
                    <div className="flex justify-between gap-2">
                      <dt className="text-muted uppercase tracking-wider">{t("specStrings")}</dt>
                      <dd className="text-cream/85 text-right">{item.strings[lang]}</dd>
                    </div>
                  </dl>
                  <p className="text-muted text-sm leading-relaxed mt-auto">
                    {item.description[lang]}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div className="text-center mt-14">
              <ButtonLink href="/configurador">{t("catalogCta")}</ButtonLink>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
