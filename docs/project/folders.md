Guia de Pastas — NLA Consultoria (Next.js App Router)

Estrutura principal

- app/
  - globals.css: Estilos globais (Tailwind + CSS variables de tema). Define paleta (claro/escuro), raio, ring, container, foco.
  - layout.tsx: Layout raiz. Injeta fontes (Inter/Libre Baskerville), tema inicial (script), SEO (GTM/PostHog opcional), JSON-LD de organização, Header, CookieConsent e Provider do Modal de Lead. Envolve todas as páginas.
  - page.tsx: Página inicial (landing). Consome os componentes de seção e o conteúdo em `content/home.ts`.

- components/
  - header.tsx / footer.tsx: Cabeçalho fixo e rodapé com navegação, CTA e dados de contato.
  - hero.tsx, why.tsx, how.tsx, benefits.tsx, testimonials.tsx, faq.tsx, cta-final.tsx: Seções da landing page. Cada uma recebe textos de `content/home.ts`.
  - lead-modal-wizard.tsx: Modal de captação em 3 passos (nome/telefone/email → empresa/UF/cidade → faturamento/vendeu para governo/dor). Validação com `zod`, máscara via regex e fetch de cidades do IBGE por UF. Envia dados para webhook n8n.
  - lead-modal.tsx: Versão anterior/simples do modal (mantida como referência).
  - cookie-consent.tsx: Banner/consentimento de cookies.
  - theme-toggle.tsx: Alternância de tema light/dark com persistência em localStorage.
  - logo-v8.tsx: Componente de logo com variações de cor por tema.
  - ui/: Biblioteca de componentes base (Tailwind + Radix UI)
    - button.tsx: Botão com variantes (default, secondary, outline, ghost, link) e tamanhos (sm, default, lg, icon).
    - dialog.tsx: Dialog (overlay, content, header, title, description) baseado em `@radix-ui/react-dialog`.
    - input.tsx, label.tsx, textarea.tsx, switch.tsx: Campos de formulário padrão.
    - cn.ts: Utilitário `cn` (classNames) para composição de classes.

- content/
  - home.ts: Fonte única de conteúdo (copy) da landing. Títulos, subtítulos, bullets, CTA, FAQ, footer. Editável para ajustes de texto.

- lib/
  - env.ts: Leitura de variáveis de ambiente públicas (NEXT_PUBLIC_*):
    - NEXT_PUBLIC_N8N_WEBHOOK_URL, NEXT_PUBLIC_AGENDA_URL, NEXT_PUBLIC_WHATSAPP_URL,
      NEXT_PUBLIC_GTM_ID, NEXT_PUBLIC_POSTHOG_KEY, NEXT_PUBLIC_SITE_URL
    - `hasAnalytics()` indica se GTM ou PostHog estão configurados.
  - seo.ts: SEO helpers — `defaultSEO`, `canonicalUrl`, JSON-LD de organização e de FAQ.
  - validators.ts: `PHONE_MASK` e `leadSchema` (zod) para validações do modal.

- public/
  - logo.svg: Logotipo do site. Servido estaticamente.

- deploy/
  - stack-easypanel.yml: Stack de implantação (ex.: EasyPanel). Define serviços/variáveis para deploy.

Arquivos de configuração e build

- next.config.mjs: Configurações do Next.js (se necessário ajustar reescritas/imagens/etc.).
- tailwind.config.ts: Escaneia app/components/content; estende tema com cores ligadas às CSS variables, animações e borderRadius.
- postcss.config.mjs: Pipeline do Tailwind.
- tsconfig.json / next-env.d.ts / react-shim.d.ts: Tipos TypeScript e ajustes React/Next.
- package.json: Scripts (`dev`, `build`, `start`, `lint`) e dependências (Next 14, React 18.3, Tailwind 3.4, Radix, zod, lucide-react).
- Dockerfile: Build multi-stage (deps → builder → runner). Produz standalone server (`node server.js`) com `.next/standalone` e `.next/static`. Porta padrão 3000.

Fluxo de dados (resumo)

1) Usuário clica “Agendar minha reunião” (header/hero/CTAs).
2) Abre `lead-modal-wizard` com 3 passos e validação incremental.
3) Carrega cidades pelo IBGE baseado no UF selecionado.
4) Submissão envia JSON ao webhook n8n; exibe popup de sucesso.

Pontos de extensão

- Conteúdo: editar `content/home.ts` para alterar textos e CTAs sem tocar nos componentes.
- Estilo: alterar variáveis em `app/globals.css` (cores/raio) e utilitários Tailwind.
- Analytics: setar `NEXT_PUBLIC_GTM_ID` ou `NEXT_PUBLIC_POSTHOG_KEY` em ambiente.
- Lead/Webhook: substituir URL no componente pelo valor de ambiente (ou usar `env.N8N_WEBHOOK_URL`).

