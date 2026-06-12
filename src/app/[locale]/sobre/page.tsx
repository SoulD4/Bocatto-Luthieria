import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { useTranslations, useLocale } from "next-intl";
import { use } from "react";
import { ButtonLink } from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import { defaultInstrument } from "@/data/instruments/violao";
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
        <Reveal delay={0.15}>
          <Image
            src="/brand/wood-engraving.jpg"
            alt="Bocatto gravado em madeira"
            width={1200}
            height={1200}
            className="mt-12 mx-auto w-full max-w-xl rounded-md border border-line/60 shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
          />
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

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {defaultInstrument.models.map((model, idx) => (
              <Reveal key={model.id} delay={idx * 0.06}>
                <article className="group card-premium rounded-lg overflow-hidden h-full flex flex-col transition-colors duration-300">
                  <div className="relative aspect-[4/3] overflow-hidden bg-ink">
                    <Image
                      src={model.image}
                      alt={model.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-baseline justify-between gap-3 mb-3">
                      <h3 className="[font-family:var(--font-display)] text-2xl gold-text">
                        {model.name}
                      </h3>
                      <span className="text-[0.7rem] uppercase tracking-widest text-muted whitespace-nowrap">
                        {model.scale}
                      </span>
                    </div>
                    <p className="text-muted text-sm leading-relaxed mb-4">
                      {model.description[lang]}
                    </p>
                    <ul className="space-y-1.5 mt-auto">
                      {model.characteristics.map((c, i) => (
                        <li key={i} className="text-xs text-cream/80 flex items-start gap-2">
                          <span className="text-gold mt-0.5">·</span>
                          {c[lang]}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div className="text-center mt-14">
              <ButtonLink href="/criacao">{t("catalogCta")}</ButtonLink>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
