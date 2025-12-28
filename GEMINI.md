# NLA Consultoria - Landing Page Project Context

## Project Overview
This project is a high-conversion landing page for **NLA Consultoria**, a consultancy firm helping businesses sell to the public sector (B2G).
It is built with **Next.js (App Router)**, **TypeScript**, and **Tailwind CSS**, featuring a clean, accessible design with dark mode support.
The primary goal is lead generation through a 3-step modal wizard that integrates with N8N webhooks.

## Architecture & Tech Stack
- **Framework:** Next.js 14.2.5 (App Router)
- **Language:** TypeScript 5.4+
- **Styling:** Tailwind CSS 3.4+ (using HSL CSS variables for theming)
- **UI Library:** Shadcn UI (built on Radix UI) + Lucide React icons
- **Form Handling:** React State + Zod validation
- **Deployment:** Docker (multi-stage build), Easypanel (via `deploy/stack-easypanel.yml`)

## Key Directories
- **`app/`**: Application routes and layouts (App Router structure).
- **`components/`**: Reusable UI components.
  - **`components/ui/`**: Low-level Shadcn UI primitives (Button, Dialog, Input, etc.).
- **`content/`**: Centralized static content.
  - **`home.ts`**: Contains all text copy for the landing page.
- **`docs/`**: Project documentation.
  - **`prd.md`**: Product Requirements Document.
  - **`design.md`**: Design System specifications.
- **`lib/`**: Utility functions.
  - **`env.ts`**: Environment variable validation.
  - **`seo.ts`**: SEO configurations.
  - **`trackMetaEvent.ts`**: Meta/Facebook Pixel integration.
  - **`validators.ts`**: Zod schemas for form validation.

## Development Workflow

### Commands
- **Install Dependencies:** `npm install`
- **Start Development Server:** `npm run dev` (Runs on http://localhost:3000)
- **Build for Production:** `npm run build`
- **Start Production Server:** `npm run start`
- **Lint Code:** `npm run lint`

### Configuration
- **Environment Variables:** Managed via `.env.local` (see `.env.example`).
  - Key vars: `NEXT_PUBLIC_N8N_WEBHOOK_URL`, `NEXT_PUBLIC_AGENDA_URL`, `NEXT_PUBLIC_WHATSAPP_URL`.

## Key Features
1.  **Lead Modal Wizard:** A 3-step form capturing user details, validating via Zod, and submitting to an N8N webhook.
2.  **Theming:** Light/Dark mode toggle persisted in `localStorage`.
3.  **Analytics:** Built-in support for Meta Pixel, Google Tag Manager, and PostHog.
4.  **Content Management:** Copy is decoupled from components, residing in `content/home.ts` for easy updates without code changes.

## Design & Conventions
- **Typography:** Inter (primary), Libre Baskerville (accents/logo).
- **Colors:** Defined in `app/globals.css` using HSL variables.
- **Accessibility:** Focus on AA contrast, visible focus states, and keyboard navigation.
- **Code Style:** Functional React components, strict TypeScript typing, Tailwind utility classes for styling.

## Integration Details
- **Form Submission:** POST request to `NEXT_PUBLIC_N8N_WEBHOOK_URL`.
- **Success Flow:** Redirects to `NEXT_PUBLIC_AGENDA_URL` or opens `NEXT_PUBLIC_WHATSAPP_URL`.
