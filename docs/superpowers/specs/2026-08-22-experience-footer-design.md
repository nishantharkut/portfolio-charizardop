# Experience Page and Footer Design

## Objective

Replace the decorative Experience page content with a clear work-history presentation and correct the shared footer navigation without changing the established page hero or unrelated site UI.

## Experience Hero

Keep the current full-screen Experience hero, `PixelBlast` background, title treatment, supporting sentence, and CTA. The redesign begins at the work-history section below the hero.

## Work History

Render all roles in one responsive ledger instead of separate mobile and desktop timelines.

Each entry contains:

- Exact date range and duration
- Role and company
- One factual overview sentence
- Compact technology list
- Evidence bullets taken from the existing verified data

QuickIntell receives five evidence bullets because it was a year-long software-engineering internship. Cook N Klean receives three concise bullets. Entries remain reverse chronological.

Desktop uses a restrained date column and a flexible content column separated by thin rules. Mobile stacks the date above the role without changing content or maintaining separate markup. The ledger uses sentence case, normal paragraph alignment, small accent labels, and no cards, heavy shadows, alternating alignment, decorative timeline animation, or chip hover effects.

QuickIntell is corrected to `Aug. 2025 - Aug. 2026`, `1 year`, and past tense.

## Removed Sections

Remove the Experience page's Core Competencies tiles, Coding Stats section, and generic work-together CTA. These duplicate content available elsewhere and interrupt the work-history narrative. The ledger flows directly into the shared footer.

## Footer

Remove the `CONNECT` navigation column while retaining the bottom GitHub, LinkedIn, and Instagram icons and the existing contact/email area.

The `NAVIGATE` section contains only valid cross-page destinations:

- Home: `/`
- About: `/about`
- Experience: `/experience`
- Skills: `/#skills`
- Projects: `/projects`
- Achievements: `/achievements`
- Contact: `/#contact`

Internal links open in the current tab. External social links continue to open in a new tab.

### Footer visual refinement

Rebalance the space left by the removed `CONNECT` column without adding another content category. The upper desktop area uses the existing contact block on the left and a wider navigation region on the right. `NAVIGATE` links use a compact two-column grid instead of a narrow vertical list.

Add one original, compact Charizard-inspired character-art watermark to the otherwise empty desktop area. It is decorative rather than interactive, uses a monospace font and an existing muted colour at low opacity, stays behind the content layer, and is clipped within the footer. The treatment is inspired by character-art references rather than copied from a third-party artwork.

The lower band retains the large `NISHANT` wordmark, availability message, `HIRE ME` action, logo, and social icons. Thin rules and deliberate alignment provide hierarchy without introducing cards, extra copy, gradients, animations, or new colours.

## Responsive Behavior

- No horizontal overflow at 390, 768, or 1440 pixels.
- Date, title, company, technologies, and bullets remain readable without clipping.
- The Experience ledger uses one markup path at every viewport.
- Footer navigation remains visible as a compact two-column link grid on mobile rather than collapsing into a disclosure.
- The large character artwork is desktop-only. Mobile retains a clean text hierarchy without decorative overflow.

## Verification

- Assert one work-history entry per data record with no duplicated mobile/desktop render.
- Assert QuickIntell displays the corrected dates and past-tense overview.
- Assert the removed Experience sections are absent.
- Assert the footer has no `CONNECT` heading and every navigation link resolves to the approved destination.
- Assert the character artwork is hidden below the desktop breakpoint and does not create overflow.
- Inspect desktop and mobile screenshots.
- Run the Experience/Footer browser contract, type checking, and production build.

## Exclusions

No changes to the loader, custom cursor, navbar, Experience hero, homepage Experience section, colour system, project pages, or achievement content.
