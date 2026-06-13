/**
 * Regenerates the home-hero carousel photos at high quality. The dark studio
 * gradient backgrounds band badly under aggressive WebP, so these use a larger
 * size, quality 92, max effort and smart subsampling — plus a faint grain that
 * dithers the gradient and keeps the encoder from quantizing it into steps.
 * Run (after extracting Referencias2.rar to .refs2-tmp): node scripts/build-gallery.mjs
 */
import sharp from "sharp";
import { mkdir } from "fs/promises";
import path from "path";

const SRC = path.resolve(".refs2-tmp/Referencias2/Carrosel");
const OUT = path.resolve("public/gallery");
const WIDTH = 1200;

const FILES = [
  ["1000139106.webp", "instrumento-1.webp"],
  ["1000139107.webp", "instrumento-2.webp"],
  ["1000139108.webp", "instrumento-3.webp"],
  ["1000139112.webp", "instrumento-4.webp"],
  ["1000139116.webp", "instrumento-5.webp"],
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
