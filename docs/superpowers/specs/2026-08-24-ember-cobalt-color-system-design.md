# Ember + Cobalt Color System Design

## Goal

Replace the portfolio's orange-on-warm-neutral monotone with a restrained Ember + Cobalt system while preserving the existing Charizard identity, layout, content, animation behavior, and original brand assets.

The change is a color-system migration only. It must not alter page structure, copy, navigation, loaders, media framing, GSAP behavior, component dimensions, or responsive behavior.

## Visual Direction

The interface will remain primarily neutral. Orange stays the signature brand color. Cobalt becomes a controlled secondary color for technical and interactive information.

Target distribution:

- 75% neutral backgrounds, surfaces, text, and structural lines
- 18% orange brand and primary-action emphasis
- 7% cobalt links, technical information, data, and secondary interaction

Orange and cobalt must not be blended into large hero gradients. They should appear as separate, purposeful signals. Most surfaces and borders must remain neutral.

## Palette

### Light mode

| Role | Value | Use |
| --- | --- | --- |
| Background | `#F8F8F5` | Main page background |
| Background end | `#F1F2F0` | Subtle section separation |
| Surface | `#F3F4F1` | Secondary panels and bands |
| Elevated surface | `#FFFFFF` | Cards, controls, overlays |
| Primary text | `#191A1E` | Headings and body text |
| Secondary text | `#555961` | Supporting copy |
| Muted text | `#686D76` | Metadata with AA contrast |
| Ember | `#B25420` | Brand text, primary actions, active navigation |
| Ember hover | `#984619` | Primary hover and pressed states |
| Ember light | `#CF7440` | Decorative emphasis only |
| Cobalt | `#2859A6` | Links, technical metadata, focus, data |
| Cobalt hover | `#1F4788` | Secondary hover and pressed states |
| Cobalt light | `#DDE7F7` | Selected or informational backgrounds |
| Border | `#D9DADE` | Default dividers and component borders |
| Border strong | `#BFC3CC` | Hovered and emphasized boundaries |

`#B25420` is used instead of the initially proposed `#B75A25` because it reaches WCAG AA contrast against both white and the selected off-white background.

### Dark mode

| Role | Value | Use |
| --- | --- | --- |
| Background | `#0B0D12` | Main page background |
| Background end | `#11141C` | Subtle section separation |
| Surface | `#151821` | Secondary panels and bands |
| Elevated surface | `#1C202B` | Cards, controls, overlays |
| Primary text | `#F3F4F7` | Headings and body text |
| Secondary text | `#B8BDC8` | Supporting copy |
| Muted text | `#949BA9` | Metadata |
| Ember | `#EE884C` | Brand text, primary actions, active navigation |
| Ember hover | `#F29B67` | Primary hover and pressed states |
| Ember dark | `#BA5B2C` | Low-emphasis orange details |
| Cobalt | `#82A4EE` | Links, technical metadata, focus, data |
| Cobalt hover | `#A2BCF4` | Secondary hover and pressed states |
| Cobalt dark | `#24375E` | Selected or informational backgrounds |
| Border | `#2B303B` | Default dividers and component borders |
| Border strong | `#414958` | Hovered and emphasized boundaries |

## Semantic Roles

### Ember

Use orange for:

- the primary brand signature and selected title fragments
- primary CTA fills
- active top-level navigation
- signature project numbering where it represents identity rather than data
- current-role or featured-item emphasis
- the existing Charizard-linked hero, loader, and cursor effects

Do not use orange for every card border, every divider, ordinary metadata, all links, every bullet, or all hover states.

### Cobalt

Use cobalt for:

- inline and standalone links
- keyboard focus rings
- GitHub and open-source data emphasis
- technical labels and selected technology metadata
- secondary buttons and secondary interactive states
- informational badges and data visualization accents
- selected timeline or navigation details where a second hierarchy is required

Cobalt is not a second brand competing with orange. It is the interface's technical and informational color.

### Neutral

Use neutral colors for:

- ordinary card and section borders
- dividers, grids, and timeline rails
- inactive navigation
- default icon buttons
- card shadows
- page and section surfaces

This neutralization is the main mechanism that removes the current orange monotone.

### Preserved semantic and brand colors

Success, warning, error, and destructive states retain dedicated semantic colors. Company logos, technology logos, project screenshots, achievement logos, and external media retain their original colors.

## Protected Elements

The following must not be visually redesigned during this migration:

- the existing loader, including its current orange/yellow animation and timing
- the custom cursor and Charizard-linked cursor effects
- project screenshots and hero media
- company, open-source organization, achievement, and technology logos
- the monochrome logo lockup
- the footer character art and its geometry
- the protected `/admin` interface
- `_dev` diagnostic routes

Hardcoded colors inside protected elements are audited but intentionally retained unless they are shared with a public component and cause a verified theme defect.

## Component Mapping

### Global tokens

