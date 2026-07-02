import type { Localized } from "@/data/catalog";
import type { InstrumentDefinition } from "./types";
import { instruments } from "./violao";

/**
 * Catalog of instrument families offered by the workshop — the very first
 * choice of the creation flow. Making a family (or a variant) available later
 * means wiring its InstrumentDefinition here; everything downstream (wizard,
 * summary, PDF, e-mails, WhatsApp) is data-driven and needs no changes.
 */

export type InstrumentVariant = {
  id: string;
  name: Localized;
  description: Localized;
  /** Present when this variant's configurator is ready. */
  definition?: InstrumentDefinition;
  /** Coming-soon body shown when there is no definition yet. */
  comingSoonNote?: Localized;
};

export type InstrumentFamily = {
  id: "violao" | "guitarra" | "baixo" | "viola";
  name: Localized;
  description: Localized;
  /** Families without variants (or with none ready) show a coming-soon screen. */
  variants?: InstrumentVariant[];
  comingSoonNote?: Localized;
};

const CONFIGURATOR_SOON: Localized = {
  pt: "Estamos preparando o configurador deste instrumento.",
  en: "We are preparing the configurator for this instrument.",
};

export const families: InstrumentFamily[] = [
  {
    id: "violao",
    name: { pt: "Violão", en: "Acoustic Guitar" },
    description: {
      pt: "A alma da oficina: corpos de aço e nylon feitos sob medida, madeira a madeira.",
      en: "The soul of the workshop: steel and nylon bodies built to order, wood by wood.",
    },
    variants: [
      {
        id: "aco",
        name: { pt: "Violão de Aço", en: "Steel-string Guitar" },
        description: {
          pt: "Brilho, projeção e sustain — o timbre do folk, do pop e do fingerstyle.",
          en: "Sparkle, projection and sustain — the voice of folk, pop and fingerstyle.",
        },
        definition: instruments["violao-aco"],
      },
      {
        id: "nylon",
        name: { pt: "Violão de Nylon", en: "Nylon-string Guitar" },
        description: {
          pt: "Calor e intimidade — a voz do clássico, da bossa e do choro.",
          en: "Warmth and intimacy — the voice of classical, bossa and choro.",
        },
        comingSoonNote: {
          pt: "Estamos finalizando os modelos de violões de nylon.",
          en: "We are finishing the nylon guitar models.",
        },
      },
    ],
  },
  {
    id: "guitarra",
    name: { pt: "Guitarra", en: "Electric Guitar" },
    description: {
      pt: "Projetos sólidos e semiacústicos esculpidos peça a peça na bancada.",
      en: "Solid-body and semi-hollow projects sculpted piece by piece on the bench.",
    },
    comingSoonNote: CONFIGURATOR_SOON,
  },
  {
    id: "baixo",
    name: { pt: "Baixo", en: "Bass" },
    description: {
      pt: "A fundação do groove, com madeiras e eletrônica escolhidas a dedo.",
      en: "The foundation of the groove, with hand-picked woods and electronics.",
    },
    comingSoonNote: CONFIGURATOR_SOON,
  },
  {
    id: "viola",
    name: { pt: "Viola", en: "Viola Caipira" },
    description: {
      pt: "Dez cordas de tradição brasileira, do sertão ao palco.",
      en: "Ten strings of Brazilian tradition, from the countryside to the stage.",
    },
    comingSoonNote: CONFIGURATOR_SOON,
  },
];
