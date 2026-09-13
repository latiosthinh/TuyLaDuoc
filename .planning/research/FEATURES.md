# Feature Research

**Domain:** Vietnamese lunch-picker / decision web app ("Trưa Nay Ăn Gì" modernized clone)
**Researched:** 2026-09-13
**Confidence:** HIGH (verified against truanayangi.com production site and open-source repo)

## Feature Landscape

### Table Stakes (Users Expect These)

Features users assume exist in a modern "what to eat" decision randomizer. Missing these = product feels broken or useless.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Random dish spin with category filter | Core value proposition: decide what to eat in 1 click | MEDIUM | Filter tabs: Món chính, Đồ uống, Ăn vặt, Món nhậu. |
| Budget-based filtering | Users have hard lunch budget constraints (e.g. ~50k VND) | LOW | Filter step ~30k, 50k, 70k, 100k+ VND. |
| Result presentation card | User needs actionable outcome: dish name, photo, price, subtitle | LOW | Show subtle rarity badge (QUỐC DÂN, HIẾM, CỰC PHẨM, TỐI MẬT, ★ ĐẶC BIỆT). |
| Re-spin / Spin again | 80%+ users don't take first suggestion | LOW | Instant trigger; sound/animation reset. |
| Dish Library (/dishes) | Users want to browse what exists in the system | MEDIUM | Grid view with category filter, price display, rarity tags. |
| Anonymous browser storage | Original repo identity: zero login, works immediately | LOW | Save custom lists, favorite dishes, chosen picker mode in `localStorage`. |
| Global spin counter ("Lượt quay toàn trạm") | Shows community activity and social proof | MEDIUM | Server-side increment on every spin. Needs atomic counter handling. |
| Admin CMS dish management | Admin must update dishes without redeploying code | MEDIUM | CRUD dishes (name, subtitle, price, category, diet tags, photo, rarity). |
| Admin CMS category management | Dish taxonomy evolution | LOW | Edit/add categories and top-level filter tabs. |
| Admin email/password login | Protect CMS routes | MEDIUM | Better Auth with admin role, session cookies. |
| Responsive mobile-first design | 85%+ lunch decision happens on smartphone | MEDIUM | Touch-friendly wheel/cards, fluid typography, no horizontal scroll. |

### Differentiators (Competitive Advantage)

Features that set this app apart from generic decision wheels.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| 4 Switchable Picker Modes | Different user preferences: Roulette wheel, Card shuffle + flip, Slot machine reel, Ngẫu hứng (random mode per spin) | HIGH | Admin sets site default; user can toggle mode; smoothly animates with Motion. |
| Clean modern food-app aesthetic | Moving away from noisy gaming/gacha theme to clean, appetizing UI | MEDIUM | Neutral background, appetizing photography, refined typography (Be Vietnam Pro). |
| Daily Lunch Fortune ("Quẻ trưa") | Habit-forming morning/lunch ritual; fun daily fortune slip | LOW | Reseeded daily or per click; content managed via CMS. |
| "Duyên vị" & "Khui vị" extra pages | Discovery modes: flavor compatibility and mystery dish reveals | MEDIUM | Redesigned minimal pages, content editable in CMS. |
| Custom Dish Lists ("Hòm của tôi") | Office teams or picky eaters can spin exclusively from their curated list | MEDIUM | Stored in localStorage; custom items can blend or replace system dishes. |
| Full Content CMS | Admin edits fortune text, homepage copy, SEO metadata, default mode | MEDIUM | Key-value settings table with revalidation tag. |

### Anti-Features (Commonly Requested, Often Problematic)

Features that seem good but create friction or violate project principles.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Visitor user accounts & login | To sync custom lists across devices | Adds friction; kills instant lunch decision; auth drop-off | Anonymous localStorage first; optional export/import JSON if needed. |
| Real-time multiplayer room | "Let's all spin together in the office" | WebSockets, state sync, room codes, complex hosting costs | Client-side shareable result URL or image card. |
| Food delivery / ordering integration | Order directly from Grab/ShopeeFood | Affiliate APIs fragile, restaurant locations hyper-local | Google Maps / delivery search link out using dish name. |
| Over-the-top lootbox gacha FX | Theatrical opening sounds, explosions, tier fanfare | User chose clean minimal redesign; loud SFX annoys office environments | Subtle, tasteful Motion springs, haptic feedback, subtle rarity badge. |
| English i18n | Broader reach | Audience is 100% Vietnamese lunch crowd; translated dish names lose local nuance | Vietnamese-only UI with native diacritic typography. |

