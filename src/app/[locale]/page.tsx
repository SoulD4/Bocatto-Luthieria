import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { use } from "react";
import { ButtonLink } from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import GuitarArt from "@/components/art/GuitarArt";

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
            <p className="text-gold text-xs uppercase tracking-[0.35em] mb-6">
              {t("heroKicker")}
            </p>
            <h1 className="[font-family:var(--font-display)] text-4xl md:text-6xl leading-[1.08] mb-5">
              {t("heroTitle")}
            </h1>
            <Image
              src="/brand/logo-gold.png"
              alt="Bocatto"
              width={974}
              height={280}
              priority
              className="h-16 md:h-20 w-auto mb-8"
            />
            <p className="text-muted text-lg max-w-xl mb-10">
              {t("heroSubtitle")}
            </p>
            <div className="flex flex-wrap gap-4">
              <ButtonLink href="/configurador">{t("heroCta")}</ButtonLink>
              <ButtonLink href="/sobre" variant="outline">
                {t("heroSecondary")}
              </ButtonLink>
            </div>
          </Reveal>

          <Reveal delay={0.15} className="hidden md:block">
            <div className="relative mx-auto w-64">
              <div className="absolute inset-0 -m-10 rounded-full bg-gold/5 blur-3xl" />
              <GuitarArt className="relative w-full drop-shadow-[0_20px_50px_rgba(0,0,0,0.6)]" />
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
          <ButtonLink href="/configurador">{t("ctaButton")}</ButtonLink>
        </Reveal>
      </section>
    </div>
  );
}
