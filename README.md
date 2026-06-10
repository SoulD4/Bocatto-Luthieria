# Bocatto Luthieria

Site premium da Bocatto Luthieria: páginas institucionais + configurador de violão sob medida com visualização 3D, geração de PDF, envio por e-mail e WhatsApp. Bilíngue (PT/EN), mobile-first, tema escuro com dourado.

## Rodando localmente

```bash
npm install
npm run dev        # http://localhost:3000
```

Sem nenhuma variável de ambiente o site funciona 100% em modo protótipo:
- uploads e PDFs vão para `public/uploads/` (ignorado no git);
- e-mails são apenas logados no console;
- a verificação anti-bot (Turnstile) é pulada.

## Variáveis de ambiente (produção)

Copie `.env.example` para `.env.local` e preencha:

| Variável | Função |
|---|---|
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp do luthier (só dígitos, ex. `5511999999999`) |
| `NEXT_PUBLIC_CONTACT_EMAIL` | E-mail exibido no site |
| `LUTHIER_EMAIL` | E-mail que recebe os pedidos |
| `RESEND_API_KEY` / `EMAIL_FROM` | Envio de e-mails (Resend, domínio verificado) |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob (PDFs e fotos de referência) |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile (anti-bot) |

Deploy recomendado: **Vercel** (Blob e domínio integrados).

## Arquitetura

- `src/data/instruments/violao.ts` — definição data-driven do configurador (etapas → campos → opções, rótulos PT/EN). **Para adicionar guitarra/baixo:** crie um arquivo irmão e registre em `instruments`; wizard, revisão, 3D e PDF são genéricos.
- `src/components/configurator/` — wizard, campo "Outro" (texto + fotos), revisão, visualizador 3D (`GuitarViewer`, procedural com react-three-fiber).
- `src/lib/` — `pdf.tsx` (documento da marca), `email.ts` (Resend com fallback de log), `whatsapp.ts` (link wa.me), `antispam.ts` (rate limit + Turnstile + honeypot), `summary.ts` (resumo único usado em revisão/PDF/WhatsApp), `storage.ts` (Blob ou disco local).
- `src/app/api/` — `pedido` (valida, gera PDF, envia e-mails, retorna links), `upload`, `contato`.
- `src/messages/{pt,en}.json` — textos da interface (next-intl).

## Fluxo do pedido

Configurador (8 etapas) → revisão com 3D → dados do cliente → `POST /api/pedido` → PDF gerado e armazenado → e-mail ao luthier + cópia ao cliente → tela de sucesso com botão WhatsApp (mensagem pronta + link do PDF).

## Anti-spam

Rate limit por IP (3 pedidos/h, 15 uploads/h, 5 contatos/h), honeypot, Cloudflare Turnstile, validação Zod + semântica no servidor (IDs de opção reais, "Outro" com texto obrigatório), sniffing de magic bytes nos uploads (JPG/PNG/WebP, máx. 8 MB).
