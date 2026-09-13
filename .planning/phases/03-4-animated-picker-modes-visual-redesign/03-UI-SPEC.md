---
phase: 3
slug: 4-animated-picker-modes-visual-redesign
status: approved
shadcn_initialized: false
preset: clean-minimal-food
created: 2026-09-13
---

# Phase 3 — UI Design Contract

## Visual Presentation Modes Contract
- **Mode Switcher:** Segmented pill toggle: "Vòng quay" (Roulette), "Lật bài" (Cards), "Quả chuông" (Slot), "Ngẫu hứng" (Random).
- **Roulette Wheel:** SVG disc with dynamic candidate slices, pointer at top/right, decelerating rotation with spring dampening.
- **Card Shuffle & Flip:** Centered card stack with 3D perspective (`preserve-3d`), card flip animation via `rotateY(180deg)`.
- **Slot Reel:** Window viewport with overflow-hidden, vertical translation animation with blur overlay.
- **Motion Safety:** Respects `prefers-reduced-motion` with instant fade-in fallback.
