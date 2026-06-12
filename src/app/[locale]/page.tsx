import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { use } from "react";
import { ButtonLink } from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import InstrumentCarousel from "@/components/home/InstrumentCarousel";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return { title: t("homeTitle"), description: t("description") };
}

export default function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations("home");

  return (
    <div className="pt-16">
      {/* ───────────── Hero ───────────── */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-5 py-20 md:py-28 grid md:grid-cols-[1.2fr_0.8fr] gap-12 items-center">
          <Reveal>
            {/* Brand first: the logo is the protagonist of the hero. */}
            <Image
              src="/brand/logo-gold.png"
              alt="Bocatto"
              width={974}
              height={280}
              priority
              className="h-28 md:h-40 w-auto mb-10"
            />
            <p className="text-gold text-sm uppercase tracking-[0.35em] mb-4">
              {t("heroKicker")}
            </p>
            <h1 className="text-cream/90 text-lg md:text-xl tracking-[0.08em] uppercase mb-6">
              {t("heroTitle")}
            </h1>
            <p className="text-muted text-lg max-w-xl mb-10">
              {t("heroSubtitle")}
            </p>
            <div className="flex flex-wrap gap-4">
              <ButtonLink href="/criacao">{t("heroCta")}</ButtonLink>
              <ButtonLink href="/sobre" variant="outline">
                {t("heroSecondary")}
              </ButtonLink>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            {/* Real instruments built by the workshop */}
            <div className="relative mx-auto w-full max-w-sm md:max-w-md">
              <div className="absolute inset-0 -m-12 rounded-full bg-gold/5 blur-3xl" />
              <div className="relative">
                <InstrumentCarousel alt={t("galleryAlt")} />
              </div>
            </div>
          </Reveal>
        </div>
        <div className="gold-line mx-auto max-w-4xl" />
      </section>

      {/* ───────────── Pillars ───────────── */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <Reveal>
          <h2 className="[font-family:var(--font-display)] text-3xl md:text-4xl text-center mb-14">
            {t("pillarsTitle")}
          </h2>
        </Reveal>
        <div className="grid gap-6 md:grid-cols-3">
          {([1, 2, 3] as const).map((i, idx) => (
            <Reveal key={i} delay={idx * 0.1}>
              <div className="card-premium rounded-md p-8 h-full transition-colors duration-300">
                <span className="gold-text [font-family:var(--font-display)] text-4xl">
                  {String(i).padStart(2, "0")}
                </span>
                <h3 className="[font-family:var(--font-display)] text-xl mt-4 mb-3">
                  {t(`pillar${i}Title`)}
                </h3>
                <p className="text-muted text-sm leading-relaxed">
                  {t(`pillar${i}Body`)}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ───────────── Special project (in construction) ───────────── */}
      <section className="border-y border-line/60 bg-surface/30 overflow-hidden">
        <div className="mx-auto max-w-6xl px-5 py-20 grid gap-12 md:grid-cols-2 items-center">
          <Reveal>
            <div className="relative overflow-hidden rounded-lg border border-line shadow-[0_24px_70px_rgba(0,0,0,0.55)]">
              <Image
                src="/brand/projeto-especial.webp"
                alt={t("specialAlt")}
                width={1200}
                height={1600}
                className="w-full h-auto"
              />
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="text-gold text-xs uppercase tracking-[0.35em] mb-6">
              {t("specialKicker")}
            </p>
            <h2 className="[font-family:var(--font-display)] text-3xl md:text-5xl leading-[1.1] mb-6">
              {t("specialTitle")}
            </h2>
            <p className="text-muted text-lg leading-relaxed mb-4">
              {t("specialBody1")}
            </p>
            <p className="text-cream/80 leading-relaxed mb-10">
              {t("specialBody2")}
            </p>
            <ButtonLink href="/contato" variant="outline">
              {t("specialCta")}
            </ButtonLink>
          </Reveal>
        </div>
      </section>

      {/* ───────────── Price band ───────────── */}
      <section className="border-y border-line/60 bg-surface/40">
        <Reveal>
          <div className="mx-auto max-w-6xl px-5 py-14 text-center">
            <p className="text-xs uppercase tracking-[0.35em] text-muted mb-3">
              {t("priceTitle")}
            </p>
            <p className="[font-family:var(--font-display)] text-2xl md:text-3xl gold-text max-w-2xl mx-auto">
              {t("priceBody")}
            </p>
          </div>
        </Reveal>
      </section>

      {/* ───────────── Final CTA ───────────── */}
      <section className="mx-auto max-w-3xl px-5 py-24 text-center">
        <Reveal>
          <h2 className="[font-family:var(--font-display)] text-3xl md:text-5xl mb-5">
            {t("ctaTitle")}
          </h2>
          <p className="text-muted mb-10">{t("ctaBody")}</p>
          <ButtonLink href="/criacao">{t("ctaButton")}</ButtonLink>
        </Reveal>
      </section>
    </div>
  );
}
