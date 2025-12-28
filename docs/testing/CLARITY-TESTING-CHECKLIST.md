# Checklist de Testes - Microsoft Clarity

Use este checklist para validar manualmente que todos os eventos Clarity estão funcionando corretamente no navegador.

## 🔧 Preparação

### 1. Verificar que Clarity está carregado

```javascript
// No DevTools Console, execute:
typeof window.clarity
// Deve retornar: "function"
```

### 2. Habilitar modo de debug (opcional)

```javascript
// Para ver eventos em tempo real no console:
const originalClarity = window.clarity;
window.clarity = function(...args) {
  console.log('[Clarity]', ...args);
  return originalClarity.apply(this, args);
};
```

---

## ✅ Testes de CTAs

### CTA Hero (Seção Principal)

- [ ] Abrir página home
- [ ] Clicar no botão "Agendar minha reunião" no hero
- [ ] **Esperado no console:**
  - `['event', 'cta_click_hero']`
  - `['set', 'has_cta_click', 'true']`
  - `['set', 'cta_location', 'hero']`
- [ ] Modal deve abrir

### CTA Header (Fixo no Topo)

- [ ] Clicar no botão "Agendar minha reunião" no header
- [ ] **Esperado:**
  - `['event', 'cta_click_header']`
  - `['set', 'cta_location', 'header']`
- [ ] Modal deve abrir

### CTA Why Section

- [ ] Rolar até seção "Por que vender"
- [ ] Clicar em "Quero abrir esse canal de vendas"
- [ ] **Esperado:**
  - `['event', 'cta_click_why_section']`
  - `['set', 'cta_location', 'why_section']`
- [ ] Modal deve abrir

### CTA How Section

- [ ] Rolar até seção "Como funciona"
- [ ] Clicar no botão no final da seção
- [ ] **Esperado:**
  - `['event', 'cta_click_how_section']`
  - `['set', 'cta_location', 'how_section']`
- [ ] Modal deve abrir

### CTA Final

- [ ] Rolar até seção final (antes do footer)
- [ ] Clicar em "Agendar minha reunião"
- [ ] **Esperado:**
  - `['event', 'cta_click_final_cta']`
  - `['set', 'cta_location', 'final_cta']`
- [ ] Modal deve abrir

---

## ✅ Testes de Formulário - Funil Completo

### Abertura do Modal

- [ ] Clicar em qualquer CTA
- [ ] **Esperado:**
  - `['event', 'form_opened']`
  - `['set', 'form_opened', 'true']`
- [ ] Modal deve estar visível

### Step 1 - Dados Básicos

- [ ] Preencher:
  - Nome: "Teste Clarity"
  - Telefone: "(62) 99999-9999"
  - Email: "teste@clarity.com"
- [ ] Clicar em "Próximo"
- [ ] **Esperado:**
  - `['event', 'form_step_1_completed']`
  - `['set', 'form_highest_step', '1']`
- [ ] Deve avançar para Step 2

### Step 2 - Dados da Empresa

- [ ] Preencher:
  - Empresa: "Empresa Teste"
  - UF: "GO"
  - Cidade: "Goiânia"
- [ ] Clicar em "Próximo"
- [ ] **Esperado:**
  - `['event', 'form_step_2_completed']`
  - `['set', 'form_highest_step', '2']`
- [ ] Deve avançar para Step 3

### Step 3 - Qualificação

- [ ] Preencher:
  - Fatura mensal: "R$ 50–200 mil"
  - Já vendeu para governo: "Não"
  - Negócio: "Teste de integração Clarity"
- [ ] Clicar em "Enviar"
- [ ] **Esperado:**
  - `['event', 'form_submit_success']`
  - `['set', 'converted', 'true']`
  - `['set', 'lead_billing_range', 'R$ 50–200 mil']`
  - `['set', 'sold_to_gov_before', 'nao']`
  - `['set', 'lead_state', 'GO']`
  - `['identify', 'teste@clarity.com']`
  - `['set', 'user_name', 'Teste Clarity']`
  - `['set', 'user_company', 'Empresa Teste']`
- [ ] Modal de sucesso deve aparecer

---

## ✅ Testes de Comportamento - Voltar

### Voltar do Step 2 para Step 1

- [ ] Abrir formulário
- [ ] Preencher Step 1 e avançar
- [ ] No Step 2, clicar em "Voltar"
- [ ] **Esperado:**
  - `['event', 'form_step_back_from_2']`
- [ ] Deve voltar para Step 1

### Voltar do Step 3 para Step 2

- [ ] Avançar até Step 3
- [ ] Clicar em "Voltar"
- [ ] **Esperado:**
  - `['event', 'form_step_back_from_3']`
- [ ] Deve voltar para Step 2

---

## ✅ Testes de Abandono

### Abandono no Step 1

- [ ] Abrir formulário
- [ ] Preencher alguns campos (não todos)
- [ ] Fechar modal (clicar fora ou no X)
- [ ] **Esperado:**
  - `['event', 'form_abandoned_step_1']`
  - `['set', 'form_abandoned', 'true']`
  - `['set', 'abandoned_at_step', '1']`

### Abandono no Step 2

