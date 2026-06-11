import { randomBytes } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

/**
 * File storage abstraction: Vercel Blob in production (public URLs required
 * for the WhatsApp PDF link), local public/uploads as the dev fallback so the
 * whole flow works without any account.
 */

function randomName(ext: string, prefix: string): string {
  return `${prefix}/${Date.now()}-${randomBytes(6).toString("hex")}${ext}`;
}

export async function storeFile(
  data: Buffer,
  ext: string,
  contentType: string,
  prefix: "referencias" | "pedidos",
): Promise<{ url: string }> {
  const name = randomName(ext, prefix);

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const { put } = await import("@vercel/blob");
    const blob = await put(name, data, {
      access: "public",
      contentType,
    });
    return { url: blob.url };
  }

  // On Vercel the filesystem is read-only: without a Blob store there is
  // nowhere to persist files. Fail with a clear message so callers can
  // degrade gracefully (the order flow continues without a public PDF link).
  if (process.env.VERCEL) {
    throw new Error(
      "storage unavailable: create a Vercel Blob store so BLOB_READ_WRITE_TOKEN is set",
    );
  }

  // Local fallback: served from /public.
  const filePath = path.join(process.cwd(), "public", "uploads", name);
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, data);
  return { url: `/uploads/${name.replace(/\\/g, "/")}` };
}
