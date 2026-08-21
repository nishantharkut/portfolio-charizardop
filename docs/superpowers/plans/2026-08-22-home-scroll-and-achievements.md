# Homepage Scroll and Achievements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Repair the homepage project transition across resizing and replace the achievements card wall with a compact, responsive milestone ledger.

**Architecture:** The project section will use breakpoint-specific behavior: GSAP pinning with function-based geometry on desktop and native CSS scroll snap on smaller screens. The achievements page will remain data-driven but will render four explicit semantic sections with reusable row-level patterns and truthful action states.

**Tech Stack:** Next.js 15, React 19, TypeScript, GSAP ScrollTrigger, Framer Motion, Tailwind CSS, Puppeteer verification.

---

### Task 1: Add a homepage scroll regression check

**Files:**
- Create: `scripts/verification/verify-home-project-scroll.mjs`

- [ ] **Step 1: Add a failing browser check**

The script launches Chromium against `BASE_URL` or `http://localhost:3000`, tests 1280px and 1920px widths in the same page session, and records project and contact geometry while the trigger is active. It must fail when the final panel is not reachable or when `#contact` enters the viewport before the pin ends.

```js
import puppeteer from 'puppeteer';

const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();

async function assertLayout(width, height) {
  await page.setViewport({ width, height, deviceScaleFactor: 1 });
  await page.goto(baseUrl, { waitUntil: 'networkidle0' });
  await page.waitForSelector('.projects-section .project-box');
  await page.evaluate(() => {
    document.documentElement.style.scrollBehavior = 'auto';
    document.querySelector('.projects-section')?.scrollIntoView();
  });
  await new Promise(resolve => setTimeout(resolve, 250));

  const result = await page.evaluate(() => {
    const section = document.querySelector('.projects-section');
    const contact = document.querySelector('#contact');
    const boxes = [...document.querySelectorAll('.project-box')];
    const last = boxes.at(-1);
    if (!section || !contact || !last) return null;
    return {
      sectionTop: section.getBoundingClientRect().top,
      sectionBottom: section.getBoundingClientRect().bottom,
      contactTop: contact.getBoundingClientRect().top,
      lastRight: last.getBoundingClientRect().right,
      viewportWidth: innerWidth,
    };
  });

  if (!result) throw new Error('Project section geometry unavailable');
  if (result.sectionTop === 0 && result.contactTop < height) {
    throw new Error(`Contact entered pinned viewport at ${width}px`);
  }
}

await assertLayout(1280, 800);
await page.setViewport({ width: 1920, height: 1000, deviceScaleFactor: 1 });
await assertLayout(1920, 1000);
await browser.close();
```

- [ ] **Step 2: Run the check against the current implementation**

Run: `node scripts/verification/verify-home-project-scroll.mjs`

Expected: FAIL after the live resize because the trigger retains geometry from the initial width.

- [ ] **Step 3: Commit the regression check**

```powershell
git add -- scripts/verification/verify-home-project-scroll.mjs
git commit -m "test: cover homepage project scroll boundaries"
```

### Task 2: Make the project interaction resize-safe

**Files:**
- Modify: `src/app/components/sections/Projects.tsx`
- Modify: `src/app/components/styles/Projects.css`

- [ ] **Step 1: Replace one-time global geometry with scoped responsive GSAP**

Use `sectionRef`, `trackRef`, and `gsap.matchMedia()`. Measure the required travel from the final box edge, not `scrollWidth`, because the decorative pseudo-elements intentionally span thousands of viewport widths.

