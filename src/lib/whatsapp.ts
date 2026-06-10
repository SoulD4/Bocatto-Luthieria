import pt from "@/messages/pt.json";
import en from "@/messages/en.json";

/**
 * Builds the wa.me deep link that opens WhatsApp with the order message
 * pre-filled (text + PDF link) — the user only presses "send".
 */
export function buildWhatsappUrl(opts: {
  lang: "pt" | "en";
  order: string;
  name: string;
  summary: string;
  pdfUrl: string;
}): string {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "5500000000000";
  const template = (opts.lang === "pt" ? pt : en).wa.message;
  const message = template
    .replace("{order}", opts.order)
    .replace("{name}", opts.name)
    .replace("{summary}", opts.summary)
    .replace("{link}", opts.pdfUrl);
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
