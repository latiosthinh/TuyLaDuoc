# Phase 1: Foundation, Database & Seed Data - Context

**Gathered:** 2026-09-13
**Status:** Ready for planning

<domain>
## Phase Boundary

Establish the Next.js 16 app structure, database connection with Turso and Drizzle ORM, ported dish dataset from original open-source repo, and root public layout with Be Vietnam Pro typography and source attribution.

</domain>

<decisions>
## Implementation Decisions

### Project Scaffolding & Shell
- Light-first with clean minimal aesthetic; subtle neutral tones.
- Header with text logo "Trưa Nay Ăn Gì" + badge + quick navigation link to Kho tiếp tế (`/dishes`).
- Dual-mode database configuration: `file:local.db` fallback when `TURSO_DATABASE_URL` is unset, Turso cloud when set.
- Seed data sourced from bundled snapshot ported from `truanayangi-com/truanayangi` with live fetch fallback.

### Database Schema & Entity Design
- Category slug + diet tags as JSON array (`["chay", "healthy"]`).
- Price stored as integer VND (e.g. `50000`) — exact amounts without float precision issues.
- Rarity tiers stored as 5 string codes (`QUOC_DAN`, `HIEM`, `CUC_PHAM`, `TOI_MAT`, `DAC_BIET`) with display helpers.
- Global counter table: key-value `counters (key PRIMARY KEY, value INTEGER)` with atomic SQL increment capability.

### Typography & Public Layout Shell
- `next/font/google` Be Vietnam Pro (variable weight 400..700), self-hosted at build time with `subsets: ["vietnamese", "latin"]`.
- Centered `max-w-4xl` container layout, clean minimal spacing, mobile-first responsive design.
- Subtle footer credit: "Nguồn dữ liệu & Cảm hứng: truanayangi.com" with links to original project and legal pages.
- Package manager: `pnpm` with clear scripts (`dev`, `build`, `start`, `lint`, `db:generate`, `db:push`, `db:seed`).

### the agent's Discretion
- Exact styling details of empty states and base card borders.
- Minor utility helper function signatures.

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- Greenfield repository. All assets will be scaffolded in this phase.

### Established Patterns
- Next.js 16 App Router with React 19.
- Tailwind CSS v4 CSS-first configuration (`@import "tailwindcss"; @theme` in `globals.css`).
- Drizzle ORM 0.45.2 with `@libsql/client` 0.18.0.

### Integration Points
- Root layout `app/layout.tsx` embeds font and global shell.
- Public route group `app/(public)/layout.tsx` provides header, container, and footer.
- Database module `db/index.ts` and `db/schema.ts`.
- Seed script `scripts/seed.ts`.

</code_context>

<specifics>
## Specific Ideas
- Ensure Vietnamese diacritics render crisply without clipping on any device.
- Keep local developer setup effortless: `pnpm install && pnpm db:seed && pnpm dev` works immediately without requiring Turso cloud account.

</specifics>

<deferred>
## Deferred Ideas
None — discussion stayed within Phase 1 scope.

</deferred>