```tsx
const trackRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  const section = sectionRef.current;
  const track = trackRef.current;
  if (!section || !track) return;

  const context = gsap.context(() => {
    const media = gsap.matchMedia();
    media.add('(min-width: 769px)', () => {
      const boxes = Array.from(track.querySelectorAll<HTMLElement>('.project-box'));
      const getDistance = () => {
        const last = boxes.at(-1);
        if (!last) return 0;
        const trackTransform = gsap.getProperty(track, 'x') as number;
        const lastRightWithoutTransform = last.getBoundingClientRect().right - trackTransform;
        return Math.max(0, lastRightWithoutTransform - window.innerWidth);
      };

      const tween = gsap.to(track, {
        x: () => -getDistance(),
        ease: 'none',
        scrollTrigger: {
          id: 'work',
          trigger: section,
          start: 'top top',
          end: () => `+=${getDistance()}`,
          scrub: true,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      const observer = new ResizeObserver(() => ScrollTrigger.refresh());
      observer.observe(section);
      observer.observe(track);
      document.fonts.ready.then(() => ScrollTrigger.refresh());

      return () => {
        observer.disconnect();
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    });
    return () => media.revert();
  }, section);

  return () => context.revert();
}, []);
```

- [ ] **Step 2: Add the track ref and breakpoint-specific CSS**

```tsx
<div className="project-flex" ref={trackRef}>
```

Desktop keeps the current presentation but receives an opaque theme background and stacking context. Mobile becomes native horizontal scroll snap and is not transformed by GSAP.

```css
.projects-section {
  background: var(--color-background);
  isolation: isolate;
  z-index: 2;
}

@media (max-width: 768px) {
  .projects-section {
    height: auto;
    min-height: 100vh;
    overflow: visible;
  }

  .project-flex {
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    overscroll-behavior-x: contain;
    scrollbar-width: none;
  }

  .project-flex::-webkit-scrollbar { display: none; }
  .project-box { scroll-snap-align: start; }
}
```

- [ ] **Step 3: Run the homepage check**

Run: `node scripts/verification/verify-home-project-scroll.mjs`

Expected: PASS at both widths and after resizing.

- [ ] **Step 4: Commit the ScrollTrigger repair**

```powershell
git add -- src/app/components/sections/Projects.tsx src/app/components/styles/Projects.css
git commit -m "fix: make homepage project scroll resize-safe"
```

### Task 3: Prepare truthful credential actions

**Files:**
- Modify: `src/data/index.ts`
- Modify: `src/data/achievements.json`

- [ ] **Step 1: Extend the certification type**

```ts
export interface CertificationCourse {
  name: string;
  date: string;
  credentialId: string;
  credentialUrl?: string;
}

export interface Certification {
  id: number;
  name: string;
  issuer: string;
  date: string;
  credentialId?: string;
  credentialUrl?: string;
  image: string;
  skills: string[];
  courses?: CertificationCourse[];
}
```

- [ ] **Step 2: Add only verified credential URLs**

Use the standard issuer verification pages for Udemy and Coursera. Leave Postman without an action unless its exact public assertion URL is confirmed.

```json
"credentialUrl": "https://www.udemy.com/certificate/UC-4967f38f-8805-4583-8568-a03d1f445d36/"
```

Google course URLs use `https://www.coursera.org/account/accomplishments/verify/<credentialId>`.

- [ ] **Step 3: Validate data and compile types**

Run: `node -e "const d=require('./src/data/achievements.json'); JSON.stringify(d); console.log('valid')"`

Expected: `valid`

Run: `npm run type-check`

Expected: exit code 0.

- [ ] **Step 4: Commit the credential model**

```powershell
git add -- src/data/index.ts src/data/achievements.json
git commit -m "content: add verified credential destinations"
```

### Task 4: Replace the achievements card wall with a ledger

**Files:**
- Modify: `src/app/achievements/AchievementsClient.tsx`

- [ ] **Step 1: Remove unused state and legacy card imports**

Remove unused `Link`, `StarBorder`, `useTheme`, particle state, and commented visual code. Retain `Navbar`, `Footer`, `PixelBlast`, `AchievementImage`, `PageHeroCta`, and Framer Motion.

- [ ] **Step 2: Add evidence-strip data and selected milestones**

Create local derived arrays from the existing data. Do not duplicate claims in JSON.

