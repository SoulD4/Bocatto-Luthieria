/**
 * Converts the luthier's reference pack (.refs-tmp/Referencias, extracted from
 * Referencias.rar) into web-optimized webp files under public/refs/<field>/<optionId>.webp.
 * File names follow the option ids in src/data/instruments/violao.ts so the UI
 * can reference them directly. Run: node scripts/build-refs.mjs
 */
import sharp from "sharp";
import { mkdir, rm } from "fs/promises";
import path from "path";

const SRC = path.resolve(".refs-tmp/Referencias");
const OUT = path.resolve("public/refs");
const WIDTH = 800;
const QUALITY = 80;

/** field -> { sourceDir, files: { "source name.png": "option-id" } } */
const MAP = {
  modelos: {
    dir: "Modelos",
    files: {
      "Bocatto OM.png": "om",
      "Bocatto Deadnought.png": "dreadnought",
      "Bocatto Jumbo.png": "jumbo",
      "Bocatto J45.png": "j45",
      "Bocatto 015.png": "015",
      "Bocatto Mini.png": "mini",
    },
  },
  tampo: {
    dir: "Tampo",
    files: {
      "Abeto Alemão.png": "abeto-alemao",
      "Mogno.png": "mogno",
      "Red Cedar.png": "red-cedar",
      "Sitka Spruce.png": "sitka",
    },
  },
  fundo: {
    dir: "Fundo",
    files: {
      "Imbuia.png": "imbuia",
      "Jacarandá.png": "jacaranda",
      "Maple.png": "maple",
      "Mogno.png": "mogno",
    },
  },
  lateral: {
    dir: "Lateral",
    files: {
      "Imbuia.png": "imbuia",
      "Jacarandá.png": "jacaranda",
      "Maple.png": "maple",
      "Mogno.png": "mogno",
    },
  },
  braco: {
    dir: "Braço",
    files: {
      "Cedro.png": "cedro",
      "Maple.png": "maple",
      "Marupá.png": "marupa",
      "Mogno.png": "mogno",
    },
  },
  escala: {
    dir: "Escala",
    files: {
      "Black Purple.png": "black-purple",
      "Jacarandá.png": "jacaranda",
      "Maple.png": "maple",
      "Pau Ferro.png": "pau-ferro",
      "Ébano.png": "ebano",
    },
  },
  cavalete: {
    dir: "Cavalet",
    files: {
      "Black Purple.png": "black-purple",
      "Jacarandá.png": "jacaranda",
      "Pau Ferro.png": "pau-ferro",
      "Ébano.png": "ebano",
    },
  },
  roseta: {
    dir: "Roseta",
    files: {
      "Abalone.png": "abalone",
      "Jacaranda Exclusiva.png": "jacaranda-exclusiva",
      "Madre Pérola.png": "madre-perola",
    },
  },
  marcacao: {
    dir: "Marcação Escala",
    files: {
      "Cruz e Lozango.png": "cruz-losango",
      "Dots.png": "dots-6mm",
      "Floral.png": "floral",
    },
  },
  escudo: {
    dir: "Escudo",
    files: {
      "Gota em Maderira.png": "gota-madeira",
      "Gota em Preto.png": "gota-preto",
      "Gota Tortoise.png": "gota-tortoise",
      "Hummingbird em Madeira.png": "hummingbird-madeira",
      "Hummingbird Preto.png": "hummingbird-preto",
      "Hummingbird Tortoise.png": "hummingbird-tortoise",
      "Sem escudo.png": "sem-escudo",
    },
  },
  cutaway: {
    dir: "Cutway",
    files: {
      "Florentino.png": "florentino",
      "Sem Cut.png": "sem-cutaway",
      "Veneziano.png": "veneziano",
    },
  },
  tarraxas: {
    dir: "Tarraxas",
    files: {
      "Gotoh Cromo.png": "gotoh",
      "Grover Cromo.png": "grover",
      "Guyker Cromo.png": "guyker",
    },
  },
  nutRastilho: {
    dir: "Nut e Rastilho",
    files: {
      "Grafitech.png": "grafitech",
      "Nature Bone ( Osso).png": "nature-bone",
      "Sintetic (plástico).png": "sintetico",
    },
  },
  trastes: {
    dir: "Trastes",
    files: {
      "DHP - Inox.png": "dhp-inox",
      "DHP - Liga.png": "dhp-liga",
      "Jescar - Inox.png": "jescar-inox",
      "Sanko Gotoh - Liga.png": "sanko-gotoh-liga",
    },
  },
  acabamento: {
    dir: "Acabamento",
    files: {
      "Brilho.png": "brilho",
      "Fosco.png": "fosco",
      "Semi Brilho.png": "semi-brilho",
    },
  },
  armRest: {
    dir: "ArmRest",
    files: {
      "Com ArmRest.png": "arm-rest-madeira",
      "Sem ArmRest.png": "sem-arm-rest",
    },
  },
};

async function convert(src, dest) {
  await sharp(src)
    .resize({ width: WIDTH, withoutEnlargement: true })
    .webp({ quality: QUALITY })
    .toFile(dest);
}

await rm(OUT, { recursive: true, force: true });
let count = 0;

for (const [field, { dir, files }] of Object.entries(MAP)) {
  const outDir = path.join(OUT, field);
  await mkdir(outDir, { recursive: true });
  for (const [file, optionId] of Object.entries(files)) {
    await convert(path.join(SRC, dir, file), path.join(outDir, `${optionId}.webp`));
    count++;
  }
}

// Generic "Outro" image, used by every custom-option card.
await convert(
  path.join(SRC, "Outros (usa em todos)", "1000138557.png"),
  path.join(OUT, "outro.webp"),
);
count++;

console.log(`done: ${count} images -> public/refs`);
