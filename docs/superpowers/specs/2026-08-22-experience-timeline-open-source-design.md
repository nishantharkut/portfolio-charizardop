# Experience Timeline and Open Source Design

## Goal

Replace the generic Experience ledger with a deliberate GSAP-driven work timeline and add a factual open-source section containing Nishant's real GitHub contribution graph and verified merged contributions.

## Page Structure

The existing full-screen hero remains unchanged. The work-history section uses an editorial three-part desktop grid: date and duration, a narrow timeline rail, and the role content. Mobile collapses this into a single readable column with the rail on the left. The existing footer remains unchanged.

After employment history, a separate Open Source section shows the GitHub contribution graph followed by unframed organization rows for Learning Unlimited, Kiwix, and Palisadoes Foundation.

## Timeline Motion

GSAP ScrollTrigger controls only two effects:

- The progress line grows from the first timeline node to the final node as the user scrolls through work history.
- Each node and corresponding entry changes from muted to active when the entry crosses the viewport focus area.

There is no pinning, horizontal scrolling, glowing spark, blur, bounce, card tilt, staggered bullet animation, or scroll reversal. Reduced-motion users receive the fully rendered timeline without scroll animation.

## Visual Treatment

The timeline uses existing theme variables. Accent colour is limited to the active progress line, node, links, and small labels. Experience entries are unframed layouts separated by neutral rules. Technology labels are plain inline text, not pills or buttons. Bullets remain normal readable statements.

The open-source section uses one neutral surface band. The GitHub graph is the only graph. Contribution counts are written as evidence beside each organization and are not converted into invented percentages or additional charts.

## Content

Employment content continues to come from `src/data/experience.json`, including QuickIntell's `Aug. 2025 - Aug. 2026` duration. The same data file gains structured open-source records:

- Learning Unlimited: 9 merged pull requests across 38 files
- Kiwix: 5 merged pull requests
- Palisadoes Foundation: 2 maintainer-reviewed pull requests

The page must not imply that research work is published or add unsupported GitHub totals.

## Responsive And Failure Behaviour

Desktop keeps dates separate from role content. Mobile places dates above each role while preserving the left rail. Long bullets wrap normally and must not create horizontal overflow. The existing GitHub graph fallback remains visible if the remote chart cannot load. All links remain keyboard accessible.

## Verification

Browser verification covers 1440, 768, and 390 pixel widths. It checks the complete timeline, current QuickIntell dates, structured open-source rows, GitHub graph or fallback, reduced-motion behaviour, and horizontal overflow. Visual screenshots cover light and dark themes on desktop and mobile.
