---
phase: 1
slug: foundation-database-seed-data
status: approved
shadcn_initialized: false
preset: clean-minimal-food
created: 2026-09-13
---

# Phase 1 — UI Design Contract

> Visual and interaction contract for frontend foundation and public layout shell.

---

## Design System

| Property | Value |
|----------|-------|
| Tool | none (hand-rolled Tailwind v4 for public; shadcn reserved for admin in Phase 5) |
| Preset | clean-minimal-food |
| Component library | none (native HTML + Tailwind CSS v4) |
| Icon library | lucide-react |
| Font | Be Vietnam Pro (variable 400..700 via `next/font/google`) |

---

## Spacing Scale

Declared values (must be multiples of 4):

| Token | Value | Usage |
|-------|-------|-------|
| xs | 4px | Icon gaps, inline badge padding |
| sm | 8px | Compact tag spacing, button gaps |
| md | 16px | Default element spacing, card padding |
| lg | 24px | Section padding, modal margins |
| xl | 32px | Layout gaps between cards/sections |
| 2xl | 48px | Header-to-content spacing |
| 3xl | 64px | Page-level top/bottom padding |

Exceptions: none

---

## Typography

| Role | Size | Weight | Line Height |
|------|------|--------|-------------|
| Body | 15px | 400 (Regular) | 1.6 |
| Label | 13px | 500 (Medium) | 1.4 |
| Subheading | 18px | 600 (SemiBold) | 1.4 |
| Heading | 24px | 700 (Bold) | 1.3 |
| Display | 32px | 800 (ExtraBold) | 1.2 |

Note: Vietnamese diacritic marks require at least `leading-normal` (1.4 - 1.6) to avoid clipping. Never use `leading-none` on Vietnamese text.

---

## Color

| Role | Value | Usage |
|------|-------|-------|
| Dominant (60%) | `#fafaf9` (stone-50) / dark: `#0c0a09` (stone-950) | App background, page canvas |
| Secondary (30%) | `#ffffff` (white) / dark: `#1c1917` (stone-900) | Header, card surfaces, footer, border `#e7e5e4` |
| Accent (10%) | `#ea580c` (orange-600) / dark: `#f97316` (orange-500) | Spin CTA button, active filter tab, key badges |
| Destructive | `#ef4444` (red-500) | Delete actions in custom list |

Accent reserved for: Primary spin trigger button, active tab underline, highlight tags.

---

## Copywriting Contract

| Element | Copy |
|---------|------|
| Header Brand | **Trưa Nay Ăn Gì** |
| Header Nav Link | Kho tiếp tế |
| Tagline | Quay chọn món trưa nhanh chóng theo sở thích và ngân sách |
| Footer Credit | Nguồn dữ liệu & Cảm hứng: truanayangi.com (Mã nguồn mở) |
| Footer Links | Điều khoản · Quyền riêng tư · GitHub |
| Loading State | Đang chuẩn bị món... |
| Error State | Không thể kết nối cơ sở dữ liệu. Vui lòng thử lại sau. |

---

## Layout Grid & Shell

- Container: `max-w-4xl mx-auto px-4 sm:px-6`
- Header: Sticky top-0, backdrop-blur-md, border-b border-stone-200/80 dark:border-stone-800/80
- Footer: Subtle centered text, py-10, text-xs text-stone-500 dark:text-stone-400

---
*Contract verified: 2026-09-13*
