# Phase 2: Core Public Experience & Spin Engine - Context

**Gathered:** 2026-09-13
**Status:** Ready for planning

<domain>
## Phase Boundary

Deliver the primary lunch-picking loop: category tabs, budget selector, client-side randomizer, dish result card with subtle rarity tags, atomic global counter, and dish library page (`/dishes`).

</domain>

<decisions>
## Implementation Decisions

### Spin Interaction & Result Flow
- Spin button triggers client-side random selection from active filtered candidates.
- Preset budget chips (Tất cả, 30k, 50k, 70k, 100k+) for instant 1-tap filtering.
- Result card displays dish title, subtitle, formatted VND price, category, subtle rarity badge, "Quay lại" (re-spin), and "Tìm quán gần đây" (Google Maps search link).
- Empty state: clean inline helper card with reset button if zero dishes match filters.

### Global Spin Counter
- Server Action `recordSpin()` with atomic SQL `UPDATE counters SET value = value + 1` in Turso.
- Displayed prominently in hero badge: "Lượt quay toàn trạm: 12,481+" with live update.
- POST Server Action guarantees zero prefetch inflation.

### Dish Library Page (/dishes)
- Searchable, filterable responsive grid (1-3 cols).
- Live debounced text search, category tabs, and rarity badges.
- Next.js Image with fallback gradient placeholder.

### the agent's Discretion
- Autonomous execution mode locked per user instruction: proceed through all remaining phases without further questions.

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/db/index.ts` & `src/db/schema.ts` (dishes, categories, counters)
- `src/lib/utils.ts` (`formatVND`, `cn`)
- Header & Footer public shell

### Established Patterns
- Next.js 16 Server Actions and Server Components
- Tailwind v4 styling with Be Vietnam Pro font

</code_context>

<specifics>
## Specific Ideas
- Fully autonomous completion of Phase 2, Phase 3, Phase 4, Phase 5, and Milestone Lifecycle.

</specifics>

<deferred>
## Deferred Ideas
None.

</deferred>
