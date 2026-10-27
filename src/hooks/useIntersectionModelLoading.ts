"use client";

import { useState, useEffect, useRef, useCallback } from 'react';

interface UseIntersectionModelLoadingOptions {
  threshold?: number;
  rootMargin?: string;
  delay?: number;
  enabled?: boolean;
}

interface UseIntersectionModelLoadingReturn {
  shouldLoadModel: boolean;
  isModelVisible: boolean;
  heroRef: React.RefObject<HTMLDivElement | null>;
  isIntersecting: boolean;
}

/**
 * Custom hook for intelligent 3D model loading using Intersection Observer
 * Delays model loading until the hero section is visible and adds a delay
 * to prioritize critical content loading first
 */
export function useIntersectionModelLoading(
  options: UseIntersectionModelLoadingOptions = {}
): UseIntersectionModelLoadingReturn {
  const {
    threshold = 0.1,
    rootMargin = '50px 0px',
    delay = 1000,
    enabled = true
  } = options;

  const [shouldLoadModel, setShouldLoadModel] = useState(false);
  const [isModelVisible, setIsModelVisible] = useState(false);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    
    if (entry.isIntersecting) {
      setIsIntersecting(true);
      setIsModelVisible(true);
      
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      // Delay model loading to prioritize critical content
      timeoutRef.current = setTimeout(() => {
        setShouldLoadModel(true);
      }, delay);
    } else {
      setIsIntersecting(false);
      // Don't immediately hide the model if it goes out of view
      // This prevents flickering during scroll
    }
  }, [delay]);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') {
      return;
    }

    const observer = new IntersectionObserver(handleIntersection, {
      threshold,
      rootMargin,
    });

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    return () => {
      observer.disconnect();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [handleIntersection, threshold, rootMargin, enabled]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    shouldLoadModel,
    isModelVisible,
    heroRef,
    isIntersecting,
  };
}

/**
 * Hook for preloading 3D model assets with priority
 * Uses link preload for better browser optimization
 */
export function useModelPreloading() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // NEVER preload or download the 64MB model on mobile devices (mobile uses GIF fallback)
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile) return;

    // Preload 3D model on desktop in background
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = '/models/charizard.glb';
    link.as = 'fetch';
    link.crossOrigin = 'anonymous';
    link.setAttribute('fetchpriority', 'low');
    
    if (!document.querySelector('link[href="/models/charizard.glb"]')) {
      document.head.appendChild(link);
    }

    // Preload via useGLTF for Three.js cache during the video intro window
    const preloadModel = async () => {
      try {
        const { useGLTF } = await import('@react-three/drei');
        useGLTF.preload('/models/charizard.glb');
      } catch (error) {
        console.warn('Failed to preload 3D model:', error);
      }
    };

    // Start preloading promptly so model streams during the 7.44s loader video
    setTimeout(preloadModel, 100);

    return () => {
      const existingLink = document.querySelector('link[href="/models/charizard.glb"]');
      if (existingLink) {
        existingLink.remove();
      }
    };
  }, []);
}

/**
 * Hook for performance-aware model loading
 * Adjusts loading strategy based on device capabilities
 */
export function usePerformanceAwareModelLoading() {
  const [loadingStrategy, setLoadingStrategy] = useState<'immediate' | 'delayed' | 'disabled'>('delayed');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Detect device capabilities
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const deviceMemory = (navigator as any).deviceMemory || 4;
    const connection = (navigator as any).connection;
    const isSlowConnection = connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g');

    // Determine loading strategy based on device capabilities
    if (isSlowConnection) {
      setLoadingStrategy('disabled');
    } else if (isMobile && deviceMemory <= 2) {
      setLoadingStrategy('delayed'); // Changed from 'disabled' to 'delayed'
    } else if (isMobile || deviceMemory <= 4) {
      setLoadingStrategy('delayed');
    } else {
      setLoadingStrategy('immediate');
    }
  }, []);

  return loadingStrategy;
}
