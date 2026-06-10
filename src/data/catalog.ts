/** Localized string pair used across data files. */
export type Localized = { pt: string; en: string };

export type CatalogItem = {
  id: string;
  name: string;
  top: Localized;
  backSides: Localized;
  strings: Localized;
  description: Localized;
  /** Wood gradient for the concept illustration. */
  woodFrom: string;
  woodTo: string;
};

/**
 * Example instruments shown on the About page. Placeholder content until the
 * luthier provides real photos and specs — keep names plausible and elegant.
 */
export const catalog: CatalogItem[] = [
  {
    id: "concerto",
    name: "Concerto",
    top: { pt: "Spruce alemão", en: "German spruce" },
    backSides: { pt: "Jacarandá", en: "Rosewood" },
    strings: { pt: "Nylon", en: "Nylon" },
    description: {
      pt: "Clássico de concerto com voz cristalina e projeção generosa, pensado para o repertório erudito.",
      en: "A concert classical with a crystalline voice and generous projection, designed for the classical repertoire.",
    },
    woodFrom: "#6b4423",
    woodTo: "#2a1a0e",
  },
  {
    id: "estudio",
    name: "Estúdio",
    top: { pt: "Cedro", en: "Cedar" },
    backSides: { pt: "Imbuia", en: "Brazilian walnut (imbuia)" },
    strings: { pt: "Nylon", en: "Nylon" },
    description: {
      pt: "Timbre quente e resposta imediata, com madeiras brasileiras e estética minimalista.",
      en: "Warm tone and immediate response, with Brazilian woods and a minimalist aesthetic.",
    },
    woodFrom: "#8a5a2b",
    woodTo: "#3a2410",
  },
  {
    id: "ribeira",
    name: "Ribeira",
    top: { pt: "Spruce Sitka", en: "Sitka spruce" },
    backSides: { pt: "Mogno", en: "Mahogany" },
    strings: { pt: "Aço", en: "Steel" },
    description: {
      pt: "Folk em aço com cutaway venetian, equilíbrio entre brilho e corpo para dedilhado e palhetada.",
      en: "A steel-string folk with venetian cutaway, balancing sparkle and body for fingerstyle and strumming.",
    },
    woodFrom: "#7c4a22",
    woodTo: "#331f0f",
  },
  {
    id: "aurora",
    name: "Aurora",
    top: { pt: "Cedro", en: "Cedar" },
    backSides: { pt: "Maple flameado", en: "Flamed maple" },
    strings: { pt: "Nylon", en: "Nylon" },
    description: {
      pt: "Peça de atelier com fundo em maple flameado, roseta em mosaico e acabamento goma-laca.",
      en: "A workshop showpiece with flamed maple back, mosaic rosette and shellac finish.",
    },
    woodFrom: "#a87b3f",
    woodTo: "#4a2f15",
  },
];