- Consolidate duplicated `:root` and `.light` palette definitions so every public component reads one authoritative token set.
- Add explicit cobalt tokens instead of reusing the existing orange `--color-secondary` token.
- Make default borders and card borders neutral.
- Keep shadows neutral. Orange or cobalt glows are allowed only on deliberate brand or interactive emphasis.
- Preserve semantic status tokens.

### Navigation and global controls

- Keep the logo monochrome.
- Active navigation remains orange.
- Links and keyboard focus use cobalt.
- Theme and download controls use neutral surfaces and borders, with cobalt for secondary hover/focus feedback.
- Mobile navigation must receive the same semantic mapping as desktop.

### Landing page

- Keep the hero predominantly neutral with the existing restrained orange signature effect.
- Keep the primary contact CTA orange.
- Use cobalt for the secondary resume action, technical links, and data-oriented highlights.
- Convert bento-card borders from orange to neutral.
- Use orange for brand or current-status emphasis and cobalt for technical/open-source emphasis within bento cards.
- Keep original technology icon colors.
- Keep project media unchanged.
- Use neutral structure in career, projects, contact, and footer sections, then add cobalt only where it communicates interaction or technical data.

### Experience page

- Keep the selected hero word and primary CTA orange.
- Change ordinary timeline rails and section dividers to neutral.
- Use orange for the current/primary experience marker.
- Use cobalt for company links, open-source links, merged-PR data, and GitHub activity.
- Preserve company logos and technology icon colors.

### Projects page

- Keep the selected hero word and primary CTA orange.
- Convert ordinary project-card borders and modal separators to neutral.
- Keep primary project numbers orange.
- Use cobalt for repository links, technical tags, secondary actions, and informational badges.
- Replace unrelated hardcoded Tailwind orange/yellow treatments with semantic tokens.
- Preserve project screenshots and their natural colors.

### Achievements page

- Keep the selected hero word and primary CTA orange.
- Use neutral dividers and card structure.
- Use cobalt for evidence links, source links, dates, categories, and non-primary data emphasis.
- Keep achievement logos in their original colors.
- Do not encode award rank solely by color.

### About page and shared UI

- Replace direct `text-orange-*`, `bg-orange-*`, `border-orange-*`, and literal orange values with semantic tokens unless the element is protected.
- Use neutral boundaries for skill tags and timeline structure.
- Use cobalt for technical metadata and secondary interaction.
- Preserve status and third-party brand colors.

## Hardcoded Color Audit Policy

The initial scan found 522 potential color references in `src`. Each reference must be classified before modification:

1. Theme token that should change centrally.
2. Public UI hardcode that should become a semantic token.
3. Intentional company or technology brand color that must remain literal.
4. Semantic success, warning, error, or destructive color that must remain semantic.
5. Protected loader, cursor, media, admin, or diagnostic-route color that must remain unchanged.
6. Rendering implementation detail such as transparent black, white, or shader math that changes only if it produces a visible palette defect.

A final audit must confirm that no public orange utility or legacy orange literal remains unintentionally outside protected or explicitly branded contexts.

## Accessibility

- Normal text and interactive labels must meet WCAG AA contrast of at least 4.5:1.
- Large text must meet at least 3:1.
- Focus indicators and meaningful component boundaries must meet at least 3:1 against adjacent colors.
- Color cannot be the only indicator of selection, rank, state, or interactivity.
- Both themes must be inspected independently. Dark mode is not treated as a mechanical inversion of light mode.

Verified key contrast pairs:

- Light Ember `#B25420` on white: 5.02:1
- Light Cobalt `#2859A6` on white: 6.84:1
- Dark Ember `#EE884C` on `#0B0D12`: 7.65:1
- Dark Cobalt `#82A4EE` on `#0B0D12`: 7.86:1

## Verification

Before delivery:

- run a production build and targeted lint/type checks
- scan source again for legacy orange literals, RGB values, and Tailwind color utilities
- inspect home, experience, projects, achievements, and about pages
- inspect light and dark modes at desktop, tablet, and mobile widths
- inspect initial viewport, representative mid-page sections, modals, menus, hover states, focus states, and footer
- confirm the loader and custom cursor remain unchanged
- confirm company and technology logos retain original colors
- compare before/after screenshots for layout shifts and accidental content changes
- run the existing responsive, homepage scroll, project-card layout, experience/footer, and service-worker verification scripts
- check browser console errors and obvious hydration issues

## Acceptance Criteria

- Orange remains immediately recognizable as the portfolio's primary brand color.
- Cobalt is visible but restrained and consistently associated with technical information and secondary interaction.
- Ordinary cards, dividers, and structural borders no longer make the site appear orange throughout.
- Light and dark themes both look intentional and maintain readable contrast.
- No content, layout, loader, cursor, animation behavior, link destination, media asset, or responsive behavior changes.
- No unclassified public hardcoded orange treatment remains.
