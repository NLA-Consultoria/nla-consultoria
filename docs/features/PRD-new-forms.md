# PRD — New Lead Form Experience

## Overview
The current lead capture modal (`components/lead-modal.tsx`) collects all fields in a single scroll. Users face a long cognitive load, city dropdown depends on IBGE latency, and there is no feedback besides a native browser error. This PRD defines the improvements required for a higher-converting, insight-rich form that still posts to the existing n8n webhook.

## Goals & Success Metrics
- Increase lead conversion rate on the modal submission step by 15%.
- Reduce form abandonment before step 2 by providing granular progress cues.
- Capture structured signal on readiness (ICP fit, budget range) and sync it to analytics events (GTM/PostHog) with at least 95% tracking coverage.

## Key User Stories
1. As a prospect, I want a concise multi-step experience so I can focus on a few fields at a time and understand my progress.
2. As a marketer, I want to know which fields cause fall-off so I can optimize campaigns and copy.
3. As SDR/CS, I need complete, validated contact data (phone, UF, city) to follow up without manual cleanup.

## Functional Requirements
1. **Stepper layout**: Split into 3 steps (Contato, Empresa, Potencial), each screen showing 2–3 inputs max, with a sticky progress bar and “voltar/avançar” buttons. Persist partial data via component state to avoid losing info when navigating.
2. **Smart validation**: Reuse `lib/validators.ts` but surface inline helper text for each field. Show masked errors for phone/UF instantly; disable “Avançar” until step schema passes.
3. **Location UX**: Replace dropdown-only city selection with a searchable combobox fed by the IBGE API. Cache responses per UF during a session and expose a manual text fallback if the API fails.
4. **Calendar CTA**: After success, confirm via modal plus CTA buttons to `NEXT_PUBLIC_AGENDA_URL` and WhatsApp fallback. Auto-close and deep-link to agenda in a new tab.
5. **Analytics hooks**: Fire GTM/PostHog events for `lead_step_view`, `lead_step_error`, and `lead_submit` with payload `{step, field, errorType}`. Respect `NEXT_PUBLIC_POSTHOG_KEY` toggles already used in layouts.
6. **Enrichment questions**: Add optional checkboxes for “Segmento principal” (Licitações, Serviços gerais, Obras) and a slider/selector for “Urgência” (Imediata, Próximo mês, Explorando). Persist them in the payload.
7. **Accessibility**: Maintain keyboard navigation, ARIA labels for stepper, 44px touch targets, and focus traps inside the modal.

## Non-Goals
- Replacing the backend webhook or CRM sync.
- Building a standalone landing page for the form.
- Implementing authentication or file uploads.

## Dependencies & Open Questions
- Confirm final endpoint: keep hardcoded webhook or move to `env.NEXT_PUBLIC_N8N_WEBHOOK`.
- Need UX approval on new optional questions and copy (collaborate with marketing).
- Determine analytics schema owner to map new events inside GTM/PostHog.
