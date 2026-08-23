# Ember + Cobalt Color System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the public portfolio from an orange-monotone theme to the approved neutral, Ember, and Cobalt color system without changing content, layout, behavior, protected effects, or brand assets.

**Architecture:** `src/app/globals.css` remains the authoritative CSS token source. A small `src/lib/themePalette.ts` mirror provides the same approved values to Canvas/WebGL components that cannot consume CSS variables directly. A deterministic verification script classifies protected files and rejects legacy public orange/yellow hardcodes, while existing Playwright verification and new screenshot comparison cover rendered behavior in both themes.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS 4, CSS custom properties, Playwright CLI, Node.js verification scripts

---

## File Structure

**Create**

- `src/lib/themePalette.ts`: approved light/dark colors for JavaScript-rendered graphics.
- `scripts/verification/verify-color-system.mjs`: deterministic palette-token and legacy-hardcode contract.

**Modify**

- `src/app/globals.css`: authoritative light/dark tokens, neutral structural colors, cobalt roles, and shared control states.
- `src/app/components/styles/Navbar.css`: neutral navigation structure with Ember active and Cobalt focus behavior.
- `src/app/components/layout/Navbar.tsx`: remove any public inline legacy color behavior discovered during implementation.
- `src/app/components/layout/Footer.tsx`: neutral footer structure, Ember signature, and Cobalt links/focus without changing character art.
- `src/app/components/ui/PageHeroCta.tsx`: Ember primary action and Cobalt secondary action.
- `src/app/components/sections/Hero.tsx`: use approved runtime Ember while retaining the existing signature effect.
- `src/app/components/sections/Bento.tsx`: replace the legacy yellow-orange glow with a restrained approved accent.
- `src/app/components/ui/MagicBento.tsx`: neutral card structure and semantic Ember/Cobalt emphasis while retaining original technology colors.
- `src/app/components/sections/Projects.tsx`: neutral project/modal structure and Cobalt secondary interaction.
- `src/app/components/styles/Projects.css`: remove legacy structural grays only where tokens already define the same public role.
- `src/app/experience/ExperienceClient.tsx`: approved hero Ember.
- `src/app/experience/ExperienceTimeline.tsx`: neutral timeline rail, Ember current marker, Cobalt links.
- `src/app/experience/OpenSourceExperience.tsx`: Cobalt source/PR emphasis while preserving logo canvases.
- `src/app/projects/ProjectsClient.tsx`: remove direct Tailwind orange/yellow/black structure and map project UI to semantic tokens.
- `src/app/achievements/AchievementsClient.tsx`: approved hero Ember, neutral structure, and Cobalt evidence links/metadata.
- `src/app/about/AboutClient.tsx`: remove legacy orange utilities and map timeline/skills to semantic roles.

**Explicitly protected and not redesigned**

- `src/app/components/ui/LoadingScreen.tsx`
- `src/app/components/ui/LazyLoader.tsx`
- `src/app/components/ui/LoadingProgress.tsx`
- `src/app/components/ui/LoadingProgressAligned.tsx`
- `src/app/components/ui/SplashCursor.tsx`
- `src/app/admin/**`
- `src/app/_dev/**`
- company/technology/achievement logo assets and project media

### Task 1: Establish the Color Contract

**Files:**

- Create: `scripts/verification/verify-color-system.mjs`
- Reference: `docs/superpowers/specs/2026-08-24-ember-cobalt-color-system-design.md`

- [ ] **Step 1: Write the failing verification script**

Create a Node script that verifies the approved token declarations, scans public source files, and excludes only the protected paths from the design:

