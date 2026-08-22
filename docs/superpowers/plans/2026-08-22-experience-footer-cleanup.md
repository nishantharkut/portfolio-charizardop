# Experience Page and Footer Cleanup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Experience page's decorative below-hero UI with one factual work-history ledger and correct the shared footer navigation.

**Architecture:** Keep the existing Experience hero intact and replace all content between the hero and footer with a single data-driven ledger. Continue sourcing roles from `experience.json`, update the authoritative date/tense there, and keep the footer links in `navigation.json`. A Puppeteer contract verifies content, structure, routes, and responsive overflow.

**Tech Stack:** Next.js, React, TypeScript, Tailwind CSS, Framer Motion, Puppeteer

---

### Task 1: Define the failing Experience and Footer contract

**Files:**
- Create: `scripts/verification/verify-experience-footer.mjs`

- [ ] **Step 1: Add responsive structural assertions**

At `1440x900`, `768x900`, and `390x844`, load `/experience` and assert:

```js
workEntries === 2
quickIntellText.includes('Aug. 2025 - Aug. 2026')
quickIntellText.includes('1 year')
!quickIntellText.includes('Present')
!pageText.includes('Core Competencies')
!pageText.includes('Coding Statistics')
!pageText.includes('Want to Work Together?')
!footerText.includes('CONNECT')
overflow <= 1
```

Assert the unique footer link pairs equal:

```js
[
  'Home|/',
  'About|/about',
  'Experience|/experience',
  'Skills|/#skills',
  'Projects|/projects',
  'Achievements|/achievements',
  'Contact|/#contact',
]
```

- [ ] **Step 2: Run the contract and confirm it fails**

Run: `node scripts/verification/verify-experience-footer.mjs`

Expected: FAIL because the corrected work-entry structure and footer routes do not exist yet.

### Task 2: Correct authoritative Experience and footer data

**Files:**
- Modify: `src/data/experience.json`
- Modify: `src/data/navigation.json`

- [ ] **Step 1: Correct QuickIntell chronology and tense**

Set the duration to `Aug. 2025 - Aug. 2026`, months to `1 year`, and change the overview to past tense without changing evidence bullets or metrics.

- [ ] **Step 2: Replace footer navigation data**

Remove the `CONNECT` section. Set `NAVIGATE` links to Home, About, Experience, Skills, Projects, Achievements, and Contact using the approved href values.

- [ ] **Step 3: Validate both JSON files**

Run:

```bash
node -e "for (const f of ['src/data/experience.json','src/data/navigation.json']) JSON.parse(require('fs').readFileSync(f,'utf8')); console.log('content JSON valid')"
```

Expected: `content JSON valid`

### Task 3: Replace the below-hero Experience UI

**Files:**
- Modify: `src/app/experience/ExperienceClient.tsx`

- [ ] **Step 1: Preserve the hero and remove unused timeline dependencies**

Keep Navbar, the full-height PixelBlast hero, title, supporting sentence, and PageHeroCta. Remove GSAP timeline state, duplicated mobile/desktop render paths, unused skill/highlight imports, CodingStats, and generic CTA dependencies.

- [ ] **Step 2: Render one responsive ledger**

Map `experienceData` once into `article[data-work-entry]`. Use a desktop `11rem / flexible-content` grid and a single mobile column. Each entry renders duration, months, role, company, overview, technologies, and all evidence bullets.

- [ ] **Step 3: Keep styling restrained**

Use full-width rows, thin `var(--color-border)` separators, sentence case, small accent labels, and normal paragraph alignment. Do not use `neubrutalism-card`, alternating alignment, centre-line animation, heavy shadows, or animated technology pills.

- [ ] **Step 4: Remove redundant sections**

After the ledger, render the shared Footer directly. Do not render Core Competencies, CodingStats, or the work-together CTA.

### Task 4: Simplify and correct the Footer

**Files:**
- Modify: `src/app/components/layout/Footer.tsx`

- [ ] **Step 1: Remove unused footer code**

Remove unused imports while retaining the contact/email form, `NAVIGATE` rendering, name block, and bottom social icons.

- [ ] **Step 2: Mark navigation for deterministic verification**

Add `data-footer-navigation` to the navigation wrapper without changing its responsive presentation.

- [ ] **Step 3: Run the browser contract**

Run: `node scripts/verification/verify-experience-footer.mjs`

Expected: `Experience and footer verification passed`.

### Task 5: Verify locally without pushing

**Files:**
- No production files unless verification reveals a scoped defect.

- [ ] **Step 1: Run achievements regression**

Run: `node scripts/verification/verify-achievements-ledger.mjs`

Expected: `Achievements ledger verification passed`.

- [ ] **Step 2: Run static and production checks**

Run `npm run type-check` and `npm run build`; both must exit `0`.

- [ ] **Step 3: Inspect desktop and mobile screenshots**

Inspect `/experience`, `/achievements`, and the footer at `1440x900` and `390x844` for hierarchy, wrapping, alignment, clipping, overflow, and stale content.

- [ ] **Step 4: Commit locally and wait for approval**

Commit the scoped achievements, Experience, Footer, data, tests, logo assets, specs, and plans. Do not push until Nishant approves the local result.
