import pt from "@/messages/pt.json";
import en from "@/messages/en.json";

/**
 * Builds the wa.me deep link that opens WhatsApp with the order message
 * pre-filled (customer name, order number, instrument, summary and PDF link)
 * — the user only presses "send".
 */
export function buildWhatsappUrl(opts: {
  lang: "pt" | "en";
  order: string;
  name: string;
  instrument: string;
  summary: string;
  /** Public PDF link; null when storage is unavailable (PDF goes by e-mail only). */
  pdfUrl: string | null;
}): string {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "5519997581354";
  const wa = (opts.lang === "pt" ? pt : en).wa;
  const pdfLine = opts.pdfUrl
    ? wa.pdfLink.replace("{link}", opts.pdfUrl)
    : wa.pdfByEmail;
  const message = wa.message
    .replace("{order}", opts.order)
    .replace("{name}", opts.name)
    .replace("{instrument}", opts.instrument)
    .replace("{summary}", opts.summary)
    .replace("{pdfLine}", pdfLine);
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
