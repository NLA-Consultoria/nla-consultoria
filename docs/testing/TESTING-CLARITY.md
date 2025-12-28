# Como Testar a Implementação do Clarity

## 🎯 Visão Geral

Este guia consolida todas as formas de testar a implementação do Microsoft Clarity.

## 📝 Tipos de Teste

### 1. **Testes Unitários** (Automatizados)

**Arquivo:** `lib/__tests__/clarity-events.test.ts`

**Como executar:**
```bash
# Instalar Jest (se ainda não tiver)
npm install --save-dev jest @types/jest ts-jest

# Configurar Jest (criar jest.config.js)
npx ts-jest config:init

# Executar testes
npm test -- clarity-events.test.ts
```

**O que testa:**
- Todos os eventos são disparados corretamente
- Tags são aplicadas conforme esperado
- Proteção contra SSR (não quebra no servidor)
- Proteção quando Clarity não está disponível
- Identificação de usuário funciona
- Qualificação de leads funciona

**Resultado esperado:** Todos 40+ testes devem passar ✅

---

### 2. **Testes no Console** (Semi-automatizados)

**Arquivo:** `docs/clarity-console-test.js`

**Como executar:**
1. Abrir http://localhost:3000
2. Abrir DevTools (F12 ou Cmd+Option+I)
3. Ir na aba **Console**
4. Copiar todo conteúdo de `clarity-console-test.js`
5. Colar no console e pressionar Enter
6. Executar: `runClarityTests()`

**O que testa:**
- Clarity está carregado e disponível
- Eventos podem ser disparados
- Tags podem ser aplicadas
- Usuários podem ser identificados
- Componentes estão presentes na página

**Funções úteis:**
```javascript
// Executar todos testes
runClarityTests()

// Monitorar eventos em tempo real
monitorClarityEvents()

// Testar clique em CTA
testCtaClick()
```

---

### 3. **Testes Manuais** (Checklist Completo)

**Arquivo:** `docs/CLARITY-TESTING-CHECKLIST.md`

**Como usar:**
1. Abrir o checklist no editor
2. Seguir passo a passo
3. Marcar [x] cada item conforme completa
4. Verificar eventos no console (use `monitorClarityEvents()`)
5. Validar no Clarity Dashboard após 1-2 minutos

**O que testa:**
- ✅ Todos 5 CTAs (hero, header, why, how, final)
- ✅ Funil completo do formulário (3 steps)
- ✅ Comportamento de "Voltar"
- ✅ Abandono em cada step
- ✅ Qualificação de leads (billing, gov experience, state)
- ✅ Identificação de usuário
- ✅ Tratamento de erros

---

## 🚀 Fluxo Recomendado de Testes

### Desenvolvimento (Pré-Commit)

```bash
# 1. Testes unitários
npm test -- clarity-events.test.ts

# 2. Testes rápidos no console
# - Abrir localhost:3000
# - Executar clarity-console-test.js
# - Rodar: runClarityTests()

# 3. Se ambos passarem → OK para commit
```

### Pré-Deploy (Staging)

```bash
# 1. Testes unitários
npm test

# 2. Testes manuais completos
# - Seguir CLARITY-TESTING-CHECKLIST.md
# - Marcar todos items

# 3. Validar no Clarity Dashboard
# - Buscar sessões dos últimos 10min
# - Verificar eventos apareceram
# - Verificar tags estão corretas

# 4. Se tudo OK → Deploy
```

### Pós-Deploy (Produção)

```bash
# 1. Smoke test em produção
# - Abrir URL de produção
# - Executar clarity-console-test.js
# - Rodar: runClarityTests()

# 2. Teste de conversão real
# - Preencher formulário até o fim
# - Usar email real de teste
# - Aguardar 2-3 minutos

# 3. Validar no Clarity Dashboard
# - Buscar por email de teste
# - Verificar sessão identificada
# - Verificar todos eventos aparecem
```

---

## 🔍 Debugging

### Problema: Clarity não está carregando

**Verificação:**
```javascript
// No console
typeof window.clarity
// Deve retornar: "function"
```

**Soluções:**
1. Verificar `.env.local` tem `NEXT_PUBLIC_CLARITY_ID=uscdlda0qf`
2. Verificar `ClarityTracker` está em `app/layout.tsx`
3. Limpar cache (Cmd+Shift+R)
4. Verificar console por erros de rede

---

### Problema: Eventos não aparecem no Dashboard

**Causas possíveis:**
1. **Delay de processamento** → Aguardar 1-2 minutos
2. **Ambiente errado** → Verificar project ID correto
3. **Ad blocker** → Desabilitar extensões

**Verificação:**
```javascript
// Ativar monitor
monitorClarityEvents()

// Clicar em algum CTA
// Deve aparecer no console: [Event] cta_click_*
```

---

### Problema: Events duplicados

**Causa:** React Strict Mode em desenvolvimento

**Esperado:** Normal em `npm run dev`, não afeta produção

**Solução:** Ignorar ou desabilitar Strict Mode temporariamente

---

## 📊 Critérios de Aceitação

Para considerar implementação completa e funcional:

### Testes Automatizados
- [ ] Todos testes unitários passam (40+ testes)
- [ ] Console tests passam sem erros

### Testes Manuais
- [ ] Todos 5 CTAs disparamevents corretos
- [ ] Funil rastreado em todos 3 steps
- [ ] Abandono funciona em todos steps
- [ ] Voltar funciona e é rastreado
- [ ] Qualificação aplica tags corretas
- [ ] Identificação funciona com email

### Validação no Clarity
- [ ] Eventos aparecem no dashboard (aguardar 2min)
- [ ] Tags aparecem corretamente
- [ ] Sessão identificada com email
- [ ] Busca por email retorna sessão

---

## 📚 Arquivos de Teste

```
docs/
├── CLARITY-ANALYTICS-GUIDE.md      # Guia de uso do Clarity
├── CLARITY-TESTING-CHECKLIST.md    # Checklist manual completo
├── clarity-console-test.js         # Suite de testes para console
└── TESTING-CLARITY.md              # Este arquivo

lib/
└── __tests__/
    └── clarity-events.test.ts      # Testes unitários
```

---

## 🎯 Próximos Passos

Após validar todos testes:

1. ✅ Commit das mudanças
2. ✅ Deploy para staging
3. ✅ Smoke test em staging
4. ✅ Deploy para produção
5. ✅ Monitorar dashboard por 24h
6. ✅ Analisar primeiros dados
7. ✅ Iterar com base em insights

---

**Última atualização:** 2025-12-27
**Mantido por:** Claude Code
