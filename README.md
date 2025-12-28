# NLA Consultoria — Landing Page (Licitações)

Projeto Next.js (App Router) com TypeScript, Tailwind e componentes shadcn/ui mínimos para uma landing page focada em conversão (agendamento).

## Rodando localmente

- Requisitos: Node 18+
- Instalar deps: `npm i`
- Dev: `npm run dev`
- Build: `npm run build` e `npm start`

## Deploy Automático (DEV)

Script que automatiza todo o fluxo de deploy no ambiente de desenvolvimento:

```bash
# Deploy completo (commit, push, aguarda build, trigger Easypanel, verifica site)
npm run deploy:dev

# Com mensagem de commit customizada
npm run deploy:dev "feat: nova funcionalidade"

# Com flags opcionais
npm run deploy:dev -- --fast        # aguarda 2min em vez de 3min
npm run deploy:dev -- --skip-build  # pula aguardar build
npm run deploy:dev -- --no-verify   # não faz health check
```

**O que o script faz:**
1. Verifica se está na branch `dev`
2. Commit e push (se houver mudanças)
3. Aguarda GitHub Actions buildar imagem Docker (~3min)
4. Trigger deploy no Easypanel via webhook
5. Aguarda container reiniciar (~1min)
6. Verifica se site está online
7. Mostra resumo com URLs e próximos passos

Ver documentação completa em: `docs/project/DEPLOY-AUTOMATION.md`

## Variáveis de ambiente

Copie `.env.example` para `.env.local` e preencha conforme necessário:

- `NEXT_PUBLIC_N8N_WEBHOOK_URL` — destino do POST do formulário
- `NEXT_PUBLIC_AGENDA_URL` — URL de agendamento (Calendly/Cal.com)
- `NEXT_PUBLIC_WHATSAPP_URL` — fallback para WhatsApp
- `NEXT_PUBLIC_GTM_ID` — Google Tag Manager (opcional)
- `NEXT_PUBLIC_POSTHOG_KEY` — alternativa ao GTM (opcional)
- `NEXT_PUBLIC_SITE_URL` — URL pública do site para canônico/OG
##teste
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

