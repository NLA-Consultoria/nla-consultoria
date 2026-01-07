# Design: Progressive Wizard with Express Features

**Data:** 2026-01-07
**Status:** Validado
**Objetivo:** Trazer features do formulário express (lp-2) para o wizard da home, melhorando conversão

---

## Contexto

Atualmente temos dois providers de formulário:
- **LeadModalExpressProvider** (lp-2): Progressive reveal, draft saving, webhooks parciais, tracking detalhado
- **LeadModalWizardProvider** (home): Formulário tradicional em 3 steps, sem features avançadas

Esta refatoração unifica os dois em um único provider com todas as features avançadas.

---

## 1. Arquitetura: Unificação dos Providers

### Estrutura
```typescript
type FormVariant = 'express' | 'wizard';

function LeadModalProvider({ children }: ProviderProps) {
  const pathname = usePathname();
  const variant: FormVariant = pathname?.startsWith("/lp-2") ? 'express' : 'wizard';

  // Features habilitadas para ambos:
  const useProgressiveReveal = true;
  const useDraftSaving = true;
  const usePartialWebhooks = true;
  const useConversationalUX = true;
  const useDetailedTracking = true;
}
```

### Benefícios
- Elimina duplicação de ~300 linhas
- Bugs fixados em um lugar só
- Facilita manutenção futura
- Permite toggle de features por variant se necessário

### Diferenças entre variants
- Microcopy pode variar levemente
- Ambos mantêm estrutura de 3 steps
- Ambos usam todas as features avançadas

---

## 2. Progressive Field Reveal

### Implementação
- Reutiliza hook `useFieldReveal` existente
- Cada step começa com 1 campo visível
- Campos aparecem progressivamente com debounce de 800ms
- Animações: fade-in + slide via Framer Motion
- Auto-scroll em mobile para campo revelado

### Flow por Step

**Step 1 (Contato):**
1. Nome (≥3 chars) → revela Phone
2. Phone (≥14 chars) → revela Email
3. Email (contém @) → habilita botão "Continuar"

**Step 2 (Empresa):**
1. Empresa (≥2 chars) → revela UF
2. UF selecionado → revela Cidade
3. Cidade selecionada → habilita botão "Continuar"

**Step 3 (Qualificação):**
1. Faturamento selecionado → revela "Já vendeu gov?"
2. SoldToGov respondido → revela Pain/Negócio
3. Pain preenchido (≥10 chars) → habilita botão "Enviar"

### Código reutilizado
- `useFieldReveal` hook
- `getNextField()`, `isLastFieldInStep()` de `field-reveal.ts`
- `AnimatePresence` do Framer Motion

---

## 3. Draft Saving no localStorage

### Estrutura do Draft
```typescript
{
  data: Draft,              // todos os campos
  lastStep: number,         // último step visitado
  sessionId: string,        // ID único da sessão
  webhooksSent: string[],   // campos que enviaram webhook
  timestamp: string         // quando foi salvo
}
```

### Comportamento
- **Auto-save:** A cada mudança de campo (debounced)
- **Recuperação:** Ao abrir modal, se draft < 24h
- **Limpeza:** Após envio sucesso ou draft > 24h
- **Chave:** `lead_draft_v2` (compartilhada com express)

### Recuperação Inteligente
- Draft no step 2 → abre direto no step 2
- Campos pré-populados
- Webhooks não reenviados (controle via `webhooksSent`)

### Validação
- Drafts > 24h descartados automaticamente
- Previne dados obsoletos

---

## 4. Webhooks Parciais

### Gatilhos de Envio (5 pontos críticos)

| Campo | Payload | Motivo |
|-------|---------|--------|
| **phone** | `{name, phone}` | Mínimo para remarketing WhatsApp |
| **email** | `{name, phone, email}` | Permite remarketing email + Custom Audiences |
| **city** | step 1 + step 2 completos | Qualificação geográfica |
| **billing** | tudo até aqui | Qualificação financeira |
| **soldToGov** | tudo menos pain | Lead QUALIFICADO (ready for sales) |

### Payload Structure
```typescript
{
  ...leadData,              // campos preenchidos até momento
  session_id: string,       // ID único sessão
  event_type: 'partial_lead',
  status: 'partial',
  field_completed: string,  // phone, email, city, billing, soldToGov
  step: string,             // contact, company, qualification
  source: 'nla-site' | 'lp-2',
  timestamp: ISO string
}
```

### Sistema de Retry
- 3 tentativas com backoff exponencial via `sendWebhookWithRetry()`
- Falhas salvas em localStorage via `saveFailedWebhook()`
- Retry automático ao reabrir modal via `retryFailedWebhooks()`

### Prevenção de Duplicatas
- `webhooksSent: Set<FieldName>` rastreia envios
- Salvo no localStorage com draft
- Nunca reenvia mesmo se usuário editar

### Validação
- `validatePayload()` garante campos obrigatórios preenchidos
- Nunca envia dados vazios/incompletos

---

## 5. UX Conversacional

### Labels como Perguntas

**Step 1:**
- ❌ "Nome" → ✅ "Qual é o seu nome completo?"
- ❌ "Telefone" → ✅ "Qual seu WhatsApp?"
- ❌ "E-mail" → ✅ "E seu melhor e-mail?"

**Step 2:**
- ❌ "Empresa" → ✅ "Qual o nome da empresa?"
- ❌ "UF" → ✅ "Em qual estado você atua?"
- ❌ "Cidade" → ✅ "E a cidade?"

