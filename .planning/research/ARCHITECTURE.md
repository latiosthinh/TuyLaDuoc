# Architecture Research

**Domain:** Vietnamese lunch-picker web app ("Trưa Nay Ăn Gì" clone, modernized)
**Researched:** 2026-09-13
**Confidence:** HIGH

## Standard Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       Next.js App Router (Vercel)                           │
├──────────────────────────────────────┬──────────────────────────────────────┤
│           Public Surface             │             Admin Surface            │
│         Route Group: (public)        │         Route Group: (admin)         │
│  ┌────────────┐  ┌────────────────┐  │  ┌────────────────┐  ┌────────────┐  │
│  │ Spin Stage │  │ Dishes Library │  │  │  Better Auth   │  │ CMS Panels │  │
│  │  (Motion)  │  │   (/dishes)    │  │  │ (Admin Session)│  │ (CRUD/Sets)│  │
│  └─────┬──────┘  └────────┬───────┘  │  └────────┬───────┘  └─────┬──────┘  │
│        │                  │          │           │                │         │
├────────┴──────────────────┴──────────┴───────────┴────────────────┴─────────┤
│                             Data & Service Layer                            │
│  ┌─────────────────────────┐  ┌──────────────────────────────────────────┐  │
│  │   Public Data Queries   │  │     Admin Server Actions / Mutations     │  │
│  │ (unstable_cache/tagging)│  │    (revalidateTag, session guarded)      │  │
│  └────────────┬────────────┘  └──────────────────┬───────────────────────┘  │
├───────────────┴──────────────────────────────────┴──────────────────────────┤
│                                Persistence                                  │
│  ┌───────────────────────────┐  ┌────────────────┐  ┌────────────────────┐  │
│  │    Turso DB (libSQL)      │  │  Vercel Blob   │  │ User localStorage  │  │
│  │   Drizzle ORM 0.45.2      │  │ (Dish Photos)  │  │(Custom Lists/Prefs)│  │
│  └───────────────────────────┘  └────────────────┘  └────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| **Public Layout & Pages** | Render landing, spin interface, `/dishes`, `/que-trua`, static info | Server Components with client animation boundaries |
| **Spin Stage Controller** | Controls active picker mode, filter state, spin trigger, result display | Client Component orchestrating Motion picker components |
| **Picker Mode Components** | Roulette wheel, card shuffle+flip, slot machine reel | Modular Motion components sharing a common `PickerModeProps` interface |
| **Global Counter** | Displays total spins and performs server-side atomic increment | Server Action with `UPDATE counters SET value = value + 1 ...` |
| **Local Custom Lists Store** | Manages user's personal dish list and mode preferences | Client-side custom hook with `localStorage` fallback |
| **Admin Auth Module** | Email/password login, cookie session creation, middleware protection | Better Auth 1.7.4 with Drizzle adapter and Admin plugin |
| **Admin CMS Panels** | Dishes CRUD, Categories manager, Fortunes editor, Site settings | Shadcn UI tables/forms + Next.js Server Actions |
| **Image Upload Pipeline** | Upload dish thumbnails | Vercel Blob client upload or server action upload route |

## Recommended Project Structure

