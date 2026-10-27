"use client";

import { createContext, useContext, useState, useEffect, useRef } from 'react';

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

  // ── Returning-visitor check ──────────────────────────────────────────────
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const hasVisited = sessionStorage.getItem('hasVisited');
      const hasCompletedLoad = sessionStorage.getItem('hasCompletedInitialLoad');

      if (hasVisited && hasCompletedLoad) {
        // Already seen the full video experience in this session — skip loader entirely
        setIsInitialLoading(false);
        setIsModelLoaded(true);
        setIsVideoComplete(true);
        setHasCompletedInitialLoad(true);
      } else if (hasVisited) {
        // Returning visitor in same tab — quick casual path
        setIsInitialLoading(true);
        setIsModelLoaded(true);
      }
    } catch {
      // sessionStorage unavailable — fall through to normal load
    }
  }, []);

  // ── Dismiss loader when the video is complete (or skipped) ───────────────
  // The video playback is the master gate on initial visit.
  // We do not cut the video short when the 3D model loads; we let the video play to 100%.
  useEffect(() => {
    if (!isVideoComplete || !isInitialLoading || hasCompletedInitialLoad) return;
    const timer = setTimeout(dismiss, 120);
    return () => clearTimeout(timer);
  }, [isVideoComplete, isInitialLoading, hasCompletedInitialLoad]);

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
