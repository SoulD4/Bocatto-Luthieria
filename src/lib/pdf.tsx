import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  renderToBuffer,
} from "@react-pdf/renderer";
import { readFile } from "fs/promises";
import path from "path";
import type { InstrumentDefinition } from "@/data/instruments/types";
import type { FieldValue } from "@/data/instruments/values";
import { buildSummary, type SummaryEntry } from "@/lib/summary";
import pt from "@/messages/pt.json";
import en from "@/messages/en.json";

type Lang = "pt" | "en";

export type CustomerInfo = {
  name: string;
  email: string;
  whatsapp: string;
  notes?: string;
  source?: string;
};

const GOLD = "#c9a227";
const INK = "#0c0a07";
const CREAM = "#f6f1e6";
const TEXT = "#2b241a";
const MUTED = "#7a6f5c";

const styles = StyleSheet.create({
  cover: {
    backgroundColor: INK,
    alignItems: "center",
    justifyContent: "center",
    padding: 60,
  },
  coverLogo: { width: 260, borderRadius: 6, marginBottom: 36 },
  coverTitle: {
    color: CREAM,
    fontSize: 24,
    fontFamily: "Times-Roman",
    marginBottom: 10,
    textAlign: "center",
  },
  coverRule: { width: 120, height: 1, backgroundColor: GOLD, marginVertical: 18 },
  coverMeta: { color: "#a89d8a", fontSize: 11, marginBottom: 4 },
  coverName: { color: GOLD, fontSize: 15, fontFamily: "Times-Italic", marginBottom: 14 },

  page: { backgroundColor: CREAM, padding: 48, fontSize: 10, color: TEXT },
  brandRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 22,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: GOLD,
  },
  brand: { fontSize: 14, fontFamily: "Times-BoldItalic", color: INK },
  brandSub: { fontSize: 8, color: MUTED, letterSpacing: 3 },
  sectionTitle: {
    fontSize: 13,
    fontFamily: "Times-Bold",
    color: INK,
    marginTop: 18,
    marginBottom: 8,
  },
  stepTitle: {
    fontSize: 11,
    fontFamily: "Times-Bold",
    color: GOLD,
    marginTop: 12,
    marginBottom: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ddd2bb",
  },
  rowLabel: { color: MUTED, width: "45%" },
  rowValue: { width: "55%", textAlign: "right" },
  otherTag: { color: GOLD, fontFamily: "Times-Bold" },
  refBlock: { marginTop: 10, marginBottom: 6 },
  refCaption: { fontSize: 9, color: MUTED, marginBottom: 4 },
  refImage: { width: 180, maxHeight: 220, objectFit: "contain", borderRadius: 4 },
  notes: { lineHeight: 1.5, marginTop: 4 },
  footer: {
    position: "absolute",
    bottom: 28,
    left: 48,
    right: 48,
    textAlign: "center",
    fontSize: 8,
    color: MUTED,
    borderTopWidth: 0.5,
    borderTopColor: "#ddd2bb",
    paddingTop: 8,
  },
});