- [ ] Abrir formulário
- [ ] Completar Step 1
- [ ] Preencher parcialmente Step 2
- [ ] Fechar modal
- [ ] **Esperado:**
  - `['event', 'form_abandoned_step_2']`
  - `['set', 'abandoned_at_step', '2']`

### Abandono no Step 3

- [ ] Completar Steps 1 e 2
- [ ] Preencher parcialmente Step 3
- [ ] Fechar modal
- [ ] **Esperado:**
  - `['event', 'form_abandoned_step_3']`
  - `['set', 'abandoned_at_step', '3']`

---

## ✅ Testes de Erro

### Erro de Envio (Simular)

**Nota:** Para testar erro, desconecte internet ou mude webhook URL para inválida temporariamente.

- [ ] Preencher formulário completamente
- [ ] Desconectar internet
- [ ] Clicar em "Enviar"
- [ ] **Esperado:**
  - `['event', 'form_submit_error']`
  - `['set', 'form_error', '<mensagem de erro>']`
- [ ] Mensagem de erro deve aparecer no formulário

---

## ✅ Testes de Qualificação

### Diferentes Faixas de Faturamento

Teste cada uma destas opções separadamente:

- [ ] "Até R$ 50 mil"
  - Esperado: `['set', 'lead_billing_range', 'Até R$ 50 mil']`

- [ ] "R$ 50–200 mil"
  - Esperado: `['set', 'lead_billing_range', 'R$ 50–200 mil']`

- [ ] "R$ 200–500 mil"
  - Esperado: `['set', 'lead_billing_range', 'R$ 200–500 mil']`

- [ ] "R$ 500 mil – 1 mi"
  - Esperado: `['set', 'lead_billing_range', 'R$ 500 mil – 1 mi']`

- [ ] "Acima de R$ 1 mi"
  - Esperado: `['set', 'lead_billing_range', 'Acima de R$ 1 mi']`

### Experiência com Governo

- [ ] Selecionar "Sim"
  - Esperado: `['set', 'sold_to_gov_before', 'sim']`

- [ ] Selecionar "Não"
  - Esperado: `['set', 'sold_to_gov_before', 'nao']`

### Diferentes Estados

Teste alguns estados:

- [ ] SP - Esperado: `['set', 'lead_state', 'SP']`
- [ ] RJ - Esperado: `['set', 'lead_state', 'RJ']`
- [ ] GO - Esperado: `['set', 'lead_state', 'GO']`

---

## ✅ Verificação no Dashboard Clarity

### Após completar os testes acima, aguarde 1-2 minutos e verifique:

1. **Ir para:** https://clarity.microsoft.com/projects/view/uscdlda0qf

2. **Buscar sua sessão:**
   - Dashboard → Sessions
   - Filtrar por "Last 1 hour"
   - Identificar sua sessão (IP/Device)

3. **Verificar eventos:**
   - Clicar na sessão
   - Aba "Events" deve mostrar todos eventos disparados
   - Verificar se `cta_click_*`, `form_*` aparecem

4. **Verificar tags:**
   - Clicar na sessão
   - Aba "Custom tags" deve mostrar:
     - `has_cta_click: true`
     - `cta_location: <última localização>`
     - `form_opened: true`
     - `converted: true` (se completou)
     - Tags de qualificação

5. **Verificar identificação:**
   - Se completou formulário
   - Sessão deve estar identificada com email usado
   - Buscar por "teste@clarity.com" deve retornar a sessão

---

## 🐛 Troubleshooting

### Clarity não dispara eventos

**Verificar:**
```javascript
// 1. Clarity está disponível?
typeof window.clarity
// Deve ser "function"

// 2. Tentar disparar manualmente
window.clarity("event", "test_manual")

// 3. Verificar erros no console
```

**Soluções:**
- Recarregar página (Cmd+R ou Ctrl+R)
- Limpar cache (Cmd+Shift+R ou Ctrl+Shift+F5)
- Verificar se CLARITY_ID está em .env.local
- Verificar se ClarityTracker está no layout

### Eventos aparecem duplicados

**Causa:** React Strict Mode em dev dispara effects 2x

**Solução:** Normal em desenvolvimento, não afeta produção

### Tags não aparecem no dashboard

**Causa:** Delay de processamento

**Solução:** Aguardar 1-2 minutos e recarregar dashboard

---

## ✅ Checklist Final

Antes de considerar testes completos:

- [ ] Todos CTAs (5) dispararam eventos corretos
- [ ] Funil completo testado (Steps 1-3)
- [ ] Comportamento de "Voltar" funciona
- [ ] Abandono rastreado em todos steps
- [ ] Qualificação aplicada (billing, gov, state)
- [ ] Identificação funciona (email/nome/empresa)
- [ ] Erro de envio rastreado
- [ ] Eventos aparecem no Clarity Dashboard
- [ ] Tags aparecem no Clarity Dashboard
- [ ] Sessão está identificada com email

---

**Data dos Testes:** __________

**Testado por:** __________

**Status:** ☐ Aprovado  ☐ Pendências

**Observações:**
_______________________________________________
_______________________________________________
_______________________________________________