## Feature Dependencies

```
[Database & Seed Data]
    └──requires──> [Turso DB Setup]
[Dish Library (/dishes)]
    └──requires──> [Database & Seed Data]
[Spin Engine]
    └──requires──> [Database & Seed Data]
[4 Picker Presentation Modes]
    └──requires──> [Spin Engine]
[Global Spin Counter]
    └──requires──> [Spin Engine (atomic increment)]
[Custom Lists (Hòm của tôi)]
    └──requires──> [Spin Engine (custom pool support)]
[Admin CMS Dishes/Categories]
    └──requires──> [Better Auth (admin credentials)]
    └──requires──> [Database Schema]
[Admin CMS Site Settings]
    └──requires──> [Better Auth (admin credentials)]
[Fun Extras (Quẻ trưa, Duyên vị, Khui vị)]
    └──requires──> [Admin CMS Site Settings (content source)]
```

### Dependency Notes

- **Spin Engine requires Database & Seed Data:** Random picker must query or cache seeded dish pool filtered by category/budget.
- **4 Picker Modes require Spin Engine:** Presentation modes share the exact same outcome engine; only visual representation switches.
- **Admin CMS requires Better Auth:** Gated `/admin` route group and Server Actions protected by session verification.
- **Fun Extras require Site Settings:** Text for fortunes and copy comes from DB settings table.

## MVP Definition

### Launch With (v1)

- [ ] Core Spin Engine: random dish selection filtered by budget and category tab.
- [ ] 4 Picker Modes: Roulette wheel, Card shuffle + flip, Slot reel, Ngẫu hứng (random mode selector).
- [ ] Dish Result Card: dish title, subtitle, price in VND, category, subtle rarity badge, spin-again button.
- [ ] Dish Library page (`/dishes`): searchable, filterable grid of all available dishes.
- [ ] Global Spin Counter: visible site-wide counter incrementing on server.
- [ ] Custom Lists: browser-stored personal dish list, ability to spin from custom list.
- [ ] Fun Extras: Quẻ trưa (daily fortune), Duyên vị, Khui vị (minimal redesign).
- [ ] Admin Auth: email + password login at `/admin/login`.
- [ ] Admin CMS Dishes: CRUD dish with image, price, rarity, tags, categories.
- [ ] Admin CMS Content: edit Quẻ trưa fortunes, homepage copy, default picker mode.
- [ ] Admin CMS Stats: view total spin count.
- [ ] Initial Data Seed: port complete dataset from original `truanayangi-com/truanayangi` repo.

### Add After Validation (v1.x)

- [ ] Shareable spin result card (dynamic OG image or downloadable image).
- [ ] Export / import custom lists as JSON.
- [ ] Advanced admin analytics (spins per dish, popular budget ranges).

### Future Consideration (v2+)

- [ ] Nearby food spot suggestions (Google Places API integration).
- [ ] Multi-day lunch planner / meal calendar.

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Spin Box & Filters | HIGH | MEDIUM | P1 |
| 4 Animated Picker Modes | HIGH | HIGH | P1 |
| Dish Library (/dishes) | MEDIUM | LOW | P1 |
| Global Spin Counter | MEDIUM | LOW | P1 |
| Admin CMS (Dishes + Categories) | HIGH | MEDIUM | P1 |
| Admin Auth (Better Auth) | HIGH | MEDIUM | P1 |
| Admin CMS (Settings + Fortunes) | MEDIUM | LOW | P1 |
| Data Seeding (original repo) | HIGH | LOW | P1 |
| Custom Lists (localStorage) | MEDIUM | MEDIUM | P1 |
| Quẻ trưa & Fun Extras | MEDIUM | MEDIUM | P1 |
| Share Result Card (OG Image) | MEDIUM | MEDIUM | P2 |

## Sources

- Original open-source repository: https://github.com/truanayangi-com/truanayangi
- Production reference: https://truanayangi.com
- User configuration choices: 2026-09-13 GSD questioning

---
*Feature research for: Vietnamese lunch-picker web app*
*Researched: 2026-09-13*
