# NLA Consultoria — Landing Page (Licitações)

Projeto Next.js (App Router) com TypeScript, Tailwind e componentes shadcn/ui mínimos para uma landing page focada em conversão (agendamento).

## Rodando localmente

- Requisitos: Node 18+
- Instalar deps: `npm i`
- Dev: `npm run dev`
- Build: `npm run build` e `npm start`

## Variáveis de ambiente

Copie `.env.example` para `.env.local` e preencha conforme necessário:

- `NEXT_PUBLIC_N8N_WEBHOOK_URL` — destino do POST do formulário
- `NEXT_PUBLIC_AGENDA_URL` — URL de agendamento (Calendly/Cal.com)
- `NEXT_PUBLIC_WHATSAPP_URL` — fallback para WhatsApp
- `NEXT_PUBLIC_GTM_ID` — Google Tag Manager (opcional)
- `NEXT_PUBLIC_POSTHOG_KEY` — alternativa ao GTM (opcional)
- `NEXT_PUBLIC_SITE_URL` — URL pública do site para canônico/OG

## Estrutura de conteúdo

- `content/home.ts`: todos os textos da página. Comentários indicam os blocos de copy. Altere livremente.

## Acessibilidade e UX

- Componentes navegáveis por teclado e com foco visível.
- Contraste AA nos temas claro/escuro.
- Todos os CTAs abrem o mesmo modal de formulário.

## Formulário (modal)

- Campos: Nome, Telefone (WhatsApp), E-mail, Empresa, Cidade/UF, Fatura mensal (faixa), Já vendeu para governo? (sim/não), Maior dor.
- Validação básica com `zod`.
- Envio: `POST` para `NEXT_PUBLIC_N8N_WEBHOOK_URL` (JSON). Após sucesso, redireciona para `NEXT_PUBLIC_AGENDA_URL` ou abre `NEXT_PUBLIC_WHATSAPP_URL` em nova aba.
- Aviso LGPD exibido sob o botão.

## SEO e Analytics

- Metadados base em `app/layout.tsx` e JSON-LD (`Organization` no layout e `FAQPage` na home).
- GTM ou PostHog injetados via env.
- Banner de cookies simples para consentimento.

## Personalização visual

- Tailwind configurado em `tailwind.config.ts`.
- Temas: `dark` via classe na tag `html` (toggle no header).

## Observações

- Não há seção de planos/preços.
- Performance/SEO/Acessibilidade otimizadas para Lighthouse 90+ (dependente de deploy e assets).

