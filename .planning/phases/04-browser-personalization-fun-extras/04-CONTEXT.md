# Phase 4: Browser Personalization & Fun Extras - Context

**Gathered:** 2026-09-13
**Status:** Ready for planning

<domain>
## Phase Boundary

Enable anonymous user custom dish lists ("Hòm của tôi") in localStorage, ability to spin exclusively from the custom list, and deliver the redesigned minimal fun extras: Quẻ trưa (daily fortune card at `/que-trua`), Duyên vị (`/duyen-vi`), Khui vị (`/khui-vi`), and static information pages (`/privacy`, `/terms`).

</domain>

<decisions>
## Implementation Decisions

### Custom Lists ("Hòm của tôi")
- Managed through client-side React hook `useCustomList()` synced to `localStorage`.
- Dialog modal on homepage allowing user to add, edit, or delete custom dishes.
- Source toggle on SpinEngine: "Toàn bộ món" (Global pool) vs "Hòm của tôi" (Custom pool).
- Anonymous, zero login required.

### Fun Extras
- `/que-trua`: Animated fortune drawing card pulling advice from the `fortunes` table in DB.
- `/duyen-vi`: Flavor chemistry discovery tool pairing two complementary lunch dishes.
- `/khui-vi`: Mystery surprise box revealing a single hidden gourmet dish.
- `/privacy` & `/terms`: Clean minimal markdown-style legal policies.

### the agent's Discretion
- Fortune drawing card flip animation and flavor pairing algorithm.

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/components/public/DishCard.tsx`
- `src/components/pickers/` (Motion components)
- `src/db/schema.ts` (`fortunes`, `dishes`)

</code_context>
