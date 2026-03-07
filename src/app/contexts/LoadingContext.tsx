"use client";

import { createContext, useContext, useState, useEffect } from 'react';

interface LoadingContextType {
  isInitialLoading: boolean;
  isModelLoaded: boolean;
  isVideoComplete: boolean;
  startInitialLoading: () => void;
  finishInitialLoading: () => void;
  setModelLoaded: (loaded: boolean) => void;
  setVideoComplete: (complete: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isVideoComplete, setIsVideoComplete] = useState(false);
  const [hasCompletedInitialLoad, setHasCompletedInitialLoad] = useState(false);

  // ── Helpers ──────────────────────────────────────────────────────────────
  const persistVisit = () => {
    if (typeof window === 'undefined') return;
    try {
      sessionStorage.setItem('hasVisited', 'true');
      sessionStorage.setItem('hasCompletedInitialLoad', 'true');
    } catch {
      // silent — private browsing, quota exceeded, etc.
    }
  };

  const dismiss = () => {
    setIsInitialLoading(false);
    setHasCompletedInitialLoad(true);
    persistVisit();
  };

  // ── Returning-visitor fast path ────────────────────────────────────────
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const hasVisited = sessionStorage.getItem('hasVisited');
      const hasCompletedLoad = sessionStorage.getItem('hasCompletedInitialLoad');

      if (hasVisited && hasCompletedLoad) {
        // Already seen the full experience — skip loader entirely
        setIsInitialLoading(false);
        setIsModelLoaded(true);
        setIsVideoComplete(true);
        setHasCompletedInitialLoad(true);
      } else if (hasVisited) {
        // Returning visitor in same tab — 1.5 s fast loader (LoadingScreen timeout fires)
        setIsInitialLoading(true);
        setIsModelLoaded(true);
      }
    } catch {
      // sessionStorage unavailable — fall through to normal load
    }
  }, []);

  // ── 3D model ready → dismiss loader (with 400 ms grace for fly-in) ────
  // This is the HAPPY PATH. The loader waits here before fading out.
  useEffect(() => {
    if (!isModelLoaded || !isInitialLoading || hasCompletedInitialLoad) return;
    // 400 ms grace: Charizard starts his entrance animation, THEN the loader
    // fades out — so the user sees him arrive rather than pop in from nothing.
    const timer = setTimeout(dismiss, 400);
    return () => clearTimeout(timer);
  }, [isModelLoaded, isInitialLoading, hasCompletedInitialLoad]);

  // ── LoadingScreen timeout/video-end → dismiss loader ─────────────────
  // This is the SLOW / FAILURE PATH. If the 3D model never signals ready
  // (WebGL error, very slow connection), the LoadingScreen's own internal
  // fallbackTimeoutMs fires, calls onComplete → setVideoComplete(true) here.
  // The LoadingScreen handles the UX gracefully (progress bar reaches 100%,
  // text says "ENVIRONMENT READY", then it calls onComplete).
  useEffect(() => {
    if (!isVideoComplete || !isInitialLoading || hasCompletedInitialLoad) return;
    const timer = setTimeout(dismiss, 100);
    return () => clearTimeout(timer);
  }, [isVideoComplete, isInitialLoading, hasCompletedInitialLoad]);

  // ── Public API ─────────────────────────────────────────────────────────
  const startInitialLoading = () => {
    setIsInitialLoading(true);
    setIsModelLoaded(false);
    setIsVideoComplete(false);
  };

  const finishInitialLoading = () => dismiss();

  return (
    <LoadingContext.Provider value={{
      isInitialLoading,
      isModelLoaded,
      isVideoComplete,
      startInitialLoading,
      finishInitialLoading,
      setModelLoaded: (loaded) => setIsModelLoaded(loaded),
      setVideoComplete: (complete) => setIsVideoComplete(complete),
    }}>
      {children}
    </LoadingContext.Provider>
  );
}

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};
