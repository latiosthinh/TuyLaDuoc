<!-- GSD:project-start source:PROJECT.md -->
## Project

**Trưa Nay Ăn Gì**

A Vietnamese lunch-picker web app replicating truanayangi.com: visitors filter by category and budget, spin to get a random dish suggestion, browse the dish library, and save personal lists in their browser — no login. Rebuilt from the original open-source Vite app on latest Next.js + Tailwind with a fresh, clean minimal redesign, richer animations, and an admin CMS that owns all dish data and site content.

**Core Value:** A visitor can decide "trưa nay ăn gì" in seconds — one satisfying spin returns a real dish suggestion filtered by their budget and category.

### Constraints

- **Tech stack**: Latest Next.js (App Router) + Tailwind CSS v4; all dependencies at latest stable versions — user explicitly requested
- **Hosting**: Vercel
- **Database**: Turso (libSQL) preferred; Neon Postgres if Turso blocks anything
- **Auth**: email/password for admin only; visitors never authenticate
- **Language**: Vietnamese-only UI (public + admin can be Vietnamese)
- **User data**: localStorage/cookies only for visitor preferences and custom lists
- **Budget**: free/cheap tiers (Vercel Hobby, Turso free tier) implied by project nature
<!-- GSD:project-end -->

<!-- GSD:stack-start source:research/STACK.md -->
## Technology Stack

