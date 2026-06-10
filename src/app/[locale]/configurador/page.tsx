import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { use } from "react";
import ConfiguratorClient from "@/components/configurator/ConfiguratorClient";
import { violao } from "@/data/instruments/violao";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return { title: t("configTitle"), description: t("description") };
}

export default function ConfiguratorPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  setRequestLocale(locale);

  return (
    <div className="pt-16 flex-1 flex flex-col">
      <ConfiguratorClient definition={violao} />
    </div>
  );
}
