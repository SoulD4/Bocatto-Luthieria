/**
 * Anti-spam helpers: per-IP in-memory rate limiting, Cloudflare Turnstile
 * verification and honeypot check.
 *
 * The rate limiter is in-memory by design for the prototype: good enough on a
 * single serverless instance / dev server. Swap for Upstash Redis when real
 * traffic arrives.
 */

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): { allowed: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  bucket.count += 1;
  if (bucket.count > limit) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((bucket.resetAt - now) / 1000),
    };
  }
  return { allowed: true, retryAfterSeconds: 0 };
}

export function clientIp(request: Request): string {
  const fwd = request.headers.get("x-forwarded-for");
  return fwd?.split(",")[0]?.trim() || "unknown";
}

/**
 * Verifies a Cloudflare Turnstile token. When TURNSTILE_SECRET_KEY is not
 * configured (local prototype), verification is skipped so the flow still
 * works end-to-end.
 */
export async function verifyTurnstile(
  token: string | undefined,
  ip: string,
): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;

  try {
    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret, response: token, remoteip: ip }),
      },
    );
    const data = (await res.json()) as { success: boolean };
    return data.success;
  } catch {
    return false;
  }
}

/** Returns true when the hidden honeypot field was filled in (i.e. a bot). */
export function isHoneypotTripped(value: unknown): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

/** Strips HTML tags and trims — basic sanitization for free-text inputs. */
export function sanitizeText(value: string, maxLength = 1000): string {
  return value.replace(/<[^>]*>/g, "").trim().slice(0, maxLength);
}