```js
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { extname, join, relative, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '../..');
const sourceRoot = join(root, 'src');
const globalsPath = join(sourceRoot, 'app/globals.css');

const protectedPrefixes = [
  'src/app/admin/',
  'src/app/_dev/',
];

const protectedFiles = new Set([
  'src/app/components/ui/LoadingScreen.tsx',
  'src/app/components/ui/LazyLoader.tsx',
  'src/app/components/ui/LoadingProgress.tsx',
  'src/app/components/ui/LoadingProgressAligned.tsx',
  'src/app/components/ui/SplashCursor.tsx',
]);

const requiredTokens = [
  '--color-bg-start: #F8F8F5;',
  '--color-text: #191A1E;',
  '--color-accent: #B25420;',
  '--color-complement: #2859A6;',
  '--color-border: #D9DADE;',
  '--color-bg-start: #0B0D12;',
  '--color-text: #F3F4F7;',
  '--color-accent: #EE884C;',
  '--color-complement: #82A4EE;',
  '--color-border: #2B303B;',
];

const legacyPatterns = [
  /#c96f2e\b/i,
  /#b86326\b/i,
  /#dc8f52\b/i,
  /#a5561e\b/i,
  /#ff9a1c\b/i,
  /\b(?:text|bg|border|from|via|to)-orange-(?:[1-9]00|50)(?:\/\d+)?\b/,
  /\b(?:text|bg|border|from|via|to)-yellow-(?:[1-9]00|50)(?:\/\d+)?\b/,
];

function walk(directory) {
  return readdirSync(directory).flatMap((entry) => {
    const absolute = join(directory, entry);
    return statSync(absolute).isDirectory() ? walk(absolute) : [absolute];
  });
}

const globals = readFileSync(globalsPath, 'utf8');
for (const token of requiredTokens) {
  assert.ok(globals.includes(token), `Missing approved token: ${token}`);
}

const violations = [];
for (const absolute of walk(sourceRoot)) {
  if (!['.css', '.ts', '.tsx'].includes(extname(absolute))) continue;
  const path = relative(root, absolute).replaceAll('\\', '/');
  if (protectedFiles.has(path) || protectedPrefixes.some((prefix) => path.startsWith(prefix))) continue;

  const source = readFileSync(absolute, 'utf8');
  source.split(/\r?\n/).forEach((line, index) => {
    if (line.includes('originalColor:')) return;
    for (const pattern of legacyPatterns) {
      if (pattern.test(line)) violations.push(`${path}:${index + 1}: ${line.trim()}`);
    }
  });
}

assert.deepEqual(violations, [], `Legacy public colors remain:\n${violations.join('\n')}`);
console.log('Ember + Cobalt color-system verification passed');
```

- [ ] **Step 2: Run the contract and verify it fails against the current palette**

Run:

```powershell
node scripts/verification/verify-color-system.mjs
```

Expected: FAIL for missing Cobalt tokens and legacy orange/yellow references in public components.

- [ ] **Step 3: Commit the failing contract**

```powershell
git add scripts/verification/verify-color-system.mjs
git commit -m "Test Ember and Cobalt color contract"
```

### Task 2: Centralize the Approved Theme Tokens

**Files:**

- Create: `src/lib/themePalette.ts`
- Modify: `src/app/globals.css:3-58`
- Modify: `src/app/globals.css:276-438`
- Test: `scripts/verification/verify-color-system.mjs`

- [ ] **Step 1: Add the runtime palette mirror for non-CSS renderers**

Create:

```ts
export const themePalette = {
  light: {
    background: '#F8F8F5',
    surface: '#F3F4F1',
    text: '#191A1E',
    ember: '#B25420',
    cobalt: '#2859A6',
    border: '#D9DADE',
  },
  dark: {
    background: '#0B0D12',
    surface: '#151821',
    text: '#F3F4F7',
    ember: '#EE884C',
    cobalt: '#82A4EE',
    border: '#2B303B',
  },
} as const;

export type VisualTheme = keyof typeof themePalette;
```

- [ ] **Step 2: Replace the root/light token block with the approved light palette**

Use the following authoritative values for `:root` and make `.light` inherit them rather than duplicating an independent palette:

