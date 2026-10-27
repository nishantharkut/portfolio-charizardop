# Portfolio refresh handoff

This folder is the implementation brief for the October 2026 portfolio refresh. It is deliberately specific because the portfolio has content split between JSON data, React components, metadata, and deployment files. Editing only the page a visitor sees will leave stale claims elsewhere.

## Read order

1. Read `CONTENT-SOURCE-OF-TRUTH.md` before changing copy. It contains approved wording, verified numbers, and facts that must not be invented.
2. Read `EDIT-MAP.md` before editing files. It identifies every known public surface that needs to remain in sync.
3. Read `VERIFICATION.md` before the final build. It includes the domain, cache-recovery, link, and responsive checks.

## Ready-to-paste Antigravity prompt

```text
Work only in this repository. Read docs/antigravity-handoff/README.md and the three linked files in its read order before editing.

Make the October 2026 portfolio refresh exactly as specified. This is a factual content and domain migration, not a redesign. Preserve the current visual language, layout, animations, 3D scene, colors, and dependencies. Do not add generated images, SVGs, badges, marketing copy, new libraries, or broad refactors.

Use CONTENT-SOURCE-OF-TRUTH.md as the authority for wording and facts. Use EDIT-MAP.md so duplicated text, links, metadata, and the .dev to .tech migration are updated consistently. Do not make up a current employer, repository visibility, a direct resume link, metrics, dates, or technical depth.

Only make CSS changes when the approved replacement text would otherwise clip, overlap, or harm mobile readability. Keep them narrow and prove the final desktop and mobile views are clean. Do not change the service-worker strategy while refreshing content; preserve its existing recovery behavior.

Run every check in VERIFICATION.md. Report changed files, commands run, and any fact you intentionally left unchanged because it was not verified.
```

## Scope

In scope:

- Correct stale career status, project facts, competitive-programming links, skills presentation, and portfolio copy.
- Migrate every live `.dev` domain reference to the `.tech` canonical policy described in `EDIT-MAP.md`.
- Keep content source files and hard-coded homepage cards synchronized.
- Preserve returning-visitor behavior while deploying the new content.

Out of scope:

- A new design system, new visual assets, new animations, or replacing the Charizard scene.
- Rewriting every historical project or achievement without a verified source.
- Inflating the profile with generic claims such as "passionate", "scalable", "cutting-edge", or "AI-powered".
- Changing infrastructure or service-worker behavior beyond the required `.tech` host migration.

## Decision rule

If a proposed change is not supported by `CONTENT-SOURCE-OF-TRUTH.md`, leave it unchanged and report it. Accuracy is more important than filling every card with new copy.
