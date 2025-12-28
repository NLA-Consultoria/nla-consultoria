# Analytics

Documentação sobre implementação e uso de ferramentas de analytics para otimização de conversão.

## 📊 Ferramentas Implementadas

### Microsoft Clarity
Ferramenta de behavior analytics que permite visualizar sessões de usuários através de heatmaps e gravações de tela.

**Project ID:** `uscdlda0qf`
**Dashboard:** https://clarity.microsoft.com/projects/view/uscdlda0qf

---

## 📚 Documentação Disponível

### [CLARITY-ANALYTICS-GUIDE.md](./CLARITY-ANALYTICS-GUIDE.md)

Guia completo de 300+ linhas cobrindo:

#### 📍 Eventos Rastreados
- **CTA Clicks** (5 tipos): hero, header, why_section, how_section, final_cta
- **Form Funnel** (7 eventos): opened, steps completed, abandoned, submit
- **Session Tags** (10+ tags): comportamento, qualificação, progresso
- **User Identification**: email, nome, empresa

#### 📈 Análises Recomendadas
1. **Análise de Funil de Conversão** - Identificar onde usuários abandonam
2. **Comparação de CTAs** - Descobrir qual CTA converte mais
3. **Análise por Perfil de Lead** - Comportamento de diferentes segmentos
4. **Identificação de Bugs** - Encontrar erros técnicos
5. **Análise de Abandono** - Entender por que não convertem

#### 🎨 Heatmaps e Click Maps
- Scroll depth
- Rage clicks
- Elementos não-clicáveis que usuários tentam clicar

#### 📊 KPIs para Monitorar
- Form Open Rate
- Step Completion Rates
- Final Conversion Rate
- CTA Click Rate
- Error Rate

#### 🚀 Próximas Implementações
- Scroll depth tracking
- FAQ interaction tracking
- Exit intent detection
- Time on page segmentation

---

## 🎯 Início Rápido

### Para Analistas

1. **Acessar Dashboard:**
   ```
   https://clarity.microsoft.com/projects/view/uscdlda0qf
   ```

2. **Principais Análises:**
   - Dashboard → Funnels → Criar funil de conversão
   - Dashboard → Filters → Custom Events → Comparar CTAs
   - Dashboard → Filters → Custom Tags → Segmentar por perfil

3. **Primeiro Report:**
   - Seguir seção "Análises Recomendadas" do guia
   - Começar com "Análise de Funil de Conversão"

### Para Desenvolvedores

1. **Módulo de Eventos:**
   ```typescript
   // lib/clarity-events.ts
   import { trackCtaClick, trackFormOpen } from '@/lib/clarity-events';
   ```

2. **Adicionar Novo Evento:**
   ```typescript
   // 1. Adicionar função em clarity-events.ts
   export function trackNewEvent(data: string) {
     if (!isClarityAvailable()) return;
     window.clarity!('event', `new_event_${data}`);
   }

   // 2. Importar e usar no componente
   import { trackNewEvent } from '@/lib/clarity-events';

   function handleClick() {
     trackNewEvent('button_name');
   }
   ```

3. **Validar:**
   - Usar ferramentas em `/docs/testing/`
   - Console: `monitorClarityEvents()`

---

## 📖 Glossário

### Eventos
- **Event**: Ação específica do usuário (clicar, submeter, etc)
- **Tag**: Atributo da sessão para segmentação
- **Identify**: Associar sessão a usuário específico

### Métricas
- **Conversion Rate**: % de sessões que convertem
- **Drop-off Rate**: % que abandona em determinado step
- **Rage Click**: Cliques rápidos repetidos (frustração)
- **Dead Click**: Clique em elemento não-clicável

---

## 🔗 Links Relacionados

- **Código:** `/lib/clarity-events.ts`
- **Testes:** `/docs/testing/`
- **Componentes:** `/components/lead-modal-wizard.tsx`
- **Docs Oficiais:** https://learn.microsoft.com/en-us/clarity/

---

**Última atualização:** 2025-12-27
