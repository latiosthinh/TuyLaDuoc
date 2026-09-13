# Trưa Nay Ăn Gì

## What This Is

A Vietnamese lunch-picker web app replicating truanayangi.com: visitors filter by category and budget, spin to get a random dish suggestion, browse the dish library, and save personal lists in their browser — no login. Rebuilt from the original open-source Vite app on latest Next.js + Tailwind with a fresh, clean minimal redesign, richer animations, and an admin CMS that owns all dish data and site content.

## Core Value

A visitor can decide "trưa nay ăn gì" in seconds — one satisfying spin returns a real dish suggestion filtered by their budget and category.

## Requirements

### Validated

(None yet — ship to validate)

### Active

<!-- All are hypotheses until shipped. -->

**Public site (Vietnamese, anonymous):**

- [ ] User can spin for a random dish, filtered by category tabs (Món chính / Đồ uống / Ăn vặt / Món nhậu) and budget level
- [ ] User can switch between 4 picker presentation modes: roulette wheel, card shuffle + flip, slot-machine reel, and "Ngẫu hứng" (randomly picks one of the three modes per spin)
- [ ] Admin-chosen default picker mode applies for first-time visitors; user's choice persists in browser
- [ ] Dish result shows name, description, price, category, and rarity as a subtle colored badge (QUỐC DÂN / HIẾM / CỰC PHẨM / TỐI MẬT / ĐẶC BIỆT)
- [ ] User can browse the full dish library page (/dishes) with category, price, rarity
- [ ] User sees a global all-site spin counter that increments on every spin (server-side)
- [ ] User can create and save custom dish lists + preferences in localStorage (anonymous, no sync)
- [ ] Fun extras, redesigned minimal: Quẻ trưa (daily lunch fortune), Duyên vị, Khui vị
- [ ] Polished motion design throughout (spin physics, reveals, page transitions); clean minimal food-app aesthetic; responsive mobile-first
- [ ] Static pages: privacy, terms, contact

**Admin CMS (email + password):**

- [ ] Admin can log in with email/password
- [ ] Admin can CRUD dishes: name, description, price, category, image, rarity tag, diet tags (e.g. Chay)
- [ ] Admin can manage categories and top-level filter tabs
- [ ] Admin can manage site content: fortune texts (Quẻ trưa etc.), homepage copy, SEO settings
- [ ] Admin can set the default picker mode
- [ ] Admin can view stats: global spin count, basic usage stats

**Data:**

- [ ] Initial dish dataset ported from the original open-source repo (names, prices, categories, rarities) and seeded into the DB
- [ ] Attribution to the original project preserved (per repo ATTRIBUTION.md)

### Out of Scope

- Visitor accounts / login — anonymous by design, faithful to original
- English UI / i18n — Vietnamese only per decision
- Cross-device sync of user lists — localStorage only
- Native mobile app — web only
- Gacha/supply-box theatrics (loot-box animations, rarity reveal FX as centerpiece) — fresh redesign chosen; rarity survives only as subtle badges
- Payments, ordering, delivery integration — suggestion app only
- Real-time/social features (chat, sharing spins live) — not core to deciding lunch

## Context

- **Original app:** github.com/truanayangi-com/truanayangi — Vite + TypeScript, no backend, cookie storage; production site truanayangi.com (587 stars, active community). Repo has no LICENSE file at root but has ATTRIBUTION.md; data port must keep attribution.
- **Original data model:** dishes carry name, subtitle, price (VND), kitchen category (Bún/phở/mì, Cơm & xôi, Pizza & pasta, Nướng & chiên, Salad & món nhẹ, Bánh mì & cuốn, Chay), rarity tier, plus top-level filters (Món chính, Đồ uống, Ăn vặt, Món nhậu) and budget tiers (~50k steps). "Lượt quay toàn trạm" global counter exists on production.
- **This project:** greenfield, empty directory, git initialized. The differentiator vs original: backend + CMS (original hardcodes data), modern stack, premium animation/UI/UX.

## Constraints

- **Tech stack**: Latest Next.js (App Router) + Tailwind CSS v4; all dependencies at latest stable versions — user explicitly requested
- **Hosting**: Vercel
- **Database**: Turso (libSQL) preferred; Neon Postgres if Turso blocks anything
- **Auth**: email/password for admin only; visitors never authenticate
- **Language**: Vietnamese-only UI (public + admin can be Vietnamese)
- **User data**: localStorage/cookies only for visitor preferences and custom lists
- **Budget**: free/cheap tiers (Vercel Hobby, Turso free tier) implied by project nature

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Fresh redesign, not gacha theme replication | User wants clean minimal food-app look, "nicer UI/UX" | — Pending |
| 4 picker modes (wheel / cards / slot / Ngẫu hứng), admin sets default, user switches | User asked for all modes with choice | — Pending |
| Turso preferred, Neon fallback | Edge-friendly libSQL, good Vercel fit; fallback de-risks | — Pending |
| Rarity kept as subtle badges | Preserves ported data + game charm without gacha theatrics | — Pending |
| Anonymous visitors, localStorage | Faithful to original; zero-friction | — Pending |
| Email/password admin auth (Better Auth or Auth.js) | One/few admins, simplest secure option | — Pending |
| CMS owns dishes, categories, site content, settings, stats | Single source of truth; no code deploys for content | — Pending |
| Vietnamese-only UI | Faithful replication; audience is VN | — Pending |
| Port dataset from original repo | Rich ready data; keep attribution | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-09-13 after initialization*
