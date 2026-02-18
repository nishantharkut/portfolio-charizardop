# Portfolio Redesign Plan — Comprehensive Implementation Guide

> **Design Direction**: Monochrome base (black/white/gray) + orange accent sparingly. Lighter neubrutalism (2px borders, 4px shadows). Full-bleed 3D hero. Fluid typography. Generous whitespace. All animations kept.

---

## Table of Contents

1. [Design System Foundation](#1-design-system-foundation)
2. [Typography Overhaul](#2-typography-overhaul)
3. [Spacing & Layout Standardization](#3-spacing--layout-standardization)
4. [Color System Cleanup](#4-color-system-cleanup)
5. [Hero Section Redesign](#5-hero-section-redesign)
6. [Homepage Structure](#6-homepage-structure)
7. [Section-by-Section Fixes](#7-section-by-section-fixes)
8. [Subpage Fixes](#8-subpage-fixes)
9. [Component Extraction & Cleanup](#9-component-extraction--cleanup)
10. [Data File Cleanup](#10-data-file-cleanup)
11. [CSS Cleanup](#11-css-cleanup)
12. [Verification Checklist](#12-verification-checklist)

---

## 1. Design System Foundation

### 1.1 Populate `NeuCard.tsx` (Currently Empty)

**File**: `src/app/components/ui/NeuCard.tsx`

Currently this file is **0 lines / empty**. Every section re-implements neubrutalism card styling with inline styles and JS hover handlers. There are 20+ places in the codebase doing this:

```tsx
// Current pattern repeated everywhere (Skills.tsx, Contact.tsx, CodingStats.tsx, etc.):
<div
  style={{
    borderColor: 'var(--color-accent)',
    boxShadow: '8px 8px 0px 0px var(--shadow-neubrutalism)',
    backgroundColor: 'var(--color-surface)',
  }}
  className="border-4 ..."
  onMouseEnter={(e) => {
    e.currentTarget.style.boxShadow = '4px 4px 0px 0px var(--shadow-neubrutalism-hover)';
    e.currentTarget.style.transform = 'translate(4px, 4px)';
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.boxShadow = '8px 8px 0px 0px var(--shadow-neubrutalism)';
    e.currentTarget.style.transform = 'translate(0, 0)';
  }}
>
```

**Create a reusable component with these variants:**

| Variant | Border | Shadow Offset | Use Case |
|---------|--------|--------------|----------|
| `default` | `2px` | `4px 4px` | Standard cards (skills groups, experience cards, contact wrapper) |
| `elevated` | `2px` | `6px 6px` | Featured/hero cards, modal containers |
| `tag` | `1px` | `2px 2px` | Skill tags, tech badges, category labels |

**Props interface:**
```tsx
interface NeuCardProps {
  variant?: 'default' | 'elevated' | 'tag';
  hoverable?: boolean;        // enables hover animation (default: true)
  className?: string;         // additional classes
  children: React.ReactNode;
  as?: 'div' | 'article' | 'section';  // semantic HTML element
}
```

**Key changes from current:**
- `border-4` → `border-2` (halves visual weight)
- `8px 8px` shadow → `4px 4px` shadow (halves shadow offset)
- JS `onMouseEnter`/`onMouseLeave`/`onTouchStart`/`onTouchEnd` → CSS `:hover` pseudo-class
- Inline `style={{}}` objects → CSS classes using `var()` custom properties
- All colors from CSS variables, zero hardcoded values

**CSS to add in globals.css (replacing existing `.neubrutalism-card`):**
```css
.neu-card {
  border-width: 2px;
  border-color: var(--color-border);
  background-color: var(--color-surface);
  box-shadow: 4px 4px 0px 0px var(--shadow-neubrutalism);
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}
.neu-card:hover {
  box-shadow: 2px 2px 0px 0px var(--shadow-neubrutalism-hover);
  transform: translate(2px, 2px);
}
.neu-card-elevated {
  border-width: 2px;
  border-color: var(--color-border);
  background-color: var(--color-surface);
  box-shadow: 6px 6px 0px 0px var(--shadow-neubrutalism);
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}
.neu-card-elevated:hover {
  box-shadow: 3px 3px 0px 0px var(--shadow-neubrutalism-hover);
  transform: translate(3px, 3px);
}
.neu-card-tag {
  border-width: 1px;
  border-color: var(--color-border);
  background-color: var(--color-surface-elevated);
  box-shadow: 2px 2px 0px 0px var(--shadow-neubrutalism-small);
  transition: box-shadow 0.15s ease, transform 0.15s ease;
}
.neu-card-tag:hover {
  box-shadow: none;
  transform: translate(2px, 2px);
}
```

**Files that need to be updated to use `<NeuCard>`:**
1. `src/app/components/sections/Skills.tsx` — Lines 28-62 (category cards + skill tags)
2. `src/app/components/sections/Contact.tsx` — Line 27 (outer card), Line 120 (response card)
3. `src/app/components/sections/CodingStats.tsx` — Lines 88-108 (LeetCode placeholder card)
4. `src/app/components/sections/About.tsx` — Lines 52-60 (skill tags), Lines 76-94 (CTA button wrapping)
5. `src/app/components/sections/Projects.tsx` — Card styling via CSS (Projects.css Lines 58-70)
6. `src/app/components/layout/Navbar.tsx` — Lines 56-147 (navbar container)
7. `src/app/about/AboutClient.tsx` — Lines 263-285 (about section cards), Lines 333-397 (skill category cards)
8. `src/app/experience/ExperienceClient.tsx` — Lines 290-370 (mobile cards), Lines 498-580 (desktop cards)
9. `src/app/achievements/AchievementsClient.tsx` — Lines 155-215 (featured card), Lines 237-290 (achievement cards), Lines 316-430 (cert cards), Lines 470-510 (award cards)
10. `src/app/projects/ProjectsClient.tsx` — Lines 40-95 (project cards)

---

### 1.2 Populate `NeuButton.tsx` (Currently Empty)

**File**: `src/app/components/ui/NeuButton.tsx`

Also **0 lines / empty**. Buttons are repeated with 6+ inline style props + 2 JS event handlers everywhere.

**Variants:**

| Variant | Style | Use Case |
|---------|-------|----------|
| `primary` | Filled accent bg, `border-2`, `4px` shadow, dark text | Main CTAs ("Connect With Me", "Submit") |
| `secondary` | Transparent bg, `border-2`, `4px` shadow, text color inherits | Secondary CTAs ("View Resume", "Learn More") |
| `ghost` | No border, no shadow, text with underline on hover | Inline links, nav items |

**Props interface:**
```tsx
interface NeuButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  href?: string;            // renders as <a> if provided
  onClick?: () => void;     // renders as <button> if provided
  className?: string;
  children: React.ReactNode;
  external?: boolean;       // adds target="_blank" rel="noopener"
}
```

**Size scale:**

| Size | Padding | Font Size |
|------|---------|-----------|
| `sm` | `px-3 py-1.5` | `text-fluid-xs` |
| `md` | `px-5 py-2.5` | `text-fluid-sm` |
| `lg` | `px-7 py-3.5` | `text-fluid-base` |

**Files that need to be updated to use `<NeuButton>`:**
1. `src/app/components/sections/Hero.tsx` — Lines 498-530 (mobile CTAs), Lines 661-698 (desktop CTAs)
2. `src/app/components/sections/About.tsx` — Lines 76-94 ("Learn More" button)
3. `src/app/components/sections/Contact.tsx` — Lines 181-196 (submit button)
4. `src/app/components/sections/Experience.tsx` — Lines 199-213 ("View Full Experience" button)
5. `src/app/components/sections/CodingStats.tsx` — Lines 47-72 (tab buttons)
6. `src/app/components/layout/Navbar.tsx` — Lines 140-165 ("Connect Here" button), all nav link buttons
7. `src/app/about/AboutClient.tsx` — Lines 186-200 (hero CTAs), Lines 295-305 (section CTAs), Lines 574-585 (bottom CTA)
8. `src/app/experience/ExperienceClient.tsx` — Lines 233-245 (hero CTAs), Lines 763-775 (bottom CTA)
9. `src/app/achievements/AchievementsClient.tsx` — Lines 96-110 (hero CTAs), Lines 207-215 ("VIEW DETAILS")
10. `src/app/projects/ProjectsClient.tsx` — Lines 87-95 ("VIEW DETAILS"), Lines 181-195 (hero CTAs), modal action buttons

---

## 2. Typography Overhaul

### 2.1 Current Problem — 48 Font Sizes, Zero Consistency

**Font sizes currently used (full inventory):**

**Tailwind classes (15 unique):**
`text-xs`, `text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl`, `text-3xl`, `text-4xl`, `text-5xl`, `text-6xl`, `text-7xl`, `text-8xl`, `text-9xl`, `text-[13px]`, `text-[12px]`

**CSS values (16 unique):**
`0.625rem`, `0.75rem`, `0.8rem`, `0.875rem`, `0.9rem`, `1rem`, `1.063rem`, `1.125rem`, `1.25rem`, `1.5rem`, `1.75rem`, `1.875rem`, `2rem`, `2.5rem`, `3rem`, `10px`

**Plus 7 `clamp()` values in CSS files and 10 `clamp()` values in tailwind config (unused).**

**Total: ~48 distinct font-size values across the codebase.**

Industry standard design systems use **6-10 font sizes total**.

### 2.2 Target Type Scale — Use Existing Fluid Tokens

The fluid tokens already defined in `tailwind.config.ts` (lines 52-61) are perfect. Map them to semantic roles:

| Semantic Role | Token | Value | Replaces |
|--------------|-------|-------|----------|
| **Display / Hero name** | `text-fluid-6xl` | `clamp(3.75rem, 10vw, 5rem)` | `text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl` and all hero h1 combos |
| **Page hero h1** | `text-fluid-5xl` | `clamp(3rem, 8vw, 4rem)` | `text-4xl md:text-6xl lg:text-7xl`, `text-4xl md:text-6xl lg:text-8xl` |
| **Section heading h2** | `text-fluid-4xl` | `clamp(2.25rem, 6vw, 3rem)` | `text-4xl md:text-5xl lg:text-6xl`, `text-3xl md:text-5xl`, `text-2xl sm:text-3xl md:text-4xl lg:text-5xl`, `clamp(2rem,5vw,4rem)` |
| **Subsection heading h3** | `text-fluid-2xl` | `clamp(1.5rem, 4vw, 2rem)` | `text-2xl md:text-3xl`, `text-xl md:text-2xl`, `text-2xl lg:text-3xl`, `text-2xl sm:text-3xl lg:text-4xl` |
| **Card title** | `text-fluid-xl` | `clamp(1.25rem, 3vw, 1.5rem)` | `text-xl`, `text-lg sm:text-xl`, `text-base sm:text-lg lg:text-xl`, `text-lg sm:text-xl lg:text-2xl` |
| **Large body / lead** | `text-fluid-lg` | `clamp(1.125rem, 2.5vw, 1.375rem)` | `text-lg md:text-xl`, `text-lg`, `text-base sm:text-lg` |
| **Body text** | `text-fluid-base` | `clamp(1rem, 2vw, 1.125rem)` | `text-base md:text-lg`, `text-base`, `text-sm md:text-base` |
| **Small text** | `text-fluid-sm` | `clamp(0.875rem, 1.5vw, 1rem)` | `text-sm`, `text-xs md:text-sm`, `text-sm sm:text-base` |
| **Caption / tag / badge** | `text-fluid-xs` | `clamp(0.75rem, 1vw, 0.875rem)` | `text-xs`, `text-xs sm:text-sm`, `text-[12px]`, `text-[13px]` |
| **Footer display** | `text-fluid-6xl` | Same as hero | `text-4xl sm:text-6xl md:text-8xl lg:text-9xl` (reduce this extreme range) |

### 2.3 Font Weight Hierarchy

**Current problem**: `font-black` (900) is used on headings, labels, badges, tags, navigation, and even some body text. When everything is ultra-bold, nothing has visual emphasis.

**Target hierarchy:**

| Element | Weight | Class |
|---------|--------|-------|
| Hero name / Display | `800` | `font-extrabold` |
| Section headings (h2) | `700` | `font-bold` |
| Subsection headings (h3) | `600` | `font-semibold` |
| Card titles | `600` | `font-semibold` |
| Labels, nav links | `500` | `font-medium` |
| Body text | `400` | `font-normal` |
| Captions, meta text | `400` | `font-normal` |

**Files to update (every `font-black` → appropriate weight):**
- `Hero.tsx` — h1 name: keep `font-extrabold`, everything else drop to `font-semibold` or lower
- `About.tsx` — heading: `font-bold`, subheading: `font-semibold`, body: `font-normal`
- `Skills.tsx` — heading: `font-bold`, category title: `font-semibold`, tags: `font-medium`
- `Experience.tsx` — heading: `font-bold` (via `.section-heading`), position: `font-semibold`
- `Contact.tsx` — heading: `font-bold`, form title: `font-semibold`, labels: `font-medium`
- `CodingStats.tsx` — heading: `font-bold`
- `Footer.tsx` — "NISHANT": `font-extrabold`, section titles: `font-semibold`, links: `font-normal`
- `Navbar.tsx` — logo: `font-bold`, links: `font-medium`, CTA: `font-semibold`
- `AboutClient.tsx` — hero h1: `font-extrabold`, section headings: `font-bold`, card titles: `font-semibold`
- `ExperienceClient.tsx` — hero h1: `font-extrabold`, section headings: `font-bold`
- `AchievementsClient.tsx` — hero h1: `font-extrabold`, section headings: `font-bold`
- `ProjectsClient.tsx` — hero h1: `font-extrabold`, section headings: `font-bold`

### 2.4 Line Height

Standardize to:
- Headings: `leading-tight` (1.25)
- Body: `leading-relaxed` (1.625)
- Captions: `leading-normal` (1.5)

Currently `leading-relaxed` and `leading-tight` are mixed within the same card context.

### 2.5 CSS Font-Size Cleanup

**Experience.css** (lines 170-324) defines **22 separate font-size declarations** with media query overrides for `.experience-year`, `.experience-position`, `.experience-company`, `.experience-description`, `.experience-months`, `.experience-button`. Replace all of these with the fluid tokens applied via Tailwind classes on the component, or convert the CSS values to `clamp()` expressions.

**Projects.css** (lines 38-285) defines **18 font-size declarations** with 3 breakpoint-specific override blocks (mobile at 768px, 480px, landscape). Replace with `clamp()` or Tailwind fluid classes.

**globals.css** — Remove:
- Line 406: `.text-responsive` class (uses its own `clamp()` that conflicts with the fluid scale)
- Line 942: `font-size: 0.75rem !important` on `.banner-scroll-container span` — the `!important` indicates a cascade conflict
- Lines 964-999: 4 separate `@media` blocks for `.banner-container` font sizes — replace with single `clamp()`

---

## 3. Spacing & Layout Standardization

### 3.1 Section Spacing — Current Chaos

In `page.tsx` (lines 100-129), section dividers use **3 different spacing scales**:

```
Hero → divider: my-8 sm:my-12 md:my-16       (32px → 48px → 64px)
Bento → divider: my-12 sm:my-16 md:my-20     (48px → 64px → 80px)  ← DIFFERENT
About → divider: my-8 sm:my-12 md:my-16      
Experience → divider: my-8 sm:my-12 md:my-16  
CodingStats → divider: my-8 sm:my-12 md:my-16
Skills → divider: my-4 sm:my-6 md:my-8       (16px → 24px → 32px)  ← DIFFERENT AGAIN
Projects → divider: my-4 sm:my-6 md:my-8
Contact → (no divider)
```

**Fix**: Remove ALL `<div className="section-divider">` elements from `page.tsx`. Instead, apply consistent padding to each `<section>` element inside the section components themselves:

```
section { padding: py-20 md:py-28 lg:py-36 }
```

This gives: `80px → 112px → 144px` — generous, professional-grade whitespace.

### 3.2 Section Padding — Current Per-Component Values

| Component | Current Padding | Target |
|-----------|----------------|--------|
| About.tsx | `py-12 sm:py-16 md:py-20 lg:py-24` | `py-20 md:py-28 lg:py-36` |
| Skills.tsx | `py-8 sm:py-12 md:py-16 lg:py-20` | `py-20 md:py-28 lg:py-36` |
| Experience.tsx | `py-8 sm:py-12 md:py-20` (missing lg!) | `py-20 md:py-28 lg:py-36` |
| Contact.tsx | `py-12 sm:py-16 md:py-20 lg:py-24` | `py-20 md:py-28 lg:py-36` |
| CodingStats.tsx | `py-12 sm:py-16 md:py-20 px-4` | `py-20 md:py-28 lg:py-36` |
| Projects.tsx | Via CSS `padding: 60px 0` | `py-20 md:py-28 lg:py-36` |
| Bento.tsx | `py-8 sm:py-12 md:py-16 lg:py-20 xl:py-24` (5 breakpoints!) | **REMOVED** |

### 3.3 Container Width — Standardize to `max-w-7xl`

| Component | Current | Target |
|-----------|---------|--------|
| Hero.tsx | `max-w-7xl` | `max-w-7xl` ✓ |
| About.tsx | `max-w-7xl` | `max-w-7xl` ✓ |
| Skills.tsx | `max-w-7xl` | `max-w-7xl` ✓ |
| Experience.tsx | `max-w-5xl` | `max-w-7xl` |
| Contact.tsx | `max-w-7xl` | `max-w-7xl` ✓ |
| CodingStats.tsx | `max-w-6xl` | `max-w-7xl` |
| Projects.tsx | N/A (horizontal scroll) | Keep as-is |
| Navbar.tsx | `max-w-7xl` | `max-w-7xl` ✓ |
| Footer.tsx | `max-w-7xl` | `max-w-7xl` ✓ |

### 3.4 Card Padding — Standardize

| Current (varies per component) | Target |
|-------------------------------|--------|
| `p-4 sm:p-5 lg:p-6`, `p-5`, `p-6 md:p-8`, `p-8 lg:p-12`, `p-3 sm:p-4 lg:p-5` | Standard: `p-6 md:p-8`. Elevated: `p-8 md:p-10`. Tag: `px-3 py-1.5` |

### 3.5 Internal Gaps — Standardize

| Element | Current | Target |
|---------|---------|--------|
| Grid gap (cards) | `gap-6 md:gap-8` (Skills), `gap-12 lg:gap-16` (Contact) | `gap-6 lg:gap-8` |
| Tag gap | `gap-2` everywhere | `gap-2` (keep) |
| Text stack (within card) | `space-y-4`, `space-y-6`, `space-y-8` (varies) | `space-y-4` for cards, `space-y-6` for sections |
| Section title → content | `mb-4`, `mb-8`, `mb-12` (varies) | `mb-10 md:mb-14` |

### 3.6 Horizontal Padding

Standardize section horizontal padding:
```
px-6 md:px-8 lg:px-12
```

Currently varies: `px-3 sm:px-4`, `px-4`, `px-6 md:px-10`, `px-4 sm:px-6 lg:px-8`

---

## 4. Color System Cleanup

### 4.1 Palette Shift — Monochrome + Orange Accent

**Current**: Orange is used on everything — headings, borders, backgrounds, tags, buttons, icons, shadows, gradients. It's the dominant color.

**Target**: Monochrome base with orange as a sparse accent.

| Usage | Current | Target |
|-------|---------|--------|
| Section heading accent word | `text-orange-500` | `text-[var(--color-accent)]` (but consider using it less often — not every heading needs an orange word) |
| Card borders | `border-orange-500` via `var(--color-accent)` on `border-color` | `var(--color-border)` (muted, not full accent) |
| Card shadows | White/accent | `var(--shadow-neubrutalism)` (keep, but reduce intensity) |
| CTAs (primary) | `bg-orange-500` | `var(--color-accent)` |
| CTAs (secondary) | transparent + orange border | transparent + `var(--color-border)` |
| Tags/badges | `bg-orange-400`, `border-orange-500` | `var(--color-surface-elevated)` bg + `var(--color-border)` border — **no accent color on tags** |
| Icon containers | `bg-orange-500 border-orange-500` | `var(--color-surface-elevated)` bg + `var(--color-border)` border, icon color: `var(--color-accent)` |
| Links | `text-orange-400` | `var(--color-accent)` |
| Featured badge | `bg-yellow-400 text-black` | `var(--color-accent)` bg + `var(--color-button-text)` text |
| Verification badge | `bg-green-400` | Keep (semantic color — not themed) |
| Error text | `text-red-400` | Keep (semantic color) |
| Success text | `text-green-400` | Keep (semantic color) |

### 4.2 New CSS Variables to Add

Add to `:root` in `globals.css`:

```css
/* Card system - lighter than full accent for monochrome feel */
--color-card-bg: var(--color-surface);
--color-card-border: rgba(255, 255, 255, 0.12);      /* subtle, not orange */
--color-card-shadow: rgba(255, 255, 255, 0.4);       /* lighter shadow */
--color-card-border-hover: rgba(255, 140, 66, 0.3);  /* orange appears on hover only */
```

### 4.3 Files With Hardcoded Colors (Complete List)

**`Contact.tsx`** — 12 hardcoded color instances:
- Line 63: `border-orange-500` (icon box border)
- Line 64: `bg-orange-500` (icon box bg)
- Lines 69, 81, 93: `text-orange-400` (email, LinkedIn, GitHub link text)
- Line 104: `bg-orange-500 border-orange-500` (social icon buttons)
- Line 126: `text-orange-400` ("24 hours" text)
- Line 73: `via-orange-500/30` (separator gradient)

**`Projects.tsx` (home section)** — via `Projects.css`:
- CSS uses `var(--color-accent)` for borders ✓, but cards have `border: 4px` → reduce to `2px`

**`Projects.tsx` (modal inside home section)** — 15+ hardcoded instances:
- `border-black` (10+ occurrences on modal elements)
- `bg-orange-400` (featured badge)
- `bg-orange-500` / `hover:bg-orange-600` (action buttons)
- `text-orange-500` (tech tags)
- `bg-orange-500/10`, `bg-orange-500/20` (tag backgrounds)
- `bg-yellow-400` (featured badge)
- `text-black` (button text)
- `border-orange-500` (tech tag borders, heading decorations)

**`ProjectsClient.tsx` (projects subpage)** — 20+ hardcoded instances:
- Same patterns as above, duplicated for mobile AND desktop modal views
- `border-black` used extensively in both modal renders

**`Footer.tsx`** — **Worst offender, ZERO CSS variables used:**
- Line 62: `bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900` (entire footer bg)
- Lines throughout: `text-white`, `text-white/90`, `text-white/70`, `text-white/60`
- Line 94: `bg-white/10` (input bg)
- Line 95: `border-white/20` (input border)
- Line 96: `focus:border-orange-500/50` (input focus)
- Line 99: `bg-orange-600 border-orange-600 hover:bg-orange-700` (subscribe button)
- Lines 110, 114: `text-green-400`, `text-red-400` (status — keep these)
- Line 114: `bg-orange-600` (hire me button)
- Line 170: `from-orange-600 to-orange-700` (logo gradient)
- Line 193: `bg-black` (bottom bar)
- Line 195: `hover:text-orange-500` (social links)

**`CodingStats.tsx`** — 2 instances:
- Line 33: `text-orange-500` on heading accent word
- Line 97: `text-orange-500` on LeetCode icon

**`Experience.tsx`** — via `Experience.css`:
- Line 399: `background: #6366f1` on `.experience-button` — **completely off-brand indigo color**

**`ExperienceClient.tsx`** — Multiple hardcoded instances:
- `text-orange-500` (accent words in headings)
- `bg-orange-500` (button backgrounds)
- `border-orange-500` (card accents)
- `text-orange-400` (links)

**`AchievementsClient.tsx`** — Multiple hardcoded instances:
- `text-orange-500` (accent words)
- `bg-orange-500` (buttons, badges)
- `border-orange-500` (cards)
- `bg-orange-400` (featured badge)

**`AboutClient.tsx`** — Multiple hardcoded instances:
- `text-orange-500` (accent words)
- `bg-orange-500` (progress bars, buttons)
- `border-orange-500` (cards)

**`Navbar.tsx`** — ✓ Uses CSS variables correctly (no hardcoded colors)

**`Hero.tsx`** — Mostly uses CSS variables, some inline accent colors in style objects

### 4.4 `border-black` → Theme-Aware Alternative

`border-black` is used 10+ times in project modals. In dark mode it's invisible (black border on dark bg). In light mode it works but is too harsh.

Replace with: `border-[var(--color-border)]` or a Tailwind `border-foreground/20` pattern.

---

## 5. Hero Section Redesign

### 5.1 Current Layout Problem

The hero uses `lg:grid-cols-2` but the right column is **completely empty DOM** — the 3D Canvas is absolutely positioned behind the entire section, not inside the grid. This creates a compositional disconnect between text and model.

**Lines 640-700 (desktop text block):**
```tsx
<div className="relative z-20 grid grid-cols-1 lg:grid-cols-2 gap-8 ...">
  <motion.div> {/* LEFT: text content */} </motion.div>
  {/* RIGHT: nothing — empty space */}
</div>
```

The model floats at `x: 3.25, y: -2.5, z: 0` in 3D space which roughly maps to right-of-center, but there's no intentional compositional relationship.

### 5.2 Target Layout — Full-Bleed Model + Text Overlay

**Without touching the 3D model code (`CharizardModel` component, lines 100-338):**

1. **Remove** the `lg:grid-cols-2` grid wrapper
2. Keep the Canvas as full-viewport absolutely positioned (it already mostly is)
3. Add a gradient overlay on the left side for text readability:
   ```tsx
   <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent z-10" />
   ```
4. Position text content with `absolute` or `relative z-20` aligned to the left:
   ```tsx
   <div className="relative z-20 flex flex-col justify-center items-start max-w-2xl px-8 md:px-16 h-full">
   ```
5. This creates a cinematic "text over scene" composition where the Charizard flies on the right while text is readable on the left

### 5.3 Text Hierarchy Fix

**Current**: "Hey, I'm" (badge) → "Nishant Harkut" (gradient) → TypewriterRoles → paragraph → 2 equal CTAs

**Target staggered entrance** (each element fades up with 0.15s delay):
1. Small badge: "Hey, I'm" — `text-fluid-sm font-medium` with subtle border
2. Name: "Nishant Harkut" — `text-fluid-6xl font-extrabold` — the visual anchor
3. TypewriterRoles — `text-fluid-xl` with accent color
4. Short description — `text-fluid-base font-normal` max 2 lines (currently too long/dense)
5. CTAs — Primary first ("Connect With Me"), Secondary second ("View Resume")

**Entrance animation (Framer Motion):**
```tsx
// Each child gets increasing delay:
const staggerChildren = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } }
};
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};
```

### 5.4 CTA Order Fix

Currently at line 661 (desktop): "View Resume" (secondary) renders BEFORE "Connect With Me" (primary). The primary action should come first.

### 5.5 Add Scroll Indicator

Currently there's no visual cue to scroll down. Add below the CTAs:
```tsx
<motion.div
  className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20"
  animate={{ y: [0, 8, 0] }}
  transition={{ duration: 2, repeat: Infinity }}
>
  <span className="text-fluid-xs font-medium tracking-widest uppercase opacity-60">Scroll</span>
  <ChevronDown className="w-5 h-5 mx-auto opacity-40" />
</motion.div>
```

### 5.6 Extract Subcomponents

Reduce Hero.tsx from ~1012 lines to ~200 by extracting:

| New File | Content (from Hero.tsx) | Lines |
|----------|------------------------|-------|
| `HeroCanvas.tsx` | R3F Canvas + lighting + effects + error fallback | 611-735 |
| `HeroLoader.tsx` | Pixel-art Charizard SVG loading animation | 808-970 |
| `HeroAnnouncement.tsx` | Bottom announcement banner | 971-1012 |
| `HeroBackground.tsx` | ScrollVelocity background text | 568-610 |
| `CharizardModel.tsx` | 3D model component (extract, don't change) | 100-338 |
| `CharizardFallback.tsx` | Mobile GIF fallback | 340-380 |

The main `Hero.tsx` becomes a layout shell composing these pieces.

### 5.7 Announcement Banner Integration

Currently the banner:
- Is absolute-positioned at section bottom (`bottom: 0`)
- Delays 1.2s to appear (creates a jarring visual "bump")
- Contains 5 job titles: "SWE | Full stack Development | Security Analyst | Frontend Dev | Backend Dev"

**Fix:**
- Make it inline-flow (not absolute) with `mt-auto` in a flex column
- Remove the 1.2s delay — show with the rest of the hero
- Simplify text (you'll rewrite this yourself)

---

## 6. Homepage Structure

### 6.1 Remove Bento Section

In `page.tsx`, remove:
```tsx
// Line 14-19: Remove the dynamic import
const Bento = dynamic(() => import('./components/sections/Bento'), { ... });

// Lines 106-109: Remove from render
<Bento />
<div className="section-divider my-12 sm:my-16 md:my-20" />
```

### 6.2 Remove Section Dividers

Replace all `<div className="section-divider my-*">` with nothing — section padding handles spacing.

### 6.3 New Homepage Structure

```tsx
<main>
  <SplashCursorWrapper />
  <PerformanceIndicator />
  <Navbar />
  <Hero />          {/* Full viewport */}
  <About />         {/* py-20 md:py-28 lg:py-36 */}
  <Experience />    {/* py-20 md:py-28 lg:py-36 */}
  <CodingStats />   {/* py-20 md:py-28 lg:py-36 */}
  <Skills />        {/* py-20 md:py-28 lg:py-36 */}
  <Projects />      {/* py-20 md:py-28 lg:py-36 */}
  <Contact />       {/* py-20 md:py-28 lg:py-36 */}
  <Footer />
</main>
```

7 sections (down from 8). Bento removed. Consistent spacing.

### 6.4 Fix ScrollTrigger Hack

Remove the triple `ScrollTrigger.refresh()` at lines 77-93:
```tsx
// REMOVE these 3 timeouts:
const timer1 = setTimeout(() => { ScrollTrigger.refresh(); }, 500);
const timer2 = setTimeout(() => { ScrollTrigger.refresh(); }, 1500);
const timer3 = setTimeout(() => { ScrollTrigger.refresh(); }, 2500);
```

Replace with a single `ResizeObserver`-based approach:
```tsx
useEffect(() => {
  const observer = new ResizeObserver(() => {
    ScrollTrigger.refresh();
  });
  observer.observe(document.body);
  return () => observer.disconnect();
}, []);
```

---

## 7. Section-by-Section Fixes

### 7.1 About Section (`src/app/components/sections/About.tsx`)

**Current issues:**
- Hardcodes text instead of reading from `about.json`
- Skills hardcoded as `['Full-Stack', 'Frontend', 'Backend', ...]` at line 56
- TiltedCard has hardcoded pixel dimensions (320px, 450px)
- `gap-2 lg:gap-8` jump is abrupt

**Changes:**
1. Import and read from `src/data/about.json`
2. Replace skill tags array with data from JSON
3. Heading: `text-4xl md:text-5xl lg:text-6xl font-black` → `text-fluid-4xl font-bold`
4. Subheading: `text-2xl md:text-3xl` → `text-fluid-2xl font-semibold`
5. Body: `text-base md:text-lg` → `text-fluid-base font-normal`
6. Tags: `text-xs` → `text-fluid-xs`
7. Replace inline border/shadow styles with `<NeuCard variant="tag">`
8. Replace "Learn More" button inline styles with `<NeuButton variant="secondary">`
9. TiltedCard dimensions: `320px` → `w-full max-w-sm`, `450px` → `aspect-[3/4]`
10. Grid gap: `gap-2 lg:gap-8` → `gap-6 lg:gap-10`
11. Section padding: `py-12 sm:py-16 md:py-20 lg:py-24` → `py-20 md:py-28 lg:py-36`

### 7.2 Skills Section (`src/app/components/sections/Skills.tsx`)

**Current issues:**
- No icons for skills (plain text `<li>` tags)
- border-4 + 8px shadow on category cards (heavy)
- border-2 + 3px shadow on every tag inside (double-bordered)
- Manual JS hover handlers on every element
- Skills data duplicated between `skills` and `skillGroups` in `skills.json`

**Changes:**
1. Install `react-icons` devicons or use existing `react-icons/si` (Simple Icons)
2. Create icon mapping in a utility file:
   ```tsx
   // src/utils/skillIcons.ts
   import { SiReact, SiPython, SiNodedotjs, SiTypescript, SiDocker, ... } from 'react-icons/si';
   
   export const skillIconMap: Record<string, IconType> = {
     'React': SiReact,
     'Python': SiPython,
     'Node.js': SiNodedotjs,
     'TypeScript': SiTypescript,
     'Docker': SiDocker,
     // ... map every skill
   };
   ```
3. Each skill tag renders as: `[icon 16px] [name]`
4. Category cards: Replace inline styles with `<NeuCard>` (border-2, 4px shadow)
5. Skill tags: Replace inline styles with `<NeuCard variant="tag">`
6. Remove all `onMouseEnter`/`onMouseLeave`/`onTouchStart`/`onTouchEnd` handlers
7. Heading: `text-4xl md:text-5xl lg:text-6xl font-black` → `text-fluid-4xl font-bold`
8. Category title: `text-lg` → `text-fluid-xl font-semibold`
9. Tags: `text-xs` → `text-fluid-xs`
10. Section padding: `py-8 sm:py-12 md:py-16 lg:py-20` → `py-20 md:py-28 lg:py-36`

### 7.3 Experience Section (`src/app/components/sections/Experience.tsx`)

**Current issues:**
- `max-w-5xl` (inconsistent with other sections)
- `Experience.css` has hardcoded `#6366f1` indigo on `.experience-button`
- Mobile cards use `1px border` (not neubrutalism), desktop uses timeline without cards
- `py-8 sm:py-12 md:py-20` (missing `lg` breakpoint)
- 22 separate CSS font-size declarations in `Experience.css`

**Changes:**
1. `max-w-5xl` → `max-w-7xl`
2. In `Experience.css` line 399: `background: #6366f1` → `background: var(--color-accent)`
3. Mobile cards: Apply `<NeuCard>` styling for consistency
4. Heading font sizes: Convert CSS `font-size` declarations to use fluid tokens
5. Button: `text-xs md:text-sm` → `text-fluid-xs` via `<NeuButton variant="secondary" size="sm">`
6. Section padding: `py-8 sm:py-12 md:py-20` → `py-20 md:py-28 lg:py-36`
7. Reduce the 22 CSS font-size declarations to use `clamp()` or Tailwind fluid classes

### 7.4 Projects Section (`src/app/components/sections/Projects.tsx`)

**Current issues:**
- Cards have `gap: 0` — they literally touch each other
- Fixed `500px` card height (via inline style in ProjectsClient, line 26)
- Modal rendered twice (mobile + desktop split = ~400 lines duplication)
- 15+ hardcoded `border-black`, `bg-orange-*`, `bg-yellow-400`, `text-black` in modal
- `.section-heading` class used but defined in `Projects.css`

**Changes:**
1. Add `gap: 2rem` (32px) between horizontal scroll cards in `Projects.css`
2. Remove fixed `height: '500px'` — use `min-h-[400px] h-auto`
3. Card borders: `4px` → `2px`, shadow: `8px` → `4px`
4. Modal: Consolidate into single responsive component (eliminate 400-line duplication)
5. Replace all `border-black` with `border-[var(--color-border)]`
6. Replace all `bg-orange-*` with `var(--color-accent)` or `var(--color-surface-elevated)`
7. Replace `bg-yellow-400` featured badge with accent-colored badge
8. Section padding: CSS `padding: 60px 0` → `py-20 md:py-28` (applied via Tailwind)
9. Horizontal scroll: Keep GSAP pin behavior, just fix card sizing/spacing

### 7.5 Contact Section (`src/app/components/sections/Contact.tsx`)

**Current issues:**
- 12 hardcoded color instances (`orange-500`, `orange-400`)
- Outer card has `12px` neubrutalism shadow (heaviest on the site)
- Form inputs have no visible focus ring
- All social links hardcoded in JSX

**Changes:**
1. Outer card: `boxShadow: '12px 12px'` → use `<NeuCard variant="elevated">` (6px shadow)
2. Replace all `border-orange-500` → `var(--color-border)` or theme class
3. Replace all `bg-orange-500` → `var(--color-accent)` on icons
4. Replace all `text-orange-400` → `var(--color-accent)` on links
5. Form inputs: Add `focus:ring-2 focus:ring-[var(--color-accent)]/30` focus style
6. Submit button: Use `<NeuButton variant="primary">`
7. Heading: Use `.section-heading` class consistently
8. Subtitle: `text-lg` → `text-fluid-lg`
9. Form title: `text-2xl lg:text-3xl` → `text-fluid-2xl font-semibold`
10. Section padding: `py-12 sm:py-16 md:py-20 lg:py-24` → `py-20 md:py-28 lg:py-36`
11. Move social links to data file or constants

### 7.6 CodingStats Section (`src/app/components/sections/CodingStats.tsx`)

**Changes:**
1. `max-w-6xl` → `max-w-7xl`
2. `text-orange-500` → `text-[var(--color-accent)]`
3. Heading: `text-4xl md:text-5xl lg:text-6xl` → `text-fluid-4xl font-bold`
4. Tab buttons: Use `<NeuButton>` variants
5. LeetCode tab: Either implement it or remove the tab entirely (showing "Coming Soon" is unprofessional)
6. Section padding: Standardize to `py-20 md:py-28 lg:py-36`

### 7.7 Footer (`src/app/components/layout/Footer.tsx`)

**Current issues — WORST OFFENDER:**
- **ZERO CSS variables used** — every color is hardcoded
- `bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900` (ignores theme)
- `bg-black` bottom bar (ignores theme)
- `bg-orange-600`, `border-orange-600`, `hover:bg-orange-700` (buttons — hardcoded)
- `from-orange-600 to-orange-700` (logo gradient — hardcoded)
- `text-white`, `text-white/90`, `text-white/70`, `text-white/60` used throughout
- No neubrutalism at all — uses rounded corners and gradients (visual outlier)
- Contains a subscribe form, nav sections, giant "NISHANT" text, hire button, social bar — too much content

**Changes:**
1. Background: `from-gray-900 via-slate-800 to-gray-900` → `bg-[var(--color-bg-start)]` or `bg-[var(--color-surface)]`
2. All text: `text-white` → `text-[var(--color-text)]`, `text-white/70` → `text-[var(--color-text-muted)]`
3. All buttons: Replace hardcoded orange with `var(--color-accent)`
4. Input: `bg-white/10 border-white/20` → `var(--color-surface-elevated)` + `var(--color-border)`
5. Bottom bar: `bg-black` → `var(--color-bg-start)` or `var(--color-surface)`
6. Logo: `from-orange-600 to-orange-700` → `var(--color-accent)` solid or gradient via CSS vars
7. Apply neubrutalism to footer elements for consistency
8. "NISHANT" text: `text-4xl sm:text-6xl md:text-8xl lg:text-9xl` → `text-fluid-6xl` (less extreme range)
9. Consider simplifying footer content (remove subscribe form, reduce nav sections)

### 7.8 Navbar (`src/app/components/layout/Navbar.tsx`)

**Current issues:**
- Every button has 6+ inline style props + `onMouseEnter`/`onMouseLeave`/`onTouchStart`/`onTouchEnd`
- Desktop and mobile navbars largely duplicate code
- `text-xs xl:text-[13px]` and `text-xs xl:text-[12px]` — pixel-level font sizing
- 4-5 bordered elements in one bar creates visual noise

**Changes:**
1. Nav links: `text-xs xl:text-[13px]` → `text-fluid-xs font-medium`
2. CTA: `text-xs xl:text-[12px]` → `text-fluid-xs font-semibold` via `<NeuButton variant="primary" size="sm">`
3. Reduce navbar border to `border-2` (from `border-4`)
4. Reduce navbar shadow to `4px 4px` (from `6px 6px`)
5. Inner buttons (theme toggle, resume): Use `<NeuButton variant="ghost">` — remove borders/shadows from these
6. Only the nav bar itself and the main CTA should have neubrutalism borders
7. Replace all inline `style={{}}` + JS hover handlers with CSS classes
8. Extract mobile nav into a separate component

---

## 8. Subpage Fixes

### 8.1 AboutClient (`src/app/about/AboutClient.tsx` — 621 lines)

**Changes:**
1. Hero h1: `text-4xl md:text-6xl lg:text-7xl` → `text-fluid-5xl font-extrabold`
2. Subtitle: `text-lg md:text-xl` → `text-fluid-lg`
3. "Who I Am" heading: `text-3xl md:text-5xl` → `text-fluid-4xl font-bold`
4. Card titles: `text-xl md:text-2xl` → `text-fluid-xl font-semibold`
5. Card content: `text-sm md:text-base` → `text-fluid-sm`
6. "Technical Expertise" heading: `text-3xl md:text-5xl` → `text-fluid-4xl font-bold`
7. Skill category title: `text-xl` → `text-fluid-xl font-semibold`
8. Proficiency label: `text-sm` → `text-fluid-xs`
9. Tech tags: `text-xs` → `text-fluid-xs`
10. "Beyond Code" heading: `text-3xl md:text-5xl` → `text-fluid-4xl font-bold`
11. Interest titles: `text-lg` → `text-fluid-lg font-semibold`
12. CTA heading: `text-3xl md:text-4xl` → `text-fluid-3xl font-bold`
13. Replace all hardcoded `orange-*` colors with CSS variables
14. Use `<NeuCard>` for all card sections
15. Use `<NeuButton>` for all CTAs
16. **Remove commented-out Journey Timeline section** (lines 454-522)

### 8.2 ExperienceClient (`src/app/experience/ExperienceClient.tsx` — 894 lines)

**Changes:**
1. Hero h1: `text-4xl md:text-6xl lg:text-7xl` → `text-fluid-5xl font-extrabold`
2. "Professional Experience" heading: `text-2xl sm:text-3xl md:text-4xl lg:text-5xl` → `text-fluid-4xl font-bold`
3. All card content: Apply fluid type scale
4. Mobile and desktop card layouts both need `<NeuCard>` styling
5. "Core Competencies" heading: `text-2xl sm:text-3xl md:text-4xl` → `text-fluid-3xl font-bold`
6. CTA heading: `text-2xl sm:text-3xl md:text-4xl` → `text-fluid-3xl font-bold`
7. Replace hardcoded colors with CSS variables
8. Use `<NeuButton>` for all buttons
9. **Remove commented-out Career Highlights + Technology Evolution sections** (lines 637-856)

### 8.3 AchievementsClient (`src/app/achievements/AchievementsClient.tsx` — 741 lines)

**Changes:**
1. Hero h1: `text-4xl md:text-6xl lg:text-8xl` → `text-fluid-5xl font-extrabold` (the jump from `text-4xl` to `text-8xl` is extreme — 2.25rem to 6rem)
2. "Major Achievements" heading: `text-2xl sm:text-3xl md:text-4xl lg:text-5xl` → `text-fluid-4xl font-bold`
3. Featured title: `text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl` (5 breakpoints!) → `text-fluid-2xl font-semibold`
4. All other text: Apply fluid scale
5. Achievement cards: Fixed heights `h-[440px] sm:h-[460px] lg:h-[480px]` → remove fixed height, use `min-h-[300px] h-auto`
6. Certification cards: `min-h-[500px] sm:min-h-[520px] lg:min-h-[540px]` → remove, use `h-auto`
7. Replace hardcoded colors with CSS variables
8. Use `<NeuCard>` and `<NeuButton>`
9. **Remove commented-out Career Highlights section** (lines 591-665)

### 8.4 ProjectsClient (`src/app/projects/ProjectsClient.tsx` — 731 lines)

**Changes:**
1. Hero h1: `text-4xl md:text-6xl lg:text-8xl` → `text-fluid-5xl font-extrabold`
2. "Featured Work" heading: `text-3xl md:text-5xl` → `text-fluid-4xl font-bold`
3. Project card title: `text-xl` → `text-fluid-xl font-semibold`
4. **Eliminate duplicate modal** — currently lines 230-415 render a desktop modal AND lines 305-415 render a mobile modal. Consolidate into ONE responsive `<ProjectModal>` component
5. Fixed card height `500px` → `min-h-[400px] h-auto`
6. Replace ALL `border-black` (10+ occurrences) with `border-[var(--color-border)]`
7. Replace ALL `bg-orange-*` with CSS variable equivalents
8. Replace `bg-yellow-400` featured badge with accent badge
9. Use `<NeuCard>` and `<NeuButton>`

---

## 9. Component Extraction & Cleanup

### 9.1 Hero Subcomponents (from Hero.tsx ~1012 lines → ~200 lines)

| New File | Extract From | Approx Lines |
|----------|-------------|-------------|
| `src/app/components/sections/hero/HeroCanvas.tsx` | Lines 611-735 | ~125 lines |
| `src/app/components/sections/hero/HeroLoader.tsx` | Lines 808-970 | ~165 lines |
| `src/app/components/sections/hero/HeroAnnouncement.tsx` | Lines 971-1012 | ~45 lines |
| `src/app/components/sections/hero/HeroBackground.tsx` | Lines 568-610 | ~45 lines |
| `src/app/components/sections/hero/CharizardModel.tsx` | Lines 100-338 | ~240 lines (don't change) |
| `src/app/components/sections/hero/CharizardFallback.tsx` | Lines 340-380 | ~40 lines |

**Main Hero.tsx becomes** a ~200-line layout shell that composes these pieces.

### 9.2 Project Modal Extraction

**From `Projects.tsx` (home section):**
Extract the modal (lines 213-550) into `src/app/components/ui/ProjectModal.tsx`. This same component can be reused in `ProjectsClient.tsx`, eliminating the duplicate modal there.

**From `ProjectsClient.tsx` (projects page):**
Remove the two separate modal renders (mobile: lines 305-415, desktop: lines 430-510). Replace with single `<ProjectModal>`.

### 9.3 Remove Commented-Out Code

| File | Lines | Content |
|------|-------|---------|
| `AboutClient.tsx` | 454-522 | Journey Timeline section |
| `ExperienceClient.tsx` | 637-856 | Career Highlights + Technology Evolution |
| `AchievementsClient.tsx` | 591-665 | Career Highlights section |

All recoverable from git history — remove for cleanliness.

### 9.4 Skill Icons Utility

Create `src/utils/skillIcons.ts`:

Map every skill name from `skills.json` → corresponding `react-icons/si` icon:

```tsx
import {
  SiReact, SiNextdotjs, SiTypescript, SiJavascript,
  SiPython, SiNodedotjs, SiExpress, SiMongodb,
  SiPostgresql, SiDocker, SiGit, SiTailwindcss,
  SiFirebase, SiFigma, SiLinux, SiAmazonwebservices,
  // ... etc
} from 'react-icons/si';

export const skillIconMap: Record<string, React.ComponentType> = {
  'React': SiReact,
  'Next.js': SiNextdotjs,
  'TypeScript': SiTypescript,
  'JavaScript': SiJavascript,
  'Python': SiPython,
  'Node.js': SiNodedotjs,
  'Express': SiExpress,
  'MongoDB': SiMongodb,
  'PostgreSQL': SiPostgresql,
  'Docker': SiDocker,
  'Git': SiGit,
  'Tailwind CSS': SiTailwindcss,
  'Firebase': SiFirebase,
  'Figma': SiFigma,
  'Linux': SiLinux,
  'AWS': SiAmazonwebservices,
  // Map every skill from your skills.json
};
```

Usage in Skills.tsx and AboutClient.tsx:
```tsx
import { skillIconMap } from '@/utils/skillIcons';

// In the skill tag:
const Icon = skillIconMap[skill.name];
<NeuCard variant="tag">
  {Icon && <Icon className="w-4 h-4" />}
  <span>{skill.name}</span>
</NeuCard>
```

---

## 10. Data File Cleanup

> **Note: You will rewrite the actual content yourself. This section covers structural changes only.**

### 10.1 `hero.json`

**Remove:**
- `"title": "AKA CharizardOP"` — gaming alias has no place in professional portfolio

**Simplify:**
- `"announcement.text"` — reduce from 5 job titles to 1-2 focused ones
- `"description"` — tighten; remove buzzword stacking

### 10.2 `skills.json`

**Remove redundant data:**
- `"skills"` array (6 categories with `level` percentages) — REDUNDANT with `"skillGroups"` and levels are never displayed. Keep `"skillGroups"` only.
- `"timeline"` section — claims professional work starting 2015/2017, contradicts being a current student. Remove entirely.
- `"interests"` section — move to `about.json` if needed, doesn't belong in skills data.

**Add icon names** to each skill for the icon mapping:
```json
{
  "skillGroups": [
    {
      "category": "Frontend",
      "skills": [
        { "name": "React", "icon": "SiReact" },
        { "name": "Next.js", "icon": "SiNextdotjs" },
        ...
      ]
    }
  ]
}
```

### 10.3 `experience.json`

**Remove inflated stats:**
- `"50+ Projects Completed"` — actual projects list has 6
- `"98% Client Satisfaction"` — no verifiable source
- `"6 Team Members Led"` — no supporting context
- `"technologyEvolution"` timeline starting from 2017 — contradicts being a current student

**Keep:** Honest experience entries with accurate dates, positions, and descriptions.

### 10.4 `about.json`

**Current issue:** `About.tsx` (home section) completely ignores this file and hardcodes its own text. After fixing step 7.1, the component will read from this file. Ensure the data structure matches what the component expects.

### 10.5 `projects.json`

**No structural changes needed.** Content rewrite is on you.

### 10.6 `achievements.json`

**No structural changes needed.** Content rewrite is on you.

---

## 11. CSS Cleanup

### 11.1 `globals.css` — Specific Line Changes

**Replace neubrutalism classes (lines 61-115):**
```css
/* OLD — Heavy */
.neubrutalism-card {
  border-width: 4px;
  box-shadow: 8px 8px 0px 0px var(--shadow-neubrutalism);
}

/* NEW — Lighter */
.neubrutalism-card {
  border-width: 2px;
  box-shadow: 4px 4px 0px 0px var(--shadow-neubrutalism);
}
```

Same reduction for `.neubrutalism-button` (4px → 2px border, 6px → 4px shadow) and `.neubrutalism-input` (3px → 2px border, 4px → 3px shadow).

**Remove `.retro-text` class** (line ~714) — uses `'Courier New', monospace` which clashes with Geist Sans.

**Remove overly broad `will-change: transform`** (lines ~130-140):
```css
/* REMOVE: */
.bento-card,
.project-box,
.glass,
.glass-card,
[class*="transform"],
[class*="transition"] {
  will-change: transform;
}
```
This promotes dozens of elements to GPU layers, causing memory bloat. Only apply `will-change` to actively animating elements.

**Remove `!important` override** (line 942):
```css
/* REMOVE: */
.banner-scroll-container span {
  font-size: 0.75rem !important;
}
```

**Remove multiple `@media` blocks for `.banner-container`** (lines 964-999) — replace with single `clamp()`:
```css
.banner-container {
  font-size: clamp(0.625rem, 1.5vw, 1rem);
}
```

**Add custom cursor mobile fallback** (near line 991-1000):
```css
@media (pointer: coarse) {
  * {
    cursor: auto !important;
  }
}
```

### 11.2 `Experience.css` — Key Changes

**Line 399: `background: #6366f1`** → `background: var(--color-accent)`

This hardcoded indigo color is completely off-brand in a fire-themed site.

**Font sizes:** Convert the 22 separate `font-size` + `@media` declarations to `clamp()` expressions:

| Current (multiple declarations) | Target (single declaration) |
|--------------------------------|---------------------------|
| `.experience-year`: `2.5rem` (base), `3rem` (lg) | `font-size: clamp(2rem, 4vw, 3rem)` |
| `.experience-position`: `1.5rem` (base), `1.75rem` (lg) | `font-size: clamp(1.25rem, 2.5vw, 1.75rem)` |
| `.experience-company`: `1.125rem` (base), `1.25rem` (lg) | `font-size: clamp(1rem, 2vw, 1.25rem)` |
| `.experience-description`: `0.875rem`→`1rem`→`1.125rem` (4 breakpoints) | `font-size: clamp(0.875rem, 1.5vw, 1.125rem)` |
| `.experience-button`: `0.9rem`→`1rem`→`1.063rem`→`1.125rem` (4 breakpoints) | `font-size: clamp(0.875rem, 1.5vw, 1.125rem)` |

This reduces 22 declarations to ~6.

### 11.3 `Projects.css` — Key Changes

**Card gap:** Add `gap: 2rem` to the horizontal scroll container (currently 0).

**Border:** `border: 4px` → `border: 2px`

**Shadow:** `box-shadow: 8px 8px` → `box-shadow: 4px 4px`

**Font sizes:** Convert 18 declarations with 3 breakpoint blocks to `clamp()` expressions:

| Current | Target |
|---------|--------|
| `.section-heading`: `clamp(2rem, 5vw, 4rem)` + mobile overrides | Remove mobile overrides, keep single `clamp()` |
| `.project-number`: `clamp(2rem, 4vw, 3.5rem)` + mobile overrides | Remove mobile overrides, keep single `clamp()` |
| `.project-title h3`: `clamp(1.125rem, 2.5vw, 1.75rem)` + overrides | Remove overrides, keep single `clamp()` |
| `.project-title p`: `clamp(0.875rem, 1.5vw, 1rem)` + overrides | Remove overrides |
| `.project-info h4`: `clamp(0.875rem, 1.5vw, 1.1rem)` + overrides | Remove overrides |
| `.project-info p`: `clamp(0.75rem, 1.25vw, 0.9rem)` + overrides | Remove overrides |

---

## 12. Verification Checklist

### Build
- [ ] `pnpm build` completes with no errors
- [ ] No TypeScript errors
- [ ] No unused imports after component extractions

### Typography
- [ ] Grep for multi-breakpoint font patterns (`text-2xl sm:text-3xl`, etc.) — should find zero
- [ ] Grep for `text-[12px]`, `text-[13px]` — should find zero
- [ ] Grep for `font-black` — should find zero (replaced with appropriate weight)
- [ ] All font sizes use `text-fluid-*` classes or CSS `clamp()` values
- [ ] Total unique font-size values ≤ 10 (down from 48)

### Colors
- [ ] Grep for `text-orange-`, `bg-orange-`, `border-orange-` in component files — should find zero (only in `globals.css` variables)
- [ ] Grep for `border-black` in component files — should find zero
- [ ] Grep for `from-gray-`, `via-slate-`, `bg-black` in component files — should find zero (except semantic uses)
- [ ] Grep for `text-white` outside of `globals.css` — should find zero (use `var(--color-text)`)
- [ ] Footer passes visual check with both dark and light themes

### Spacing
- [ ] No `<div className="section-divider">` in `page.tsx`
- [ ] Every section component uses `py-20 md:py-28 lg:py-36`
- [ ] All sections use `max-w-7xl mx-auto` (except Projects horizontal scroll)
- [ ] All sections use `px-6 md:px-8 lg:px-12`

### Components
- [ ] `NeuCard.tsx` has 3 variants, used across all 10+ consumer files
- [ ] `NeuButton.tsx` has 3 variants + 3 sizes, used across all 10+ consumer files
- [ ] No inline `onMouseEnter`/`onMouseLeave`/`onTouchStart`/`onTouchEnd` for hover effects in any component
- [ ] No inline `style={{ borderColor: ..., boxShadow: ..., backgroundColor: ... }}` patterns for neubrutalism (all via CSS classes)
- [ ] Hero.tsx is ≤ 250 lines (down from 1012)
- [ ] ProjectsClient.tsx has only ONE modal component (down from 2)

### Design System
- [ ] Neubrutalism uses `border-2` + `4px shadow` max (not `border-4` + `8px`)
- [ ] Project cards have visible gap between them
- [ ] No fixed pixel heights on cards (no `h-[440px]`, `h-[500px]`, etc.)
- [ ] Custom cursor degrades gracefully on mobile (`@media (pointer: coarse)`)

### Content
- [ ] "AKA CharizardOP" removed from hero and all professional sections
- [ ] No inflated stats in experience.json ("50+ Projects", "98% Satisfaction")
- [ ] No contradictory timeline in skills.json (starting from 2015/2017)
- [ ] `skills.json` has single `skillGroups` array (redundant `skills` array removed)
- [ ] LeetCode tab either implemented or removed (no "Coming Soon")

### Performance
- [ ] No `will-change: transform` on broad selectors
- [ ] No triple `ScrollTrigger.refresh()` hack
- [ ] No `!important` in font-size declarations

### Visual (Manual Check)
- [ ] Test at 375px (iPhone SE), 390px (iPhone 14), 768px (iPad), 1024px (laptop), 1440px (MacBook), 1920px (desktop)
- [ ] Dark theme: all text readable, no invisible borders, consistent visual language
- [ ] Light theme: same checks (if light mode is supported)
- [ ] All entrance animations are consistent (fade-up, 0.4s, staggered where appropriate)
- [ ] Hero creates a "wow" moment — model visible behind text, staggered text reveal, scroll cue present
- [ ] No section feels "packed" — adequate whitespace between all elements
- [ ] Navbar doesn't feel visually noisy (max 2 bordered elements)
- [ ] Footer matches the rest of the site's design language

---

## Implementation Order (Recommended Sequence)

| Phase | Steps | Priority |
|-------|-------|----------|
| **Phase 1: Foundation** | 1.1 NeuCard, 1.2 NeuButton, 2.2-2.3 Type scale + weights, 3.1-3.3 Spacing + containers, 4.1-4.2 Color variables | **Do first** — everything else depends on this |
| **Phase 2: CSS** | 11.1 globals.css cleanup, 11.2 Experience.css, 11.3 Projects.css | Second — prep the styles |
| **Phase 3: Homepage sections** | 6.1-6.4 Page structure, 7.1-7.8 Each section | Third — apply the system |
| **Phase 4: Hero** | 5.1-5.7 Hero redesign + extraction | Fourth — the biggest visual impact |
| **Phase 5: Subpages** | 8.1-8.4 All client pages | Fifth |
| **Phase 6: Cleanup** | 9.1-9.4 Component extraction, 10.1-10.6 Data files | Last |
| **Phase 7: Verification** | 12 Full checklist | After all changes |

---

*Total estimated files to modify: ~25 component/style files + ~6 data files + ~3 new utility files*
*Estimated LOC changed: ~2000-3000 lines across all files*
*Estimated LOC removed: ~800-1000 (duplication, commented code, inline styles)*
