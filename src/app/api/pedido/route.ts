import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { z } from "zod";
import { violao, instruments } from "@/data/instruments/violao";
import { OTHER_OPTION_ID } from "@/data/instruments/values";
import type { FieldValue } from "@/data/instruments/values";
import { isFieldVisible, shortSummary, validateStep } from "@/lib/summary";
import {
  clientIp,
  isHoneypotTripped,
  rateLimit,
  sanitizeText,
  verifyTurnstile,
} from "@/lib/antispam";
import { emailShell, LUTHIER_EMAIL, sendMail } from "@/lib/email";
import { generateOrderPdf } from "@/lib/pdf";
import { storeFile } from "@/lib/storage";
import { buildWhatsappUrl } from "@/lib/whatsapp";

export const runtime = "nodejs";
export const maxDuration = 60;

const imageSchema = z.object({
  url: z.string().max(500),
  name: z.string().max(200),
});

const fieldValueSchema = z.object({
  optionId: z.string().max(60).optional(),
  otherText: z.string().max(500).optional(),
  images: z.array(imageSchema).max(2).optional(),
  text: z.string().max(500).optional(),
});

const orderSchema = z.object({
  locale: z.enum(["pt", "en"]),
  instrumentId: z.literal("violao"),
  values: z.record(z.string().max(60), fieldValueSchema),
  customer: z.object({
    name: z.string().min(2).max(120),
    email: z.string().email().max(200),
    whatsapp: z.string().min(10).max(30),
    notes: z.string().max(2000).optional().default(""),
    source: z.string().max(30).optional().default(""),
  }),
  website: z.string().optional(), // honeypot
  turnstileToken: z.string().optional(),
});

/** Allows only URLs we could have produced: local uploads or Vercel Blob. */
function isTrustedImageUrl(url: string): boolean {
  if (url.startsWith("/uploads/")) return true;
  try {
    const u = new URL(url);
    return u.protocol === "https:" && u.hostname.endsWith(".blob.vercel-storage.com");
  } catch {
    return false;
  }
}

/**
 * Semantic validation against the instrument definition: required fields
 * answered, option ids real, "Other" descriptions present, images trusted.
 */
function validateValues(
  values: Record<string, FieldValue>,
): { ok: true } | { ok: false; reason: string } {
  let totalImages = 0;

  for (const step of violao.steps) {
    const errors = validateStep(step, values);
    if (Object.keys(errors).length > 0) {
      return { ok: false, reason: `step:${step.id}` };
    }
    for (const field of step.fields) {
      const value = values[field.id];
      if (!value) continue;
      if (field.kind === "choice" && value.optionId) {
        if (!isFieldVisible(field, values)) continue;
        const valid =
          value.optionId === OTHER_OPTION_ID
            ? field.allowOther !== false
            : field.options.some((o) => o.id === value.optionId);
        if (!valid) return { ok: false, reason: `option:${field.id}` };
      }
      for (const img of value.images ?? []) {
        totalImages += 1;
        if (!isTrustedImageUrl(img.url)) {
          return { ok: false, reason: `image:${field.id}` };
        }
      }
    }
  }

  if (totalImages > 12) return { ok: false, reason: "images:count" };
  return { ok: true };
}

function makeOrderId(): string {
  const now = new Date();
  const ymd = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
  return `BOC-${ymd}-${randomBytes(2).toString("hex").toUpperCase()}`;
}

