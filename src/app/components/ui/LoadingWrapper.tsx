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

  const [isReturningVisitor, setIsReturningVisitor] = useState<boolean | null>(null);

  useEffect(() => {
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

  // Don't render loading screens until we know if it's a returning visitor
  // This prevents hydration mismatches
  const shouldShowInitialLoading = isInitialLoading && isReturningVisitor !== null;

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
          <div key="lazy-loading" className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
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
