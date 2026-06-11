/**
 * Central site configuration. Values come from environment variables so the
 * luthier's real contacts never live in the source code.
 */
export const site = {
  name: "Bocatto Luthieria",
  /** WhatsApp number in international format, digits only. */
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "5519997581354",
  /** Public contact e-mail shown on the site. */
  contactEmail:
    process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "cadubocatto83@gmail.com",
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? "",
} as const;
