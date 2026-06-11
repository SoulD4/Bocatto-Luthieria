import type { InstrumentDefinition } from "./types";

/**
 * Bocatto steel-string acoustic family. Models and options come from the
 * luthier's spreadsheet ("Violões Aço"). The whole creation flow, summary,
 * PDF and 3D viewer are driven by this data — adding nylon guitars, electric
 * guitars, basses or violas later means creating a sibling file (e.g.
 * `violaoNylon`, `guitarra`, `baixo`, `viola`) and registering it in
 * `instruments` below, with no screen changes.
 */
export const violaoAco: InstrumentDefinition = {
  id: "violao-aco",
  family: "violao-aco",
  name: { pt: "Violão de Aço", en: "Steel-string guitar" },
  strings: "aco",

  models: [
    {
      id: "om",
      name: "Bocatto OM",
      scale: "645 mm",
      shape: "om",
      description: {
        pt: "Corpo Orchestra Model, equilibrado e articulado — favorito do dedilhado.",
        en: "Orchestra Model body, balanced and articulate — a fingerstyle favorite.",
      },
      characteristics: [
        { pt: "Escala 645 mm", en: "645 mm scale" },
        { pt: "Médio porte, muito confortável", en: "Mid-size, very comfortable" },
        { pt: "Resposta equilibrada e definida", en: "Balanced, defined response" },
      ],
    },
    {
      id: "dreadnought",
      name: "Bocatto Dreadnought",
      scale: "645 mm",
      shape: "dreadnought",
      description: {
        pt: "Corpo amplo de graves profundos e grande projeção — ideal para palhetada.",
        en: "Big body with deep lows and strong projection — ideal for strumming.",
      },
      characteristics: [
        { pt: "Escala 645 mm", en: "645 mm scale" },
        { pt: "Graves potentes e volume", en: "Powerful lows and volume" },
        { pt: "Clássico do violão de aço", en: "The steel-string classic" },
      ],
    },
    {
      id: "jumbo",
      name: "Bocatto Jumbo",
      scale: "645 mm",
      shape: "jumbo",
      description: {
        pt: "O maior dos corpos, som cheio e ressonante com presença máxima.",
        en: "The largest body, full resonant sound with maximum presence.",
      },
      characteristics: [
        { pt: "Escala 645 mm", en: "645 mm scale" },
        { pt: "Volume e sustain generosos", en: "Generous volume and sustain" },
        { pt: "Presença marcante no palco", en: "Striking stage presence" },
      ],
    },
    {
      id: "j45",
      name: "Bocatto J45",
      scale: "645 mm",
      shape: "jumbo",
      description: {
        pt: "Ombros arredondados, timbre quente e equilibrado — voz de cantor e compositor.",
        en: "Round shoulders, warm balanced tone — the singer-songwriter voice.",
      },
      characteristics: [
        { pt: "Escala 645 mm", en: "645 mm scale" },
        { pt: "Médios quentes e encorpados", en: "Warm, full mids" },
        { pt: "Ótimo para voz e violão", en: "Great for voice and guitar" },
      ],
    },
    {
      id: "015",
      name: "Bocatto 015",
      scale: "628 mm",
      shape: "parlor",
      description: {
        pt: "Corpo menor de escala curta, timbre íntimo e focado, muito confortável.",
        en: "Smaller short-scale body, intimate focused tone, very comfortable.",
      },
      characteristics: [
        { pt: "Escala 628 mm (curta)", en: "628 mm (short) scale" },
        { pt: "Resposta imediata e doce", en: "Immediate, sweet response" },
        { pt: "Conforto para tocar por horas", en: "Comfortable for hours of play" },
      ],
    },
    {
      id: "mini",
      name: "Bocatto Mini",
      scale: "577 mm",
      shape: "parlor",
      description: {
        pt: "Compacto de escala curta, leve e fácil de tocar — perfeito para viagem.",
        en: "Compact short-scale, light and easy to play — perfect for travel.",
      },
      characteristics: [
        { pt: "Escala 577 mm (curta)", en: "577 mm (short) scale" },
        { pt: "Leve e portátil", en: "Light and portable" },
        { pt: "Tocabilidade fácil", en: "Easy playability" },
      ],
    },
  ],

  steps: [
    /* ─────────────────────────── Madeiras ─────────────────────────── */
    {
      id: "madeiras",
      title: { pt: "Madeiras", en: "Woods" },
      intro: {
        pt: "A alma do som. Cada madeira dá uma voz ao instrumento.",
        en: "The soul of the sound. Each wood gives the instrument a voice.",
      },
      fields: [
        {
          kind: "choice",
          id: "fundoLateral",
          label: { pt: "Fundo e laterais", en: "Back & sides" },
          required: true,
          allowOther: true,
          options: [
            { id: "jacaranda", label: { pt: "Jacarandá", en: "Rosewood (Jacarandá)" }, swatch: "#42291a" },
            { id: "mogno", label: { pt: "Mogno", en: "Mahogany" }, swatch: "#7c4a26" },
            { id: "maple", label: { pt: "Maple", en: "Maple" }, swatch: "#d9c49a" },
            { id: "imbuia", label: { pt: "Imbuia", en: "Imbuia" }, swatch: "#5b3d22" },
          ],
        },
        {
          kind: "choice",
          id: "tampo",
          label: { pt: "Tampo", en: "Top" },
          required: true,
          allowOther: true,
          options: [
            { id: "abeto-alemao", label: { pt: "Abeto alemão", en: "German spruce" }, swatch: "#e3cb9d" },
            { id: "mogno", label: { pt: "Mogno", en: "Mahogany" }, swatch: "#7c4a26" },
            { id: "sitka", label: { pt: "Sitka Spruce", en: "Sitka spruce" }, swatch: "#d9b98a" },
            { id: "red-cedar", label: { pt: "Red Cedar", en: "Red cedar" }, swatch: "#b5793c" },
          ],
        },
        {
          kind: "choice",
          id: "braco",
          label: { pt: "Braço", en: "Neck" },
          allowOther: true,
          options: [
            { id: "mogno", label: { pt: "Mogno", en: "Mahogany" }, swatch: "#7c4a26" },
            { id: "cedro", label: { pt: "Cedro", en: "Cedar" }, swatch: "#b5793c" },
            { id: "maple", label: { pt: "Maple", en: "Maple" }, swatch: "#d9c49a" },
            { id: "marupa", label: { pt: "Marupá", en: "Marupá" }, swatch: "#d8c9a0" },
          ],
        },
        {
          kind: "choice",
          id: "escala",
          label: { pt: "Escala", en: "Fretboard" },
          allowOther: true,
          options: [
            { id: "jacaranda", label: { pt: "Jacarandá", en: "Rosewood (Jacarandá)" }, swatch: "#42291a" },
            { id: "ebano", label: { pt: "Ébano", en: "Ebony" }, swatch: "#1d160f" },
            { id: "maple", label: { pt: "Maple", en: "Maple" }, swatch: "#d9c49a" },
            { id: "pau-ferro", label: { pt: "Pau-ferro", en: "Pau ferro" }, swatch: "#5e3a24" },
            { id: "black-purple", label: { pt: "Black Purple", en: "Black Purple" }, swatch: "#4a2b39" },
          ],
        },
        {
          kind: "choice",
          id: "cavalete",
          label: { pt: "Cavalete", en: "Bridge" },
          allowOther: true,
          options: [
            { id: "jacaranda", label: { pt: "Jacarandá", en: "Rosewood (Jacarandá)" }, swatch: "#42291a" },
            { id: "ebano", label: { pt: "Ébano", en: "Ebony" }, swatch: "#1d160f" },
            { id: "black-purple", label: { pt: "Black Purple", en: "Black Purple" }, swatch: "#4a2b39" },
            { id: "pau-ferro", label: { pt: "Pau-ferro", en: "Pau ferro" }, swatch: "#5e3a24" },
          ],
        },
      ],
    },

    /* ────────────────────────── Construção ────────────────────────── */
    {
      id: "construcao",
      title: { pt: "Construção", en: "Construction" },
      intro: {
        pt: "As escolhas estruturais — o que sustenta o som e o toque.",
        en: "The structural choices — what supports the sound and the feel.",
      },
      fields: [
        {
          kind: "choice",
          id: "tensor",
          label: { pt: "Tensor", en: "Truss rod" },
          allowOther: true,
          options: [
            { id: "dupla-acao", label: { pt: "Dupla ação", en: "Dual action" } },
            { id: "acao-simples", label: { pt: "Ação simples", en: "Single action" } },
            { id: "vintage", label: { pt: "Vintage", en: "Vintage" } },
            { id: "sem-tensor", label: { pt: "Sem tensor", en: "No truss rod" } },
          ],
        },
        {
          kind: "choice",
          id: "nutRastilho",
          label: { pt: "Nut e rastilho", en: "Nut & saddle" },
          allowOther: true,
          options: [
            { id: "nature-bone", label: { pt: "Nature Bone (osso)", en: "Nature Bone (bone)" } },
            { id: "grafitech", label: { pt: "Graphtech", en: "Graphtech" } },
            { id: "sintetico", label: { pt: "Sintético (plástico)", en: "Synthetic (plastic)" } },
          ],
        },
        {
          kind: "choice",
          id: "trastes",
          label: { pt: "Trastes", en: "Frets" },
          allowOther: true,
          options: [
            { id: "sanko-gotoh-liga", label: { pt: "Sanko Gotoh — Liga", en: "Sanko Gotoh — Alloy" } },
            { id: "jescar-inox", label: { pt: "Jescar — Inox", en: "Jescar — Stainless" } },
            { id: "dhp-liga", label: { pt: "DHP — Liga", en: "DHP — Alloy" } },
            { id: "dhp-inox", label: { pt: "DHP — Inox", en: "DHP — Stainless" } },
          ],
        },
        {
          kind: "choice",
          id: "trastesTamanho",
          label: { pt: "Tamanho dos trastes", en: "Fret size" },
          allowOther: true,
          options: [
            { id: "medio", label: { pt: "Médio", en: "Medium" } },
            { id: "medio-jumbo", label: { pt: "Médio Jumbo", en: "Medium Jumbo" } },
            { id: "jumbo", label: { pt: "Jumbo", en: "Jumbo" } },
          ],
        },
        {
          kind: "choice",
          id: "tarraxas",
          label: { pt: "Tarraxas", en: "Tuners" },
          allowOther: true,
          options: [
            { id: "gotoh", label: { pt: "Gotoh", en: "Gotoh" } },
            { id: "guyker", label: { pt: "Guyker", en: "Guyker" } },
            { id: "grover", label: { pt: "Grover", en: "Grover" } },
          ],
        },
        {
          kind: "choice",
          id: "tarraxasAcabamento",
          label: { pt: "Acabamento das tarraxas", en: "Tuner finish" },
          allowOther: true,
          options: [
            { id: "cromo", label: { pt: "Cromo", en: "Chrome" }, swatch: "#c0c0c0" },
            { id: "black", label: { pt: "Black", en: "Black" }, swatch: "#222222" },
            { id: "gold", label: { pt: "Gold", en: "Gold" }, swatch: "#c9a227" },
            { id: "cosmo-black", label: { pt: "Cosmo Black", en: "Cosmo Black" }, swatch: "#3a3a3a" },
          ],
        },
        {
          kind: "choice",
          id: "captacao",
          label: { pt: "Captação", en: "Pickup" },
          allowOther: true,
          options: [
            {
              id: "fornecida-cliente",
              label: {
                pt: "Fornecida pelo cliente (instalação inclusa)",
                en: "Provided by the customer (installation included)",
              },
            },
            { id: "sem-captacao", label: { pt: "Sem captação", en: "No pickup" } },
          ],
        },
      ],
    },

    /* ──────────────────────── Personalização ──────────────────────── */
    {
      id: "personalizacao",
      title: { pt: "Personalização", en: "Personalization" },
      intro: {
        pt: "Os detalhes que tornam o instrumento inconfundivelmente seu.",
        en: "The details that make the instrument unmistakably yours.",
      },
      fields: [
        {
          kind: "choice",
          id: "headstock",
          label: { pt: "Headstock", en: "Headstock" },
          allowOther: true,
          options: [
            { id: "modelo-1", label: { pt: "Modelo I", en: "Model I" } },
            { id: "modelo-2", label: { pt: "Modelo II", en: "Model II" } },
            { id: "modelo-3", label: { pt: "Modelo III", en: "Model III" } },
            { id: "modelo-4", label: { pt: "Modelo IV", en: "Model IV" } },
            { id: "modelo-5", label: { pt: "Modelo V", en: "Model V" } },
          ],
        },
        {
          kind: "choice",
          id: "cutaway",
          label: { pt: "Cutaway", en: "Cutaway" },
          allowOther: true,
          options: [
            { id: "veneziano", label: { pt: "Veneziano (arredondado)", en: "Venetian (rounded)" } },
            { id: "florentino", label: { pt: "Florentino (agudo)", en: "Florentine (pointed)" } },
            { id: "sem-cutaway", label: { pt: "Sem cutaway", en: "No cutaway" } },
          ],
        },
        {
          kind: "choice",
          id: "escudo",
          label: { pt: "Escudo", en: "Pickguard" },
          allowOther: true,
          options: [
            { id: "gota-tortoise", label: { pt: "Gota Tortoise", en: "Teardrop Tortoise" }, swatch: "#6b3a1e" },
            { id: "gota-preto", label: { pt: "Gota Preto", en: "Teardrop Black" }, swatch: "#191510" },
            { id: "gota-madeira", label: { pt: "Gota em madeira", en: "Teardrop wood" }, swatch: "#5b3d22" },
            { id: "hummingbird-preto", label: { pt: "Hummingbird Preto", en: "Hummingbird Black" }, swatch: "#191510" },
            { id: "hummingbird-madeira", label: { pt: "Hummingbird em madeira", en: "Hummingbird wood" }, swatch: "#5b3d22" },
            { id: "sem-escudo", label: { pt: "Sem escudo", en: "No pickguard" } },
          ],
        },
        {
          kind: "choice",
          id: "roseta",
          label: { pt: "Roseta", en: "Rosette" },
          allowOther: true,
          options: [
            { id: "jacaranda-exclusiva", label: { pt: "Jacarandá exclusiva", en: "Exclusive rosewood" } },
            { id: "abalone", label: { pt: "Abalone", en: "Abalone" } },
            { id: "madre-perola", label: { pt: "Madrepérola", en: "Mother-of-pearl" } },
          ],
        },
        {
          kind: "choice",
          id: "marcacao",
          label: { pt: "Marcação da escala", en: "Fretboard markers" },
          allowOther: true,
          options: [
            { id: "dots-6mm", label: { pt: "Dots 6 mm", en: "6 mm dots" } },
            { id: "cruz-losango", label: { pt: "Cruz e Losango (padrão Martin)", en: "Cross & Diamond (Martin style)" } },
            { id: "floral", label: { pt: "Floral", en: "Floral" } },
          ],
        },
        {
          kind: "choice",
          id: "armRest",
          label: { pt: "Arm Rest", en: "Arm rest" },
          allowOther: true,
          options: [
            { id: "arm-rest-madeira", label: { pt: "Arm Rest em madeira", en: "Wood arm rest" } },
            { id: "sem-arm-rest", label: { pt: "Sem Arm Rest", en: "No arm rest" } },
          ],
        },
      ],
    },
  ],
};

/** Registry of instrument families. Add nylon/guitarra/baixo/viola here later. */
export const instruments = { "violao-aco": violaoAco } as const;

/** Default family used by the creation flow while only steel guitars exist. */
export const defaultInstrument = violaoAco;

// Backwards-compatible alias (older imports).
export const violao = violaoAco;
