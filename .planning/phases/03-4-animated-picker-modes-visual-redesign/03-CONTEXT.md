# Phase 3: 4 Animated Picker Modes & Visual Redesign - Context

**Gathered:** 2026-09-13
**Status:** Ready for planning

<domain>
## Phase Boundary

Build the 4 swappable picker presentation modes (Roulette Wheel, Card Shuffle & Flip, Slot Machine Reel, and "Ngẫu hứng" random selector) with Motion animations, user mode switcher, and clean minimal food-app redesign.

</domain>

<decisions>
## Implementation Decisions

### Mode Architectures & Visuals
- Unified `PickerModeProps` interface across all 4 modes.
- Mode 1: Roulette Wheel — Circular rotating wheel with deceleration spring and center indicator.
- Mode 2: Card Shuffle — Deck of cards shuffling horizontally with 3D Y-axis flip reveal.
- Mode 3: Slot Machine Reel — Vertical rolling strip with blurred motion easing into place.
- Mode 4: "Ngẫu hứng" — Coordinator dynamically picks one of the three visual modes per spin.
- User mode switcher bar with local storage persistence across sessions.
- 60fps GPU-composited CSS transforms with reduced-motion support.

### the agent's Discretion
- Spring stiffness and damping parameters for tactile physical feel.

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/components/public/SpinEngine.tsx` (candidate filtering & state controller)
- `src/components/public/DishCard.tsx`
- `src/components/public/RarityBadge.tsx`

</code_context>

<specifics>
## Specific Ideas
- Smooth Motion 13 integration with hardware acceleration.

</specifics>

<deferred>
## Deferred Ideas
None.

</deferred>