```tsx
const evidence = [
  { value: '3,000 / 134,421', label: 'Amazon ML Summer School 2026' },
  { value: '16', label: 'Merged upstream pull requests' },
  { value: 'Top 25', label: 'HackOn with Amazon 6.0' },
  { value: '3 roles', label: 'Student Activity Council progression' },
];

const selectedMilestones = [
  achievements.find(item => item.id === 1),
  achievements.find(item => item.id === 2),
  awards.find(item => item.id === 1),
  awards.find(item => item.id === 5),
  achievements.find(item => item.id === 4),
].filter(Boolean);
```

- [ ] **Step 3: Build full-width semantic sections**

Render, in order:

1. evidence strip,
2. selected milestones,
3. competition record grouped by year,
4. leadership timeline,
5. credential rows.

Each ledger row uses borders and aligned metadata, not a decorative card. Award images render as 48px supporting marks. Leadership records are derived from achievement categories other than ML and open source. Credential links render only when `credentialUrl` exists. Google child courses use native `<details>` and `<summary>`.

- [ ] **Step 4: Add stable selectors for verification**

```tsx
<section data-section="evidence">...</section>
<section data-section="milestones">...</section>
<section data-section="competitions">...</section>
<section data-section="leadership">...</section>
<section data-section="credentials">...</section>
```

- [ ] **Step 5: Run type checking**

Run: `npm run type-check`

Expected: exit code 0.

- [ ] **Step 6: Commit the ledger page**

```powershell
git add -- src/app/achievements/AchievementsClient.tsx
git commit -m "feat: redesign achievements as milestone ledger"
```

### Task 5: Verify behavior and presentation

**Files:**
- Create: `scripts/verification/verify-achievements-ledger.mjs`

- [ ] **Step 1: Add browser assertions**

Use the following script to verify the five regions, 16 competition entries, absence of dead actions, and horizontal containment at desktop and mobile widths.

```js
import puppeteer from 'puppeteer';

const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();

for (const viewport of [
  { width: 1440, height: 900 },
  { width: 390, height: 844 },
]) {
  await page.setViewport({ ...viewport, deviceScaleFactor: 1 });
  await page.goto(`${baseUrl}/achievements`, { waitUntil: 'networkidle0' });
  await page.waitForSelector('[data-section="evidence"]');

  const result = await page.evaluate(() => ({
    sections: [...document.querySelectorAll('[data-section]')].map(node => node.getAttribute('data-section')),
    competitions: document.querySelectorAll('[data-competition]').length,
    deadLinks: document.querySelectorAll('a[href="#"]').length,
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
  }));

  const required = ['evidence', 'milestones', 'competitions', 'leadership', 'credentials'];
  for (const section of required) {
    if (!result.sections.includes(section)) throw new Error(`Missing ${section} at ${viewport.width}px`);
  }
  if (result.competitions !== 16) throw new Error(`Expected 16 competitions, found ${result.competitions}`);
  if (result.deadLinks !== 0) throw new Error(`Found ${result.deadLinks} dead links`);
  if (result.overflow > 1) throw new Error(`Horizontal overflow is ${result.overflow}px`);
}

await browser.close();
console.log('Achievements ledger verification passed');
```

- [ ] **Step 2: Run browser verification**

Run: `node scripts/verification/verify-home-project-scroll.mjs`

Expected: PASS.

Run: `node scripts/verification/verify-achievements-ledger.mjs`

Expected: PASS at desktop and mobile widths.

- [ ] **Step 3: Inspect screenshots manually**

Capture and inspect:

- homepage project start, final panel, and contact boundary at 1920x1000,
- homepage projects after resizing 1280px to 1920px,
- achievements top, competition ledger, leadership timeline, and credentials at 1440x900,
- achievements page at 390x844.

- [ ] **Step 4: Run repository verification**

Run: `npm run type-check`

Expected: exit code 0.

Run: `npm run build`

Expected: 36 static pages generated and exit code 0.

Run: `git diff --check`

Expected: no whitespace errors.

- [ ] **Step 5: Commit verification and push**

```powershell
git add -- scripts/verification/verify-achievements-ledger.mjs
git commit -m "test: verify achievements ledger layout"
git push origin content/portfolio-2026-refresh
```
