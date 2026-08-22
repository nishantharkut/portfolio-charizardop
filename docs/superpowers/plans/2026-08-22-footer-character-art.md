# Footer Character Art Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebalance the shared footer with visible two-column navigation and one responsive Charizard-inspired ASCII watermark while preserving all approved content, routes, and colours.

**Architecture:** Keep the footer as one shared React component and define the artwork as a local decorative constant. Extend the existing Puppeteer contract to verify its responsive visibility, link integrity, and absence of horizontal overflow before changing the component.

**Tech Stack:** Next.js, React, TypeScript, Tailwind CSS, Framer Motion, Puppeteer

---

### Task 1: Extend the footer browser contract

**Files:**
- Modify: `scripts/verification/verify-experience-footer.mjs`

- [ ] **Step 1: Add responsive character-art assertions**

Inside `page.evaluate`, collect the art element and its computed visibility, then append `characterArtCount` and `characterArtVisible` to the returned object:

```js
const characterArt = document.querySelector('[data-footer-character-art]');
const characterArtCount = document.querySelectorAll('[data-footer-character-art]').length;
const characterArtVisible = characterArt
  ? getComputedStyle(characterArt).display !== 'none'
  : false;
```

After the existing footer assertions, require one artwork node, require it to be visible at `1440px`, and require it to be hidden at `768px` and `390px`:

```js
if (result.characterArtCount !== 1) {
  throw new Error(`Expected one footer character artwork, found ${result.characterArtCount}`);
}
const shouldShowCharacterArt = viewport.width >= 1280;
if (result.characterArtVisible !== shouldShowCharacterArt) {
  throw new Error(`Footer character artwork visibility is incorrect at ${viewport.width}px`);
}
```

- [ ] **Step 2: Run the browser contract and confirm the new assertion fails**

Run:

```powershell
node scripts/verification/verify-experience-footer.mjs
```

Expected: FAIL because `[data-footer-character-art]` does not exist.

### Task 2: Rebalance the footer and add the artwork

**Files:**
- Modify: `src/app/components/layout/Footer.tsx`

- [ ] **Step 1: Define one original ASCII artwork constant**

Add a compact pure-ASCII dragon silhouette above the component:

```tsx
const charizardArt = String.raw`
                 __
          _     /  \     _
       __/ \___/ /\ \___/ \__
      /   _    \/  \/    _   \
     /   / \    /\      / \   \
    /___/   \__/  \____/   \___\
        \      .--.      /
         \    /o  o\    /
          \   \_==_/   /
           '-._____.-'
              /||\
         ____/ || \____
        /___   ||   ___\
            \  ||  /
             \_||_/
               ||\_________  *
              /  \_________>
`;
```

- [ ] **Step 2: Replace the sparse upper row with a responsive three-part grid**

Change the upper row wrapper class to the following grid. Its current contact block remains its first child:

```tsx
className="grid items-start gap-10 lg:grid-cols-[20rem_minmax(0,1fr)] xl:grid-cols-[20rem_18rem_minmax(0,1fr)] xl:gap-12"
```

Replace both responsive navigation render paths with this single navigation block, then place the artwork immediately after it as the third grid child:

```tsx
<nav data-footer-navigation aria-label="Footer navigation">
  {navigationSections.map((section) => (
    <div key={section.title}>
      <h4 className="mb-4 text-base font-bold">{section.title}</h4>
      <ul className="grid grid-cols-2 gap-x-8 gap-y-3">
        {section.links.map((link) => (
          <li key={link.href}>
            <a href={link.href}>{link.label}</a>
          </li>
        ))}
      </ul>
    </div>
  ))}
</nav>

<pre
  data-footer-character-art
  aria-hidden="true"
  className="pointer-events-none hidden select-none self-center justify-self-end whitespace-pre font-mono text-[10px] leading-[1.05] xl:block"
  style={{ color: 'var(--color-text-muted)', opacity: 0.24 }}
>
  {charizardArt}
</pre>
```

Keep link target behavior unchanged. Do not add animation, a card, a label, or another content section.

- [ ] **Step 3: Separate the lower brand band with a thin rule**

Retain `NISHANT`, availability, copyright, `HIRE ME`, logo, and social links. Replace the current large-name wrapper class and style with:

```tsx
<div
  className="mx-auto mt-10 max-w-7xl border-t px-6 pt-8 sm:px-8 lg:px-12"
  style={{ borderColor: 'var(--color-border)' }}
>
```

- [ ] **Step 4: Run the browser contract**

Run:

```powershell
node scripts/verification/verify-experience-footer.mjs
```

Expected: `Experience and footer verification passed`.

### Task 3: Verify visual and production behavior

**Files:**
- Verify: `src/app/components/layout/Footer.tsx`
- Verify: `scripts/verification/verify-experience-footer.mjs`

- [ ] **Step 1: Capture desktop and mobile footer screenshots**

Capture the rendered footer at `1440x900` and `390x844`. Confirm the artwork fills the desktop gap without touching navigation or availability content, the mobile navigation remains visible, and neither viewport overflows horizontally.

- [ ] **Step 2: Run source checks and production build**

Run:

```powershell
git diff --check
npm run type-check
npm run build
```

Expected: no whitespace errors and no portfolio-source TypeScript or build errors. If the untracked `output/repo-audit` tree is included by TypeScript, preserve it outside the repository during the checks and restore it afterward.

- [ ] **Step 3: Commit locally without pushing**

Stage only the footer, verification script, and plan-related files together with the previously completed approved portfolio files. Do not stage `.playwright-cli`, `output`, unrelated `public/assets` files, or `public/images/uproot-preview.png`.

```powershell
git commit -m "fix: restore portfolio content hierarchy"
```

Expected: a local commit on `content/portfolio-2026-refresh`. Do not push until the user approves the rendered pages.