```css
:root {
  --color-bg-start: #F8F8F5;
  --color-bg-end: #F1F2F0;
  --color-text: #191A1E;
  --color-text-secondary: #555961;
  --color-text-muted: #686D76;
  --color-button-text: #FFFFFF;

  --color-accent: #B25420;
  --color-accent-hover: #984619;
  --color-accent-light: #CF7440;
  --color-accent-dark: #873B15;
  --color-accent-transparent: rgba(178, 84, 32, 0.22);
  --color-accent-glow: rgba(178, 84, 32, 0.16);

  --color-complement: #2859A6;
  --color-complement-hover: #1F4788;
  --color-complement-light: #DDE7F7;
  --color-complement-transparent: rgba(40, 89, 166, 0.18);
  --color-focus: #2859A6;

  --color-surface: #F3F4F1;
  --color-surface-hover: #ECEEEA;
  --color-surface-elevated: #FFFFFF;
  --color-border: #D9DADE;
  --color-border-hover: #BFC3CC;
  --color-border-light: rgba(25, 26, 30, 0.10);
}
```

Retain the current status-color declarations. Change card, glass, grid, and shadow variables to derive from neutral border/surface values, not orange.

- [ ] **Step 3: Replace the dark token block with the approved dark palette**

```css
.dark {
  --color-bg-start: #0B0D12;
  --color-bg-end: #11141C;
  --color-text: #F3F4F7;
  --color-text-secondary: #B8BDC8;
  --color-text-muted: #949BA9;
  --color-button-text: #0B0D12;

  --color-accent: #EE884C;
  --color-accent-hover: #F29B67;
  --color-accent-light: #F0A276;
  --color-accent-dark: #BA5B2C;
  --color-accent-transparent: rgba(238, 136, 76, 0.24);
  --color-accent-glow: rgba(238, 136, 76, 0.18);

  --color-complement: #82A4EE;
  --color-complement-hover: #A2BCF4;
  --color-complement-light: #24375E;
  --color-complement-transparent: rgba(130, 164, 238, 0.20);
  --color-focus: #82A4EE;

  --color-surface: #151821;
  --color-surface-hover: #1B2030;
  --color-surface-elevated: #1C202B;
  --color-border: #2B303B;
  --color-border-hover: #414958;
  --color-border-light: rgba(243, 244, 247, 0.10);
}
```

Retain status colors and replace white neubrutalist shadows with restrained neutral dark-mode boundaries so they do not dominate the palette.

- [ ] **Step 4: Make shared component primitives semantic**

Update `.neubrutalism-*`, `.neu-card*`, `.neu-button-*`, glass, card, link, selection, focus-visible, scrollbar, and skeleton rules:

```css
.neu-card,
.neu-card-elevated,
.neu-card-tag,
.neubrutalism-card,
.neubrutalism-tag {
  border-color: var(--color-border);
}

.neu-button-primary {
  background-color: var(--color-accent);
  border-color: var(--color-text);
}

.neu-button-secondary {
  background-color: var(--color-surface-elevated);
  border-color: var(--color-complement);
}

:where(a, button, input, textarea, select):focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 3px;
}
```

- [ ] **Step 5: Run targeted checks**

Run:

```powershell
npx eslint src/lib/themePalette.ts
npx tsc --noEmit
node scripts/verification/verify-color-system.mjs
```

Expected: ESLint and type-check PASS. The color contract still FAILS only for public component hardcodes addressed in later tasks.

- [ ] **Step 6: Commit the token foundation**

```powershell
git add src/lib/themePalette.ts src/app/globals.css
git commit -m "Establish Ember and Cobalt theme tokens"
```

### Task 3: Migrate Shared Navigation, Hero Controls, and Footer

**Files:**

- Modify: `src/app/components/styles/Navbar.css`
- Modify: `src/app/components/layout/Navbar.tsx`
- Modify: `src/app/components/layout/Footer.tsx`
- Modify: `src/app/components/ui/PageHeroCta.tsx`

- [ ] **Step 1: Replace structural accent usage in navigation**

Apply this role mapping throughout the navbar CSS and JSX:

