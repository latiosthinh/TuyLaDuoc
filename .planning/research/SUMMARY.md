# Project Research Summary

**Project:** Trưa Nay Ăn Gì
**Domain:** Vietnamese lunch-picker web app with Admin CMS
**Researched:** 2026-09-13
**Confidence:** HIGH

## Executive Summary

"Trưa Nay Ăn Gì" is a high-polish replication and modernization of the popular Vietnamese lunch roulette tool (truanayangi.com / open-source repo). While the original is a zero-backend Vite/cookie app focused on a gacha-style lootbox experience, this version elevates the concept into a modern, aesthetic food-app experience built on latest Next.js 16 (App Router), React 19, Tailwind CSS v4, and Motion animations.

Crucially, it replaces hardcoded data with an administrative CMS backed by Turso (libSQL) and Drizzle ORM, protected by Better Auth email/password authentication. The public experience remains completely frictionless and anonymous: visitors filter by meal category and budget, pick their preferred visual animation mode (Roulette Wheel, Card Shuffle & Flip, Slot Reel, or Random "Ngẫu hứng" mode), spin for a lunch idea, and can curate custom dish lists in browser localStorage.

Key risks include animation frame drops on mobile devices, serverless counter race conditions, hydration mismatches from client-side randomizers, and font clipping on Vietnamese diacritics. These have clear, established architectural mitigations (composite-only transforms, atomic SQL increments, client-only random execution, and Be Vietnam Pro font integration).

## Key Findings

### Recommended Stack

From `STACK.md`:
- **Core:** Next.js 16.3.5 (App Router, Turbopack) + React 19.3.0 + Tailwind CSS 4.3.3 (CSS-first v4 `@theme`).
- **Database & ORM:** Turso (@libsql/client 0.18.0) + Drizzle ORM 0.45.2. Native libSQL, edge-ready, serverless-friendly. Neon Postgres as fallback if needed.
- **Admin Auth:** Better Auth 1.7.4 with Drizzle adapter and Admin plugin (email + password credentials).
- **Animation:** Motion 13.2.0 (DOM/SVG GPU-accelerated springs, no canvas needed).
- **Typography:** `next/font/google` Be Vietnam Pro (native Vietnamese diacritics support, self-hosted at build time).
- **Storage:** Vercel Blob 2.8.0 for admin dish photo uploads.
- **Admin UI:** shadcn/ui CLI 4.21.0 primitives for CMS views only.

### Expected Features

From `FEATURES.md`:
- **Table Stakes:** Random dish spin with category and budget filters, dish result card with price & subtitle, re-spin, dish library grid (`/dishes`), anonymous localStorage custom lists, global spin counter, admin dish CRUD, admin category management, responsive mobile layout.
- **Differentiators:** 4 switchable picker presentation modes (Roulette, Card Shuffle, Slot Reel, Random per spin), clean minimal food app aesthetic (away from noisy gacha), Quẻ trưa (daily lunch fortune slip), Duyên vị & Khui vị discovery pages, full CMS control over copy, fortunes, and default picker mode.
- **Anti-Features:** Mandatory visitor accounts, complex WebSockets multiplayer, food delivery checkout integration, loud intrusive lootbox gacha SFX.

### Architecture Approach

From `ARCHITECTURE.md`:
- **Route Group Isolation:** `(public)` layout optimized for speed and zero-friction vs `(admin)` layout with shadcn UI and Better Auth session guards.
- **Unified Picker Interface:** `PickerModeProps` abstraction separating decision logic from visual presentation components.
- **Atomic Concurrency:** Dedicated atomic SQL statement (`sql\`${counters.value} + 1\``) for the global spin counter.
- **Cached Public Reads:** `unstable_cache` with tag-based revalidation (`revalidateTag('dishes')`) on admin mutations.

### Critical Pitfalls

From `PITFALLS.md`:
1. **Hydration Mismatch:** Never compute initial random dish during SSR; compute exclusively client-side on spin interaction.
2. **Bot/Prefetch Counter Inflation:** Spin counter must only increment via explicit POST Server Action triggered by user click, never on GET or page load.
3. **Turso Connection Mode:** Use HTTPS protocol URLs on Vercel Serverless Functions, avoiding WebSocket protocol locks.
4. **Animation Jank:** Strictly animate CSS `transform` and `opacity` with hardware acceleration to guarantee 60fps on mobile.
5. **Server Action Security:** Validate Better Auth session inside every admin Server Action, not just in route middleware.
6. **Data Attribution:** Maintain `ATTRIBUTION.md` and display a clear footer credit to `truanayangi.com`.

## Implications for Roadmap

Suggested phase structure for roadmap derivation:

### Phase 1: Foundation, Database & Data Seeding
**Delivers:** Next.js 16 + Tailwind v4 + Be Vietnam Pro setup; Turso database connection via Drizzle ORM; schema for dishes, categories, settings, counters; runnable seed script porting the full dataset from `truanayangi-com/truanayangi`; basic public layout with footer attribution.
**Avoids:** Unseeded empty state; Turso connection pitfalls; font diacritic issues.

### Phase 2: Core Public Experience & Spin Engine
**Delivers:** Public homepage with category tabs (Món chính, Đồ uống, Ăn vặt, Món nhậu) and budget filter; spin randomizer engine; dish result card with subtle rarity tags; atomic global spin counter ("Lượt quay toàn trạm"); dish library page (`/dishes`).
**Avoids:** Hydration mismatch; bot prefetch counter inflation; heavy DB load per spin.

### Phase 3: 4 Animated Picker Modes & Visual Polish
**Delivers:** The 4 swappable picker presentation modes (Roulette Wheel, Card Shuffle + Flip, Slot Machine Reel, and "Ngẫu hứng" randomizer); user mode switcher; smooth Motion animations; responsive mobile polish; clean minimal redesign styling.
**Avoids:** Animation jank on mobile; layout thrashing.

### Phase 4: Local Personalization & Fun Extras
**Delivers:** LocalStorage custom dish lists ("Hòm của tôi"); Quẻ trưa (daily lunch fortune card); Duyên vị & Khui vị pages; privacy & terms pages.
**Avoids:** Visitor auth friction; unconstrained localStorage quota.

### Phase 5: Admin CMS & Content Management
**Delivers:** Better Auth email/password login at `/admin/login`; admin dashboard with spin statistics; dish CRUD with photo upload (Vercel Blob); category & filter tab management; site content & fortune editor; default picker mode configuration.
**Avoids:** Unprotected Server Actions; admin session leaks.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All package versions registry-verified on 2026-09-13. |
| Features | HIGH | Original repo and production site analyzed in detail. |
| Architecture | HIGH | Standard Next.js 16 App Router patterns with clean route grouping. |
| Pitfalls | HIGH | Specific gotchas identified for Turso, Vercel, and Next.js 16. |

**Overall confidence:** HIGH

---
*Research completed: 2026-09-13*
*Ready for roadmap: yes*
