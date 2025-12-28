# Guia de Analytics com Microsoft Clarity

## 📊 Visão Geral

Este documento descreve a implementação avançada do Microsoft Clarity focada em otimização de conversão para a landing page de lead generation da NLA Consultoria.

## 🎯 Objetivos da Implementação

1. **Identificar pontos de fricção** no funil de conversão
2. **Otimizar taxa de conversão** através de dados comportamentais
3. **Segmentar sessões** por perfil de lead para análise direcionada
4. **Conectar sessões a leads** para entender jornadas completas

---

## 📍 Eventos Rastreados

### 1. **CTA Clicks** - Identificar CTAs mais efetivos

Rastreia cliques em todos os Call-to-Actions da página:

- `cta_click_hero` - CTA principal no topo
- `cta_click_header` - CTA fixo no header
- `cta_click_why_section` - CTA na seção "Por que vender"
- `cta_click_how_section` - CTA na seção "Como funciona"
- `cta_click_final_cta` - CTA final de fechamento

**Como usar no Clarity:**
- Dashboard → Filters → Custom Events → Selecione `cta_click_*`
- Compare taxa de conversão entre diferentes CTAs
- Identifique qual seção gera mais engajamento

### 2. **Form Funnel** - Rastrear abandono no formulário

Eventos do funil multi-step:

- `form_opened` - Modal aberto
- `form_step_1_completed` - Dados básicos preenchidos
- `form_step_2_completed` - Dados da empresa preenchidos
- `form_step_back_from_2` ou `form_step_back_from_3` - Usuário voltou
- `form_abandoned_step_1/2/3` - Formulário fechado sem completar
- `form_submit_success` - Lead enviado com sucesso
- `form_submit_error` - Erro no envio

**Como usar no Clarity:**
- Dashboard → Funnels → Crie funil:
  1. form_opened
  2. form_step_1_completed
  3. form_step_2_completed
  4. form_submit_success
- Identifique onde há maior queda (drop-off)
- Assista gravações de sessões que abandonaram

### 3. **Session Tags** - Segmentar por perfil

Tags aplicadas para filtrar sessões:

**Comportamento:**
- `has_cta_click: true` - Clicou em algum CTA
- `cta_location: [hero|header|why_section|...]` - Último CTA clicado
- `form_opened: true` - Abriu o formulário
- `converted: true` - Completou o formulário
- `form_abandoned: true` - Abandonou o formulário

**Qualificação do Lead:**
- `lead_billing_range: [Até R$ 50 mil|R$ 50–200 mil|...]`
- `sold_to_gov_before: [sim|nao]`
- `lead_state: [GO|SP|RJ|...]`

**Progresso no Funil:**
- `form_highest_step: [1|2|3]` - Até qual step chegou
- `abandoned_at_step: [1|2|3]` - Onde abandonou

**Como usar no Clarity:**
- Dashboard → Filters → Custom Tags
- Exemplo: Filtrar sessões com `converted: true` + `sold_to_gov_before: nao`
- Analise padrões de comportamento de leads que nunca venderam para governo
- Compare heatmaps entre diferentes perfis

### 4. **User Identification** - Conectar sessões a leads

Quando um lead converte, a sessão é identificada com:
- Email (ID único)
- Nome
- Empresa

**Como usar no Clarity:**
- Dashboard → Sessions → Busque por email do lead
- Veja a jornada completa desde o primeiro acesso até conversão
- Identifique se voltou múltiplas vezes antes de converter

---

## 📈 Análises Recomendadas

### 1. **Análise de Funil de Conversão**

**Objetivo:** Identificar onde os usuários abandonam

**Como fazer:**
1. Clarity Dashboard → Create Funnel
2. Steps:
   - Page view (baseline)
   - form_opened
   - form_step_1_completed
   - form_step_2_completed
   - form_submit_success
3. Analise taxa de conversão entre steps
4. Para steps com >30% drop-off, assista recordings

**Ações baseadas em dados:**
- Step 1 alto abandono → Simplificar campos ou melhorar copy
- Step 2 alto abandono → UF/Cidade pode estar com UX ruim
- Step 3 alto abandono → Perguntas de qualificação podem assustar

### 2. **Comparação de CTAs**

**Objetivo:** Descobrir qual CTA converte mais

**Como fazer:**
1. Filters → Custom Events → Selecione todos `cta_click_*`
2. Compare volume de cada evento
3. Para cada CTA, filtre sessions e veja taxa de conversão final

**Exemplo:**
- Se `cta_click_hero` tem 100 eventos mas apenas 5 conversões
- E `cta_click_why_section` tem 40 eventos mas 8 conversões
- → Why section converte 2x melhor (20% vs 5%)
- → Considere tornar esse CTA mais proeminente

### 3. **Análise por Perfil de Lead**

**Objetivo:** Entender comportamento de diferentes perfis

**Como fazer:**
1. Crie segmentos com tags:
   - Leads grandes: `lead_billing_range: Acima de R$ 1 mi`
   - Leads pequenos: `lead_billing_range: Até R$ 50 mil`
   - Experientes: `sold_to_gov_before: sim`
   - Inexperientes: `sold_to_gov_before: nao`

2. Para cada segmento, analise:
   - Heatmaps: Onde clicam mais?
   - Scroll depth: Leem toda página?
   - Form abandonment: Onde param?

**Ações baseadas em dados:**
- Se leads grandes scrollam pouco → Copy muito longo
- Se inexperientes abandonam no step 3 → Pergunta sobre "já vendeu" intimida
- Se leads de SP convertem mais → Focar SEO/ads em SP

### 4. **Identificação de Bugs/Problemas**

**Objetivo:** Encontrar erros técnicos que afetam conversão