```css
/* Structure */
border-color: var(--color-border);
background-color: var(--color-bg-start);

/* Active route */
color: var(--color-accent);
text-decoration-color: var(--color-accent);

/* Hover and keyboard focus */
color: var(--color-complement);
outline-color: var(--color-focus);
```

Keep the logo black/white and preserve mobile-menu dimensions and animation.

- [ ] **Step 2: Give PageHeroCta separate primary and secondary roles**

Keep the primary action Ember and change the Home/back action to Cobalt interaction:

```tsx
const primaryStyle = {
  backgroundColor: 'var(--color-accent)',
  borderColor: 'var(--color-accent)',
  color: 'var(--color-button-text)',
};

// Back action
style={{
  borderColor: 'var(--color-complement)',
  color: 'var(--color-complement)',
}}
```

Preserve text, icons, spacing, and `nishant.dev` signature.

- [ ] **Step 3: Rebalance the footer without changing its layout or character art**

Map ordinary dividers and grid lines to `--color-border`, navigation/social links to Cobalt on hover/focus, the primary contact action to Ember, and the character art to muted neutral text. Do not alter the ASCII/character content, footer geometry, destinations, or responsive behavior.

- [ ] **Step 4: Run shared-component checks**

```powershell
npx eslint src/app/components/layout/Navbar.tsx src/app/components/layout/Footer.tsx src/app/components/ui/PageHeroCta.tsx
npx tsc --noEmit
```

Expected: PASS.

- [ ] **Step 5: Commit shared layout colors**

```powershell
git add src/app/components/styles/Navbar.css src/app/components/layout/Navbar.tsx src/app/components/layout/Footer.tsx src/app/components/ui/PageHeroCta.tsx
git commit -m "Apply semantic colors to shared layout"
```

### Task 4: Migrate the Landing Page and Bento System

**Files:**

- Modify: `src/app/components/sections/Hero.tsx`
- Modify: `src/app/components/sections/Bento.tsx`
- Modify: `src/app/components/ui/MagicBento.tsx`
- Modify: `src/app/components/sections/Projects.tsx`
- Modify: `src/app/components/styles/Projects.css`
- Test: `scripts/verification/verify-home-project-scroll.mjs`

- [ ] **Step 1: Use runtime palette values for the hero renderer**

Import `themePalette` and use the current `actualTheme` value for renderer props that require concrete colors:

```tsx
import { themePalette } from '@/lib/themePalette';

const visualColors = themePalette[actualTheme];

<PixelBlast color={visualColors.ember} />
```

Keep existing hero glow geometry, WebGL behavior, copy, CTA layout, and current orange-linked signature effect.

- [ ] **Step 2: Replace the Bento wrapper's legacy glow**

Change `glowColor="255, 179, 71"` to the approved restrained Cobalt RGB value:

```tsx
<MagicBento glowColor="40, 89, 166" />
```

Inside `MagicBento.tsx`, use the dark-mode Cobalt RGB value when theme-specific glow logic already exists.

- [ ] **Step 3: Classify MagicBento colors rather than replacing every literal**

Apply these exact mappings:

| Current role | New role |
| --- | --- |
| Card border and ordinary hover boundary | `var(--color-border)` / `var(--color-border-hover)` |
| Profile/current-status emphasis | `var(--color-accent)` |
| Technical data, PR counts, and secondary links | `var(--color-complement)` |
| Selected technical background | `var(--color-complement-transparent)` |
| Technology `originalColor` values | Preserve unchanged |
| LinkedIn, GitHub, coding-platform brand colors | Preserve unchanged |
| Neutral black/white renderer math | Preserve when not user-facing |

Replace Tailwind orange utilities in public card UI with arbitrary semantic-variable utilities such as `text-[var(--color-accent)]` and `bg-[var(--color-complement-transparent)]`.

- [ ] **Step 4: Migrate home project cards and modals**

In `sections/Projects.tsx`:

- change structural `border-black` to `border-[var(--color-border)]`
- use Ember for primary project numbers/actions
- use Cobalt for repository/secondary actions and informational badges
- change yellow `Featured` badges to Cobalt-light backgrounds with Cobalt text
- use theme button text tokens instead of hardcoded `text-black`
- preserve project screenshots and image framing

