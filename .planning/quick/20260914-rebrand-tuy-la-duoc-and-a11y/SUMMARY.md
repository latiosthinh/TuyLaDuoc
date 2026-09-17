---
slug: rebrand-tuy-la-duoc-and-a11y
date: 2026-09-14
status: complete
---

# Quick Task Summary: Rebrand to "Tùy Là Được" and Full Accessibility Remediation

## Summary of Accomplishments
1. **Schema & Domain Expansion**:
   - Added `domain` field (`food`, `entertainment`, `activity`, `task`) to `categories` and `dishes` in `src/db/schema.ts`.
   - Exported universal `Item` and `items` type aliases for backward-compatible consumption.
   - Expanded seed data with 19 categories and 53 choices spanning Food, Cinema/Netflix, Games/Boardgames, Music/Podcasts, Walking/Cafes, Sports/Gym, and Daily Tasks.
   - Seeded database cleanly with updated site settings.
2. **Branding & Copy Updates**:
   - Rebranded to **"Tùy Là Được"** (v2.0) across root layout, metadata, header, footer, home page, `/dishes` catalog, quẻ may mắn, privacy, and terms.
   - Replaced food-only labels with universal decision terminology ("Kho lựa chọn", "Lựa chọn trúng đích", "Quyết định dành cho bạn").
3. **Accessibility Remediation (WCAG 2.1 AA)**:
   - Modals (`WinnerModal`, `CustomListModal`): Added `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, `aria-describedby`, Escape-key dismiss, and auto-focus management.
   - Live Region: Integrated screen-reader polite live announcer (`aria-live="polite"`, `aria-atomic="true"`) for spin start and winning selection reveals.
   - Interactive Groups: Wired `role="radiogroup"` and `role="radio"` with `aria-checked` to domain selectors, category filters, and budget tiers.
   - Form Inputs: Associated all modal inputs with explicit `<label htmlFor="...">` and matching IDs.
   - Buttons: Added meaningful `aria-label` attributes to all icon-only action buttons (close, trash, rewind, swipe, search).
   - Text Contrast: Adjusted muted stone colors to pass 4.5:1 contrast requirements.
4. **Verification**:
   - Passed `npx tsx scripts/verify-a11y-and-schema.ts` asserting all domains, categories, and items.
   - Passed `pnpm build` with zero TypeScript and build errors across all 14 routes.
