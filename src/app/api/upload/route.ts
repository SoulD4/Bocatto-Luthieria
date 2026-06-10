import { NextResponse } from "next/server";
import { clientIp, rateLimit } from "@/lib/antispam";
import { storeFile } from "@/lib/storage";

const MAX_SIZE = 8 * 1024 * 1024;

const ALLOWED: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

/** Magic-byte sniffing so a renamed executable can't pass as an image. */
function sniffImage(buf: Buffer): string | null {
  if (buf.length > 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff)
    return "image/jpeg";
  if (
    buf.length > 8 &&
    buf[0] === 0x89 &&
    buf[1] === 0x50 &&
    buf[2] === 0x4e &&
    buf[3] === 0x47
  )
    return "image/png";
  if (
    buf.length > 12 &&
    buf.toString("ascii", 0, 4) === "RIFF" &&
    buf.toString("ascii", 8, 12) === "WEBP"
  )
    return "image/webp";
  return null;
}

export async function POST(request: Request) {
  const ip = clientIp(request);
  const { allowed, retryAfterSeconds } = rateLimit(
    `upload:${ip}`,
    15,
    60 * 60 * 1000,
  );
  if (!allowed) {
    return NextResponse.json(
      { error: "rate_limited" },
      { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } },
    );
  }

  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File) || file.size === 0 || file.size > MAX_SIZE) {
    return NextResponse.json({ error: "invalid_file" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const sniffed = sniffImage(buffer);
  if (!sniffed || !(sniffed in ALLOWED)) {
    return NextResponse.json({ error: "invalid_type" }, { status: 400 });
  }

  const { url } = await storeFile(buffer, ALLOWED[sniffed], sniffed, "referencias");
  return NextResponse.json({ url });
}