Use:

```tsx
className="border-2 border-[var(--color-border)] bg-[var(--color-complement-light)] text-[var(--color-complement)]"
```

for informational badges, and:

```tsx
style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-button-text)' }}
```

for primary actions.

- [ ] **Step 5: Run landing-page checks**

```powershell
npx eslint src/app/components/sections/Hero.tsx src/app/components/sections/Bento.tsx src/app/components/ui/MagicBento.tsx src/app/components/sections/Projects.tsx
npx tsc --noEmit
$env:BASE_URL='http://localhost:3000'; node scripts/verification/verify-home-project-scroll.mjs
```

Expected: lint/type PASS and homepage project scroll PASS at the existing test viewport.

- [ ] **Step 6: Commit landing-page migration**

```powershell
git add src/app/components/sections/Hero.tsx src/app/components/sections/Bento.tsx src/app/components/ui/MagicBento.tsx src/app/components/sections/Projects.tsx src/app/components/styles/Projects.css
git commit -m "Rebalance landing page with Cobalt accents"
```

### Task 5: Migrate the Experience Page

**Files:**

- Modify: `src/app/experience/ExperienceClient.tsx`
- Modify: `src/app/experience/ExperienceTimeline.tsx`
- Modify: `src/app/experience/OpenSourceExperience.tsx`
- Test: `scripts/verification/verify-experience-footer.mjs`

- [ ] **Step 1: Replace the hero renderer's legacy orange**

Use `themePalette[actualTheme].ember` for concrete renderer props and retain CSS-variable Ember for the selected hero word and primary CTA.

- [ ] **Step 2: Make work-history structure neutral**

Apply:

```tsx
style={{ borderColor: 'var(--color-border)' }}
```

to timeline rails and ordinary dividers. Keep the primary/current role marker Ember. Change company links and external-link icons to Cobalt. Preserve company logos and technology icon colors.

- [ ] **Step 3: Give open-source evidence the Cobalt role**

Use Cobalt for merged-PR counts, GitHub links, source links, and focus states. Keep organization-logo containers white when the actual logo needs a white canvas for legibility. Keep section borders neutral.

- [ ] **Step 4: Run experience checks**

```powershell
npx eslint src/app/experience/ExperienceClient.tsx src/app/experience/ExperienceTimeline.tsx src/app/experience/OpenSourceExperience.tsx
npx tsc --noEmit
$env:BASE_URL='http://localhost:3000'; node scripts/verification/verify-experience-footer.mjs
```

Expected: PASS, including duration labels, company links, GitHub graph shell, and footer behavior.

- [ ] **Step 5: Commit experience migration**

```powershell
git add src/app/experience/ExperienceClient.tsx src/app/experience/ExperienceTimeline.tsx src/app/experience/OpenSourceExperience.tsx
git commit -m "Apply Ember and Cobalt to experience"
```

### Task 6: Migrate the Projects Route

**Files:**

- Modify: `src/app/projects/ProjectsClient.tsx`
- Test: `scripts/verification/verify-project-card-layout.mjs`

- [ ] **Step 1: Replace legacy hero colors**

Use runtime Ember for concrete renderer props, CSS Ember for the selected hero word, and the shared `PageHeroCta` roles.

- [ ] **Step 2: Replace hardcoded project-card and modal colors**

Perform the same semantic mapping as the landing-page project section:

| Existing treatment | Replacement |
| --- | --- |
| `border-black` structural borders | `border-[var(--color-border)]` |
| `bg-orange-400/500` primary action or project number | `bg-[var(--color-accent)]` |
| `text-black` on primary fill | `text-[var(--color-button-text)]` |
| `bg-yellow-400` featured/information badge | Cobalt-light background and Cobalt text |
| `border-orange-500` ordinary tag border | Cobalt for technical tags, neutral for structure |
| orange bullet in feature lists | Cobalt bullet unless it marks the primary project identity |
| close-button neutral state | neutral border/surface, Cobalt focus/hover |

