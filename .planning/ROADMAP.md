# Roadmap: Trưa Nay Ăn Gì

## Overview

A structured 5-phase execution roadmap taking "Trưa Nay Ăn Gì" from an empty directory to a fully-deployed, production-grade Vietnamese lunch picker web app. The build path starts with foundation infrastructure and dataset seeding from the original repository, advances through the core public spin engine, elevates the UX with 4 swappable Motion picker modes, layers on browser-side personalization and fun fortune extras, and culminates in a complete Better Auth-protected administrative CMS.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

- [x] **Phase 1: Foundation, Database & Seed Data** - Bootstrap Next.js 16, Tailwind v4, Turso/Drizzle schema, ported dataset seed, and root layout with Be Vietnam Pro font.
- [x] **Phase 2: Core Public Experience & Spin Engine** - Public landing, category & budget filters, random selection engine, dish result card, atomic global spin counter, and `/dishes` library.
- [ ] **Phase 3: 4 Animated Picker Modes & Visual Redesign** - Implement Roulette Wheel, Card Shuffle + Flip, Slot Reel, and Ngẫu hứng modes with Motion and clean minimal styling.
- [ ] **Phase 4: Browser Personalization & Fun Extras** - Offline localStorage custom dish lists ("Hòm của tôi"), Quẻ trưa daily fortune card, Duyên vị, Khui vị, and static pages.
- [ ] **Phase 5: Admin CMS & Content Management** - Better Auth email/password login, dish/category CRUD with Vercel Blob image upload, fortune editor, and settings management.

## Phase Details

### Phase 1: Foundation, Database & Seed Data
**Goal**: Establish the Next.js 16 app structure, database connection with Turso and Drizzle ORM, ported dish dataset from original open-source repo, and root public layout.
**Depends on**: Nothing (first phase)
**Requirements**: DATA-01, DATA-02, DATA-03, EXTR-05
**Success Criteria** (what must be TRUE):
  1. Next.js 16 App Router runs cleanly with Tailwind CSS v4 and Be Vietnam Pro typography with zero diacritic clipping.
  2. Turso database connects via Drizzle ORM with tables for dishes, categories, site_settings, and counters.
  3. Runnable seed script successfully ports and seeds the full dish catalog from `truanayangi-com/truanayangi`.
  4. Public footer displays source attribution link to `truanayangi.com`.
**UI hint**: yes
**Plans**: 3 plans

Plans:
- [x] 01-01: Project scaffolding with Next.js 16, Tailwind v4, Be Vietnam Pro font, and basic public layout.
- [x] 01-02: Drizzle ORM schema definition for Turso (dishes, categories, fortunes, settings, counters).
- [x] 01-03: Dataset porting script from original repo and database seed execution.

### Phase 2: Core Public Experience & Spin Engine
**Goal**: Deliver the primary lunch-picking loop: category tabs, budget selector, client-side randomizer, dish result card with subtle rarity tags, atomic global counter, and dish library page.
**Depends on**: Phase 1
**Requirements**: SPIN-01, SPIN-02, SPIN-03, SPIN-04, SPIN-05, SPIN-06, DISH-01, DISH-02, DISH-03, DISH-04, DISH-05, STAT-01, STAT-02, STAT-03
**Success Criteria** (what must be TRUE):
  1. User can filter candidates by meal category tabs (Món chính, Đồ uống, Ăn vặt, Món nhậu) and budget tiers.
  2. Clicking spin triggers client-side random selection without SSR hydration errors.
  3. Result card clearly shows dish title, subtitle, formatted VND price, category, and subtle rarity badge.
  4. Global spin counter ("Lượt quay toàn trạm") increments atomically on the server on each user spin.
  5. User can visit `/dishes` to browse, search, and filter the complete dish library.
**UI hint**: yes
**Plans**: 3 plans

Plans:
- [x] 02-01: Spin engine with category tabs, budget slider/selector, and client-side randomizer logic.
- [x] 02-02: Dish result card component with subtle rarity badge and atomic global spin counter integration.
- [x] 02-03: Dish library page (`/dishes`) with search, filter tabs, and responsive grid display.