**Step 3:**
- ❌ "Fatura mensal" → ✅ "Qual a faixa de faturamento mensal da empresa?"
- ❌ "Já vendeu para governo?" → ✅ "Sua empresa já vendeu para órgãos públicos?"
- ❌ "Maior dor hoje" → ✅ "Conte um pouco sobre o que sua empresa faz"

### Mensagens Contextuais

| Trigger | Mensagem |
|---------|----------|
| Nome preenchido | "Ótimo, [PrimeiroNome]! 👋" |
| Phone preenchido | "Usaremos para confirmar a reunião" |
| Email preenchido | "Você receberá materiais exclusivos e o link da reunião" |
| Empresa preenchida | "Não se preocupe, pode ser MEI ou CNPJ em andamento" |
| UF selecionado | "Temos consultores especializados em cada região" |
| SoldToGov = Sim | "Ótimo! Vamos te mostrar como escalar essas vendas" |
| SoldToGov = Não | "Perfeito! Vamos te ensinar do zero, sem complicação" |
| Pain typing | "Não precisa escrever muito... • 45/500 caracteres" |

### Títulos dos Steps
- Step 1: "Vamos agendar sua reunião estratégica"
- Step 2: "Agora sobre sua empresa"
- Step 3: "Última etapa! Vamos personalizar sua consultoria"

### Progress Indicator
- "Etapa 1 de 3 • Seus dados de contato"
- "Etapa 2 de 3 • Dados da empresa ✓"
- "Etapa 3 de 3 • Quase lá! 🎯"

---

## 6. Tracking e Eventos Meta Detalhados

### Eventos Clarity (Behavior Analytics)

| Evento | Quando | Uso |
|--------|--------|-----|
| `trackFormOpen()` | Modal aberto | Início do funil |
| `trackFieldFocus(field, step)` | Campo focado | Mapa de interação |
| `trackFieldRevealed(field, step)` | Campo revelado | Progressive reveal flow |
| `trackFieldCompleted(field, step)` | Campo preenchido | Progresso granular |
| `trackFormStepComplete(step)` | Step completo | Avanço no funil |
| `trackFormStepBack(step)` | Voltou step | Pontos de fricção |
| `trackFormAbandonment(step)` | Fechou sem completar | Drop-off points |
| `trackFormSubmitSuccess()` | Envio sucesso | Conversão final |
| `trackFormSubmitError(msg)` | Erro no envio | Debug issues |
| `trackLeadQualification({...})` | Tags qualificação | Segmentação Clarity |
| `identifyUser(email, {...})` | Após conversão | Liga sessão ao lead |

### Eventos Meta Pixel (Funnel Optimization)

| Evento | Tipo | Quando | Dados |
|--------|------|--------|-------|
| FormOpen | Custom | Modal aberto | - |
| StepStart_{name} | Custom | Início step | step number/name |
| StepComplete_{name} | Custom | Step completo | step number/name |
| PartialLead | Custom | Phone/email captured | value 50/100, userData |
| QualifiedLead | Custom | SoldToGov respondido | billing, govExp, userData |
| **CompleteRegistration** | Standard | Formulário completo | userData, billing, govExp, pain |
| **Lead** | Standard | Conversão final | userData, billing, govExp, pain |

### Advanced Matching (Server-side)

Todos eventos enviam `user_data` via Conversions API:
```typescript
{
  email: string,      // SHA-256 hash
  phone: string,      // SHA-256 hash, E.164 format
  firstName: string,  // split de fullName
  lastName: string,   // split de fullName
  city: string,
  state: string
}
```

**Benefícios:**
- Match rate 30% maior iOS 14+
- Melhor atribuição de conversões
- Custom Audiences mais precisos

### Funções Reutilizadas
- `splitFullName()` de `meta-tracking.ts`
- Todas `track*()` de `meta-tracking.ts`
- Todas `track*()` de `clarity-events.ts`

---

## Impacto Esperado

### Métricas de Conversão
- **+15-25%** lead capture rate (progressive reveal + webhooks parciais)
- **+10-15%** completion rate (draft saving + UX conversacional)
- **+30%** remarketing reach (webhooks parciais capturam phone/email antes)

### Qualidade de Dados
- **100%** dos leads qualificados capturados (mesmo abandonos)
- **Melhor segmentação** via tags Clarity (billing, govExp, uf)
- **Match rate maior** para Meta Ads (Advanced Matching)

### DX (Developer Experience)
- **-300 linhas** código duplicado
- **1 lugar** para manutenção de formulários
- **Consistência** entre home e lp-2

---

## Dependências Existentes

Tudo já existe no codebase, apenas precisa ser aplicado ao wizard:

- ✅ `useFieldReveal` hook (`hooks/useFieldReveal.ts`)
- ✅ `field-reveal.ts` lib
- ✅ `webhook-retry.ts` system
- ✅ `meta-tracking.ts` functions
- ✅ `clarity-events.ts` functions
- ✅ Framer Motion
- ✅ `use-debounce` package

---

## Próximos Passos

1. Criar branch isolada via git worktrees
2. Escrever plano de implementação detalhado
3. Refatorar `LeadModalProvider` unificado
4. Testar ambas variants (home + lp-2)
5. Commit e PR

---

**Validado por:** Murillo Alves
**Data validação:** 2026-01-07
