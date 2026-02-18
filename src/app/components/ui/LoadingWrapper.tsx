"use client";

import { useLoading } from '../../contexts/LoadingContext';
import LoadingScreen from './LoadingScreen';
import LazyLoader from './LazyLoader';
import { AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function LoadingWrapper({ children }: { children: React.ReactNode }) {
  const { 
    isInitialLoading, 
    setVideoComplete,
    finishInitialLoading
  } = useLoading();

  const [isReturningVisitor, setIsReturningVisitor] = useState(false); // Start with false to prevent hydration mismatch
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
    if (typeof window !== 'undefined') {
      try {
        const hasVisited = sessionStorage.getItem('hasVisited');
        setIsReturningVisitor(!!hasVisited);
      } catch (error) {
        console.warn('SessionStorage not available:', error);
        setIsReturningVisitor(false);
      }
    }
  }, []);

  // Only show loading screens after hydration to prevent mismatches
  const shouldShowInitialLoading = isInitialLoading && isHydrated;

  const handleVideoComplete = () => {
    setVideoComplete(true);
  };

  const handlePixelLoaderComplete = () => {
    finishInitialLoading();
  };

  return (
    <>
      {/* Always render children so 3D model can start loading immediately */}
      {children}
      
      {/* Overlay loading screens on top */}
      <AnimatePresence mode="wait">
        {shouldShowInitialLoading && !isReturningVisitor && (
          <LoadingScreen
            key="initial-loading"
            type="starter"
            show={isInitialLoading}
            onComplete={handleVideoComplete}
          />
        )}
        {shouldShowInitialLoading && isReturningVisitor && (
          <div key="lazy-loading" className="fixed inset-0 flex items-center justify-center bg-black/90 backdrop-blur-sm" style={{ zIndex: 99999 }}>
            <LazyLoader
              show={isInitialLoading}
              onComplete={handlePixelLoaderComplete}
              duration={1500}
              message="Welcome back"
              size="lg"
            />
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
