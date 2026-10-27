# Verification checklist

Run these checks after the content refresh. Do not claim success based only on a successful build.

## 1. Static checks

From the repository root:

```powershell
pnpm run type-check
pnpm run build
```

Then inspect the changed files and search for stale public facts:

```powershell
rg -n "nishantharkut\.dev|nishant\.dev|contact@nishant\.dev|currently at QuickIntell|I work at QuickIntell|56,200|85,064 KB|0\.047 Spearman|1,348-byte|3,700-byte" src public
rg -n "fiery_charizard|nishant_harkut|codechef\.com/users/nishantharkut" src public
```

Expected result: no match in a live public source. A historical document may match only if it clearly describes the old rollout.

Also inspect the diff to make sure no unapproved generated asset, dependency, service-worker rewrite, or broad reformatting was introduced.

## 2. Local content and responsive checks

Start the local server:

```powershell
pnpm dev
```

Inspect these routes at a desktop viewport and a 390 px-wide mobile viewport:

- `/`
- `/about`
- `/experience`
- `/projects`
- `/achievements`

On the homepage, check all of the following:

- The hero no longer says that QuickIntell is current employment.
- The About section, Bento card, Experience card, and About page agree on the same one-year completed internship.
- No approved replacement text clips, overlaps, or forces a card to resize unpredictably.
- The navbar brand is `nishantharkut.tech` on desktop, mobile, and the mobile overlay.
- The social icons resolve to the current LeetCode, CodeChef, and Codeforces profiles.
- TinyRF-KD shows the corrected metrics and never claims the research repository is public.
- The skills surface has a clear primary stack instead of an exhaustive language inventory.

Use browser screenshots for the final check. Do not rely on DOM text alone for mobile card overlap or truncation.

## 3. Link and metadata checks

- Click the homepage and footer social links, project GitHub/live links, and resume link.
- Confirm the resume link still works. It may remain a Google Drive folder until Nishant provides a direct current PDF URL.
- Inspect page source or a metadata tool for each route. Canonical URLs, Open Graph URLs, sitemap, robots, and JSON-LD must use `https://www.nishantharkut.tech`.
- Confirm JSON-LD uses `nhnishantharkut@gmail.com`, not `contact@nishant.dev`.
- Confirm no placeholder Google, Yahoo, or Yandex verification token remains rendered.

## 4. Returning-visitor safety

This site has previously had a stale mobile-cache problem. A content refresh must not bring it back.

Do not edit `public/sw.js` as part of this task. Run the existing repository checks after the build:

```powershell
node scripts/verification/verify-service-worker-retirement.mjs
node scripts/verification/verify-forced-cache-recovery.mjs
```

For deployed-domain validation, update the expected host names in the domain-routing verification script as part of the `.tech` migration, then run it against the deployed environment. Confirm:

- `https://nishantharkut.tech/` redirects to `https://www.nishantharkut.tech/`.
- A route and query keep their path and query after the apex redirect.
- `https://nishantharkut.tech/sw.js` returns the retirement worker directly rather than crossing to `www`.
- `https://www.nishantharkut.tech/sw.js` continues to serve the retirement worker.

After deployment, open the canonical URL in a browser profile that visited the old site. The new content must appear without asking the visitor to clear data, use Incognito, or visit a special recovery route.

## 5. Completion report

The implementation report should include:

- Exact changed files.
- Commands run and their result.
- Desktop and mobile screenshot paths or links.
- Any item intentionally not changed because it lacked a verified source.
- Any fact mismatch discovered during implementation.