### Phase 3: 4 Animated Picker Modes & Visual Redesign
**Goal**: Build the 4 swappable picker presentation modes with Motion animations, user mode switcher, and clean minimal food-app redesign.
**Depends on**: Phase 2
**Requirements**: MODE-01, MODE-02, MODE-03, MODE-04, MODE-05, MODE-06, MODE-07, MODE-08
**Success Criteria** (what must be TRUE):
  1. User can view dish selection animated via Roulette Wheel with realistic deceleration physics.
  2. User can view dish selection animated via Card Shuffle & 3D Flip reveal.
  3. User can view dish selection animated via vertical Slot Machine Reel.
  4. User can pick "Ngẫu hứng" mode to randomly trigger one of the three visual modes per spin.
  5. User can switch modes at any time, with choice persisting in browser localStorage.
  6. All animations maintain 60fps on mobile devices and support `prefers-reduced-motion`.
**UI hint**: yes
**Plans**: 3 plans

Plans:
- [ ] 03-01: Unified picker interface and Roulette Wheel Motion component.
- [ ] 03-02: Card Shuffle & 3D Flip reveal component and Slot Machine Reel component.
- [ ] 03-03: Picker mode switcher bar, "Ngẫu hứng" coordinator, and localStorage persistence.

### Phase 4: Browser Personalization & Fun Extras
**Goal**: Enable anonymous user custom lists ("Hòm của tôi") in localStorage and deliver the redesigned minimal fun extras (Quẻ trưa, Duyên vị, Khui vị, and static info pages).
**Depends on**: Phase 3
**Requirements**: CUST-01, CUST-02, CUST-03, CUST-04, CUST-05, EXTR-01, EXTR-02, EXTR-03, EXTR-04
**Success Criteria** (what must be TRUE):
  1. User can add, edit, and delete personal dishes in "Hòm của tôi" stored in localStorage.
  2. User can switch spin source between their personal custom list and the global dish pool.
  3. User can draw a daily fortune slip on `/que-trua` (Quẻ trưa).
  4. User can explore flavor combinations on `/duyen-vi` and mystery reveals on `/khui-vi`.
  5. Privacy (`/privacy`) and Terms (`/terms`) static pages are accessible and formatted.
**UI hint**: yes
**Plans**: 3 plans

Plans:
- [ ] 04-01: LocalStorage custom dish list manager ("Hòm của tôi") with custom spin toggle.
- [ ] 04-02: Quẻ trưa daily fortune card draw page with shareable text.
- [ ] 04-03: Duyên vị, Khui vị discovery pages and static Privacy/Terms pages.

### Phase 5: Admin CMS & Content Management
**Goal**: Deliver a secure administrative CMS with Better Auth email/password login, dish & category CRUD with Vercel Blob image upload, fortune editor, and site settings.
**Depends on**: Phase 4
**Requirements**: CMS-01, CMS-02, CMS-03, CMS-04, CMS-05, CMS-06, CMS-07, CMS-08
**Success Criteria** (what must be TRUE):
  1. Admin can log in at `/admin/login` using email and password; all `/admin` routes and actions reject unauthenticated calls.
  2. Admin can create, edit, delete dishes, toggle active status, and upload photos via Vercel Blob.
  3. Admin can manage categories, filter tabs, and edit Quẻ trưa fortune entries.
  4. Admin can configure site settings: default picker presentation mode, homepage copy, and SEO tags.
  5. Admin dashboard displays total global spin metrics and catalog statistics.
**UI hint**: yes
**Plans**: 3 plans

Plans:
- [ ] 05-01: Better Auth configuration with email/password credentials, admin role, and route guards.
- [ ] 05-02: Admin dishes & categories CRUD data tables with Vercel Blob photo upload dialog.
- [ ] 05-03: Fortune editor, site settings management (default picker mode, SEO), and stats dashboard.

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation, Database & Seed Data | 3/3 | Complete | 2026-09-13 |
| 2. Core Public Experience & Spin Engine | 3/3 | Complete | 2026-09-13 |
| 3. 4 Animated Picker Modes & Visual Redesign | 0/3 | Not started | - |
| 4. Browser Personalization & Fun Extras | 0/3 | Not started | - |
| 5. Admin CMS & Content Management | 0/3 | Not started | - |
