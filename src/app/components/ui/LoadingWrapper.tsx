"use client";

import { useLoading } from '../../contexts/LoadingContext';
import LoadingScreen from './LoadingScreen';
import { AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function LoadingWrapper({ children }: { children: React.ReactNode }) {
  const {
    isInitialLoading,
    setVideoComplete,
    finishInitialLoading,
  } = useLoading();

  const [isReturningVisitor, setIsReturningVisitor] = useState(false);

  // Detect returning-visitor status client-side (no isHydrated gate needed —
  // the loader renders immediately with suppressHydrationWarning so there is
  // no flash of unstyled content while waiting for hydration).
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      setIsReturningVisitor(!!sessionStorage.getItem('hasVisited'));
    } catch {
      setIsReturningVisitor(false);
    }
  }, []);

  // Returning-visitor fast loader completion
  const handlePixelLoaderComplete = () => finishInitialLoading();

  // Video-end / timeout completion for first-visit starter loader
  const handleVideoComplete = () => setVideoComplete(true);

  return (
    <>
      {/* Always render children so the 3D scene can start loading immediately */}
      {children}

      {/* Loader overlay — rendered immediately, no isHydrated gate.
          suppressHydrationWarning prevents React from warning about the
          sessionStorage-driven class difference between SSR and client. */}
      <AnimatePresence mode="wait">
        {isInitialLoading && !isReturningVisitor && (
          <LoadingScreen
            key="initial-loading"
            type="starter"
            show={isInitialLoading}
            onComplete={handleVideoComplete}
          />
        )}
        {isInitialLoading && isReturningVisitor && (
          <LoadingScreen
            key="returning-loading"
            type="casual"
            show={isInitialLoading}
            onComplete={handlePixelLoaderComplete}
            fallbackTimeoutMs={1500}
          />
        )}
      </AnimatePresence>
    </>
  );
}
