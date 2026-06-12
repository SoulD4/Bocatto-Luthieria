/**
 * Optimizes the second reference pack (.refs2-tmp/Referencias2, extracted
 * from Referencias2.rar): headstocks, bindings (filetes), the new pickguard
 * photos, the home gallery and the special-project image.
 * Run: node scripts/build-refs2.mjs
 */
import sharp from "sharp";
import { mkdir, rm } from "fs/promises";
import path from "path";

const SRC = path.resolve(".refs2-tmp/Referencias2");
const QUALITY = 80;

async function convert(src, dest, width) {
  await mkdir(path.dirname(dest), { recursive: true });
  await sharp(src)
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: QUALITY })
    .toFile(dest);
}

/** [sourceDir, sourceFile, destPath, width] */
const JOBS = [
  // Headstock — file order follows the luthier's Modelo I..V sequence.
  ["Headstcok", "1000139084.webp", "public/refs/headstock/modelo-1.webp", 800],
  ["Headstcok", "1000139085.png", "public/refs/headstock/modelo-2.webp", 800],
  ["Headstcok", "1000139086.png", "public/refs/headstock/modelo-3.webp", 800],
  ["Headstcok", "1000139087.png", "public/refs/headstock/modelo-4.webp", 800],
  ["Headstcok", "1000139088.png", "public/refs/headstock/modelo-5.webp", 800],
  // Filetes (binding)
  ["Filete", "1000139094.webp", "public/refs/filetes/jacaranda.webp", 800],
  ["Filete", "1000139095.webp", "public/refs/filetes/maple.webp", 800],
  ["Filete", "1000139096.webp", "public/refs/filetes/madre-perola.webp", 800],
  ["Filete", "1000139097.png", "public/refs/filetes/tortoise.webp", 800],
  ["Filete", "1000139098.png", "public/refs/filetes/abalone.webp", 800],
  // Escudos — replaces the first pack's photos (real instrument shots).
  ["Escudos", "1000139128.webp", "public/refs/escudo/sem-escudo.webp", 800],
  ["Escudos", "1000139129.webp", "public/refs/escudo/gota-tortoise.webp", 800],
  ["Escudos", "1000139130.webp", "public/refs/escudo/gota-preto.webp", 800],
  ["Escudos", "1000139131.webp", "public/refs/escudo/gota-madeira.webp", 800],
  ["Escudos", "1000139132.webp", "public/refs/escudo/hummingbird-tortoise.webp", 800],
  ["Escudos", "1000139133.webp", "public/refs/escudo/hummingbird-preto.webp", 800],
  ["Escudos", "1000139134.webp", "public/refs/escudo/hummingbird-madeira.webp", 800],
  // Home gallery — real instruments built by the workshop (portrait 3:4).
  ["Carrosel", "1000139106.webp", "public/gallery/instrumento-1.webp", 1000],
  ["Carrosel", "1000139107.webp", "public/gallery/instrumento-2.webp", 1000],
  ["Carrosel", "1000139108.webp", "public/gallery/instrumento-3.webp", 1000],
  ["Carrosel", "1000139112.webp", "public/gallery/instrumento-4.webp", 1000],
  ["Carrosel", "1000139116.webp", "public/gallery/instrumento-5.webp", 1000],
  // Special project (in construction) — home feature section.
  ["Em Breve", "1000139146.png", "public/brand/projeto-especial.webp", 1200],
];

// The old separate "Lateral" category is gone: back & sides are one choice.
await rm(path.resolve("public/refs/lateral"), { recursive: true, force: true });

for (const [dir, file, dest, width] of JOBS) {
  await convert(path.join(SRC, dir, file), path.resolve(dest), width);
}
console.log(`done: ${JOBS.length} images optimized`);
