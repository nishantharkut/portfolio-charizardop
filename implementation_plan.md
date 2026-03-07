# Fix: Loader Blocks UI Until 3D Model is Ready

## Problem Diagnosis

There are **3 root causes** causing the UI to flash before/during the loader:

### Bug 1 — Hydration gap (most visible flash)
[LoadingWrapper](file:///c:/N%20Drive/Github%20projects/portfolio-charizardop/src/app/components/ui/LoadingWrapper.tsx#9-73) uses `isHydrated` state (starts `false`). Until React hydrates, `shouldShowInitialLoading = false`, so **the loader is invisible for ~200–500ms** while the page renders below it.

```
isHydrated: false  →  shouldShowInitialLoading = false  →  loader not rendered
React hydrates   →  isHydrated = true  →  loader NOW appears  ← UI already visible
```

### Bug 2 — Loader completes on video/timeout, not on model load
`onComplete` in [LoadingWrapper](file:///c:/N%20Drive/Github%20projects/portfolio-charizardop/src/app/components/ui/LoadingWrapper.tsx#9-73) calls [setVideoComplete(true)](file:///c:/N%20Drive/Github%20projects/portfolio-charizardop/src/app/contexts/LoadingContext.tsx#98-99) when the *video ends* or the *fallback timeout* fires — but **`onModelLoaded` in [Hero.tsx](file:///c:/N%20Drive/Github%20projects/portfolio-charizardop/src/app/components/sections/Hero.tsx) never connects to the loading context**. The loader can disappear before Charizard is ready.

### Bug 3 — Children rendered unconditionally
[LoadingWrapper](file:///c:/N%20Drive/Github%20projects/portfolio-charizardop/src/app/components/ui/LoadingWrapper.tsx#9-73) always renders `{children}` first (intentional, for 3D preloading), then overlays the loader. But because of Bug 1, there's a window where children are visible and the loader isn't mounted yet.

---

## Proposed Changes

### Component: [LoadingWrapper.tsx](file:///c:/N%20Drive/Github%20projects/portfolio-charizardop/src/app/components/ui/LoadingWrapper.tsx)

#### [MODIFY] [LoadingWrapper.tsx](file:///c:/N%20Drive/Github%20projects/portfolio-charizardop/src/app/components/ui/LoadingWrapper.tsx)

- **Remove the `isHydrated` guard** — instead render the loader overlay with `opacity: 0 → 1` CSS immediately on mount (avoids hydration mismatch and the flash).
- **Add `suppressHydrationWarning`** on the loader div so SSR/client mismatch is silently accepted.
- **Replace `handleVideoComplete → setVideoComplete`** with [finishInitialLoading](file:///c:/N%20Drive/Github%20projects/portfolio-charizardop/src/app/contexts/LoadingContext.tsx#84-96) — the loader should complete when the **model is loaded**, not when the video ends.
- **Expose a `onModelReady` callback prop** that [Hero.tsx](file:///c:/N%20Drive/Github%20projects/portfolio-charizardop/src/app/components/sections/Hero.tsx) can call when Charizard finishes loading.
- Wire it into [LoadingContext](file:///c:/N%20Drive/Github%20projects/portfolio-charizardop/src/app/contexts/LoadingContext.tsx#5-14) via [finishInitialLoading](file:///c:/N%20Drive/Github%20projects/portfolio-charizardop/src/app/contexts/LoadingContext.tsx#84-96).

### Component: [LoadingContext.tsx](file:///c:/N%20Drive/Github%20projects/portfolio-charizardop/src/app/contexts/LoadingContext.tsx)

#### [MODIFY] [LoadingContext.tsx](file:///c:/N%20Drive/Github%20projects/portfolio-charizardop/src/app/contexts/LoadingContext.tsx)

- **Merge `isVideoComplete` logic into `isModelLoaded`**: the loader should finish when [setModelLoaded(true)](file:///c:/N%20Drive/Github%20projects/portfolio-charizardop/src/app/contexts/LoadingContext.tsx#97-98) is called.  
- Keep `isVideoComplete` state so nothing else breaks.
- Add a **safety timeout (6 s)** — if the model never fires `onLoaded`, dismiss the loader anyway (prevents infinite load on WebGL errors).

### Component: [Hero.tsx](file:///c:/N%20Drive/Github%20projects/portfolio-charizardop/src/app/components/sections/Hero.tsx)

#### [MODIFY] [Hero.tsx](file:///c:/N%20Drive/Github%20projects/portfolio-charizardop/src/app/components/sections/Hero.tsx)

- Call [setModelLoaded(true)](file:///c:/N%20Drive/Github%20projects/portfolio-charizardop/src/app/contexts/LoadingContext.tsx#97-98) via [useLoading()](file:///c:/N%20Drive/Github%20projects/portfolio-charizardop/src/app/contexts/LoadingContext.tsx#115-122) inside the existing `onModelLoaded` callback — one line added.
- This directly connects model-ready signal to the loading context.

### Component: [LoadingScreen.tsx](file:///c:/N%20Drive/Github%20projects/portfolio-charizardop/src/app/components/ui/LoadingScreen.tsx)

#### [MODIFY] [LoadingScreen.tsx](file:///c:/N%20Drive/Github%20projects/portfolio-charizardop/src/app/components/ui/LoadingScreen.tsx)

- No structural changes needed — just update the `fallbackTimeoutMs` default to `6000` to align with context safety timeout (was `3000`, which could dismiss the loader before the model is ready on slow connections).

---

## Verification Plan

### TypeScript Check (automated)
```bash
cd "c:\N Drive\Github projects\portfolio-charizardop" && npx tsc --noEmit
```
Expected: exit code 0, no errors.

### Manual Visual Test
1. Run `npm run dev` and open `http://localhost:3000` in an **incognito** window (clears sessionStorage so the "starter" loader path is triggered).
2. **Expected**: Loader appears *instantly* — no flash of page content underneath.
3. **Expected**: The loader stays up until Charizard finishes flying into frame.
4. **Expected**: After ~1–2 s of Charizard being visible, loader fades out smoothly.
5. Reload the page (non-incognito, `hasVisited` set) — the returning-visitor fast loader (~1.5 s) should show immediately with no flash.
