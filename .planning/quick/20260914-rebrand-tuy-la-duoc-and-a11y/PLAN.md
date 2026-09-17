---
slug: rebrand-tuy-la-duoc-and-a11y
date: 2026-09-14
status: in-progress
---

# Quick Plan: Rebrand to "Tùy Là Được" and Full Accessibility Remediation

## Objective
Rebrand from single-purpose lunch picker ("Trưa Nay Ăn Gì") to universal decider ("Tùy Là Được") covering food, entertainment, activities, and tasks with full generic schema support and comprehensive accessibility (WCAG 2.1 AA) compliance.

## Planned Changes
1. Schema & Data:
   - Generalize `src/db/schema.ts` to support multi-domain items (`domain` field: food, entertainment, activity, task, custom).
   - Maintain full type aliases (`Item`, `Dish = Item`) and backward-compatible exports.
   - Expand seed data with diverse real-world options across Entertainment (Phim ảnh/Game/Boardgame), Activities (Dã ngoại/Thể thao/Dạo phố), and Tasks/Chores.
2. Rebrand UI & Content:
   - Rename to "Tùy Là Được" across layout, navigation header, footer, SEO metadata, and main headings.
   - Update domain/category switcher: allow picking what domain to decide (Ăn uống, Giải trí, Hoạt động, Việc cần làm, Hòm của tôi).
   - Rebrand buttons, modal prompts, and victory messages to be universal deciders.
3. Full Accessibility (a11y) Remediation:
   - `WinnerModal`: Add `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, Esc key listener, focus trap.
   - `CustomListModal`: Add `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, Esc key listener, form `<label htmlFor>` pairings, delete button `aria-label`.
   - `SpinEngine`: Add `aria-live="polite"` result announcer, `role="radiogroup"` / `aria-checked` on filter buttons, `aria-busy` during spinning.
   - Buttons & Contrast: Add missing `aria-label`s on icon buttons and ensure text contrast passes WCAG AA.
4. Verification:
   - Run `pnpm build` to verify type checking and bundling.
