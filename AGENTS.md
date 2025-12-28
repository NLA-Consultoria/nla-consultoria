# Repository Guidelines

## Project Structure & Module Organization
`app/` hosts the App Router routes, layouts, and metadata; keep new screens scoped to nested folders that mirror the navigation. Shared UI primitives live in `components/` (PascalCase filenames, colocated styles). Landing copy is centralized in `content/home.ts` so copy updates never touch JSX. Reusable utilities (formatters, Zod schemas, API helpers) belong in `lib/`. Static assets stay under `public/`, while marketing collateral or specs go to `docs/`. Deployment assets (Dockerfile, CI configs) live inside `deploy/` or the repo root.

## Build, Test, and Development Commands
- `npm install` — install Node 18+ dependencies.
- `npm run dev` — launch Next.js with hot reload at `http://localhost:3000`.
- `npm run lint` — run `next lint` (ESLint + TypeScript) and fail CI on errors.
- `npm run build` — create the production bundle; validates type safety.
- `npm start` — serve the build (useful for smoke tests before deploy).

## Coding Style & Naming Conventions
Write idiomatic TypeScript with ES modules, 2-space indentation, and `async/await`. Favor server components unless client interactivity is required; annotate `"use client"` blocks explicitly. Components and hooks use PascalCase, utility functions camelCase, and constants SCREAMING_SNAKE_CASE. Compose styles with Tailwind utility classes and consolidate complex variants via `class-variance-authority`; avoid ad-hoc CSS files. Keep props minimal and validated via Zod schemas when data crosses component boundaries.

## Testing Guidelines
Automated tests are not yet formalized; when adding them, colocate unit tests next to the component or under `app/__tests__/` using Vitest or Jest. Regardless of automation, verify form flows manually: submit with valid/invalid payloads, confirm GTM/PostHog snippets toggle via env vars, and inspect Lighthouse accessibility checks. Document any new test command inside `package.json` and update this guide.

## Commit & Pull Request Guidelines
Commits follow short, action-oriented messages (see `git log`: “Alt visuais”, “Correção de bugs build”). Use present tense, keep under ~70 characters, and group related changes per commit. Pull requests should describe the user impact, outline testing performed (`npm run lint`, `npm run build`, manual QA), and link tracking issues. Include screenshots or GIFs for UI tweaks, and flag any env var or content changes so reviewers can validate staging configs.

## Security & Configuration Tips
Never commit `.env.local`. Start from `.env.example`, populate `NEXT_PUBLIC_*` URLs, and document any backend webhook changes. Review third-party embeds before enabling them and ensure consent/banner text stays aligned with LGPD requirements stored in `content/home.ts`.