**Como fazer:**
1. Filters → Custom Events → `form_submit_error`
2. Filters → Custom Tags → `last_error: *`
3. Assista recordings dessas sessões
4. Identifique padrão:
   - Mesmo erro repetido?
   - Erro em device/browser específico?
   - Erro em campo específico?

**Exemplo:**
- Se muitos `last_error: Falha ao carregar cidades`
- → API do IBGE pode estar lenta/offline
- → Adicionar fallback ou cache

### 5. **Análise de Abandono**

**Objetivo:** Entender por que usuários não convertem

**Como fazer:**
1. Filters → Custom Tags → `form_abandoned: true`
2. Group by `abandoned_at_step`
3. Assista 10-20 recordings de cada step

**Padrões a observar:**
- **Step 1:** Usuários ficam confusos com máscara de telefone?
- **Step 2:** UF/Cidade demora para carregar?
- **Step 3:** Campo "Qual é o seu negócio" intimida?
- **Geral:** Usuários clicam fora do modal acidentalmente?

---

## 🎨 Heatmaps e Click Maps

### Como usar:

1. Dashboard → Heatmaps → Selecione página
2. Aplique filtros por perfil:
   - `converted: true` (leads que converteram)
   - `form_abandoned: true` (leads que abandonaram)

### Análises recomendadas:

**Scroll depth:**
- Quantos % chegam ao final da página?
- Se < 50% leem seção "FAQ" → Mover FAQ mais para cima

**Click maps:**
- Usuários clicam em elementos não-clicáveis?
- → Adicionar cursor: pointer ou tornar clicável
- Botão "Voltar" é muito usado?
- → Considere formulário single-step

**Rage clicks:**
- Usuários clicam repetidamente em mesmo lugar?
- → Pode indicar button quebrado ou carregamento lento

---

## 📱 Análise por Device/Browser

### Segmentar por dispositivo:

1. Filters → Device Type → [Desktop|Mobile|Tablet]
2. Compare taxas de conversão

**Ações baseadas em dados:**
- Mobile converte 50% menos → Otimizar UX mobile
- Safari tem erros → Testar no Safari
- Tablets não convertem → Pode ignorar otimizações

---

## 🔄 Análise de Sessões Recorrentes

### Identificar usuários que voltam:

1. Filters → Session Count → [2+, 3+, 5+]
2. Analise comportamento de retorno

**Insights:**
- Usuários que voltam 3x+ antes de converter
- → Considere retargeting ou nurturing
- Usuários voltam mas nunca convertem
- → Pode haver objeção não respondida na página

---

## 🚀 Próximas Implementações Sugeridas

### 1. **Scroll Depth Tracking**

Adicione em `clarity-events.ts`:
```typescript
// Já tem a função, precisa implementar no componente
trackScrollDepth(25|50|75|100)
```

Implemente com Intersection Observer na página.

### 2. **FAQ Interaction Tracking**

```typescript
// Já tem a função
trackFaqExpand(question)
```

Adicione onClick nos `<details>` do FAQ.

### 3. **Exit Intent Detection**

```typescript
// Já tem a função
trackExitIntent()
```

Adicione listener de mouseleave no documento.

### 4. **Time on Page Segmentation**

Adicione tags baseadas em tempo:
- `time_on_page: [0-30s|30s-1m|1-2m|2m+]`

---

## 📊 Dashboards Recomendados no Clarity

### Dashboard 1: **Visão Geral de Conversão**

**Métricas:**
- Sessions totais
- `form_opened` rate
- `converted` rate
- Abandonment rate por step

### Dashboard 2: **Performance de CTAs**

**Métricas:**
- Volume de cada `cta_click_*`
- Conversion rate de cada CTA
- Heatmap de cliques por seção

### Dashboard 3: **Perfil de Leads**

**Segmentação:**
- Por `lead_billing_range`
- Por `sold_to_gov_before`
- Por `lead_state`

### Dashboard 4: **Problemas e Erros**

**Alertas:**
- `form_submit_error` spike
- `form_abandoned` rate acima de 60%
- Sessions com rage clicks

---

## 🎯 KPIs para Monitorar

### Conversão:
- **Form Open Rate:** Sessions com `form_opened` / Total sessions
- **Step 1 Completion:** `form_step_1_completed` / `form_opened`
- **Step 2 Completion:** `form_step_2_completed` / `form_step_1_completed`
- **Final Conversion Rate:** `form_submit_success` / `form_opened`

### Engajamento:
- **CTA Click Rate:** `has_cta_click: true` / Total sessions
- **Scroll Depth:** % que chega a 75%+
- **Time on Page:** Médio por sessão

### Qualidade:
- **Error Rate:** `form_submit_error` / Total submits
- **Back Rate:** `form_step_back_*` / Total steps forward
- **Rage Click Rate:** Sessions com rage clicks / Total

---

## 🔧 Troubleshooting

### Clarity não está rastreando eventos?

1. Abra DevTools → Console
2. Digite: `typeof window.clarity`
3. Deve retornar `"function"`
4. Teste manualmente: `window.clarity("event", "test")`

### Tags não aparecem no dashboard?

- Tags podem levar 1-2 minutos para aparecer
- Verifique se há typo nos nomes
- Tags são case-sensitive

### Eventos não geram insights?

- Precisa de volume mínimo (~100 eventos)
- Aguarde 24h para dados consolidarem
- Compare com baseline (page views)

---

## 📚 Recursos

- [Microsoft Clarity Docs](https://learn.microsoft.com/en-us/clarity/)
- [Clarity API Reference](https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-api)
- [Dashboard do Projeto](https://clarity.microsoft.com/projects/view/uscdlda0qf)

---

**Última atualização:** 2025-12-27
**Mantido por:** Claude Code
