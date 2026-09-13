# Requirements: Trưa Nay Ăn Gì

**Defined:** 2026-09-13
**Core Value:** A visitor can decide "trưa nay ăn gì" in seconds — one satisfying spin returns a real dish suggestion filtered by budget and category, backed by an admin CMS that owns all data.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Core Spin Engine & Filtering (SPIN)

- [x] **SPIN-01**: User can filter dish candidates by top-level category tabs (Món chính, Đồ uống, Ăn vặt, Món nhậu)
- [x] **SPIN-02**: User can filter dish candidates by budget step (e.g. 30k, 50k, 70k, 100k+ VND)
- [x] **SPIN-03**: User can trigger a spin to randomly select a dish from the filtered candidate pool
- [x] **SPIN-04**: User can re-spin immediately to pick another suggestion without page reload
- [x] **SPIN-05**: User sees an empty/fallback state with helpful message if no dishes match current filters
- [x] **SPIN-06**: Spin execution occurs strictly on client interaction to prevent SSR hydration mismatches

### 4 Picker Presentation Modes (MODE)

- [x] **MODE-01**: User can experience dish selection via an animated Roulette Wheel mode with deceleration physics
- [x] **MODE-02**: User can experience dish selection via a Card Shuffle & 3D Flip reveal mode
- [x] **MODE-03**: User can experience dish selection via a vertical Slot Machine Reel mode
- [x] **MODE-04**: User can select "Ngẫu hứng" mode which randomly picks one of the three visual modes per spin
- [x] **MODE-05**: User can switch between the 4 picker presentation modes via an intuitive UI toggle
- [x] **MODE-06**: First-time visitors automatically receive the admin-configured default picker mode
- [x] **MODE-07**: User's chosen picker mode is persisted in browser localStorage across visits
- [x] **MODE-08**: All picker animations run at 60fps on mobile using GPU-accelerated transforms and respect `prefers-reduced-motion`

### Dish Display & Library (DISH)

- [x] **DISH-01**: Result card displays dish name, subtitle/description, formatted price in VND, and category
- [x] **DISH-02**: Result card displays subtle rarity badge (QUỐC DÂN, HIẾM, CỰC PHẨM, TỐI MẬT, ★ ĐẶC BIỆT)
- [x] **DISH-03**: User can browse the full dish library page at `/dishes` (Kho tiếp tế)
- [x] **DISH-04**: User can search and filter dishes on `/dishes` by category, price, and rarity
- [x] **DISH-05**: Dish cards render crisp imagery via Next.js Image optimization with responsive sizing

### Global Spin Counter (STAT)

- [x] **STAT-01**: User sees the live site-wide total spin counter ("Lượt quay toàn trạm")
- [x] **STAT-02**: Counter increments atomically on the server exclusively when a user clicks the spin button
- [x] **STAT-03**: Counter is protected against artificial inflation from search engine bots and Link prefetching

### Local Custom Lists (CUST)

- [x] **CUST-01**: User can view and manage a personal custom dish list ("Hòm của tôi") saved in localStorage
- [x] **CUST-02**: User can add custom dish names, prices, and categories to their personal list
- [x] **CUST-03**: User can delete or edit items in their personal custom list
- [x] **CUST-04**: User can toggle spinning exclusively from their personal list or from the global system list
- [x] **CUST-05**: Custom list operations work 100% offline and anonymously without requiring user accounts

### Fun Extras & Secondary Pages (EXTR)

- [x] **EXTR-01**: User can draw a daily lunch fortune slip on `/que-trua` (Quẻ trưa) with shareable fortune text
- [x] **EXTR-02**: User can explore flavor compatibility on `/duyen-vi` (Duyên vị)
- [x] **EXTR-03**: User can experience a mystery dish unlock on `/khui-vi` (Khui vị)
- [x] **EXTR-04**: User can access standard static information pages: Privacy (`/privacy`), Terms (`/terms`), Contact
- [x] **EXTR-05**: Public footer prominently displays data source and inspiration credit to `truanayangi.com`

### Admin CMS & Authentication (CMS)

