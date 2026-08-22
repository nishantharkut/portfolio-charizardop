# Achievements Logo and Ordering Design

## Objective

Improve recognition and chronology on the achievements page without replacing the existing milestone-ledger layout.

## Scope

- Restore the full-height `My Achievements` hero used before the ledger redesign so it matches the Projects and Experience page pattern.
- Keep the four-item evidence strip, place it after the full-height hero, and replace the removed council statistic with the verified `10+` hackathon-finals record.
- Add compact logos only to entries with a clear organisation or event identity.
- Use existing verified local assets where they are suitable at small sizes.
- Keep logo frames consistent at 40 to 48 pixels and use `object-contain` so marks are not cropped.
- Omit the logo frame when no credible mark is available. Do not generate decorative placeholders.
- Remove the `Overall Head, Student Activity Council` entry from the source data and all derived page content.
- Remove the related `3 roles` evidence statistic.
- Present dated entries in reverse chronological order.

## Layout

The hero uses the shared full-screen page composition: centred title, accent underline, concise supporting line, and the standard page CTA over `PixelBlast`. The evidence strip begins after the hero and is not part of the first viewport.

Selected milestones retain their current four-column desktop ledger. The existing rightmost mark is treated as an identity logo, not a thumbnail. Competition entries retain their compact two-column grid, with a small event or organiser mark at the start of each row. Leadership entries gain the same compact mark at the end of the row only when an organisation logo is available.

On mobile, marks remain within their row and never create a reserved empty column. Entries without a verified logo use the full text width.

## Ordering

- Sections remain in the current order: selected milestones, competitions, leadership and campus work, credentials.
- Competition year groups are sorted newest first.
- Competition entries within a year use verified event dates where available. Entries with only a year retain their source order after date-specific entries.
- Leadership entries are sorted by their end date, with ongoing memberships first, followed by the latest completed term.
- Certifications remain newest first.

## Data And Rendering

The achievement data remains the source of truth for image paths and dates. Sorting is deterministic and performed before rendering so future data edits do not silently break chronology. The page reuses `AchievementImage` for fallbacks and image loading. No new visual dependency is introduced.

## Verification

- Assert the removed Student Activity Council overall-head entry and `3 roles` statistic are absent.
- Assert the hero occupies the first viewport and the four-item evidence strip starts below it.
- Assert section entries render in reverse chronological order.
- Check that entries with recognised assets render a logo and entries without one do not reserve blank space.
- Inspect desktop and mobile screenshots for alignment, cropping, overflow and text wrapping.
- Run type checking and the production build.

## Exclusions

No changes to the homepage, loader, custom cursor, navigation, colour system, achievements hero, or unrelated portfolio content.
