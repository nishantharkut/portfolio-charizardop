# Edit map

This map identifies the live source files that have to change together. Do not treat this as permission for a broad refactor. Update only the mapped data and the small rendering paths that duplicate it.

## 1. Domain migration: `.dev` to `.tech`

The canonical public origin must be `https://www.nishantharkut.tech`.

- `https://nishantharkut.tech/<path>?<query>` must retain the existing apex-to-`www` redirect behavior, preserving both path and query.
- The apex `sw.js` exception must remain available for returning visitors, exactly as it does today. Do not turn it into a cross-origin redirect.
- Do not change `public/sw.js` or replace the recovery strategy while doing this content refresh.

Update all live references in these files:

| File | Required update |
| --- | --- |
| `src/middleware.ts` | Change `APEX_HOST` and `CANONICAL_HOST` to the `.tech` hosts while preserving the `/sw.js` matcher exception. |
| `src/app/layout.tsx` | Update `authors`, `metadataBase`, Open Graph URL/image URLs, Twitter image URL, and JSON-LD URLs from `.dev` to `.tech`. Change the JSON-LD email to `nhnishantharkut@gmail.com`. Replace stale current-intern wording with the SEO copy in `CONTENT-SOURCE-OF-TRUTH.md`. Remove placeholder verification meta entries rather than publishing fake tokens. |
| `src/app/about/page.tsx` | Update `openGraph.url`. |
| `src/app/experience/page.tsx` | Update `openGraph.url`. |
| `src/app/projects/page.tsx` | Update `openGraph.url`. |
| `src/app/achievements/page.tsx` | Update `openGraph.url`. |
| `src/app/sitemap.ts` | Update the base URL. |
| `src/app/robots.ts` | Update `host` and `sitemap`. |
| `src/app/components/layout/Navbar.tsx` | Change all visible `nishant.dev` labels to `nishantharkut.tech`. Keep the existing layout and behavior. |
| `src/data/navigation.json` | Standardize the LinkedIn URL to the canonical `www.linkedin.com` form. |

Historical design/planning documents under `docs/superpowers/` may retain `.dev` because they describe a past rollout. Do not rewrite historical records merely to remove a string.

After edits, run a repository search for `nishantharkut.dev` and `nishant.dev`. Every remaining live reference needs an explicit reason.

## 2. Source content versus duplicated UI copy

### Primary data sources

| File | Change |
| --- | --- |
| `src/data/hero.json` | Apply the approved hero, CTA, and announcement copy. Keep the existing resume URL until a direct current PDF URL is supplied. |
| `src/data/about.json` | Replace the current QuickIntell wording, About content, stats, and stale resume metadata according to the content source. |
| `src/data/experience.json` | Update QuickIntell and Cook N Klean role content. Change Cook N Klean's title to `Product Design Engineering Intern`. Avoid duplicating every QuickIntell result in two arrays. |
| `src/data/projects.json` | Update PocketBuddy, GitLore, and TinyRF-KD only as specified. TinyRF-KD needs a full factual correction. Leave Covid-RARS and older cards alone unless another verified source is supplied. |
| `src/data/skills.json` | Replace the unfocused inventory with the approved three-group presentation. |
| `src/data/achievements.json` | Change the `10+` presentation to `13+` wherever that count appears. Add the compact competitive-programming item only if the current UI can render it without crowding or changing the page design. |

### Hard-coded public copy that must stay synchronized

| File | What to change |
| --- | --- |
| `src/app/components/sections/About.tsx` | Its paragraph and `details` array currently describe QuickIntell in the present tense and list an outdated focus. Use the homepage copy from the content source. |
| `src/app/components/ui/MagicBento.tsx` | Update the About Me card, card descriptions, the `1+ years at QuickIntell` sentence, TinyRF highlight count, social-profile URLs, and the broad skills description. Keep card structure, visual treatment, and responsive behavior. |
| `src/app/components/ui/RotatingRoles.tsx` | It is currently not imported. Do not add it back to the UI. If it is retained, do not present it as the source of public identity because it includes stale labels such as graphic designer, video editor, and cybersecurity enthusiast. |
| `public/manifest.json` | Refresh only the app description so it matches the approved SEO positioning. Do not touch icons, colors, screenshots, or app behavior. |

## 3. Link corrections

These current links are stale in `MagicBento.tsx` and must be replaced:

| Profile | Current stale destination | Correct destination |
| --- | --- | --- |
| Codeforces | `https://codeforces.com/profile/fiery_charizard` | `https://codeforces.com/profile/Nishanth2908` |
| LeetCode | `https://leetcode.com/u/nishant_harkut/` | `https://leetcode.com/u/nishant14/` |
| CodeChef | `https://codechef.com/users/nishantharkut` | `https://www.codechef.com/users/nishant_h_27` |

Do not alter the GitHub, LinkedIn, or Linktree destinations unless they fail an explicit link check.

## 4. Content order and rendering constraints

1. Update shared data first.
2. Update the duplicate homepage copy second.
3. Update page metadata and domain routing third.
4. Run a text search and inspect rendered pages before making any CSS change.
5. Make a CSS change only if approved replacement text clips, overflows, or overlaps. Keep it to the affected component and verify both breakpoints.

Do not introduce a content-management layer, global state, or data-model rewrite for this refresh. The existing JSON files are sufficient for the canonical content; the few component strings can be synchronized directly.

## 5. Important existing behavior to preserve

- Existing service-worker retirement and forced-cache-recovery files under `public/` and `scripts/verification/`.
- The current page routes, page-level metadata structure, and responsive navigation.
- The Charizard model, loading sequence, color system, animations, and current asset pipeline.
- Current direct project and experience links unless this handoff supplies a correction.
- Historical documents and unrelated dirty working-tree files.
