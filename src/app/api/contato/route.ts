import { NextResponse } from "next/server";
import { z } from "zod";
import {
  clientIp,
  isHoneypotTripped,
  rateLimit,
  sanitizeText,
  verifyTurnstile,
} from "@/lib/antispam";
import { emailShell, LUTHIER_EMAIL, sendMail } from "@/lib/email";

const contactSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(200),
  message: z.string().min(5).max(3000),
  website: z.string().optional(), // honeypot
  turnstileToken: z.string().optional(),
});

export async function POST(request: Request) {
  const ip = clientIp(request);

  const { allowed, retryAfterSeconds } = rateLimit(
    `contato:${ip}`,
    5,
    60 * 60 * 1000,
  );
  if (!allowed) {
    return NextResponse.json(
      { error: "rate_limited" },
      { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } },
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  // Bots fill the hidden field — pretend success and drop silently.
  if (isHoneypotTripped(parsed.data.website)) {
    return NextResponse.json({ ok: true });
  }

  if (!(await verifyTurnstile(parsed.data.turnstileToken, ip))) {
    return NextResponse.json({ error: "turnstile" }, { status: 403 });
  }

  const name = sanitizeText(parsed.data.name, 120);
  const message = sanitizeText(parsed.data.message, 3000);

  const { ok } = await sendMail({
    to: LUTHIER_EMAIL,
    subject: `Contato pelo site — ${name}`,
    replyTo: parsed.data.email,
    html: emailShell(
      "Nova mensagem pelo site",
      `<p><strong>Nome:</strong> ${name}</p>
       <p><strong>E-mail:</strong> ${parsed.data.email}</p>
       <p style="white-space:pre-wrap;">${message}</p>`,
    ),
  });

  if (!ok) {
    return NextResponse.json({ error: "send_failed" }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
