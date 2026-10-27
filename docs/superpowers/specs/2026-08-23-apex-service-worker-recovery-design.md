# Apex Service Worker Recovery

## Goal

Recover mobile browsers that still have the retired portfolio service worker registered on `https://nishantharkut.tech` without asking visitors to clear site data, use Incognito, or open a special route.

## Root Cause

The Vercel project currently redirects the entire apex origin, including `/sw.js`, to `https://www.nishantharkut.tech`. A service worker registration is bound to its original origin. An existing worker registered by `https://nishantharkut.tech` therefore cannot update from a script redirected to the different `www` origin.

## Routing Design

- Keep `https://www.nishantharkut.tech` as the canonical public origin.
- Remove the Vercel domain-level redirect from `nishantharkut.tech` so the project can answer requests on that origin.
- Add an application-level host redirect from `nishantharkut.tech` to `www.nishantharkut.tech` for ordinary pages.
- Exclude `/sw.js` from that redirect and serve the existing retirement worker directly with `200 OK` on both origins.
- Preserve the path and query string when redirecting ordinary apex requests.
- Do not change any portfolio UI, content, or visitor-facing navigation.

## Recovery Flow

1. A returning mobile browser visits its usual `nishantharkut.tech` URL.
2. The browser checks the existing same-origin `/sw.js` registration.
3. The apex origin returns the retirement worker directly instead of redirecting its script request.
4. The retirement worker activates, removes only `portfolio-*` caches, unregisters itself, and refreshes controlled windows.
5. The refreshed page reaches the application-level canonical redirect and lands on the equivalent `www` URL.
6. Future visits use the canonical origin without a service worker.

## Deployment Order

1. Add and verify the host-aware application redirect while the current Vercel domain redirect remains active.
2. Deploy the application change to production.
3. Remove only the apex domain's Vercel-level redirect.
4. Verify both origins immediately.

This order prevents a period where the apex domain serves duplicate public pages without a canonical redirect.

## Verification

- `https://nishantharkut.tech/sw.js` returns `200 OK`, JavaScript, and no cross-origin redirect.
- `https://nishantharkut.tech/` redirects to `https://www.nishantharkut.tech/`.
- Apex page redirects preserve paths and query strings.
- `https://www.nishantharkut.tech/sw.js` still returns the retirement worker.
- Fresh visitors receive no service-worker registration.
- A simulated legacy cache-first worker is retired during a normal visit without `/refresh`.
- Existing homepage mobile scroll and project-card layout checks remain green.

## Rollback

If application routing fails after the Vercel domain change, restore the apex domain-level redirect to `www.nishantharkut.tech`. The existing `www` production site remains unaffected throughout.
