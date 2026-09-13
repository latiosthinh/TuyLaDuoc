# Pitfalls Research

**Domain:** Vietnamese lunch-picker web app ("Trưa Nay Ăn Gì" clone, modernized)
**Researched:** 2026-09-13
**Confidence:** HIGH

## Critical Pitfalls

### Pitfall 1: Hydration Mismatch from SSR Randomization

**What goes wrong:**
Next.js server renders initial dish selection with a random pick, but client hydration runs `Math.random()` and produces a different dish, triggering React hydration error #418 / #423 and UI flicker.

**Why it happens:**
Developers try to show an initial random suggestion on the homepage during SSR without deferring random selection to client-side lifecycle.

**How to avoid:**
Render the spin stage in an idle/ready state during SSR (e.g. prompt "Bấm quay để chọn món" or show a fixed featured hero dish). Randomization must ONLY execute inside client event handlers (`onClick`) or inside `useEffect` after component has mounted.

**Warning signs:**
"Hydration failed because the initial UI does not match what was rendered on the server" in dev console.

**Phase to address:**
Phase 1 (Scaffold & Core Spin Engine).

---

### Pitfall 2: Next.js Link Prefetch Accidentally Incrementing Global Spin Counter

**What goes wrong:**
Developers implement spin counting via a GET endpoint or prefetchable route, causing search engine bots, web crawlers, or Next.js `<Link>` hover prefetching to artificially inflate the global spin counter by thousands.

**Why it happens:**
GET requests are assumed to be idempotent, but prefetching triggers the handler.

**How to avoid:**
The spin counter MUST ONLY be incremented via a dedicated POST Server Action triggered explicitly by the user clicking the "QUAY" / "MỞ HÒM" button. Never invoke counter mutations on page load or GET requests.

**Warning signs:**
Global counter increases without any user interaction; spikes in spin count coinciding with bot indexation.

**Phase to address:**
Phase 2 (Spin Engine & Counter).

---

### Pitfall 3: Turso Connection Staleness and Edge vs Node Runtime Mismatches

**What goes wrong:**
`@libsql/client` throws protocol or environment errors on Vercel Serverless Functions if configured with incompatible transport modes (e.g. WebSocket attempts inside standard Node serverless).

**Why it happens:**
Turso client has multiple transports (HTTP vs WebSocket). Vercel serverless functions require standard HTTPS transport (`https://...` database URL with auth token).

**How to avoid:**
Use `createClient({ url: process.env.TURSO_DATABASE_URL, authToken: process.env.TURSO_AUTH_TOKEN })` with HTTPS URL protocol. Do not use WebSocket URLs (`wss://`) in stateless Vercel Serverless Functions.

**Warning signs:**
"FetchError" or socket timeouts during production deployment on Vercel while working locally on localhost.

**Phase to address:**
Phase 1 (Database & Auth Setup).

---

### Pitfall 4: Animation Jank from Layout Property Animation (Width / Top / Margin)

**What goes wrong:**
Spinning roulette wheels or slot reels experience severe frame drops and stuttering on mobile phones (especially lower-end devices common in Vietnam).

**Why it happens:**
Animating properties that trigger browser layout and paint cycles (`top`, `margin-top`, `left`, `width`) instead of composite-only properties (`transform: rotate(...)`, `transform: translateY(...)`, `opacity`).

**How to avoid:**
Strictly animate CSS `transform` and `opacity` using Motion. Apply `will-change: transform` and ensure GPU layer promotion. Use hardware-accelerated CSS spring easings.

**Warning signs:**
Frame rates dipping below 60fps on mobile; high layout time in Chrome DevTools Performance panel.

**Phase to address:**
Phase 3 (4 Picker Presentation Modes).

---

### Pitfall 5: Unprotected Server Actions in Admin CMS

**What goes wrong:**
Developers protect `/admin` pages via Next.js Middleware, but forget that Server Actions generate standalone HTTP POST endpoints that bypass page middleware if called directly by an attacker.

**Why it happens:**
Next.js middleware only intercepts route transitions, not direct action dispatch if paths do not match.

**How to avoid:**
Every administrative Server Action must perform a session verification check at the very start of the function body using Better Auth (`await auth.api.getSession({ headers: await headers() })`). If session or admin role is missing, throw an Unauthorized error.

**Warning signs:**
Mutations succeed even without a valid auth cookie when called programmatically.

**Phase to address:**
Phase 4 (Admin CMS & Auth).

---

### Pitfall 6: Vietnamese Diacritics Clipping and Font Fallback Glyphs

**What goes wrong:**
Vietnamese diacritic marks (tone marks: sắc, huyền, hỏi, ngã, nặng and vowel hats: `ă, â, ê, ô, ơ, ư`) get clipped by tight `line-height` / `overflow-hidden` on wheel labels, or render in an ugly fallback serif font.

**Why it happens:**
Using fonts that lack Vietnamese glyph subsets, or setting container `leading-none` without accounting for extra vertical ascender/descender space needed for Vietnamese tone marks.

**How to avoid:**
Load **Be Vietnam Pro** via `next/font/google` with `subsets: ["vietnamese", "latin"]`. Give wheel and badge labels at least `leading-normal` or explicit padding to prevent tone mark clipping.

**Warning signs:**
Tone marks looking flat, cut off, or rendering in a generic system font.

**Phase to address:**
Phase 1 & Phase 3.

---

### Pitfall 7: Data Licensing & Attribution

**What goes wrong:**
Copying assets or content without giving proper credit creates community friction or copyright concerns.

**Why it happens:**
The original open-source repo (`truanayangi-com/truanayangi`) has no root `LICENSE` file, but explicitly provides an `ATTRIBUTION.md` crediting original creators and dish data sources.

**How to avoid:**
Port the dish names, categories, and prices as seed data, but display a clean "Nguồn dữ liệu & Cảm hứng: truanayangi.com" credit link in the footer and about modal, preserving the original `ATTRIBUTION.md` in the repository.

**Phase to address:**
Phase 1 & Phase 5.

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Hardcoded dishes array instead of DB | Avoids database setup in early dev | Need to rebuild CMS later | Never — we start with Turso + Drizzle right away |
| Skipping image storage setup (using external URLs) | Faster setup | Broken image links when third-party sites change URLs | Seed with verified URLs, migrate to Vercel Blob in CMS |
| Storing admin password in plain text or `.env` only | Fast login check | No password rotation, insecure, multiple admin blocker | Never — use Better Auth credential hashing |

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Fetching all dishes on every spin click | Unnecessary DB reads | Client caches candidate pool; spin selects locally in-memory | Breaks Turso free tier quota at high traffic |
| Unbounded `localStorage` custom lists | QuotaExceededError on mobile | Cap custom dishes at 100 items per user | ~5MB localStorage limit |

---
*Pitfalls research for: Vietnamese lunch-picker web app*
*Researched: 2026-09-13*