function OrderPdf({
  lang,
  order,
  date,
  definition,
  values,
  customer,
  imageData,
  logoSrc,
}: {
  lang: Lang;
  order: string;
  date: string;
  definition: InstrumentDefinition;
  values: Record<string, FieldValue>;
  customer: CustomerInfo;
  /** url -> data URI of downloaded reference images */
  imageData: Map<string, string>;
  logoSrc?: string;
}) {
  const t = (lang === "pt" ? pt : en).pdf;
  const entries = buildSummary(definition, values);

  const byStep = new Map<string, SummaryEntry[]>();
  for (const e of entries) {
    const list = byStep.get(e.stepId) ?? [];
    list.push(e);
    byStep.set(e.stepId, list);
  }

  const references = entries.filter(
    (e) => e.images.length > 0 && e.images.some((i) => imageData.has(i.url)),
  );

  const sourceLabels: Record<string, { pt: string; en: string }> = {
    referral: { pt: "Indicação", en: "Referral" },
    instagram: { pt: "Instagram", en: "Instagram" },
    google: { pt: "Google", en: "Google" },
    other: { pt: "Outro", en: "Other" },
  };

  return (
    <Document title={`${t.docTitle} — ${order}`} author="Bocatto Luthieria">
      {/* Cover */}
      <Page size="A4" style={styles.cover}>
        {/* eslint-disable-next-line jsx-a11y/alt-text -- react-pdf Image has no alt prop */}
        {logoSrc && <Image src={logoSrc} style={styles.coverLogo} />}
        <Text style={styles.coverTitle}>{t.docTitle}</Text>
        <View style={styles.coverRule} />
        <Text style={styles.coverName}>{customer.name}</Text>
        <Text style={styles.coverMeta}>
          {t.order}: {order}
        </Text>
        <Text style={styles.coverMeta}>
          {t.date}: {date}
        </Text>
        <Text style={styles.coverMeta}>{definition.name[lang]}</Text>
      </Page>

      {/* Content */}
      <Page size="A4" style={styles.page}>
        <View style={styles.brandRow} fixed>
          <Text style={styles.brand}>Bocatto</Text>
          <Text style={styles.brandSub}>LUTHIERIA · {order}</Text>
        </View>

        <Text style={styles.sectionTitle}>{t.customer}</Text>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>{t.name}</Text>
          <Text style={styles.rowValue}>{customer.name}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>{t.email}</Text>
          <Text style={styles.rowValue}>{customer.email}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>{t.whatsapp}</Text>
          <Text style={styles.rowValue}>{customer.whatsapp}</Text>
        </View>
        {customer.source && sourceLabels[customer.source] && (
          <View style={styles.row}>
            <Text style={styles.rowLabel}>{t.source}</Text>
            <Text style={styles.rowValue}>
              {sourceLabels[customer.source][lang]}
            </Text>
          </View>
        )}

        <Text style={styles.sectionTitle}>{t.specs}</Text>
        {definition.steps.map((step) => {
          const stepEntries = byStep.get(step.id) ?? [];
          if (stepEntries.length === 0) return null;
          return (
            <View key={step.id} wrap={false}>
              <Text style={styles.stepTitle}>{step.title[lang]}</Text>
              {stepEntries.map((entry) => (
                <View key={entry.fieldId} style={styles.row}>
                  <Text style={styles.rowLabel}>{entry.fieldLabel[lang]}</Text>
                  <Text style={styles.rowValue}>
                    {!entry.answered ? (
                      t.none
                    ) : entry.kind === "text" ? (
                      entry.text
                    ) : entry.isOther ? (
                      <>
                        <Text style={styles.otherTag}>{t.other} — </Text>
                        {`"${entry.otherText ?? ""}"`}
                      </>
                    ) : (
                      entry.valueLabel?.[lang]
                    )}
                  </Text>
                </View>
              ))}
            </View>
          );
        })}

        {customer.notes && (
          <>
            <Text style={styles.sectionTitle}>{t.notes}</Text>
            <Text style={styles.notes}>{customer.notes}</Text>
          </>
        )}

        <Text style={styles.footer} fixed>
          Bocatto Luthieria — {t.footer}
        </Text>
      </Page>

      {/* Reference images */}
      {references.length > 0 && (
        <Page size="A4" style={styles.page}>
          <View style={styles.brandRow} fixed>
            <Text style={styles.brand}>Bocatto</Text>
            <Text style={styles.brandSub}>LUTHIERIA · {order}</Text>
          </View>
          <Text style={styles.sectionTitle}>{t.references}</Text>
          {references.map((entry) =>
            entry.images
              .filter((img) => imageData.has(img.url))
              .map((img) => (
                <View key={img.url} style={styles.refBlock} wrap={false}>
                  <Text style={styles.refCaption}>
                    {t.referenceFor}: {entry.stepTitle[lang]} →{" "}
                    {entry.fieldLabel[lang]}
                    {entry.otherText ? ` — "${entry.otherText}"` : ""}
                  </Text>
                  {/* eslint-disable-next-line jsx-a11y/alt-text -- react-pdf Image has no alt prop */}
                  <Image src={imageData.get(img.url)!} style={styles.refImage} />
                </View>
              )),
          )}
          <Text style={styles.footer} fixed>
            Bocatto Luthieria — {t.footer}
          </Text>
        </Page>
      )}
    </Document>
  );
}

/** Downloads/reads reference images and returns them as data URIs. */
async function collectImages(
  entries: SummaryEntry[],
  origin: string,
): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  const urls = entries.flatMap((e) => e.images.map((i) => i.url));

  for (const url of urls.slice(0, 12)) {
    try {
      let buffer: Buffer;
      if (url.startsWith("/")) {
        // Local dev upload: read straight from /public.
        const localPath = path.join(process.cwd(), "public", ...url.split("/").filter(Boolean));
        buffer = await readFile(localPath);
      } else {
        const res = await fetch(url.startsWith("http") ? url : `${origin}${url}`);
        if (!res.ok) continue;
        buffer = Buffer.from(await res.arrayBuffer());
      }
      const mime = url.endsWith(".png")
        ? "image/png"
        : url.endsWith(".webp")
          ? "image/webp"
          : "image/jpeg";
      // react-pdf does not decode webp; skip those rather than break the PDF.
      if (mime === "image/webp") continue;
      map.set(url, `data:${mime};base64,${buffer.toString("base64")}`);
    } catch {
      // Missing reference images must never block the order.
    }
  }
  return map;
}

export async function generateOrderPdf(opts: {
  lang: Lang;
  order: string;
  definition: InstrumentDefinition;
  values: Record<string, FieldValue>;
  customer: CustomerInfo;
  origin: string;
}): Promise<Buffer> {
  const entries = buildSummary(opts.definition, opts.values);
  const imageData = await collectImages(entries, opts.origin);

  let logoSrc: string | undefined;
  try {
    // Downscaled copy (~400 KB) — the original logo would balloon every PDF.
    const logo = await readFile(path.join(process.cwd(), "public", "logo-pdf.png"));
    logoSrc = `data:image/png;base64,${logo.toString("base64")}`;
  } catch {
    logoSrc = undefined;
  }

  const date = new Intl.DateTimeFormat(opts.lang === "pt" ? "pt-BR" : "en-US", {
    dateStyle: "long",
  }).format(new Date());

  return renderToBuffer(
    <OrderPdf
      lang={opts.lang}
      order={opts.order}
      date={date}
      definition={opts.definition}
      values={opts.values}
      customer={opts.customer}
      imageData={imageData}
      logoSrc={logoSrc}
    />,
  );
}