```
src/
├── app/
│   ├── (public)/
│   │   ├── layout.tsx              # Public header, navigation, footer
│   │   ├── page.tsx                # Homepage: Spin Stage + Filters + Counter
│   │   ├── dishes/page.tsx         # Kho tiếp tế: Dish Library grid
│   │   ├── que-trua/page.tsx       # Quẻ trưa: Daily fortune card
│   │   ├── duyen-vi/page.tsx       # Duyên vị: Flavor compatibility
│   │   ├── khui-vi/page.tsx        # Khui vị: Mystery discovery
│   │   ├── privacy/page.tsx        # Privacy policy
│   │   └── terms/page.tsx          # Terms of service
│   ├── (admin)/
│   │   ├── admin/
│   │   │   ├── login/page.tsx      # Admin email/password sign-in
│   │   │   ├── layout.tsx          # Admin sidebar, breadcrumbs, auth check
│   │   │   ├── page.tsx            # Dashboard overview & spin stats
│   │   │   ├── dishes/page.tsx     # Dish CRUD table & dialogs
│   │   │   ├── categories/page.tsx # Category & tab management
│   │   │   ├── fortunes/page.tsx   # Fortune cards list editor
│   │   │   └── settings/page.tsx   # Default mode, SEO, site text
│   │   └── api/
│   │       ├── auth/[...all]/route.ts # Better Auth endpoint
│   │       └── upload/route.ts        # Vercel Blob upload endpoint
│   ├── globals.css                 # Tailwind v4 `@import "tailwindcss"; @theme`
│   └── layout.tsx                  # Root layout (fonts, metadata)
├── components/
│   ├── ui/                         # shadcn/ui primitives (for admin)
│   ├── public/                     # Public site components (navbar, footer, dish card)
│   ├── pickers/                    # 4 Picker presentation modes
│   │   ├── PickerContainer.tsx     # Mode switcher + coordinator
│   │   ├── RouletteWheel.tsx       # Rotating SVG/DOM wheel
│   │   ├── CardShuffle.tsx         # Card deck shuffle & 3D flip reveal
│   │   ├── SlotReel.tsx            # Vertical spinning fruit-machine reel
│   │   └── types.ts                # Shared PickerModeProps
│   └── admin/                      # CMS forms, data tables, photo uploaders
├── db/
│   ├── schema.ts                   # Drizzle schema (dishes, categories, fortunes, settings, counter)
│   ├── index.ts                    # Drizzle client instance (Turso @libsql/client)
│   └── seed-data.ts                # Ported dataset from original repo
├── hooks/
│   ├── use-custom-lists.ts         # localStorage sync for personal dish lists
│   └── use-picker-preferences.ts   # localStorage sync for selected picker mode
├── lib/
│   ├── auth.ts                     # Better Auth server configuration
│   ├── auth-client.ts              # Better Auth client hooks
│   └── utils.ts                    # cn(), formatVND(), randomizer helpers
└── scripts/
    └── seed.ts                     # tsx runnable database seeder
```

### Structure Rationale

- **Route Group `(public)` vs `(admin)`:** Clean separation of layouts. Public site avoids bundling admin shadcn components and auth context; admin site has dedicated dashboard layout.
- **`components/pickers/` abstraction:** Enables adding/swapping picker animation styles without touching the core spin or filtering logic.
- **`db/` with explicit seed script:** Makes bootstrapping from the open-source dataset a one-command step (`pnpm db:seed`).

## Architectural Patterns

### Pattern 1: Unified Picker Mode Interface

All 4 presentation modes implement the exact same interface:

```typescript
export interface PickerModeProps {
  candidates: Dish[];
  selectedDish: Dish | null;
  isSpinning: boolean;
  onSpinEnd: () => void;
  primaryColor?: string;
}
```

The container handles random selection math, sound trigger, and counter mutation. The active mode component only handles visual motion and calls `onSpinEnd()` when animation completes.

### Pattern 2: Atomic Server Counter Increment

Avoid lost updates under concurrent spins on serverless:

```typescript
export async function recordSpinEvent(): Promise<number> {
  const result = await db
    .update(counters)
    .set({ value: sql`${counters.value} + 1` })
    .where(eq(counters.key, "global_spins"))
    .returning({ count: counters.value });
  return result[0]?.count ?? 0;
}
```

### Pattern 3: Cached Public Reads with Tag-Based Admin Revalidation

Dishes and site content are read frequently by visitors and changed rarely by admin. Wrap public queries with `unstable_cache` keyed by tags (`dishes`, `site-settings`). Admin Server Actions call `revalidateTag('dishes')` immediately on mutation.

## Data Flow

### Spin Flow

```
1. Visitor loads Page
   └── Server Component fetches active dishes & categories (cached)
2. Visitor adjusts filters (Budget <= 50k, Category = "Món chính")
   └── Client Component filters candidate pool in memory
3. Visitor clicks "QUAY CHỌN MÓN"
   ├── Pick random dish from candidate pool
   ├── Fire background Server Action: recordSpinEvent() (updates Turso counter)
   └── Trigger active picker animation (Wheel / Card / Slot)
4. Animation completes (2.5s - 3.5s)
   └── Result Card revealed with rarity badge, price, subtitle
```

## Scaling Considerations

| Scale | Architecture Strategy |
|-------|----------------------|
| 0 - 10k visits/day | Free tier Vercel + Turso free (500M reads/mo) covers everything easily. In-memory client filtering for instant response. |
| 10k - 500k visits/day | Edge CDN caching for `/dishes` and homepage; counter writes throttled/batched if necessary. |

## Sources

- Next.js 16 App Router Official Documentation
- Drizzle ORM LibSQL / Turso Integration Guide
- Better Auth Documentation

---
*Architecture research for: Vietnamese lunch-picker web app*
*Researched: 2026-09-13*
