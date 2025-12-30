# Analise Complementar - Formulario Progressivo (codex)

## Escopo
Analise do projeto e do documento `docs/features/SPEC-progressive-form-ux.md`, com foco em UX, dados e implementacao.

## Analise do Projeto
- Next.js 14 (App Router) com TypeScript e Tailwind, voltado a landing page de conversao.
- Conteudo centralizado em `content/home.ts`, facilitando governanca de copy e testes A/B.
- Form modal com validacao zod e integracao via webhook para n8n.
- Stack de tracking prevista: Meta Pixel/CAPI, Clarity e GTM/PostHog.
- Estrategia de deploy em `/lp-2` para comparacao com `/`.

## Analise do Documento
- Especificacao detalha UX progressiva, copy orientada a beneficios e captura parcial.
- Revisao adiciona "Pontos de Atencao" com prioridades e criterios de execucao.
- Tracking e eventos estao bem descritos, mas faltam owners e regras de governanca.
- KPIs definidos sem baseline atual e sem cadencia de revisao.

## Notas sobre a revisao do SPEC (claude code)
- Adicionados: fallback IBGE, retry/backoff, estados de erro/loading, a11y com reduced motion, naming de eventos e baseline.
- Reclassificados como over-engineering: RACI, guided tour, toggle opt-out LGPD, monitoramento sintetico, diagrama de estados e testes offline.

## 10 Sugestoes de Melhorias (sem explicacoes)
1. Implementar fallback IBGE com cache (TTL 7 dias) e input manual.
2. Implementar retry/backoff para webhooks e reenvio ao reabrir modal.
3. Cobrir estados de loading/erro com skeleton e reenvio manual.
4. Aplicar `prefers-reduced-motion` e revisar ARIA dos campos dinamicos.
5. Padronizar naming convention de eventos Meta (parcial vs completo).
6. Capturar baseline de conversao antes do deploy de `/lp-2`.
7. Versionar `lead_draft_v3` com estrategia de migracao.
8. Ativar feature flag para animacoes (`NEXT_PUBLIC_ENABLE_FRAMER_MOTION`).
9. Definir alerta de falha de webhook > 10% (Sentry ou similar).
10. Revisar microcopy de privacidade no modal e links de politica.

## 10 Falhas ou Problemas Identificados (sem explicacoes)
1. Persistencia em localStorage sem politica de seguranca ou expurgo.
2. Politica de retencao de dados parciais nao esta documentada.
3. Nao ha diretriz clara para deduplicacao entre webhooks parciais e final.
4. Valores de conversao definidos sem calibracao ou base historica.
5. Nao existe contrato de idempotencia para eventos e webhooks.
6. Input manual de cidade pode gerar dados inconsistentes sem normalizacao.
7. Regras de consentimento e base legal LGPD nao estao formalizadas.
8. Ownership tecnico para tracking e credenciais nao esta definido.
9. Falta plano de QA especifico para mobile de baixo desempenho.
10. Documentacao de rollback entre `/` e `/lp-2` ainda nao existe.

## 10 Questoes em Aberto, Ambiguas ou Genericas (sem explicacoes)
1. Criterio objetivo para marcar lead parcial como valido.
2. Responsavel por tokenizacao e rotacao de credenciais Meta.
3. Cadencia e owner para revisao de KPIs e metas.
4. Politica de retencao e descarte de dados parciais.
5. Escopo de internacionalizacao caso haja expansao.
6. Regra para priorizar canais de recuperacao (email vs WhatsApp).
7. Como calibrar valores de conversao usados nos eventos.
8. Qual camada aplica idempotencia para eventos e webhooks.
9. Qual criterio para ativar rollback entre `/` e `/lp-2`.
10. Plano B se framer-motion afetar performance.

## Discussao Multidisciplinar
- Camila (UX Research): "O aviso de privacidade no modal precisa ser direto e visivel para reduzir friccao e manter confianca."
- Ricardo (Engenharia Frontend): "Fallback IBGE, retry/backoff e reduced motion precisam de criterios claros para nao quebrar o fluxo."
- Fernanda (Growth/Media): "A naming convention de eventos e o baseline de conversao precisam estar prontos antes do deploy."

— codex
