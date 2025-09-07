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
  // Always start with loading true to show the video, but only for true initial loads
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isVideoComplete, setIsVideoComplete] = useState(false);
  const [hasCompletedInitialLoad, setHasCompletedInitialLoad] = useState(false);

  // Check if user has visited before - if yes, show retro loader instead of full video
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const hasVisited = sessionStorage.getItem('hasVisited');
        const hasCompletedLoad = sessionStorage.getItem('hasCompletedInitialLoad');
        
        if (hasVisited && hasCompletedLoad) {
          // User has visited before and completed initial load - no loading needed
          setIsInitialLoading(false);
          setIsModelLoaded(true);
          setIsVideoComplete(true);
          setHasCompletedInitialLoad(true);
        } else if (hasVisited) {
          // Show retro loader for returning visitors
          setIsInitialLoading(true);
          setIsModelLoaded(true);
          
          // Fast retro loading sequence
          const timer = setTimeout(() => {
            setIsVideoComplete(true);
            setIsInitialLoading(false);
            setHasCompletedInitialLoad(true);
            sessionStorage.setItem('hasCompletedInitialLoad', 'true');
          }, 1500); // Fast 1.5 second retro loader
          
          return () => clearTimeout(timer);
        }
      } catch (error) {
        console.warn('SessionStorage not available:', error);
      }
    }
  }, []);

  // Auto-complete loading when video completes
  useEffect(() => {
    if (isVideoComplete && isInitialLoading && !hasCompletedInitialLoad) {
      // Complete loading immediately when video ends
      const timer = setTimeout(() => {
        setIsInitialLoading(false);
        setHasCompletedInitialLoad(true);
        if (typeof window !== 'undefined') {
          try {
            sessionStorage.setItem('hasVisited', 'true');
            sessionStorage.setItem('hasCompletedInitialLoad', 'true');
          } catch (error) {
            console.warn('Cannot set sessionStorage:', error);
          }
        }
      }, 100); // Very short delay for smooth transition
      return () => clearTimeout(timer);
    }
  }, [isVideoComplete, isInitialLoading, hasCompletedInitialLoad]);

  const startInitialLoading = () => {
    setIsInitialLoading(true);
    setIsModelLoaded(false);
    setIsVideoComplete(false);
  };
  
  const finishInitialLoading = () => {
    setIsInitialLoading(false);
    setHasCompletedInitialLoad(true);
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem('hasVisited', 'true');
        sessionStorage.setItem('hasCompletedInitialLoad', 'true');
      } catch (error) {
        console.warn('Cannot set sessionStorage:', error);
      }
    }
  };

  const setModelLoadedState = (loaded: boolean) => setIsModelLoaded(loaded);
  const setVideoCompleteState = (complete: boolean) => setIsVideoComplete(complete);

  return (
    <LoadingContext.Provider value={{
      isInitialLoading,
      isModelLoaded,
      isVideoComplete,
      startInitialLoading,
      finishInitialLoading,
      setModelLoaded: setModelLoadedState,
      setVideoComplete: setVideoCompleteState
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
