# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Next.js 14 (App Router) landing page for NLA Consultoria, focused on lead generation for government procurement consulting services. Built with TypeScript, Tailwind CSS, and minimal shadcn/ui components.

## Development Commands

```bash
# Install dependencies
npm i

# Development server (localhost:3000)
npm run dev

# Production build
npm run build

# Start production server on port 3000
npm start

# Lint
npm run lint

# Deploy automático no ambiente DEV (commit, push, aguarda build, trigger Easypanel, verifica)
npm run deploy:dev
npm run deploy:dev "mensagem de commit customizada"
npm run deploy:dev -- --fast --no-verify  # flags opcionais
```

## Environment Variables

Copy `.env.example` to `.env.local` and configure:

- `NEXT_PUBLIC_N8N_WEBHOOK_URL` — Lead form submission endpoint (required)
- `NEXT_PUBLIC_N8N_PARTIAL_WEBHOOK_URL` — Endpoint for partial lead submissions on /lp-2 (optional, express variant only)
- `NEXT_PUBLIC_AGENDA_URL` — Scheduling URL (Calendly/Cal.com) for post-submission redirect
- `NEXT_PUBLIC_WHATSAPP_URL` — WhatsApp fallback link
- `NEXT_PUBLIC_GTM_ID` — Google Tag Manager (optional)
- `NEXT_PUBLIC_POSTHOG_KEY` — PostHog analytics (alternative to GTM)
- `NEXT_PUBLIC_CLARITY_ID` — Microsoft Clarity project ID for behavior analytics
- `NEXT_PUBLIC_SITE_URL` — Public site URL for canonical/OG tags
- `NEXT_PUBLIC_META_PIXEL_ID` — Meta (Facebook) Pixel ID
- `META_PIXEL_ACCESS_TOKEN` — Server-side access token for Meta Conversions API
- `META_PIXEL_TEST_EVENT_CODE` — Test event code for Meta Pixel debugging

**Important**: `NEXT_PUBLIC_*` variables are embedded at build time. Environment changes require rebuilding the Docker image.

## Architecture

### Directory Structure

- `app/` — Next.js App Router pages and API routes
  - `layout.tsx` — Root layout with SEO metadata, analytics scripts (GTM/PostHog/Meta Pixel), JSON-LD structured data
  - `page.tsx` — Home page composition
  - `api/meta-events/route.ts` — Server-side Meta Conversions API endpoint
- `components/` — React components (all sections of the landing page)
  - `lead-modal-wizard.tsx` — Multi-step lead capture form with context provider
  - `ui/` — shadcn/ui base components (Button, Dialog, Input, Label, Switch, Textarea)
- `content/home.ts` — All landing page copy (centralized content management)
- `lib/` — Utilities and configuration
  - `env.ts` — Environment variable access
  - `validators.ts` — Zod schema for lead form validation
  - `meta-conversions.ts` — Meta Conversions API client (server-side)
  - `trackMetaEvent.ts` — Client-side Meta Pixel event tracking
  - `seo.ts` — SEO metadata and JSON-LD generators

### Key Patterns

**Content Management**: All user-facing text lives in `content/home.ts`. Edit this file to change copy without touching components.

**Lead Flow**:
1. User clicks any CTA → Opens modal via `LeadModalProvider` context
2. Multi-step form validates with Zod (`lib/validators.ts`)
3. On submit: POST to `NEXT_PUBLIC_N8N_WEBHOOK_URL` (client-side)
4. Success → Redirect to `NEXT_PUBLIC_AGENDA_URL` or open `NEXT_PUBLIC_WHATSAPP_URL`
5. Meta Pixel events tracked client-side (`trackMetaEvent.ts`) and server-side via `/api/meta-events`

**Express Variant (/lp-2)**:
- Uses 4-step progressive disclosure modal to reduce friction
- Saves draft to localStorage (key: `lead_draft_v2`) for recovery
- Sends partial webhooks after each step completion to `NEXT_PUBLIC_N8N_PARTIAL_WEBHOOK_URL`
- Partial webhooks include `status: "partial"` and `step: number` for funnel tracking
- Only sends each step once (tracked via `lastPartialStep` in localStorage)
- Final submit uses same `NEXT_PUBLIC_N8N_WEBHOOK_URL` as standard variant

**Analytics Stack**:
- Meta Pixel injected in `layout.tsx` with deduplication check (`window.__META_PIXEL_LOADED`)
- GTM or PostHog loaded conditionally based on env vars
- Microsoft Clarity for behavior analytics (heatmaps, session recordings)
  - Custom events tracking: CTA clicks, form interactions, conversions
  - Session tagging: lead qualification, conversion status, user behavior
  - User identification: links Clarity sessions to converted leads
- Meta Conversions API used for server-side event tracking (better iOS14+ tracking)

**Clarity Event Tracking** (`lib/clarity-events.ts`):
- **CTA Events**: Tracks all CTA clicks by location (hero, header, why_section, how_section, final_cta)
- **Form Funnel**: Tracks form_opened, step completions, step backs, abandonments, submit success/error
- **Lead Qualification**: Tags sessions with billing range, gov experience, state
- **User Identification**: Associates Clarity sessions with email/company after conversion
- All events designed to identify conversion friction points and optimize funnel

**Styling**: Tailwind CSS with custom config in `tailwind.config.ts`. Theme switching removed (light theme only, controlled via `theme-init` script in layout).

**Forms**:
- Phone field uses mask: `(00) 00000-0000` (validated with regex in `validators.ts`)
- UF/City uses IBGE API for dynamic city loading based on selected state
- All fields validated with Zod before submission

### Path Aliases

TypeScript configured with `@/*` alias pointing to root (see `tsconfig.json`):
```typescript
import { content } from "@/content/home";
import { env } from "@/lib/env";
```

## Logging

**Custom Startup Script** (`scripts/start.js`):
- Shows environment info (DEV/PROD), git version, commit SHA, and date
- Displays configuration summary when `LOG_LEVEL=debug`
- Supports log levels: `debug | info | warn | error`

**Log Levels**:
- `debug` — Full logs with environment configuration (recommended for DEV)
- `info` — Basic startup information (recommended for PROD)
- `warn` — Warnings and errors only
- `error` — Errors only

**Configuration**:
```bash
# .env.local or docker-compose
LOG_LEVEL=debug  # or info, warn, error
```

The startup script runs before Next.js and shows:
- Environment (PRODUCTION/DEVELOPMENT)
- Version from package.json
- Git branch, commit SHA, and date
- Node version
- Analytics/webhook configuration status

## Deployment

**Docker**: Dockerfile uses Next.js standalone output mode (`next.config.mjs`).

**Environments**:
- **Production** (`deploy/stack-easypanel.yml`): Port 80:3000, `LOG_LEVEL=info`
- **Development** (`deploy/stack-dev.yml`): Port 8081:3000, `LOG_LEVEL=debug`

**Environment Variables**:
- Build-time: `NEXT_PUBLIC_*` variables (require rebuild to change)
- Runtime: `LOG_LEVEL`, `META_PIXEL_*` (can change without rebuild)

## Important Notes

- No pricing/plans section on landing page
- All CTAs open the same lead modal
- LGPD notice displayed below form submit button
- Cookie consent banner included (`cookie-consent.tsx`)
- Lighthouse target: 90+ (SEO, Performance, Accessibility)
- App Router only (no Pages Router)
- React 18 with Server Components where applicable