- [ ] **CMS-01**: Admin can log in securely via email and password at `/admin/login` using Better Auth
- [ ] **CMS-02**: Unauthenticated visitors are blocked from accessing any `/admin` route or administrative Server Action
- [ ] **CMS-03**: Admin can view dashboard statistics including total global spins and dish catalog counts
- [ ] **CMS-04**: Admin can CRUD dishes: title, subtitle, price, category, rarity tier, diet tags, and active status
- [ ] **CMS-05**: Admin can upload dish thumbnail images via Vercel Blob storage
- [ ] **CMS-06**: Admin can manage dish categories and top-level filter tabs
- [ ] **CMS-07**: Admin can edit Quẻ trưa fortune entries and daily advice text
- [ ] **CMS-08**: Admin can configure site settings: default picker presentation mode, homepage copy, and SEO meta tags

### Data Seeding & Architecture (DATA)

- [x] **DATA-01**: Initial dish dataset ported from original `truanayangi-com/truanayangi` repository and seeded into Turso DB
- [x] **DATA-02**: Drizzle ORM schema created for dishes, categories, fortunes, site settings, and counters
- [x] **DATA-03**: Typography renders all Vietnamese diacritics cleanly with zero clipping using Be Vietnam Pro

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Social & Sharing (v2)

- **SOCL-01**: User can export a dynamic branded OG image card of their spin result to share on Zalo / Facebook
- **SOCL-02**: User can export and import custom dish lists via JSON backup file
- **SOCL-03**: Admin can view granular spin popularity heatmaps by day of week and budget tier

## Out of Scope

Explicitly excluded to maintain speed, simplicity, and project focus.

| Feature | Reason |
|---------|--------|
| Visitor user accounts & login | Adds friction; kills instant lunch decision; anonymous localStorage matches original ethos |
| English UI / multi-language i18n | Target audience is 100% Vietnamese; dish names lose cultural context when translated |
| Native mobile applications | Web responsive PWA-ready app is faster to deploy and frictionless |
| Real-time multiplayer rooms | High operational complexity and WebSocket server costs unnecessary for deciding lunch |
| Online food ordering / Grab / ShopeeFood checkout | Affiliate APIs are volatile and restaurant geo-matching is out of scope |
| Theatrical loot-box gacha FX | Fresh clean minimal redesign chosen; subtle badges replace intrusive gaming theatrics |

## Traceability

Which phases cover which requirements. Populated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| SPIN-01 | Phase 2 | Complete |
| SPIN-02 | Phase 2 | Complete |
| SPIN-03 | Phase 2 | Complete |
| SPIN-04 | Phase 2 | Complete |
| SPIN-05 | Phase 2 | Complete |
| SPIN-06 | Phase 2 | Complete |
| MODE-01 | Phase 3 | Complete |
| MODE-02 | Phase 3 | Complete |
| MODE-03 | Phase 3 | Complete |
| MODE-04 | Phase 3 | Complete |
| MODE-05 | Phase 3 | Complete |
| MODE-06 | Phase 3 | Complete |
| MODE-07 | Phase 3 | Complete |
| MODE-08 | Phase 3 | Complete |
| DISH-01 | Phase 2 | Complete |
| DISH-02 | Phase 2 | Complete |
| DISH-03 | Phase 2 | Complete |
| DISH-04 | Phase 2 | Complete |
| DISH-05 | Phase 2 | Complete |
| STAT-01 | Phase 2 | Complete |
| STAT-02 | Phase 2 | Complete |
| STAT-03 | Phase 2 | Complete |
| CUST-01 | Phase 4 | Complete |
| CUST-02 | Phase 4 | Complete |
| CUST-03 | Phase 4 | Complete |
| CUST-04 | Phase 4 | Complete |
| CUST-05 | Phase 4 | Complete |
| EXTR-01 | Phase 4 | Complete |
| EXTR-02 | Phase 4 | Complete |
| EXTR-03 | Phase 4 | Complete |
| EXTR-04 | Phase 4 | Complete |
| EXTR-05 | Phase 1 | Complete |
| CMS-01 | Phase 5 | Pending |
| CMS-02 | Phase 5 | Pending |
| CMS-03 | Phase 5 | Pending |
| CMS-04 | Phase 5 | Pending |
| CMS-05 | Phase 5 | Pending |
| CMS-06 | Phase 5 | Pending |
| CMS-07 | Phase 5 | Pending |
| CMS-08 | Phase 5 | Pending |
| DATA-01 | Phase 1 | Complete |
| DATA-02 | Phase 1 | Complete |
| DATA-03 | Phase 1 | Complete |

**Coverage:**
- v1 requirements: 41 total
- Mapped to phases: 41
- Unmapped: 0 ✓

---
*Requirements defined: 2026-09-13*
*Last updated: 2026-09-13 after initial definition*