Preserve images, aspect ratios, modal dimensions, close behavior, scrolling, and external-link destinations.

- [ ] **Step 3: Run project checks**

```powershell
npx eslint src/app/projects/ProjectsClient.tsx
npx tsc --noEmit
$env:BASE_URL='http://localhost:3000'; node scripts/verification/verify-project-card-layout.mjs
```

Expected: PASS at 390px, 768px, and 1440px with no overlap or clipping.

- [ ] **Step 4: Commit projects migration**

```powershell
git add src/app/projects/ProjectsClient.tsx
git commit -m "Apply semantic colors to project cards"
```

### Task 7: Migrate Achievements and About

**Files:**

- Modify: `src/app/achievements/AchievementsClient.tsx`
- Modify: `src/app/about/AboutClient.tsx`
- Test: `scripts/verification/test-achievements-responsive.js`

- [ ] **Step 1: Update achievements**

Use runtime Ember for the hero renderer. Keep title emphasis and primary CTA Ember. Change evidence links, source links, dates, category labels, and technical metadata to Cobalt. Keep ordinary dividers neutral and achievement logos unchanged.

- [ ] **Step 2: Update About without flattening its hierarchy**

Replace:

- `text-orange-*` identity emphasis with Ember variables
- technical/skill tags with Cobalt borders/text and Cobalt-light backgrounds
- the orange timeline rail with a neutral rail
- primary timeline markers with Ember
- secondary icons and links with Cobalt
- direct `#ff9a1c` with the appropriate semantic token

Keep content, layout, profile media, timelines, and existing interactive behavior unchanged.

- [ ] **Step 3: Run route checks**

```powershell
npx eslint src/app/achievements/AchievementsClient.tsx src/app/about/AboutClient.tsx
npx tsc --noEmit
node scripts/verification/test-achievements-responsive.js
```

Expected: PASS with no achievements overflow at covered viewports.

- [ ] **Step 4: Commit route migration**

```powershell
git add src/app/achievements/AchievementsClient.tsx src/app/about/AboutClient.tsx
git commit -m "Finish public route color migration"
```

### Task 8: Complete the Hardcoded-Color Audit

**Files:**

- Modify only if public defects remain: `src/components/ui/LazyImage.tsx`
- Modify only if public defects remain: `src/hooks/useLazyImage.tsx`
- Modify only if public defects remain: `src/styles/performance.css`
- Modify only if public defects remain: `src/app/components/ui/FaultyTerminal.tsx`
- Modify only if public defects remain: `src/app/components/ui/DitherClient.tsx`
- Modify only if public defects remain: `src/app/components/ui/LogoLoop.tsx`
- Test: `scripts/verification/verify-color-system.mjs`

- [ ] **Step 1: Run the deterministic contract**

```powershell
node scripts/verification/verify-color-system.mjs
```

Expected: PASS. Any failure must be classified against the six audit categories in the design specification before editing.

- [ ] **Step 2: Run a broader diagnostic scan**

```powershell
$pattern='#[0-9A-Fa-f]{3,8}\b|rgba?\(|hsla?\(|(?:text|bg|border|from|via|to|shadow|ring|fill|stroke)-(?:orange|amber|yellow|red|blue|cyan|sky|teal|indigo|violet|purple|slate|gray|zinc|neutral|stone|black|white)-?[0-9/\[\].]*'
rg -n -i --glob '!**/*.svg' --glob '!**/*.map' --glob '!**/node_modules/**' $pattern src
```

Review every remaining result. Do not edit protected loaders, cursor effects, brand colors, semantic statuses, admin, diagnostics, project media, or renderer math without a visible public defect.

- [ ] **Step 3: Verify the protected elements are byte-for-byte unchanged**

```powershell
git diff 9269bac -- src/app/components/ui/LoadingScreen.tsx src/app/components/ui/LazyLoader.tsx src/app/components/ui/LoadingProgress.tsx src/app/components/ui/LoadingProgressAligned.tsx src/app/components/ui/SplashCursor.tsx src/app/admin src/app/_dev
```

