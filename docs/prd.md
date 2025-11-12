PRD — NLA Consultoria Landing (Captação de Leads B2G)

Introduction
- Title: NLA Consultoria — Landing de Captação (v1)
- Version: 1.0.0
- Created: 2025-11-12
- Purpose: Apresentar proposta de valor da NLA Consultoria para empresas que desejam vender ao setor público e captar leads qualificados para contato comercial.
- Business Objectives:
  - Aumentar a geração de oportunidades (cadastros completos e válidos).
  - Educar o visitante sobre o processo e diferenciais (confiança e previsibilidade).
  - Oferecer canal de agendamento/contato rápido.

Goals and Scope
- Business Goals:
  - 1) Elevar taxa de conversão de visitantes em leads.
  - 2) Qualificar leads com dados estruturados (UF, cidade, faturamento, experiência com governo, dor).
  - 3) Permitir testes rápidos de copy/CTA (iterar conteúdo facilmente).
- User Goals:
  - Entender claramente se o serviço é para o seu perfil.
  - Ver exemplos/benefícios e funcionamento do processo.
  - Agendar contato de forma simples e confiável.
- In Scope (v1):
  - Landing page estática com seções: Hero, Por que, Como funciona, O que recebe, Para quem, Depoimentos, FAQ, CTA final.
  - Header/rodapé com navegação por âncoras, contatos e tema claro/escuro.
  - Modal de cadastro em 3 passos com validação (zod) e envio a webhook n8n.
  - SEO básico + JSON-LD de organização e FAQ.
  - Dark mode toggle persistente.
- Out of Scope (v1):
  - CMS/headless para conteúdo dinâmico.
  - Autenticação de usuários e área logada.
  - Integração direta com calendaring (apenas link/URL eventual).

Target Users
- Pequenas e médias empresas que já vendem no privado e desejam abrir canal de vendas para o setor público.
- Fundadores/gestores de vendas/operacional com foco em previsibilidade, processo e conformidade.
- Necessidades: entender viabilidade, passos, prazos e o que recebem; contato assistido para começar.
- Benefícios: redução de incerteza, priorização de oportunidades certas, organização documental e acompanhamento até assinatura.

Features
1) Landing Page Estruturada
  - Hero com headline forte, subtítulo explicativo e CTA principal.
  - Seções informativas (por que, como, o que recebe, para quem, depoimentos, FAQ) com textos de `content/home.ts`.
  - Footer com e-mail, WhatsApp, cidade/UF, CNPJ e links (privacidade/termos).

2) Captação de Leads (Modal Wizard 3 passos)
  - Passo 1: nome, telefone (máscara/brasil), e-mail (validado).
  - Passo 2: empresa, UF (lista de 27 UFs), cidade (lista do IBGE para o UF escolhido).
  - Passo 3: faturamento (faixa), já vendeu para governo? (sim/não), dor/negócio (texto livre).
  - Validação incremental (zod) e mensagem de erro amigável.
  - Submissão (POST JSON) para webhook n8n com metadata (source, stepCount).
  - Popup de sucesso com confirmação.

3) Tema e Acessibilidade
  - Toggle light/dark com persistência em `localStorage`.
  - Foco visível e contraste adequado (cores via CSS variables HSL).

4) SEO e Analytics
  - `defaultSEO` (título/descrição), canonical opcional via `NEXT_PUBLIC_SITE_URL`.
  - JSON-LD de organização e FAQ.
  - Suporte a GTM/PostHog via variáveis públicas (`NEXT_PUBLIC_GTM_ID`, `NEXT_PUBLIC_POSTHOG_KEY`).

User Stories & Acceptance Criteria
US1 – Como visitante, quero entender rapidamente a proposta de valor
- AC1: Ao abrir a página, vejo headline e CTA acima da dobra.
- AC2: O texto “Como funciona” descreve etapas claras (1-2-3).
- AC3: Navegação por âncoras funciona e destaca a seção ao rolar.

US2 – Como visitante, quero solicitar contato com poucos passos
- AC1: Botão “Agendar minha reunião” abre modal em menos de 300ms.
- AC2: Validação impede avanço com campos obrigatórios ausentes.
- AC3: Telefone aceita somente formato (00) 00000-0000; e-mail válido.
- AC4: UF e cidade são obrigatórios; cidade lista opções do IBGE conforme UF.
- AC5: Ao enviar com sucesso, modal fecha e popup de confirmação aparece.
- AC6: Payload enviado ao webhook contém todos os campos mapeados.

US3 – Como visitante, quero alternar o tema
- AC1: Clique no toggle muda o tema e persiste em `localStorage`.
- AC2: O tema se mantém após recarregar a página.

US4 – Como marketing/negócios, quero editar conteúdo sem code changes nos componentes
- AC1: Textos principais residem em `content/home.ts` (hero, seções, FAQ, CTA, footer).
- AC2: Alterar `content/home.ts` reflete no site após rebuild/deploy.

Design & UX
- Diretrizes de design estão especificadas em `docs/design.md` (tipografia, paleta, foco, componentes).
- Estrutura de seções: linear e escaneável; CTA primário sempre visível no header e em blocos-chave.
- Wireflow (texto):
  1) Header (logo, nav, CTA) → Hero (headline, CTA).
  2) Por que vender → Como funciona (1-2-3) → O que recebe.
  3) Para quem → Depoimentos → FAQ → CTA final → Footer.
  4) A qualquer momento, CTA abre modal de 3 passos → envio → popup sucesso.

Technical Requirements
- Stack: Next.js 14.2.5 (App Router), React 18.3.x, TypeScript 5.4.x.
- Estilos: Tailwind 3.4.x (HSL CSS variables), Radix UI (Dialog), lucide-react (ícones).
- Validação: zod 3.x; máscara de telefone por regex `PHONE_MASK`.
- Conteúdo: `content/home.ts` (estático, sem CMS no v1).
- Env (públicas): `NEXT_PUBLIC_*` em `lib/env.ts` para analytics/URLs/canonical.
- SEO: `lib/seo.ts` (default SEO, JSON-LD, canonical opcional).
- Build: Dockerfile multi-stage (deps→builder→runner). Runner usa `.next/standalone` + `.next/static` e `node server.js`. Porta 3000 (ajustável).
- Desempenho: landing estática; IBGE fetch apenas no modal (client-side) quando UF muda.

Non-Functional Requirements
- Acessibilidade AA: foco visível, contraste adequado, labels/descrição.
- Segurança: sem entrada de usuário no servidor; payload do modal enviado a endpoint externo (n8n) via HTTPS; não armazenamos dados localmente além de tema.
- Observabilidade: opcional via GTM/PostHog; não bloqueia build se ausentes.

Risks & Assumptions
- Dependência do endpoint do IBGE para cidades (disponibilidade/latência).
- Webhook n8n precisa estar acessível publicamente; lidar com falhas exibindo erro amigável e mantendo o modal aberto.
- Conteúdo contém caracteres especiais; garantir encoding UTF-8.

Open Questions
- Desejo de integrar agenda/calendário (Calendly/Google) diretamente no modal?
- Substituir URL fixa do webhook por variável de ambiente (`env.N8N_WEBHOOK_URL`)?
- Inclusão de CMS leve (ex.: MDX ou JSON remoto) para conteúdo sem rebuild?

Appendix
- Estrutura técnica detalhada em `docs/folders.md`.
- Diretrizes visuais completas em `docs/design.md`.

