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
      // silent
    }
  };

  const dismiss = () => {
    setIsInitialLoading(false);
    setHasCompletedInitialLoad(true);
    persistVisit();
  };

  // ── Returning-visitor check ──────────────────────────────────────────────
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const hasVisited = sessionStorage.getItem('hasVisited');
      const hasCompletedLoad = sessionStorage.getItem('hasCompletedInitialLoad');

      if (hasVisited && hasCompletedLoad) {
        setIsInitialLoading(false);
        setIsModelLoaded(true);
        setIsVideoComplete(true);
        setHasCompletedInitialLoad(true);
      } else if (hasVisited) {
        setIsInitialLoading(true);
        setIsModelLoaded(true);
      }
    } catch {
      // ignore
    }
  }, []);

  // ── Dismiss loader when the video completes or is skipped ─────────────────
  useEffect(() => {
    if (!isVideoComplete || !isInitialLoading || hasCompletedInitialLoad) return;
    const timer = setTimeout(dismiss, 100);
    return () => clearTimeout(timer);
  }, [isVideoComplete, isInitialLoading, hasCompletedInitialLoad]);

  // ── Hard Safety Net: NEVER allow the loader to remain past 8.2s under any conditions ──
  useEffect(() => {
    if (!isInitialLoading || hasCompletedInitialLoad) return;
    const timer = setTimeout(dismiss, 8200);
    return () => clearTimeout(timer);
  }, [isInitialLoading, hasCompletedInitialLoad]);

  // ── Public API ───────────────────────────────────────────────────────────
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
