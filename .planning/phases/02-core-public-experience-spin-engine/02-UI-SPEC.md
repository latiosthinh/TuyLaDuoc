---
phase: 2
slug: core-public-experience-spin-engine
status: approved
shadcn_initialized: false
preset: clean-minimal-food
created: 2026-09-13
---

# Phase 2 — UI Design Contract

## Design System
- Theme: Minimal food-app, warm stone neutral with vibrant orange CTA (`#ea580c`).
- Spacing: 4px system, cards with `rounded-2xl`, borders `border-stone-200 dark:border-stone-800`.

## Component Contracts
- Filter Tabs: Horizontal scrollable pill buttons (Tất cả, Món chính, Đồ uống, Ăn vặt, Món nhậu).
- Budget Chips: Quick selectors (Tất cả, 30k, 50k, 70k, 100k+).
- Result Card: Featured card with dish photo (Next.js Image), title, subtitle, formatted price in VND, subtle rarity tag.
- Spin Button: Large accessible CTA "QUAY CHỌN MÓN" with pulse effect.
- Global Counter Badge: Top hero pill displaying "Lượt quay toàn trạm: {N}".
- Dish Library: Search input, category filter pill list, 3-column responsive card grid.
