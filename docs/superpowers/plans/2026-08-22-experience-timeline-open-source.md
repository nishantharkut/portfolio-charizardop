# Experience Timeline and Open Source Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a restrained GSAP work timeline and a verified open-source section with Nishant's actual GitHub contribution graph.

**Architecture:** Keep page composition in `ExperienceClient.tsx`, isolate ScrollTrigger lifecycle and responsive timeline markup in `ExperienceTimeline.tsx`, and isolate GitHub/open-source presentation in `OpenSourceExperience.tsx`. Store open-source facts in `experience.json` and expose them through typed data accessors.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS, GSAP ScrollTrigger, Puppeteer verification

---

### Task 1: Define Observable Page Behaviour

**Files:**
- Modify: `scripts/verification/verify-experience-footer.mjs`

- [ ] **Step 1: Add failing browser assertions**

Collect `data-experience-timeline`, `data-timeline-progress`, `data-timeline-node`, `data-open-source-entry`, and `data-github-contribution-graph`. Assert two work entries, two timeline nodes, three open-source rows, the `Aug. 2025 - Aug. 2026` QuickIntell date, no horizontal overflow, and a rendered GitHub chart or fallback.

- [ ] **Step 2: Run the focused verification**

Run: `node scripts/verification/verify-experience-footer.mjs`

Expected: FAIL because the current ledger does not expose the approved timeline or open-source structure.

### Task 2: Add Typed Open-Source Data

**Files:**
- Modify: `src/data/experience.json`
- Modify: `src/data/index.ts`

- [ ] **Step 1: Add verified records**

Add `openSourceContributions` with `organization`, `mergedPullRequests`, `scope`, and `url` fields for Learning Unlimited, Kiwix, and Palisadoes Foundation.

- [ ] **Step 2: Add the data contract**

```ts
export interface OpenSourceContribution {
  organization: string;
  mergedPullRequests: number;
  scope: string;
  url: string;
}

export const getOpenSourceContributions = (): OpenSourceContribution[] =>
  experienceData.openSourceContributions;
```

- [ ] **Step 3: Run type checking**

Run: `npm run type-check`

Expected: PASS.

### Task 3: Build The GSAP Timeline

**Files:**
- Create: `src/app/experience/ExperienceTimeline.tsx`

- [ ] **Step 1: Implement stable timeline markup**

Render one `article[data-work-entry]` per experience item in a responsive date/rail/content grid. Render one `data-timeline-node` per item and a single `data-timeline-progress` element. Use standard text lists for technologies and selected work.

- [ ] **Step 2: Add focused ScrollTrigger behaviour**

Use `gsap.context`, `gsap.matchMedia`, and `prefers-reduced-motion`. Scrub only the progress line's `scaleY`; use one class-state callback per entry to mark the active node. Clean up all GSAP state with `context.revert()` and `matchMedia.revert()`.

- [ ] **Step 3: Keep styling restrained**

Use theme borders and text colours. Do not add card backgrounds, orange fills, gradients, shadows, pill-shaped technology tags, or glow effects.

### Task 4: Build The Open-Source Section

**Files:**
- Create: `src/app/experience/OpenSourceExperience.tsx`
- Reuse: `src/app/components/sections/GitHubStats.tsx`

- [ ] **Step 1: Render the real GitHub graph**

Embed `GitHubStats` with `showTitle={false}` and `compact`. Wrap it with `data-github-contribution-graph` while retaining its existing network-error fallback.

- [ ] **Step 2: Render verified contribution rows**

Render three `article[data-open-source-entry]` elements with organization name, exact merged-PR count, factual scope, and repository or organization link. Use unframed rows separated by theme borders.

### Task 5: Compose The Page

**Files:**
- Modify: `src/app/experience/ExperienceClient.tsx`

- [ ] **Step 1: Replace the ledger section**

Keep the current hero and footer intact. Replace the current work-history markup with `ExperienceTimeline` and append `OpenSourceExperience` using `getOpenSourceContributions()`.

- [ ] **Step 2: Remove obsolete page animation**

Delete per-entry Framer Motion wrappers from the work-history content. Retain only the existing hero animation.

- [ ] **Step 3: Run the focused verification**

Run: `node scripts/verification/verify-experience-footer.mjs`

Expected: PASS at 1440, 768, and 390 pixel widths.

### Task 6: Verify Rendering And Regression Safety

**Files:**
- Verify: `src/app/experience/ExperienceClient.tsx`
- Verify: `src/app/experience/ExperienceTimeline.tsx`
- Verify: `src/app/experience/OpenSourceExperience.tsx`

- [ ] **Step 1: Run static checks**

Run: `npm run type-check`

Expected: PASS.

Run: `npm run lint`

Expected: PASS with no new errors.

- [ ] **Step 2: Run the production build**

Run: `npm run build`

Expected: PASS with the Experience and Achievements routes generated.

- [ ] **Step 3: Run focused browser checks**

Run: `node scripts/verification/verify-experience-footer.mjs`

Run: `node scripts/verification/verify-achievements-ledger.mjs`

Expected: both PASS.

- [ ] **Step 4: Inspect screenshots**

Capture `/experience` at 1440x900 and 390x844 in both themes. Verify that the rail tracks the entries, text does not overlap dates, the GitHub graph remains usable, colours remain restrained, and the footer starts after the open-source section.

- [ ] **Step 5: Hold for approval**

Keep all changes local. Share the localhost URL and screenshots; do not push until Nishant approves the page.
