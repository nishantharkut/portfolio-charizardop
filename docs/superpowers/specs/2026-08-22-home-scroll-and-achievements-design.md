# Homepage Scroll and Achievements Redesign

Date: 2026-08-22

## Scope

This change fixes the homepage featured-project transition and redesigns the dedicated achievements page. It does not change portfolio content, the global loader, the SVG cursor, the WebGL cursor setting, the navbar, or unrelated homepage sections.

## Confirmed Problems

### Homepage projects

The current GSAP effect calculates horizontal travel once when the component mounts. The tween distance and ScrollTrigger end value remain fixed after resizing or late layout changes. A refresh updates trigger positions but cannot recalculate those fixed values.

The failure is reproducible by loading at one viewport width and resizing to another. At 1920px, the trigger retained a 561px travel distance calculated for the earlier viewport even though the current card layout required substantially more travel. This causes an incomplete project sequence and an incorrect transition into the contact section.

Additional weaknesses:

- The tween targets the global `.project-flex` selector.
- The calculation depends on initial bounding boxes and does not observe later size changes.
- The pinned section is transparent, making a bad pin boundary visually worse.
- Desktop and mobile share the same pinned interaction despite different input and layout needs.
- Decorative pseudo-elements make `scrollWidth` unusable as a direct measurement.

### Achievements page

The page gives nearly every item the same large-card treatment. This makes major selection results, open-source work, awards, campus roles, and course credentials compete at the same visual level.

The current result is difficult to scan because:

- the page is excessively long,
- important evidence is buried,
- repeated finalist descriptions add little information,
- award artwork dominates the actual result,
- leadership progression is split into repetitive cards,
- credential cards become cramped,
- credential actions currently lead to `#`,
- sections do not answer different recruiter questions clearly.

## Design

### 1. Homepage featured projects

Desktop retains the horizontal editorial presentation.

- Scope GSAP queries to the projects section.
- Measure travel from the actual project boxes and viewport boundaries.
- Use function-based `x` and `end` values.
- Enable `invalidateOnRefresh` and explicit pin spacing.
- Recalculate after fonts, images, and container size changes.
- Use a `ResizeObserver` for meaningful layout changes.
- Give the pinned section an opaque theme background and controlled stacking context.
- Destroy the complete GSAP context on unmount or breakpoint change.

Mobile and narrow tablet use native horizontal scrolling.

- Disable pinning below the desktop breakpoint.
- Present one card at a time with CSS scroll snap.
- Preserve touch momentum and normal vertical page movement.
- Keep the existing project details modal.

The contact section must remain outside the project viewport until the desktop pin completes. The final `View All Projects` panel must be fully reachable before unpinning.

### 2. Achievements information architecture

The page becomes a milestone ledger made of full-width sections rather than repeated large cards.

#### Evidence strip

Four concise, verified signals appear immediately after the hero:

- Amazon ML Summer School selection: 3,000 of 134,421
- 16 merged upstream pull requests
- HackOn with Amazon: Grand Finalist and Top 25
- Student Activity Council progression across three roles

These are summary signals, not additional achievement records.

#### Selected milestones

Five high-value milestones use compact horizontal rows. Each row contains the date, result, organisation, one-sentence context, and a restrained logo or image. The section prioritises evidence that matters to engineering recruiters.

#### Competition record

All 16 awards remain visible in a dense year-grouped ledger. Each entry contains:

- result,
- competition,
- year,
- small organisation or competition mark,
- project association only when verified and useful.

Repeated boilerplate descriptions are removed. Large 16:10 award cards are not used.

#### Leadership and campus work

Leadership becomes a chronological timeline. Related Student Activity Council roles are visually connected so progression is obvious. Other roles remain individual entries but use one-line scope statements.

#### Credentials

Credentials use compact rows with issuer, date, exact title, and a real external URL when available. The four Google courses remain grouped under one expandable record while retaining their individual names and credential IDs in the data.

When a credential URL is unavailable, the interface shows no dead action.

## Visual Rules

- Preserve the existing neutral background, orange accent, typography, navbar, and footer.
- Use borders, spacing, and alignment for hierarchy rather than decorative cards.
- Avoid glass effects, oversized award images, gradients as decoration, and nested cards.
- Logos are supporting marks and must not exceed the importance of result text.
- Dates and outcomes align consistently for rapid scanning.
- Motion is limited to short entry transitions and respects reduced-motion preferences.

## Responsive Behavior

### Desktop

- Content width remains consistent with the existing site.
- Selected milestones use two-column metadata and narrative alignment.
- Competition results may use two compact columns when space permits.

### Mobile

- Every ledger entry becomes a single readable row.
- Result and year remain visible without horizontal scrolling.
- No fixed card heights.
- Floating controls must not cover actionable content.

## Verification

### Homepage

- Test fresh loads at 1366x768, 1440x900, and 1920x1000.
- Test resize from 1280px to 1920px and back without reload.
- Verify the project section remains pinned until the final panel is reached.
- Verify the contact section does not enter the viewport while the project trigger is active.
- Verify no project content overlaps the navbar or contact section incoherently.
- Verify mobile vertical scrolling and horizontal project swiping at 390x844.
- Verify trigger cleanup after navigating away and returning.

### Achievements

- Verify all 16 awards, leadership records, and selected credentials remain represented.
- Verify desktop and mobile screenshots at the same viewports.
- Verify no clipped text, dead credential links, missing images, or overlapping controls.
- Verify keyboard navigation and reduced-motion behavior.

### Repository

- Run `npm run type-check`.
- Run `npm run build`.
- Run `git diff --check`.

## Non-Goals

- No portfolio content research or claim changes.
- No loader redesign.
- No cursor redesign.
- No global colour-system redesign.
- No changes to the dedicated projects page.
