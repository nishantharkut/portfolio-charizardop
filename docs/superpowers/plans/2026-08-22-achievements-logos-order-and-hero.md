# Achievements Logos, Ordering, and Hero Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restore the shared achievements hero, add restrained identity logos, remove the unsupported council role, and guarantee newest-first ordering.

**Architecture:** Keep `achievements.json` as the content source and add optional `logo` and `sortDate` metadata. `AchievementsClient.tsx` will render a small brand mark only when `logo` exists and will sort cloned collections before rendering. The existing Puppeteer contract will cover content, order, hero placement, and responsive overflow.

**Tech Stack:** Next.js, React, TypeScript, Tailwind CSS, Framer Motion, React Icons, Puppeteer

---

### Task 1: Define the failing page contract

**Files:**
- Modify: `scripts/verification/verify-achievements-ledger.mjs`

- [ ] **Step 1: Add assertions for the corrected behavior**

Extend the page evaluation to collect the hero height, evidence position/count, visible page text, leadership titles, and rendered identity-logo count. Assert that:

```js
result.heroHeight >= viewport.height - 1
result.evidenceTop >= viewport.height - 1
result.evidenceCount === 4
!result.pageText.includes('Overall Head, Student Activity Council')
!result.pageText.includes('3 roles')
result.pageText.includes('10+')
result.leadershipTitles.join('|') === [
  'Member, IAENG',
  'Operations Manager, Rotaract Club',
  'Design Team Lead, Entrepreneurship Cell',
  'Joint Secretary, SAC Welfare',
  'Executive, SAC Sports',
  'Social Media Volunteer, Aurora',
  "Alumni Meet '24 Representative",
  'Squad Leader, Mood Indigo',
  "Operations Team Lead, Hindi Pakhwada '23",
].join('|')
result.identityLogos >= 10
```

- [ ] **Step 2: Run the contract and confirm it fails for the current page**

Run: `node scripts/verification/verify-achievements-ledger.mjs`

Expected: FAIL because the current hero is shorter than the viewport and the removed council content is still present.

### Task 2: Correct data and logo metadata

**Files:**
- Modify: `src/data/index.ts`
- Modify: `src/data/achievements.json`
- Add selected files: `public/assets/logos/economic-times.svg`, `public/assets/logos/ecell.png`, `public/assets/logos/iiitm.png`, `public/assets/logos/rotaract.png`

- [ ] **Step 1: Extend achievement types**

Add optional fields to `Achievement` and `Award`:

```ts
logo?: string;
sortDate?: string;
```

- [ ] **Step 2: Remove the council overall-head entry**

Delete achievement ID `4` completely. Do not modify the two earlier, independently dated SAC roles.

- [ ] **Step 3: Add deterministic dates and recognised logo identifiers**

Use ISO-like `sortDate` values for leadership end dates, with `9999-12` for the ongoing IAENG membership. Use React Icon keys for Amazon, GitHub, Flipkart, Odoo, Adobe, HP, and IEEE; use local image paths for Economic Times, IIITM, E-Cell, and Rotaract. Leave `logo` absent for entries without a clean identity asset.

- [ ] **Step 4: Keep JSON valid**

Run: `node -e "JSON.parse(require('fs').readFileSync('src/data/achievements.json','utf8')); console.log('achievements.json valid')"`

Expected: `achievements.json valid`

### Task 3: Restore the hero and render the ledger deterministically

**Files:**
- Modify: `src/app/achievements/AchievementsClient.tsx`

- [ ] **Step 1: Add a compact identity-logo renderer**

Create a local `IdentityLogo` component that maps known keys to React Icons and renders local image paths with `next/image`. Return `null` when no logo exists, so rows do not reserve an empty box.

- [ ] **Step 2: Restore the shared page hero**

Use `h-screen`, the `My Achievements` title with accent underline, the existing supporting sentence, and the standard `View all` CTA. Keep the four-item evidence section immediately after the hero and change its fourth item to:

```ts
{ value: '10+', label: 'Hackathon finalist appearances' }
```

- [ ] **Step 3: Remove stale selection and sort copied collections**

Replace the selected council milestone with the Economic Times semifinal result. Sort award groups by numeric year descending and leadership entries by `sortDate` descending without mutating imported JSON arrays.

- [ ] **Step 4: Add identity marks without blank placeholders**

Render `IdentityLogo` in selected milestones, recognised competition rows, and recognised leadership rows. Add `data-identity-logo` to the rendered mark and `data-leadership-title` to leadership headings for verification.

- [ ] **Step 5: Run the contract and confirm it passes**

Run: `node scripts/verification/verify-achievements-ledger.mjs`

Expected: `Achievements ledger verification passed`

### Task 4: Verify responsive output and build integrity

**Files:**
- No production files unless verification reveals a scoped defect.

- [ ] **Step 1: Run static checks**

Run: `npm run type-check`

Expected: exit code `0`.

- [ ] **Step 2: Run the production build**

Run: `npm run build`

Expected: exit code `0` with `/achievements` generated successfully.

- [ ] **Step 3: Inspect desktop and mobile screenshots**

Capture `/achievements` at `1440x900` and `390x844`. Confirm full-height hero consistency, the evidence strip below the first viewport, uncropped marks, reverse chronology, no horizontal overflow, and no empty logo columns.

- [ ] **Step 4: Commit and push the scoped update**

Stage only the plan/spec, verification script, achievements data/types/page, and selected logo assets. Commit with `fix: restore achievements hierarchy and identity marks`, then push `content/portfolio-2026-refresh` to update PR #5.
