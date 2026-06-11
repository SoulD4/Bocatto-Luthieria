import { Resend } from "resend";

/**
 * E-mail delivery via Resend with graceful degradation: when RESEND_API_KEY
 * is not configured (local prototype), messages are logged to the console
 * instead of failing the request.
 */

export type Attachment = { filename: string; content: Buffer };

export type Mail = {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
  attachments?: Attachment[];
};

const FROM =
  process.env.EMAIL_FROM ?? "Bocatto Luthieria <onboarding@resend.dev>";

/** E-mail address of the luthier who receives the orders. */
export const LUTHIER_EMAIL =
  process.env.LUTHIER_EMAIL ?? "cadubocatto83@gmail.com";

export async function sendMail(mail: Mail): Promise<{ ok: boolean }> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.log(
      `[email:dev] would send to=${mail.to} subject="${mail.subject}" attachments=${mail.attachments?.length ?? 0}`,
    );
    return { ok: true };
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: FROM,
      to: mail.to,
      subject: mail.subject,
      html: mail.html,
      replyTo: mail.replyTo,
      attachments: mail.attachments?.map((a) => ({
        filename: a.filename,
        content: a.content,
      })),
    });
    if (error) {
      console.error("[email] send failed:", error);
      return { ok: false };
    }
    return { ok: true };
  } catch (err) {
    console.error("[email] send threw:", err);
    return { ok: false };
  }
}

/** Shared dark/gold shell for brand e-mails. */
export function emailShell(title: string, bodyHtml: string): string {
  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#0c0a07;font-family:Georgia,serif;color:#f2ead9;">
    <div style="max-width:560px;margin:0 auto;padding:32px 24px;">
      <p style="font-size:16px;letter-spacing:5px;text-transform:uppercase;color:#c9a227;margin:0 0 28px;">Bocatto Luthieria</p>
      <h1 style="font-size:22px;font-weight:normal;color:#f2ead9;margin:0 0 16px;">${title}</h1>
      <div style="font-size:15px;line-height:1.6;color:#d8cfbd;">${bodyHtml}</div>
      <hr style="border:none;border-top:1px solid #2e271c;margin:28px 0;" />
      <p style="font-size:12px;color:#a89d8a;">Bocatto Luthieria — instrumentos feitos à mão, um a um.</p>
    </div>
  </body>
</html>`;
}