## Recommended Stack
### Core Technologies
| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| next | **16.3.5** | Framework (App Router, RSC, API routes) | Current `latest` dist-tag (verified). Requires Node >=20.9. Peer-accepts React 19. Deploy-native on Vercel. Turbopack default. |
| react / react-dom | **19.3.0** | UI runtime | Matches Next 16 peer range; 19.3.0 is `latest` (verified). |
| typescript | **5.9.3** (pin) | Type checking | Deliberate deviation from "latest": npm `latest` is **7.0.2** (native Go rewrite, verified). Ecosystem (typescript-eslint 8.70, drizzle-kit devdeps, Next docs) still centers on 5.x. 5.9.3 = newest 5.x (verified). Revisit TS 7 in a later milestone when eslint tooling certifies it. See "What NOT to Use". |
| tailwindcss + @tailwindcss/postcss | **4.3.3** | Styling | v4 CSS-first: no `tailwind.config.js` — theme lives in `globals.css` via `@theme` / `@import "tailwindcss"`. PostCSS plugin wired in `postcss.config.mjs`. Verified latest. |
| drizzle-orm | **0.45.2** | ORM | First-class `drizzle-orm/libsql` entrypoint; SQL-like, zero runtime overhead, edge-safe. Verified latest `stable` (1.x is still rc — Better Auth's peer range `^0.45.2 || >=1.0.0-rc.1 <2.0.0` confirms 0.45.2 is the ecosystem-current stable). Peer needs `@libsql/client >=0.10.0` ✓. |
| @libsql/client | **0.18.0** | Turso driver | Official Turso TS driver. Verified. Registry `exports` map ships edge/workerd builds (`lib-esm/web.js`) → same code runs in Node and Edge runtimes. |
| drizzle-kit | **0.31.10** | Migrations CLI | Verified; satisfies Better Auth peer `>=0.31.4`. |
| better-auth | **1.7.4** | Admin email/password auth + sessions | **Recommendation over Auth.js.** Stable 1.x; peer deps verified: `next ^14||^15||^16` ✓, drizzle adapter built in (`better-auth/adapters/drizzle`), `better-auth/plugins/admin` for role gating. One lib covers credentials + session cookies + admin plugin. |
| motion | **13.2.0** | Animation (all 4 spin modes, reveals, page transitions) | The `motion` package (ex-framer-motion, same team). Peer `react ^18||^19` ✓ verified. Springs + `animate()` + `AnimatePresence` cover wheel spin, card flip, slot reel. DOM/SVG, GPU-composited transforms — no canvas needed (see below). |
| zod | **4.6.4** | Validation (admin forms, API boundaries) | Verified latest. Better Auth 1.7.4 already depends on `zod ^4.5.4` → one version, no conflict. |
| @vercel/blob | **2.8.0** | Dish photo storage | Verified. Same Vercel account/dashboard, no third-party signup. Hobby plan includes **1GB/month storage** + operation/transfer allotments (verified on vercel.com/docs/pricing today). A few hundred dish photos ≈ tens of MB → fits free budget with huge headroom. Serves via Vercel CDN; pairs with `next/image`. |
| pnpm | **12.4.1** | Package manager | Verified latest. Original repo uses pnpm; fast, strict node_modules. |
### Supporting Libraries
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| shadcn (CLI) | **4.21.0** | Admin CMS component kit (copy-in components) | Verified. For `/admin` only: tables, forms, dialogs, dropdowns. CLI 4.x targets Tailwind v4 + React 19 (run `pnpm dlx shadcn@latest init` and confirm it detects TW4; MEDIUM-HIGH on auto-detect — verify at scaffold). Public visitor pages: hand-rolled Tailwind, no shadcn look. |
| radix-ui | **1.6.7** | Headless primitives (pulled in by shadcn) | Verified. Don't install manually — shadcn CLI adds what it needs. |
| lucide-react | **1.45.0** | Icons | Verified. shadcn default icon set; admin + minimal public icons. |
| tw-animate-css | **1.4.0** | Tailwind v4 animation utilities (shadcn convention) | Verified. Replaces deprecated `tailwindcss-animate` on TW4. |
| tailwind-merge + clsx | **3.7.0 / 2.1.1** | Class composition (`cn()` helper) | Verified. Standard shadcn utility. |
| tsx | **4.23.13** | Run seed script (`scripts/seed.ts`) porting original dataset | Verified. Use `tsx --env-file=.env scripts/seed.ts` (Node >=20 native env-file; no dotenv dep). |
| @vercel/analytics + @vercel/speed-insights | **2.0.1 / 2.0.0** | Optional usage stats for admin dashboard | Verified. Free-tier friendly; complements the DB spin counter. Skip if "basic usage stats" = spin count only. |
| @fontsource/* | — | **Not needed** | Use `next/font/google` instead (below). |
### Fonts (Vietnamese diacritics)
- Primary: **Be Vietnam Pro** (variable) — designed for Vietnamese, full diacritic set (` subsets: ["vietnamese", "latin"]`), clean minimal food-app feel.
- Use it for BOTH headline and body via variable weight axis — one font, no fallback-brand mismatch. Numbers/prices render well.
- `next/font` self-hosts font files at build time → no runtime requests to `fonts.googleapis.com` (which is slow/unreliable from Vietnam). Real perf win for the target audience.
- Inter is an acceptable alternative but Be Vietnam Pro is purpose-built for `ă â ê ô ơ ư đ` + tone marks.
### Development Tools
| Tool | Version | Purpose | Notes |
|------|---------|---------|-------|
| vitest | **5.0.0** | Unit tests (spin selection logic, filters, budget tiers) | Verified. Next 16 works out of the box (SWC transform via plugin-react). |
| @vitejs/plugin-react | **6.1.1** | React transform for Vitest | Verified. |
| @testing-library/react | **16.3.3** | Component tests | Verified. |
| jsdom | **30.0.1** | DOM env for Vitest | Verified. |
| @playwright/test | **1.63.0** | E2E (spin flows, admin CRUD, localStorage lists) | Verified. Next 16 peer-accepts `^1.51.1` ✓ (seen in next@16.3.5 registry metadata). |
| eslint + eslint-config-next + typescript-eslint | **10.10.0 / 16.3.5 / 8.70.0** | Lint | Verified. Next 16 uses ESLint flat config. |
| prettier | **3.9.6** | Format | Verified. |
| drizzle-kit | 0.31.10 | `generate` + `push` + `studio` | Also usable as DB GUI during CMS dev (`pnpm drizzle-kit studio`). |
## Animation Architecture (spin modes)
- **Result is computed server-side BEFORE animation.** The spin API route picks the winning dish (filtered by category+budget), increments the global counter (atomic `UPDATE ... SET spins = spins + 1` — single-row write, safe on Turso), returns the winner. The animation only *reveals* a predetermined outcome → lands on exact index, counter stays truthful, no client/server divergence.
- **Roulette wheel:** SVG wheel (one `<g>` per slice), Motion rotates the whole wheel with a spring or `ease: [0.15, 0.85, 0.25, 1]` to `360°*N + targetAngle`. GPU-composited transform; 8–20 slices is trivial for DOM.
- **Card shuffle + flip:** Motion `animate()` sequence (scatter → gather → `rotateY` flip with `transform-style: preserve-3d`). ~10 DOM elements.
- **Slot reel:** vertical strip of dish items in an `overflow-hidden` div, Motion `y`-translate with decelerating ease to the winning row; `AnimatePresence` for the result reveal.
- **Ngẫu hứng:** picks a mode server-side per spin; the three components share one `SpinStage` interface (`{ result, spin }`) so mode switching is a component swap.
- **Why not canvas:** canvas buys particle-count performance you don't need (dozens of elements, not thousands) and costs accessibility, text rendering (Vietnamese diacritics in canvas = manual font work), and SSR-friendliness. DOM/SVG keeps text crisp, a11y tree intact, Motion tooling applicable.
- **Why not GSAP (3.15.0, verified):** Motion covers every need here in React idiom (hooks, `AnimatePresence` for mount/unmount choreography, layout animations). Two animation libs = bundle bloat + idiom split. GSAP would only win for scrub-linked timelines (scroll-driven cinematic) — not this app. (GSAP core is free if ever needed — MEDIUM, not re-verified today.)
- Confetti/celebration on rare results: CSS-only keyframes or skip (gacha theatrics are Out of Scope per PROJECT.md).
## Database: Turso vs Neon Decision Guidance
| Metric | Free plan |
|--------|-----------|
| Databases | 100 |
| Storage | 5 GB |
| Rows read | 500M / month |
| Rows written | 10M / month |
| Syncs | 3 GB / month |
| Overage behavior | **Hard block** — exceeding ANY metric blocks the DBs until reset (paid plans can enable overages) |
- `PRAGMA user_version` is read-only → drizzle-kit is unaffected (it tracks migrations in its own `__drizzle_migrations` table), but don't hand-roll pragma-based versioning.
- `busy_timeout` / `journal_mode` pragmas: not supported (managed internally).
- Migration cost is LOW if you stay disciplined: Drizzle schema is dialect-swappable (`sqliteTable` → `pgTable`), queries are plain Drizzle. Keep raw SQL out of app code.
- Vietnamese text search: SQLite has no ICU tokenizer, but with ~a few hundred dishes, `LIKE '%...%'` (or client-side filter) is plenty — NOT a Neon trigger.
## Installation
# Scaffold (pulls matching latest automatically):
# Core runtime deps:
# Dev deps:
# Admin UI (interactive, adds only what's used):
# Optional stats:
## Alternatives Considered
| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| Drizzle 0.45.2 | Prisma | Prisma's npm `latest` is currently **8.0.0-rc.14** (an RC tagged latest — verified; unstable signal), libSQL support is second-class (driver adapters) vs Drizzle's native `libsql` dialect. Choose Prisma only if team already knows it deeply AND you switch to Neon Postgres. |
| Better Auth 1.7.4 | Auth.js (next-auth v5) | next-auth `latest` = 4.24.15 (v4, Pages-Router-era design); v5 = **5.0.0-beta.32** (verified dist-tags — still beta after years). Choose Auth.js only if you need its specific provider ecosystem and accept beta. For admin-only email/password, Better Auth is stable, has a built-in `admin` plugin + Drizzle adapter, and peer-supports Next 16 today. |
| Motion 13.2.0 | GSAP 3.15.0 | GSAP if you later add scroll-scrubbed cinematics or need its timeline ergonomics for a very complex slot-machine sequence. Not for v1. |
| Motion (DOM/SVG) | Canvas/PixiJS | Canvas only if you add heavy particle FX (thousands of sprites). Out of scope per PROJECT.md (no gacha theatrics). |
| Vercel Blob 2.8.0 | Cloudinary free tier | Cloudinary if you need on-the-fly transformations beyond `next/image` (which already does resize/webp/avif) or >1GB assets. Extra signup + external account for no gain here. |
| Vercel Blob | uploadthing 7.7.4 | Uploadthing if you move off Vercel or want its file-router pattern. Extra third-party service; Blob is native to the deploy target. |
| External image URLs in DB (no upload) | — | Actually viable for the seeded original dataset (keep original CDN URLs via `next/image` remotePatterns); add Blob uploads when admin needs to add NEW dishes with photos. Cheapest path: do both — URLs in the same `imageUrl` column. |
| shadcn/ui (admin only) | Full hand-roll | Hand-roll everything only if admin ends up <5 forms. shadcn saves real time on tables/forms and is copy-in (no runtime dep lock-in). |
| Turso | Neon Postgres | See decision guidance above. |
## What NOT to Use
| Avoid | Why | Use Instead |
|-------|-----|-------------|
| next-auth v4 (4.24.15) | `latest` tag but legacy: designed around Pages Router `/api/auth/[...next-auth]`, credentials provider has documented session-JWT caveats on App Router | Better Auth 1.7.4 |
| next-auth v5 beta (5.0.0-beta.32) | Years in beta; breaking changes between betas | Better Auth 1.7.4 |
| typescript 7.0.2 (current `latest`) | Native Go rewrite — very new; typescript-eslint/Next docs ecosystem not yet confirmed against it (MEDIUM confidence on friction, HIGH that it's latest) | Pin 5.9.3; re-evaluate next milestone |
| Tailwind v3 config style (`tailwind.config.ts`, `postcss` + `autoprefixer` + v3 plugin) | v4 is CSS-first; v3 config file is legacy path, slower builds, missing v4 container queries/`@theme` tokens | Tailwind 4.3.3 + `@tailwindcss/postcss` + `@theme` in CSS |
| `tailwindcss-animate` | Deprecated/unmaintained for TW4 | `tw-animate-css` 1.4.0 |
| Pages Router (`pages/`) | Next 16 momentum is App Router: RSC, server actions, route handlers; PROJECT.md mandates App Router | `app/` directory |
| `framer-motion` package | Renamed → `motion` (same maintainers); new features land in `motion` | `motion@13.2.0` |
| Prisma 8.0.0-rc.14 | RC masquerading as `latest` dist-tag; don't build on it | Drizzle 0.45.2 |
| dotenv | Node >=20 and Next 16 both load `.env` natively (`tsx --env-file`, Next auto-load) | Nothing — skip the dep |
| Redux/Zustand/React Query | State here = server data (RSC fetch + `revalidateTag`) + localStorage lists (a 30-line hook) | RSC + `useSyncExternalStore`-based localStorage hook if needed |
| Mongoose/MySQL/PlanetScale | Not the chosen DB path | Turso libSQL |
## Stack Patterns by Variant
- Cache the dish list + settings at the edge (`unstable_cache`/`revalidateTag`, or `force-static` for /dishes) so only spins write; optionally debounce counter writes (increment in-memory per serverless instance isn't reliable — keep 1 write/spin, it's cheap: 10M/mo).
- Because reads then approach zero and writes stay bounded by real spins.
- Consider Payload CMS 3 (Next-native, self-hosted, Drizzle-backed, supports libSQL? — verify dialect at that time; Postgres first-class) instead of hand-rolled shadcn admin.
- Because rebuilding tables/forms/roles by hand stops paying off past a certain size. Not v1.
- Keep all three modes as separate lazy-loaded dynamic imports (`next/dynamic`, `ssr: false` for the stage components) — only the chosen mode's code ships per interaction.
- Because each mode is self-contained; Motion tree-shakes per usage.
- Stay App Router + RSC (already chosen): server-rendered dish pages, `generateMetadata` per dish with admin-managed SEO fields, JSON-LD (`Recipe`/`Menu` schema). No extra deps.
## Version Compatibility
| Package A | Compatible With | Notes |
|-----------|-----------------|-------|
| next@16.3.5 | react@19.3.0, @playwright/test ^1.51.1, Node >=20.9 | All verified from registry metadata (peerDependencies/engines). |
| better-auth@1.7.4 | next ^14‖^15‖^16 ✓, drizzle-orm ^0.45.2 ✓, drizzle-kit >=0.31.4 ✓, zod ^4.5.4, react ^19 ✓ | Verified from its peerDependencies — the entire stack above sits inside its supported ranges. |
| drizzle-orm@0.45.2 | @libsql/client >=0.10.0 (we use 0.18.0 ✓) | Verified from peerDependencies. |
| motion@13.2.0 | react ^18‖^19 ✓, react-dom ^18‖^19 ✓ | Verified from peerDependencies. |
| tailwindcss@4.3.3 | @tailwindcss/postcss@4.3.3 (same-version lockstep), tw-animate-css 1.4.0, shadcn CLI 4.x | Verified same release train (postcss plugin deps on tailwindcss 4.3.3 exactly). |
| vitest@5.0.0 | @vitejs/plugin-react@6.1.1, @testing-library/react@16.3.3, jsdom@30.0.1 | Current release trains as of 2026-09-13 (registry-verified versions; combo is standard — MEDIUM-HIGH on exact interop, smoke-test at scaffold). |
| typescript@5.9.3 | typescript-eslint@8.70.0, drizzle-kit@0.31.10, eslint-config-next@16.3.5 | 5.x is the tested target of all three (drizzle-kit devdeps `typescript ^5.6.3` verified in registry metadata). |
| @libsql/client@0.18.0 | Next 16 Edge runtime | Registry exports map ships `edge-light`/`workerd` → `lib-esm/web.js` automatically (verified). |
## Sources
- `registry.npmjs.org` via `npm view <pkg> version` / `dist-tags` / `peerDependencies` / `engines` — HIGH — versions for: next (16.3.5 + dist-tags + peer/engines metadata), react, react-dom, typescript (dist-tags incl. 7.0.2 latest + 5.x range query → 5.9.3), tailwindcss, @tailwindcss/postcss, drizzle-orm (0.45.2 + peers), drizzle-kit (0.31.10), @libsql/client (0.18.0 + exports map), better-auth (1.7.4 + full peer/export metadata), next-auth (dist-tags: latest 4.24.15, beta 5.0.0-beta.32), prisma (latest = 8.0.0-rc.14), motion (13.2.0 + peers), gsap (3.15.0), zod, shadcn, radix-ui, lucide-react, tw-animate-css, tailwind-merge, clsx, tsx, @vercel/blob, uploadthing, @vercel/analytics, @vercel/speed-insights, vitest, @vitejs/plugin-react, @testing-library/react, jsdom, @playwright/test, pnpm (12.4.1), eslint, eslint-config-next, typescript-eslint, prettier, eslint-plugin-tailwindcss (4.4.0, optional), @types/react, @types/react-dom, @types/node.
- `https://docs.turso.tech/cloud/limitations.md` (Mintlify markdown) — HIGH — `user_version` read-only, `busy_timeout`/`journal_mode` unsupported.
- `https://turso.tech/pricing` (embedded schema.org JSON) — HIGH — free plan: 100 DBs, 5GB storage, 500M rows read/mo, 10M rows written/mo, 3GB syncs, 1-day PITR; hard block on quota exceed for free plan.
- `https://vercel.com/docs/pricing` — HIGH/MEDIUM — Blob on Hobby: 1GB/month storage included; simple ops "first 10,000", advanced ops "first 2,000", data transfer "first 10GB" allotments (table columns flattened in HTML; storage figure explicit, op allotments verify in dashboard before relying on exact numbers).
- `https://vercel.com/docs/storage/vercel-blob` — HIGH — Blob store scoping to Hobby team, put/del/list API, operations-billing model.
- next/font/google Vietnamese subset support — HIGH (stable Next feature; `Be Vietnam Pro` is a standard Google Font with `vietnamese` subset) — not separately fetched (webfetch proxy was down for non-registry domains beyond curl successes above).
- shadcn CLI 4.21.0 + Tailwind v4 + Next 16 init flow: MEDIUM-HIGH — verify at scaffold (first `init` run); CLI major version 4 aligns with TW4 era.
- GSAP "all plugins free" claim: MEDIUM (training data, not re-verified) — irrelevant since GSAP not recommended.
- Vitest 5 + Next 16 SWC interop specifics: MEDIUM-HIGH — standard combo, smoke-test at setup.
- Prisma 7.x stable line exists behind the rc `latest` tag — not investigated deeply (Drizzle chosen; Prisma not on the path).
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

Conventions not yet established. Will populate as patterns emerge during development.
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

Architecture not yet mapped. Follow existing patterns found in the codebase.
<!-- GSD:architecture-end -->

<!-- GSD:skills-start source:skills/ -->
## Project Skills

No project skills found. Add skills to any of: `.claude/skills/`, `.agents/skills/`, `.cursor/skills/`, `.github/skills/`, or `.codex/skills/` with a `SKILL.md` index file.
<!-- GSD:skills-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->



<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
