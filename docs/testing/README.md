# Testing

Ferramentas e guias para validar a implementação de analytics e funcionalidades.

## 🧪 Tipos de Teste

### 1. **Testes Unitários** (Automatizados)
**Localização:** `/lib/__tests__/clarity-events.test.ts`

```bash
# Executar testes
npm test -- clarity-events.test.ts
```

**Cobertura:**
- ✅ 40+ testes
- ✅ Todos eventos e tags
- ✅ Proteção SSR
- ✅ Casos edge

### 2. **Testes no Console** (Semi-automatizados)
**Arquivo:** [clarity-console-test.js](./clarity-console-test.js)

```javascript
// 1. Abrir localhost:3000
// 2. Abrir DevTools Console
// 3. Colar conteúdo do arquivo
// 4. Executar:
runClarityTests()

// Monitor em tempo real:
monitorClarityEvents()

// Teste específico:
testCtaClick()
```

### 3. **Testes Manuais** (Checklist)
**Arquivo:** [CLARITY-TESTING-CHECKLIST.md](./CLARITY-TESTING-CHECKLIST.md)

Checklist completo de 50+ itens testando:
- ✅ Todos CTAs (5 tipos)
- ✅ Funil completo (3 steps)
- ✅ Comportamentos (voltar, abandonar)
- ✅ Qualificação e identificação
- ✅ Validação no Clarity Dashboard

---

## 📚 Documentação Disponível

### [TESTING-CLARITY.md](./TESTING-CLARITY.md)

**Overview consolidado** de todos tipos de teste:
- Como executar cada tipo
- Fluxo recomendado (dev, staging, produção)
- Troubleshooting
- Critérios de aceitação

### [CLARITY-TESTING-CHECKLIST.md](./CLARITY-TESTING-CHECKLIST.md)

**Checklist manual detalhado** com:
- Preparação e setup
- Testes de cada CTA (5 tipos)
- Testes de funil (todos steps)
- Testes de comportamento
- Testes de erro e qualificação
- Validação no dashboard
- Seção de troubleshooting

### [clarity-console-test.js](./clarity-console-test.js)

**Script para DevTools Console:**
- `runClarityTests()` - Suite completa
- `monitorClarityEvents()` - Monitor em tempo real
- `testCtaClick()` - Teste específico de CTA

---

## 🚀 Fluxo Recomendado

### Pré-Commit (Desenvolvimento)

```bash
# 1. Testes unitários
npm test -- clarity-events.test.ts

# 2. Testes rápidos no console
# - Abrir localhost:3000
# - Executar clarity-console-test.js
# - Rodar: runClarityTests()

# ✅ Se ambos passarem → OK para commit
```

### Pré-Deploy (Staging)

```bash
# 1. Todos testes unitários
npm test

# 2. Checklist manual completo
# - Seguir CLARITY-TESTING-CHECKLIST.md
# - Marcar todos [x] items

# 3. Validar no Clarity Dashboard
# - Buscar sessões (últimos 10min)
# - Verificar eventos apareceram
# - Verificar tags corretas

# ✅ Se tudo OK → Deploy
```

### Pós-Deploy (Produção)

```bash
# 1. Smoke test
# - Abrir URL produção
# - Executar clarity-console-test.js
# - Rodar: runClarityTests()

# 2. Teste de conversão real
# - Preencher formulário completo
# - Usar email de teste
# - Aguardar 2-3 minutos

# 3. Validar dashboard
# - Buscar por email de teste
# - Verificar sessão identificada
# - Todos eventos presentes
```

---

## 🔍 Troubleshooting

### Clarity não carrega

```javascript
// No console:
typeof window.clarity
// Deve retornar: "function"
```

**Soluções:**
1. Verificar `.env.local` tem `NEXT_PUBLIC_CLARITY_ID`
2. Limpar cache (Cmd+Shift+R)
3. Verificar console por erros

### Eventos não aparecem no dashboard

**Causas:**
1. Delay de 1-2 minutos (normal)
2. Project ID errado
3. Ad blocker ativo

**Validação:**
```javascript
monitorClarityEvents() // Ver eventos em tempo real
```

### Eventos duplicados

**Causa:** React Strict Mode (dev only)

**Solução:** Normal em desenvolvimento, não afeta produção

---

## ✅ Critérios de Aceitação

Para considerar implementação validada:

**Testes Automatizados:**
- [ ] Todos testes unitários passam (40+)
- [ ] Console tests passam sem erros

**Testes Manuais:**
- [ ] 5 CTAs disparam eventos corretos
- [ ] Funil rastreado (3 steps)
- [ ] Abandono funciona
- [ ] Qualificação aplica tags
- [ ] Identificação com email funciona

**Validação Dashboard:**
- [ ] Eventos aparecem (aguardar 2min)
- [ ] Tags corretas
- [ ] Sessão identificada
- [ ] Busca por email retorna sessão

---

## 🔗 Links Relacionados

- **Analytics Docs:** `/docs/analytics/`
- **Código Fonte:** `/lib/clarity-events.ts`
- **Testes Unitários:** `/lib/__tests__/clarity-events.test.ts`
- **Clarity Dashboard:** https://clarity.microsoft.com/projects/view/uscdlda0qf

---

**Última atualização:** 2025-12-27
