"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import type { UploadedImage } from "@/store/configurator";

/** Files already in a web format and below this size skip recompression. */
const PASSTHROUGH_SIZE = 4 * 1024 * 1024;
const WEB_TYPES = ["image/jpeg", "image/png", "image/webp"];
/** Long-edge cap for recompressed photos — plenty for the PDF and review. */
const MAX_EDGE = 1600;

type UploadError = "format" | "server" | null;

/**
 * Decodes any browser-readable image (including phone-camera HEIC on iOS)
 * and re-encodes it as a web-friendly JPEG capped at MAX_EDGE pixels, so
 * multi-megabyte camera shots never hit the server's 8 MB / format limits.
 */
async function toWebImage(file: File): Promise<Blob> {
  if (WEB_TYPES.includes(file.type) && file.size <= PASSTHROUGH_SIZE) {
    return file;
  }

  let source: ImageBitmap | HTMLImageElement;
  let width: number;
  let height: number;
  try {
    const bitmap = await createImageBitmap(file);
    source = bitmap;
    width = bitmap.width;
    height = bitmap.height;
  } catch {
    // Safari can't createImageBitmap from every format — try an <img> decode.
    const url = URL.createObjectURL(file);
    try {
      const img = new Image();
      img.src = url;
      await img.decode();
      source = img;
      width = img.naturalWidth;
      height = img.naturalHeight;
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  const scale = Math.min(1, MAX_EDGE / Math.max(width, height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(width * scale));
  canvas.height = Math.max(1, Math.round(height * scale));
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas");
  ctx.drawImage(source, 0, 0, canvas.width, canvas.height);
  if ("close" in source) source.close();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", 0.85),
  );
  if (!blob) throw new Error("encode");
  return blob;
}

export default function ImageUpload({
  images,
  onChange,
  max = 2,
}: {
  images: UploadedImage[];
  onChange: (images: UploadedImage[]) => void;
  max?: number;
}) {
  const t = useTranslations("config");
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<UploadError>(null);

  async function handleFile(file: File) {
    setError(null);
    setUploading(true);

    let blob: Blob;
    try {
      blob = await toWebImage(file);
    } catch {
      setUploading(false);
      setError("format");
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    try {
      const form = new FormData();
      const name = file.name.replace(/\.[^.]+$/, "") || "referencia";
      form.append("file", blob, `${name}.jpg`);
      const res = await fetch("/api/upload", { method: "POST", body: form });
      if (!res.ok) throw new Error(String(res.status));
      const data = (await res.json()) as { url: string };
      onChange([...images, { url: data.url, name: file.name }]);
    } catch {
      setError("server");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-3">
      {images.length > 0 && (
        <ul className="flex flex-wrap gap-3">
          {images.map((img) => (
            <li key={img.url} className="relative group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.url}
                alt={img.name}
                className="h-20 w-20 object-cover rounded-sm border border-line"
              />
              <button
                type="button"
                onClick={() => onChange(images.filter((i) => i.url !== img.url))}
                className="absolute -top-2 -right-2 bg-ink border border-line rounded-full w-6 h-6 text-xs text-cream/80 hover:text-gold hover:border-gold/60 cursor-pointer"
                aria-label={t("uploadRemove")}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}

      {images.length < max && (
        <div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleFile(file);
            }}
          />
          <button
            type="button"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className="text-xs uppercase tracking-[0.15em] border border-line text-cream/80 hover:border-gold/60 hover:text-gold transition-colors rounded-sm px-4 py-2.5 cursor-pointer disabled:opacity-50"
          >
            {uploading ? t("uploadSending") : `+ ${t("uploadCta")}`}
          </button>
          <p className="text-[0.7rem] text-muted mt-2">
            {t("uploadHint", { max })}
          </p>
        </div>
      )}

      {error && (
        <p className="text-red-400/90 text-xs">
          {error === "format" ? t("uploadError") : t("uploadErrorServer")}
        </p>
      )}
    </div>
  );
}
