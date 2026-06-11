"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import type { UploadedImage } from "@/store/configurator";

const MAX_SIZE = 8 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/png", "image/webp"];

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
  const [error, setError] = useState(false);

  async function handleFile(file: File) {
    setError(false);
    if (!ALLOWED.includes(file.type) || file.size > MAX_SIZE) {
      setError(true);
      return;
    }
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: form });
      if (!res.ok) throw new Error(String(res.status));
      const data = (await res.json()) as { url: string };
      onChange([...images, { url: data.url, name: file.name }]);
    } catch {
      setError(true);
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
            accept={ALLOWED.join(",")}
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
            {uploading ? "…" : `+ ${t("uploadCta")}`}
          </button>
          <p className="text-[0.7rem] text-muted mt-2">{t("uploadHint")}</p>
        </div>
      )}

      {error && <p className="text-red-400/90 text-xs">{t("uploadError")}</p>}
    </div>
  );
}
