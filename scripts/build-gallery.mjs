/**
 * Regenerates the home-hero carousel photos at high quality. The dark studio
 * gradient backgrounds band badly under aggressive WebP, so these use a larger
 * size, quality 92, max effort and smart subsampling — plus a faint grain that
 * dithers the gradient and keeps the encoder from quantizing it into steps.
 * Source: carroselfinal.zip (owner-prepared art with embedded captions),
 * extracted to .carrossel-tmp. Run: node scripts/build-gallery.mjs
 */
import sharp from "sharp";
import { mkdir } from "fs/promises";
import path from "path";

const SRC = path.resolve(".carrossel-tmp");
const OUT = path.resolve("public/gallery");
const WIDTH = 1200;

// Display order: OM (flagship) → Dreadnought → 015 → Concert → Viola Caipira.
const FILES = [
  ["b4b6b1a0-764c-11f1-a3e0-c7b4909cf957.webp", "instrumento-1.webp"], // OM
  ["3f0c5c10-764d-11f1-a3e0-c7b4909cf957.png", "instrumento-2.webp"], // Dreadnought
  ["3eb6c200-764d-11f1-a3e0-c7b4909cf957.png", "instrumento-3.webp"], // 015
  ["b697f4c0-764c-11f1-a3e0-c7b4909cf957.webp", "instrumento-4.webp"], // Concert
  ["b8452f90-764c-11f1-a3e0-c7b4909cf957.webp", "instrumento-5.webp"], // Viola Caipira
];

await mkdir(OUT, { recursive: true });

for (const [src, dest] of FILES) {
  // Resolve the post-resize dimensions up front (metadata() reports the
  // source size, not the resized one) so the grain layer matches exactly.
  const meta = await sharp(path.join(SRC, src)).metadata();
  const w = Math.min(WIDTH, meta.width);
  const h = Math.round((w / meta.width) * meta.height);

  const resized = await sharp(path.join(SRC, src))
    .resize({ width: w, withoutEnlargement: true })
    .toBuffer();

  // Faint grain breaks up the smooth gradient so WebP can't band it.
  // Invisible to the eye, decisive for the encoder.
  const grain = await sharp({
    create: {
      width: w,
      height: h,
      channels: 3,
      background: "#000",
      noise: { type: "gaussian", mean: 128, sigma: 14 },
    },
  })
    .png()
    .toBuffer();

  await sharp(resized)
    .composite([{ input: grain, blend: "soft-light", opacity: 0.5 }])
    .webp({ quality: 92, effort: 6, smartSubsample: true })
    .toFile(path.join(OUT, dest));
}

console.log(`done: ${FILES.length} carousel photos regenerated @ q92 ${WIDTH}px + grain`);
