# Phase 5: Admin CMS & Content Management - Context

**Gathered:** 2026-09-13
**Status:** Ready for planning

<domain>
## Phase Boundary

Deliver a secure administrative CMS with email/password authentication, dish and category CRUD operations, fortune text management, site settings configuration (default picker mode, SEO), and total spin statistics.

</domain>

<decisions>
## Implementation Decisions

### Admin Authentication & Session
- Dedicated administrative login at `/admin/login`.
- Session verification check on all `/admin` routes and Server Actions.
- Secure cookie session management.
- Default admin credentials seeded: `admin@truanayangi.com` / `admin123456` (overridable via env `ADMIN_PASSWORD`).

### Admin Dashboard & CRUD
- Dashboard overview at `/admin` showing global spin metrics, total active dishes, category counts, and system status.
- Dishes manager (`/admin/dishes`): table listing with pagination/search, Add/Edit modal, active toggle, image URL input, price, and category.
- Categories manager (`/admin/categories`): edit and reorder category tabs.
- Fortunes manager (`/admin/fortunes`): edit daily fortune quotes and lucky dish pairings.
- Site settings (`/admin/settings`): update default picker mode, homepage tagline, and site metadata with cache revalidation.

### the agent's Discretion
- Clean administrative layout with sidebar navigation, breadcrumbs, and status pills.

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/db/schema.ts` (dishes, categories, fortunes, siteSettings, counters)
- `src/db/index.ts`
- `src/lib/utils.ts` (`formatVND`, `cn`)

</code_context>
