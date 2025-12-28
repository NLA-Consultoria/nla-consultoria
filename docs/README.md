# Documentação do Projeto

Este diretório contém toda a documentação técnica e de produto do projeto NLA Consultoria.

## 📂 Estrutura

### 📊 [analytics/](./analytics/)
Documentação sobre implementação e uso de ferramentas de analytics.

- **CLARITY-ANALYTICS-GUIDE.md** - Guia completo de análise com Microsoft Clarity
  - Eventos rastreados
  - Análises recomendadas
  - KPIs e dashboards
  - Como otimizar conversão

### 🧪 [testing/](./testing/)
Guias e ferramentas para testar a implementação de analytics.

- **TESTING-CLARITY.md** - Overview dos tipos de teste disponíveis
- **CLARITY-TESTING-CHECKLIST.md** - Checklist manual completo
- **clarity-console-test.js** - Script para testes automatizados no console

### 📋 [project/](./project/)
Documentação de produto e arquitetura do projeto.

- **prd.md** - Product Requirements Document
- **design.md** - Decisões de design e UI/UX
- **folders.md** - Estrutura de pastas do projeto

### ✨ [features/](./features/)
Especificações de features específicas.

- **PRD-new-forms.md** - Requisitos para novos formulários

---

## 🚀 Início Rápido

### Para Desenvolvedores

1. **Entender o projeto:**
   - Leia [project/prd.md](./project/prd.md) - Visão geral do produto
   - Consulte [project/folders.md](./project/folders.md) - Estrutura de código

2. **Configurar analytics:**
   - Siga [analytics/CLARITY-ANALYTICS-GUIDE.md](./analytics/CLARITY-ANALYTICS-GUIDE.md)

3. **Testar implementação:**
   - Use [testing/TESTING-CLARITY.md](./testing/TESTING-CLARITY.md)

### Para Análise de Dados

1. **Configurar dashboards:**
   - Consulte [analytics/CLARITY-ANALYTICS-GUIDE.md](./analytics/CLARITY-ANALYTICS-GUIDE.md)
   - Seção: "Análises Recomendadas"

2. **KPIs importantes:**
   - Form Open Rate
   - Step Completion Rate
   - Final Conversion Rate
   - CTA Click Rate

### Para Product Managers

1. **Documentação de produto:**
   - [project/prd.md](./project/prd.md) - PRD principal
   - [features/](./features/) - Features específicas

2. **Métricas de conversão:**
   - [analytics/CLARITY-ANALYTICS-GUIDE.md](./analytics/CLARITY-ANALYTICS-GUIDE.md)

---

## 📝 Contribuindo

Ao adicionar nova documentação:

1. **Escolha a pasta correta:**
   - `analytics/` - Ferramentas de análise e tracking
   - `testing/` - Testes e validação
   - `project/` - Documentação de produto/arquitetura
   - `features/` - Specs de features específicas

2. **Nomeie arquivos claramente:**
   - Use SCREAMING_CASE para guias principais
   - Use kebab-case para documentos auxiliares
   - Sempre em Markdown (.md)

3. **Atualize este README:**
   - Adicione link na seção apropriada

---

## 🔗 Links Úteis

### Ferramentas Externas
- [Clarity Dashboard](https://clarity.microsoft.com/projects/view/uscdlda0qf)
- [N8N Webhook](https://n8n.nlaconsultoria.com.br)

### Código Relacionado
- `/lib/clarity-events.ts` - Módulo de eventos Clarity
- `/components/lead-modal-wizard.tsx` - Formulário principal
- `/content/home.ts` - Conteúdo da landing page

---

**Última atualização:** 2025-12-27
**Mantido por:** Equipe de Desenvolvimento NLA