export async function POST(request: Request) {
  const ip = clientIp(request);

  const { allowed, retryAfterSeconds } = rateLimit(
    `pedido:${ip}`,
    3,
    60 * 60 * 1000,
  );
  if (!allowed) {
    return NextResponse.json(
      { error: "rate_limited" },
      { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } },
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = orderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
  const data = parsed.data;

  if (isHoneypotTripped(data.website)) {
    // Bots get a fake success and nothing happens.
    return NextResponse.json({
      order: makeOrderId(),
      pdfUrl: "/",
      whatsappUrl: "https://wa.me/",
    });
  }

  if (!(await verifyTurnstile(data.turnstileToken, ip))) {
    return NextResponse.json({ error: "turnstile" }, { status: 403 });
  }

  // Sanitize all free text before it reaches the PDF/e-mails.
  const values: Record<string, FieldValue> = {};
  for (const [fieldId, raw] of Object.entries(data.values)) {
    values[fieldId] = {
      optionId: raw.optionId,
      otherText: raw.otherText ? sanitizeText(raw.otherText, 500) : undefined,
      text: raw.text ? sanitizeText(raw.text, 500) : undefined,
      images: raw.images,
    };
  }

  const semantic = validateValues(values);
  if (!semantic.ok) {
    return NextResponse.json(
      { error: "invalid_values", detail: semantic.reason },
      { status: 400 },
    );
  }

  const customer = {
    name: sanitizeText(data.customer.name, 120),
    email: data.customer.email.trim(),
    whatsapp: sanitizeText(data.customer.whatsapp, 30),
    notes: data.customer.notes ? sanitizeText(data.customer.notes, 2000) : "",
    source: data.customer.source,
  };

  const definition = instruments[data.instrumentId];
  const order = makeOrderId();
  const origin = new URL(request.url).origin;
  const lang = data.locale;

  // 1. Generate the PDF (reference images embedded).
  let pdfBuffer: Buffer;
  try {
    pdfBuffer = await generateOrderPdf({
      lang,
      order,
      definition,
      values,
      customer,
      origin,
    });
  } catch (err) {
    console.error("[pedido] PDF generation failed:", err);
    return NextResponse.json({ error: "pdf_failed" }, { status: 500 });
  }

  // 2. Store it so WhatsApp/e-mail can link to it.
  let pdfUrl: string;
  try {
    const stored = await storeFile(pdfBuffer, ".pdf", "application/pdf", "pedidos");
    pdfUrl = stored.url.startsWith("http") ? stored.url : `${origin}${stored.url}`;
  } catch (err) {
    console.error("[pedido] PDF storage failed:", err);
    return NextResponse.json({ error: "storage_failed" }, { status: 500 });
  }

  const summary = shortSummary(definition, values, lang);
  const filename = `${order}.pdf`;
  const attachments = [{ filename, content: pdfBuffer }];

  // 3. E-mails — failures are logged but never block the order.
  const luthierHtml = emailShell(
    `Novo pedido ${order}`,
    `<p><strong>Cliente:</strong> ${customer.name}</p>
     <p><strong>E-mail:</strong> ${customer.email}<br/>
        <strong>WhatsApp:</strong> <a href="https://wa.me/${customer.whatsapp.replace(/\D/g, "")}" style="color:#c9a227;">${customer.whatsapp}</a></p>
     <p><strong>Resumo:</strong> ${summary || "—"}</p>
     ${customer.notes ? `<p><strong>Observações:</strong> ${customer.notes}</p>` : ""}
     <p>PDF completo em anexo e em <a href="${pdfUrl}" style="color:#c9a227;">${pdfUrl}</a></p>`,
  );

  const clientSubject =
    lang === "pt"
      ? "Recebemos o seu pedido — Bocatto Luthieria"
      : "We received your order — Bocatto Luthieria";
  const clientHtml = emailShell(
    lang === "pt" ? `Obrigado, ${customer.name}!` : `Thank you, ${customer.name}!`,
    lang === "pt"
      ? `<p>Recebemos o seu pedido <strong>${order}</strong> com todas as especificações do seu violão.</p>
         <p>O luthier vai analisar o projeto e retornar pessoalmente com o orçamento. O documento completo está em anexo.</p>
         <p>Até breve,<br/>Bocatto Luthieria</p>`
      : `<p>We received your order <strong>${order}</strong> with all the specifications of your guitar.</p>
         <p>The luthier will review the project and reply personally with a quote. The full document is attached.</p>
         <p>See you soon,<br/>Bocatto Luthieria</p>`,
  );

  const [luthierResult, clientResult] = await Promise.all([
    sendMail({
      to: LUTHIER_EMAIL,
      subject: `🎸 Novo pedido ${order} — ${customer.name}`,
      replyTo: customer.email,
      html: luthierHtml,
      attachments,
    }),
    sendMail({
      to: customer.email,
      subject: clientSubject,
      html: clientHtml,
      attachments,
    }),
  ]);
  if (!luthierResult.ok || !clientResult.ok) {
    console.error(
      `[pedido] e-mail delivery incomplete (luthier=${luthierResult.ok}, client=${clientResult.ok}) for ${order}`,
    );
  }

  // 4. WhatsApp deep link with ready-to-send message.
  const whatsappUrl = buildWhatsappUrl({
    lang,
    order,
    name: customer.name,
    summary,
    pdfUrl,
  });

  return NextResponse.json({ order, pdfUrl, whatsappUrl });
}
