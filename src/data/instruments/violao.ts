import type { InstrumentDefinition } from "./types";

/**
 * Acoustic guitar (violão) configurator definition. The whole wizard, review
 * screen, 3D viewer and PDF are driven by this data — adding electric guitar
 * or bass later means creating a sibling file, not new screens.
 */
export const violao: InstrumentDefinition = {
  id: "violao",
  name: { pt: "Violão", en: "Acoustic guitar" },
  steps: [
    {
      id: "cordas",
      title: { pt: "Cordas", en: "Strings" },
      intro: {
        pt: "A escolha entre nylon e aço define a construção do instrumento: tensão, braço e estética.",
        en: "Choosing nylon or steel defines the build: tension, neck and aesthetics.",
      },
      fields: [
        {
          kind: "choice",
          id: "tipoCordas",
          label: { pt: "Tipo de cordas", en: "String type" },
          required: true,
          allowOther: false,
          options: [
            {
              id: "nylon",
              label: { pt: "Nylon (clássico)", en: "Nylon (classical)" },
              description: {
                pt: "Som quente e aveludado, tradição do violão clássico e da música brasileira.",
                en: "Warm, velvety voice — the tradition of classical and Brazilian guitar.",
              },
            },
            {
              id: "aco",
              label: { pt: "Aço (folk)", en: "Steel (folk)" },
              description: {
                pt: "Brilho e projeção para dedilhado, palhetada e música popular.",
                en: "Sparkle and projection for fingerstyle, strumming and popular music.",
              },
            },
          ],
        },
      ],
    },
    {
      id: "corpo",
      title: { pt: "Corpo", en: "Body" },
      intro: {
        pt: "O formato do corpo molda o volume, o conforto e a personalidade do som.",
        en: "The body shape molds volume, comfort and the personality of the sound.",
      },
      fields: [
        {
          kind: "choice",
          id: "formato",
          label: { pt: "Formato do corpo", en: "Body shape" },
          required: true,
          options: [
            {
              id: "classico",
              label: { pt: "Clássico", en: "Classical" },
              description: {
                pt: "Proporções tradicionais de concerto.",
                en: "Traditional concert proportions.",
              },
            },
            {
              id: "auditorio",
              label: { pt: "Auditório", en: "Grand Auditorium" },
              description: {
                pt: "Versátil, equilibrado em graves e agudos.",
                en: "Versatile, balanced lows and highs.",
              },
            },
            {
              id: "dreadnought",
              label: { pt: "Dreadnought", en: "Dreadnought" },
              description: {
                pt: "Corpo amplo, graves profundos e volume.",
                en: "Big body, deep lows and volume.",
              },
            },
            {
              id: "jumbo",
              label: { pt: "Jumbo", en: "Jumbo" },
              description: {
                pt: "O maior dos corpos, presença máxima.",
                en: "The largest body, maximum presence.",
              },
            },
            {
              id: "om",
              label: { pt: "OM / Folk", en: "OM / Folk" },
              description: {
                pt: "Compacto e confortável, voz articulada.",
                en: "Compact and comfortable, articulate voice.",
              },
            },
            {
              id: "parlor",
              label: { pt: "Parlor", en: "Parlor" },
              description: {
                pt: "Pequeno e charmoso, timbre vintage.",
                en: "Small and charming, vintage tone.",
              },
            },
          ],
        },
        {
          kind: "choice",
          id: "cutaway",
          label: { pt: "Cutaway", en: "Cutaway" },
          options: [
            {
              id: "sem",
              label: { pt: "Sem cutaway", en: "No cutaway" },
            },
            {
              id: "venetian",
              label: { pt: "Venetian (arredondado)", en: "Venetian (rounded)" },
            },
            {
              id: "florentine",
              label: { pt: "Florentine (pontudo)", en: "Florentine (pointed)" },
            },
          ],
        },
      ],
    },
    {
      id: "madeiras",
      title: { pt: "Madeiras", en: "Tonewoods" },
      intro: {
        pt: "Cada madeira tem uma voz. A combinação de tampo, laterais e fundo define o caráter do instrumento.",
        en: "Every wood has a voice. The combination of top, back and sides defines the instrument's character.",
      },
      fields: [
        {
          kind: "choice",
          id: "tampo",
          label: { pt: "Madeira do tampo", en: "Top wood" },
          required: true,
          options: [
            {
              id: "sitka",
              label: { pt: "Spruce Sitka", en: "Sitka spruce" },
              description: {
                pt: "Versátil, responde do dedilhado leve à palhetada forte.",
                en: "Versatile, from light fingerstyle to hard strumming.",
              },
              swatch: "#d9b98a",
            },
            {
              id: "spruce-alemao",
              label: { pt: "Spruce alemão", en: "German spruce" },
              description: {
                pt: "Refinado, projeção cristalina de concerto.",
                en: "Refined, crystalline concert projection.",
              },
              swatch: "#e3cb9d",
            },
            {
              id: "cedro",
              label: { pt: "Cedro", en: "Cedar" },
              description: {
                pt: "Quente e imediato, favorito do repertório clássico.",
                en: "Warm and immediate, a classical favorite.",
              },
              swatch: "#b5793c",
            },
            {
              id: "mogno",
              label: { pt: "Mogno", en: "Mahogany" },
              description: {
                pt: "Som seco e focado no médio, estética escura.",
                en: "Dry, mid-focused voice with a dark look.",
              },
              swatch: "#7c4a26",
            },
          ],
        },
        {
          kind: "choice",
          id: "lateraisFundo",
          label: { pt: "Laterais e fundo", en: "Back & sides" },
          required: true,
          options: [
            {
              id: "jacaranda",
              label: { pt: "Jacarandá", en: "Rosewood" },
              description: {
                pt: "Graves profundos e agudos brilhantes, o clássico absoluto.",
                en: "Deep lows and sparkling highs — the absolute classic.",
              },
              swatch: "#42291a",
            },
            {
              id: "mogno",
              label: { pt: "Mogno", en: "Mahogany" },
              description: {
                pt: "Médios presentes, voz direta e quente.",
                en: "Present mids, a direct, warm voice.",
              },
              swatch: "#7c4a26",
            },
            {
              id: "imbuia",
              label: { pt: "Imbuia", en: "Imbuia (Brazilian walnut)" },
              description: {
                pt: "Madeira brasileira de veios ricos e som equilibrado.",
                en: "Brazilian wood with rich grain and balanced tone.",
              },
              swatch: "#5b3d22",
            },
            {
              id: "maple",
              label: { pt: "Maple", en: "Maple" },
              description: {
                pt: "Claro e articulado, visual flameado marcante.",
                en: "Clear and articulate, striking flamed looks.",
              },
              swatch: "#d9c49a",
            },
            {
              id: "pau-ferro",
              label: { pt: "Pau-ferro", en: "Pau ferro" },
              description: {
                pt: "Parente do jacarandá, denso e brilhante.",
                en: "Rosewood's relative — dense and bright.",
              },
              swatch: "#5e3a24",
            },
          ],
        },
        {
          kind: "choice",
          id: "bracoMadeira",
          label: { pt: "Madeira do braço", en: "Neck wood" },
          options: [
            { id: "mogno", label: { pt: "Mogno", en: "Mahogany" }, swatch: "#7c4a26" },
            { id: "cedro", label: { pt: "Cedro", en: "Cedar" }, swatch: "#b5793c" },
            { id: "maple", label: { pt: "Maple", en: "Maple" }, swatch: "#d9c49a" },
          ],
        },
        {
          kind: "choice",
          id: "escalaMadeira",
          label: { pt: "Madeira da escala", en: "Fretboard wood" },
          options: [
            { id: "ebano", label: { pt: "Ébano", en: "Ebony" }, swatch: "#1d160f" },
            { id: "jacaranda", label: { pt: "Jacarandá", en: "Rosewood" }, swatch: "#42291a" },
            { id: "pau-ferro", label: { pt: "Pau-ferro", en: "Pau ferro" }, swatch: "#5e3a24" },
          ],
        },
      ],
    },
    {
      id: "braco",
      title: { pt: "Braço & escala", en: "Neck & scale" },
      intro: {
        pt: "Medidas que moldam o conforto da mão esquerda — ajustadas ao seu jeito de tocar.",
        en: "Measurements that shape left-hand comfort — tailored to the way you play.",
      },
      fields: [
        {
          kind: "choice",
          id: "perfilBraco",
          label: { pt: "Perfil do braço", en: "Neck profile" },
          options: [
            {
              id: "c",
              label: { pt: "C (padrão)", en: "C (standard)" },
              description: { pt: "Confortável e universal.", en: "Comfortable and universal." },
            },
            {
              id: "d",
              label: { pt: "D (mais cheio)", en: "D (fuller)" },
              description: { pt: "Mais madeira na palma.", en: "More wood in the palm." },
            },
            {
              id: "v",
              label: { pt: "V (vintage)", en: "V (vintage)" },
              description: { pt: "Pegada tradicional.", en: "Traditional grip." },
            },
          ],
        },
        {
          kind: "choice",
          id: "escalaComprimento",
          label: { pt: "Comprimento de escala", en: "Scale length" },
          options: [
            { id: "650", label: { pt: "650 mm (clássico padrão)", en: "650 mm (classical standard)" } },
            { id: "640", label: { pt: "632–640 mm (curta)", en: "632–640 mm (short)" } },
            { id: "255", label: { pt: "25,5\" / 648 mm (aço padrão)", en: "25.5\" / 648 mm (steel standard)" } },
            { id: "2475", label: { pt: "24,75\" / 629 mm", en: "24.75\" / 629 mm" } },
          ],
        },
        {
          kind: "choice",
          id: "pestana",
          label: { pt: "Largura da pestana", en: "Nut width" },
          options: [
            { id: "52", label: { pt: "52 mm (clássico)", en: "52 mm (classical)" } },
            { id: "48", label: { pt: "48 mm", en: "48 mm" } },
            { id: "45", label: { pt: "44–45 mm (folk)", en: "44–45 mm (folk)" } },
            { id: "43", label: { pt: "42–43 mm", en: "42–43 mm" } },
          ],
        },
      ],
    },
    {
      id: "headstock",
      title: { pt: "Headstock & tarraxas", en: "Headstock & tuners" },
      intro: {
        pt: "A assinatura visual do instrumento, vista de perto por quem toca.",
        en: "The instrument's visual signature, seen up close by the player.",
      },
      fields: [
        {
          kind: "choice",
          id: "headstockFormato",
          label: { pt: "Formato do headstock", en: "Headstock shape" },
          required: true,
          options: [
            {
              id: "slotted",
              label: { pt: "Clássico vazado (slotted)", en: "Slotted (classical)" },
              description: { pt: "Tradição dos violões de concerto.", en: "Concert guitar tradition." },
            },
            {
              id: "solido-tradicional",
              label: { pt: "Sólido tradicional", en: "Solid traditional" },
            },
            {
              id: "solido-moderno",
              label: { pt: "Sólido moderno", en: "Solid modern" },
            },
            {
              id: "bocatto",
              label: { pt: "Desenho da casa Bocatto", en: "Bocatto house design" },
              description: {
                pt: "O traço exclusivo da Oficina Bocatto.",
                en: "The workshop's exclusive design.",
              },
            },
          ],
        },
        {
          kind: "choice",
          id: "tarraxas",
          label: { pt: "Tarraxas", en: "Tuners" },
          options: [
            { id: "douradas", label: { pt: "Douradas", en: "Gold" }, swatch: "#c9a227" },
            { id: "cromadas", label: { pt: "Cromadas", en: "Chrome" }, swatch: "#c0c0c0" },
            { id: "pretas", label: { pt: "Pretas", en: "Black" }, swatch: "#222222" },
            { id: "vintage", label: { pt: "Vintage abertas", en: "Open-gear vintage" }, swatch: "#b08d57" },
          ],
        },
      ],
    },
    {
      id: "inlays",
      title: { pt: "Marcadores & inlays", en: "Markers & inlays" },
      intro: {
        pt: "Detalhes em madrepérola e madeira que tornam a escala única.",
        en: "Mother-of-pearl and wood details that make the fretboard unique.",
      },
      fields: [
        {
          kind: "choice",
          id: "marcadores",
          label: { pt: "Marcadores da escala", en: "Fretboard markers" },
          options: [
            { id: "sem", label: { pt: "Sem marcadores (limpo)", en: "No markers (clean)" } },
            { id: "pontos", label: { pt: "Pontos (dots)", en: "Dots" } },
            { id: "blocos", label: { pt: "Blocos", en: "Blocks" } },
            { id: "diamantes", label: { pt: "Diamantes", en: "Diamonds" } },
            {
              id: "madreperola",
              label: { pt: "Madrepérola personalizada", en: "Custom mother-of-pearl" },
            },
          ],
        },
        {
          kind: "choice",
          id: "marcadoresLaterais",
          label: { pt: "Marcadores laterais (lado do braço)", en: "Side dots" },
          allowOther: false,
          options: [
            { id: "sim", label: { pt: "Sim", en: "Yes" } },
            { id: "nao", label: { pt: "Não", en: "No" } },
          ],
        },
        {
          kind: "text",
          id: "inlayPersonalizado",
          label: {
            pt: "Inlay personalizado (nome, símbolo, casa 12…)",
            en: "Custom inlay (name, symbol, 12th fret…)",
          },
        },
      ],
    },
    {
      id: "acabamento",
      title: { pt: "Acabamento & estética", en: "Finish & aesthetics" },
      intro: {
        pt: "Cor, brilho e ornamentos — o vestido de gala do instrumento.",
        en: "Color, sheen and ornaments — the instrument's evening attire.",
      },
      fields: [
        {
          kind: "choice",
          id: "tonalidade",
          label: { pt: "Tonalidade", en: "Color tone" },
          options: [
            { id: "natural", label: { pt: "Natural", en: "Natural" }, swatch: "#c89f68" },
            { id: "sunburst", label: { pt: "Sunburst", en: "Sunburst" }, swatch: "#8a4a1d" },
            { id: "tabaco", label: { pt: "Tabaco / escuro", en: "Tobacco / dark" }, swatch: "#4a2e16" },
            { id: "preto", label: { pt: "Preto", en: "Black" }, swatch: "#15110c" },
          ],
        },
        {
          kind: "choice",
          id: "verniz",
          label: { pt: "Verniz", en: "Finish" },
          options: [
            { id: "brilhante", label: { pt: "Brilhante", en: "Gloss" } },
            { id: "fosco", label: { pt: "Acetinado / fosco", en: "Satin / matte" } },
            {
              id: "goma-laca",
              label: { pt: "Goma-laca (tradicional)", en: "Shellac / French polish" },
            },
          ],
        },
        {
          kind: "choice",
          id: "roseta",
          label: { pt: "Roseta", en: "Rosette" },
          options: [
            { id: "mosaico", label: { pt: "Tradicional em mosaico", en: "Traditional mosaic" } },
            { id: "aneis", label: { pt: "Anéis simples", en: "Simple rings" } },
            { id: "madreperola", label: { pt: "Madrepérola", en: "Mother-of-pearl" } },
            { id: "personalizada", label: { pt: "Desenho personalizado", en: "Custom design" } },
          ],
        },
        {
          kind: "choice",
          id: "binding",
          label: { pt: "Binding (filetes)", en: "Binding (purfling)" },
          options: [
            { id: "claro", label: { pt: "Madeira clara", en: "Light wood" }, swatch: "#d9c49a" },
            { id: "escuro", label: { pt: "Madeira escura", en: "Dark wood" }, swatch: "#3a2614" },
            { id: "madreperola", label: { pt: "Madrepérola", en: "Mother-of-pearl" }, swatch: "#e8e3da" },
            { id: "sem", label: { pt: "Sem binding", en: "No binding" } },
          ],
        },
        {
          kind: "choice",
          id: "pickguard",
          label: { pt: "Escudo (pickguard)", en: "Pickguard" },
          visibleWhen: { fieldId: "tipoCordas", equals: "aco" },
          options: [
            { id: "sem", label: { pt: "Sem escudo", en: "None" } },
            { id: "tortoise", label: { pt: "Tortoise", en: "Tortoise" }, swatch: "#6b3a1e" },
            { id: "preto", label: { pt: "Preto", en: "Black" }, swatch: "#191510" },
            { id: "transparente", label: { pt: "Transparente", en: "Clear" } },
          ],
        },
      ],
    },
    {
      id: "extras",
      title: { pt: "Eletrônica & extras", en: "Electronics & extras" },
      intro: {
        pt: "Os últimos detalhes para o instrumento chegar pronto para a sua música.",
        en: "The final details so the instrument arrives ready for your music.",
      },
      fields: [
        {
          kind: "choice",
          id: "captacao",
          label: { pt: "Captação", en: "Pickup system" },
          options: [
            { id: "sem", label: { pt: "Sem captação", en: "No pickup" } },
            {
              id: "ativa",
              label: { pt: "Ativa com pré-amp e afinador", en: "Active with preamp & tuner" },
            },
            {
              id: "discreta",
              label: {
                pt: "Discreta (sob o rastilho, sem furos)",
                en: "Discreet (under-saddle, no holes)",
              },
            },
          ],
        },
        {
          kind: "choice",
          id: "mao",
          label: { pt: "Mão", en: "Handedness" },
          allowOther: false,
          options: [
            { id: "destro", label: { pt: "Destro", en: "Right-handed" } },
            { id: "canhoto", label: { pt: "Canhoto", en: "Left-handed" } },
          ],
        },
        {
          kind: "choice",
          id: "case",
          label: { pt: "Case", en: "Case" },
          options: [
            { id: "sem", label: { pt: "Sem case", en: "No case" } },
            { id: "hard", label: { pt: "Hard case", en: "Hard case" } },
            { id: "soft", label: { pt: "Soft case (bag)", en: "Soft case (gig bag)" } },
          ],
        },
        {
          kind: "text",
          id: "gravacao",
          label: {
            pt: "Gravação personalizada (nome, dedicatória…)",
            en: "Custom engraving (name, dedication…)",
          },
        },
      ],
    },
  ],
};

export const instruments = { violao } as const;