Expected: no output.

- [ ] **Step 4: Commit any justified final cleanup**

If no files changed, skip the commit. Otherwise:

```powershell
git add src/components/ui/LazyImage.tsx src/hooks/useLazyImage.tsx src/styles/performance.css src/app/components/ui/FaultyTerminal.tsx src/app/components/ui/DitherClient.tsx src/app/components/ui/LogoLoop.tsx
git commit -m "Remove remaining public legacy colors"
```

### Task 9: Visual and Behavioral Verification

**Files:**

- Test: `scripts/verification/verify-color-system.mjs`
- Test: `scripts/verification/verify-home-project-scroll.mjs`
- Test: `scripts/verification/verify-project-card-layout.mjs`
- Test: `scripts/verification/verify-experience-footer.mjs`
- Test: `scripts/verification/verify-service-worker-retirement.mjs`
- Output only: `output/color-audit-after/**`

- [ ] **Step 1: Run static verification and production build**

```powershell
node scripts/verification/verify-color-system.mjs
npx tsc --noEmit
npm run build
```

Expected: all commands exit 0 with no type or build errors.

- [ ] **Step 2: Start the production build locally**

```powershell
npm run start -- --port 3000
```

Expected: Next.js serves `http://localhost:3000`. Use another free port if 3000 is occupied and set `BASE_URL` accordingly.

- [ ] **Step 3: Run behavioral regression checks**

```powershell
$env:BASE_URL='http://localhost:3000'
node scripts/verification/verify-home-project-scroll.mjs
node scripts/verification/verify-project-card-layout.mjs
node scripts/verification/verify-experience-footer.mjs
node scripts/verification/verify-service-worker-retirement.mjs
```

Expected: every verification passes.

- [ ] **Step 4: Capture the public pages in both themes and all representative sizes**

Capture `/`, `/about`, `/experience`, `/projects`, and `/achievements` at:

- 1440 x 1000
- 768 x 1024
- 390 x 844

Capture both light and dark modes. Store output only under `output/color-audit-after/`. Inspect initial viewport, mid-page content, menus, project modals, GitHub graph shell, and footer.

- [ ] **Step 5: Run the human visual checklist**

Confirm:

- Orange is still the immediate brand signal.
- Cobalt appears only for technical information and secondary interaction.
- Cards, dividers, grids, and inactive controls are neutral.
- No page reads as orange-only, blue-only, or alternating orange/blue decoration.
- Text and controls remain legible in both themes.
- Logos and project media retain original colors.
- Loader and custom cursor are unchanged.
- No layout shift, overlap, clipping, or responsive regression appears.
- Browser console shows no new errors or hydration warnings.

- [ ] **Step 6: Commit verification-driven fixes**

Stage only files changed to fix verified issues:

```powershell
git add src scripts/verification/verify-color-system.mjs
git commit -m "Verify Ember and Cobalt across public portfolio"
```

Skip this commit if verification required no code changes.

### Task 10: Final Review and Delivery

**Files:**

- Review: all branch changes relative to `main`

- [ ] **Step 1: Review the complete diff for scope**

```powershell
git diff --stat main...HEAD
git diff --check main...HEAD
git status --short
```

Expected: only approved public color-system files, the palette helper, verification script, specification, and plan are tracked changes. Existing unrelated untracked files remain untouched.

- [ ] **Step 2: Re-run final high-signal checks**

```powershell
node scripts/verification/verify-color-system.mjs
npx tsc --noEmit
npm run build
```

Expected: PASS.

- [ ] **Step 3: Present local screenshots for approval**

Provide the local URL and the representative light/dark screenshots. Do not push or deploy until Nishant approves the rendered palette.

- [ ] **Step 4: Push only after explicit approval**

```powershell
git push -u origin feat/ember-cobalt-color-system
```

Do not merge or deploy unless explicitly requested after visual approval.
