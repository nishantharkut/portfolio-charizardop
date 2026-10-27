# Apex Service Worker Recovery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let previously used mobile browsers retire the old apex-origin service worker automatically during an ordinary visit while retaining `www.nishantharkut.tech` as the canonical site.

**Architecture:** Vercel will serve the production project on both custom domains. A Next.js middleware will redirect ordinary apex-origin requests to `www`, but its matcher will exclude `/sw.js` so the retirement worker remains same-origin and updateable. The Vercel domain-level redirect will be removed only after the middleware deployment is live.

**Tech Stack:** Next.js 15 middleware, Vercel project domains API, Node.js HTTP verification, Puppeteer regression scripts

---

### Task 1: Add a failing host-routing verification

**Files:**
- Create: `scripts/verification/verify-apex-domain-routing.mjs`

- [ ] **Step 1: Write the failing test**

Create a Node.js script that sends requests to the local Next server with explicit `Host` headers and asserts:

```js
const apexPage = await request('/', 'nishantharkut.tech');
assert.equal(apexPage.status, 307);
assert.equal(apexPage.location, 'https://www.nishantharkut.tech/');

const apexWorker = await request('/sw.js', 'nishantharkut.tech');
assert.equal(apexWorker.status, 200);
assert.equal(apexWorker.location, undefined);
assert.match(apexWorker.body, /LEGACY_CACHE_PREFIX/);

const canonicalPage = await request('/', 'www.nishantharkut.tech');
assert.equal(canonicalPage.status, 200);
```

Also verify that `/projects?source=apex` becomes `https://www.nishantharkut.tech/projects?source=apex`.

- [ ] **Step 2: Run the test to verify it fails**

Run: `node scripts/verification/verify-apex-domain-routing.mjs`

Expected: FAIL because the application currently returns `200` for an apex-host page instead of redirecting it.

### Task 2: Add the canonical-host middleware

**Files:**
- Create: `src/middleware.ts`
- Test: `scripts/verification/verify-apex-domain-routing.mjs`

- [ ] **Step 1: Implement the minimum host redirect**

```ts
import { type NextRequest, NextResponse } from "next/server";

const APEX_HOST = "nishantharkut.tech";
const CANONICAL_HOST = "www.nishantharkut.tech";

export function middleware(request: NextRequest) {
  if (request.nextUrl.hostname !== APEX_HOST) return NextResponse.next();

  const destination = request.nextUrl.clone();
  destination.protocol = "https";
  destination.hostname = CANONICAL_HOST;
  destination.port = "";
  return NextResponse.redirect(destination, 307);
}

export const config = {
  matcher: ["/((?!sw\\.js$|_next/static|_next/image|favicon.ico).*)"],
};
```

- [ ] **Step 2: Run the routing test to verify it passes**

Run: `node scripts/verification/verify-apex-domain-routing.mjs`

Expected: `Apex domain routing verification passed`.

- [ ] **Step 3: Run static checks**

Run: `pnpm exec eslint src/middleware.ts scripts/verification/verify-apex-domain-routing.mjs`

Expected: zero errors.

Run: `pnpm exec tsc --noEmit --skipLibCheck src/middleware.ts`

Expected: zero errors for the middleware. Repository-wide TypeScript errors from untracked `output/repo-audit` content are outside this change.

### Task 3: Verify regressions and deploy the middleware

**Files:**
- Create: `src/middleware.ts`
- Create: `scripts/verification/verify-apex-domain-routing.mjs`

- [ ] **Step 1: Run service-worker and layout regressions**

Run:

```text
node scripts/verification/verify-service-worker-retirement.mjs
node scripts/verification/verify-forced-cache-recovery.mjs
node scripts/verification/verify-home-project-scroll.mjs
node scripts/verification/verify-project-card-layout.mjs
```

Expected: all four scripts pass.

- [ ] **Step 2: Commit the application change**

```text
git add src/middleware.ts scripts/verification/verify-apex-domain-routing.mjs
git commit -m "Serve service worker recovery on apex domain"
```

- [ ] **Step 3: Push production branch**

Run: `git push origin main`

Expected: Vercel starts a production deployment for the new commit.

- [ ] **Step 4: Verify the middleware deployment before changing the domain redirect**

Use the deployment URL with the routing test and confirm the middleware bundle is present. Do not modify the apex domain setting until the production deployment is `READY`.

### Task 4: Replace the Vercel domain-level redirect

**Files:**
- No repository files

- [ ] **Step 1: Record current domain configuration**

Run:

```text
npx --yes vercel@59.5.0 api /v9/projects/prj_D7oGjUOPW1y9tvegDUL6vOaK0hZr/domains
```

Expected: `nishantharkut.tech` currently has `"redirect": "www.nishantharkut.tech"`.

- [ ] **Step 2: Remove only the apex domain-level redirect**

Send this JSON body through the authenticated Vercel CLI to the update-project-domain endpoint:

```json
{"redirect": null}
```

Endpoint:

```text
PATCH /v9/projects/prj_D7oGjUOPW1y9tvegDUL6vOaK0hZr/domains/nishantharkut.tech
```

- [ ] **Step 3: Verify the domain configuration response**

Expected: the apex domain has `"redirect": null` and remains verified on project `portfolio`.

### Task 5: Verify the live recovery path

**Files:**
- No repository files

- [ ] **Step 1: Check both service-worker endpoints**

Run:

```text
curl.exe -I https://nishantharkut.tech/sw.js
curl.exe -I https://www.nishantharkut.tech/sw.js
```

Expected: both return `200 OK`, `Service-Worker-Allowed: /`, and no `Location` header.

- [ ] **Step 2: Check canonical redirects**

Run:

```text
curl.exe -I https://nishantharkut.tech/
curl.exe -I "https://nishantharkut.tech/projects?source=apex"
```

Expected: both return `307`; locations use `www.nishantharkut.tech` and preserve the path and query string.

- [ ] **Step 3: Run production browser regressions**

Run the service-worker retirement, homepage scroll, and project-card scripts with `BASE_URL=https://www.nishantharkut.tech`.

Expected: each script exits `0`.

- [ ] **Step 4: Confirm no visitor-facing recovery step**

Verify that the site has no link or instruction directing visitors to `/refresh`, cookie clearing, Incognito, or browser settings.

### Task 6: Roll back only if production routing fails

**Files:**
- No repository files

- [ ] **Step 1: Restore the Vercel domain redirect when any apex verification fails**

Patch the same domain endpoint with:

```json
{"redirect": "www.nishantharkut.tech", "redirectStatusCode": 307}
```

- [ ] **Step 2: Recheck the apex root**

Expected: `https://nishantharkut.tech/` returns the original Vercel domain redirect while `www` remains available.
