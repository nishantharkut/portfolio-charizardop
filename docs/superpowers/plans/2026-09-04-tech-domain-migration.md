# Portfolio `.tech` Domain Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace every tracked portfolio-domain reference with the canonical `https://www.nishantharkut.tech` origin and keep apex-domain routing correct.

**Architecture:** Treat `www.nishantharkut.tech` as the canonical origin because the deployed apex domain redirects there. Cover the migration with a repository-wide legacy-domain check and the existing host-routing integration check, then update metadata, structured data, sitemap, robots, middleware, verification scripts, and domain documentation together.

**Tech Stack:** Next.js 15 metadata APIs, TypeScript, Node.js verification scripts, Vercel

---

### Task 1: Establish failing domain checks

**Files:**

- Create: `scripts/verification/verify-domain-migration.mjs`
- Modify: `scripts/verification/verify-apex-domain-routing.mjs`

- [ ] Add a tracked-file scan that rejects the former `.dev` domain and obsolete `.com` portfolio URL.
- [ ] Change the routing assertions to use `nishantharkut.tech` and `www.nishantharkut.tech`.
- [ ] Run the checks and confirm they fail against the existing `.dev` implementation.

### Task 2: Update the canonical origin everywhere

**Files:**

- Modify: `src/app/layout.tsx`
- Modify: `src/app/about/page.tsx`
- Modify: `src/app/achievements/page.tsx`
- Modify: `src/app/experience/page.tsx`
- Modify: `src/app/projects/page.tsx`
- Modify: `src/app/robots.ts`
- Modify: `src/app/sitemap.ts`
- Modify: `src/middleware.ts`
- Modify: `src/app/components/layout/Navbar.tsx`
- Modify: `src/app/components/styles/Navbar.css`
- Modify: `src/app/components/ui/PageHeroCta.tsx`
- Modify: `docs/SEO_Implementation_Guide.md`
- Modify: `docs/superpowers/plans/2026-08-23-apex-service-worker-recovery.md`
- Modify: `docs/superpowers/specs/2026-08-23-apex-service-worker-recovery-design.md`

- [ ] Replace all portfolio origins with `https://www.nishantharkut.tech`.
- [ ] Replace the legacy short-domain branding with `nishant.tech` and use the existing Gmail address in structured data.
- [ ] Keep `nishantharkut.tech` as the apex host and preserve paths and query strings when redirecting.
- [ ] Run the tracked-file scan and confirm no former portfolio domains remain.

### Task 3: Verify the built application

**Files:**

- No additional files.

- [ ] Run TypeScript checking and a production build.
- [ ] Run the host-routing verification against the production server.
- [ ] Verify page canonicals, Open Graph URLs, JSON-LD, `robots.txt`, and `sitemap.xml` use the `.tech` domain.
- [ ] Confirm desktop and mobile pages load without console errors or horizontal overflow.
- [ ] Commit only the domain-migration files and publish after all checks pass.
