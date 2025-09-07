"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { performanceManager } from '@/utils/performance';

interface PerformanceState {
  deviceTier: 'low' | 'medium' | 'high';
  isLowPowerMode: boolean;
  reducedMotion: boolean;
  memoryPressure: boolean;
  networkConstraints: boolean;
  isOnline: boolean;
  connectionType: string;
  
  // Animation settings
  maxParticles: number;
  animationQuality: 'low' | 'medium' | 'high';
  enableWebGL: boolean;
  enableComplexAnimations: boolean;
  enableParticles: boolean;
  targetFPS: number;
  
  // Visual effects
  enableBlur: boolean;
  enableShadows: boolean;
  enableGradients: boolean;
  enableTransitions: boolean;
  
  // Asset loading
  imageQuality: 'low' | 'medium' | 'high';
  lazyLoadThreshold: number;
  preloadImages: boolean;
  
  // WebGL specific
  webglMaxTextures: number;
  webglShadowQuality: 'off' | 'low' | 'high';
  
  // Interaction
  touchOptimized: boolean;
  reducedTooltips: boolean;
  
  isHydrated: boolean;
  viewport: {
    width: number;
    height: number;
    isMobile: boolean;
    isTablet: boolean;
  };
}

interface PerformanceContextType {
  performance: PerformanceState;
  updatePerformanceSettings: () => void;
  setReducedMotion: (enabled: boolean) => void;
}

const defaultState: PerformanceState = {
  deviceTier: 'medium',
  isLowPowerMode: false,
  reducedMotion: false,
  memoryPressure: false,
  networkConstraints: false,
  isOnline: true,
  connectionType: 'unknown',
  
  // Animation settings
  maxParticles: 75,
  animationQuality: 'medium',
  enableWebGL: true,
  enableComplexAnimations: true,
  enableParticles: true,
  targetFPS: 60,
  
  // Visual effects
  enableBlur: true,
  enableShadows: false,
  enableGradients: true,
  enableTransitions: true,
  
  // Asset loading
  imageQuality: 'medium',
  lazyLoadThreshold: 100,
  preloadImages: false,
  
  // WebGL specific
  webglMaxTextures: 8,
  webglShadowQuality: 'low',
  
  // Interaction
  touchOptimized: false,
  reducedTooltips: false,
  
  isHydrated: false,
  viewport: {
    width: 1200,
    height: 800,
    isMobile: false,
    isTablet: false,
  },
};

const PerformanceContext = createContext<PerformanceContextType | undefined>(undefined);

export function PerformanceProvider({ children }: { children: ReactNode }) {
  const [performance, setPerformance] = useState<PerformanceState>(defaultState);

  const updatePerformanceSettings = () => {
    if (typeof window === 'undefined') return;

    const settings = performanceManager.getOptimalSettings();
    const width = window.innerWidth;
    const height = window.innerHeight;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    setPerformance(prev => ({
      ...prev,
      ...settings,
      animationQuality: settings.animationQuality as 'low' | 'medium' | 'high',
      imageQuality: settings.imageQuality as 'low' | 'medium' | 'high',
      webglShadowQuality: settings.webglShadowQuality as 'off' | 'low' | 'high',
      reducedMotion: prefersReducedMotion,
      isHydrated: true,
      viewport: {
        width,
        height,
        isMobile: width <= 768,
        isTablet: width > 768 && width <= 1024,
      },
    }));
  };

  const setReducedMotion = (enabled: boolean) => {
    setPerformance(prev => ({
      ...prev,
      reducedMotion: enabled,
      enableComplexAnimations: enabled ? false : prev.enableComplexAnimations,
    }));
  };

  useEffect(() => {
    updatePerformanceSettings();

    // Listen for viewport changes
    const handleResize = () => {
      updatePerformanceSettings();
    };

    // Listen for reduced motion preference changes
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleReducedMotionChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };

    window.addEventListener('resize', handleResize, { passive: true });
    mediaQuery.addEventListener('change', handleReducedMotionChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      mediaQuery.removeEventListener('change', handleReducedMotionChange);
    };
  }, []);

  return (
    <PerformanceContext.Provider value={{
      performance,
      updatePerformanceSettings,
      setReducedMotion,
    }}>
      {children}
    </PerformanceContext.Provider>
  );
}

export function usePerformance() {
  const context = useContext(PerformanceContext);
  if (context === undefined) {
    // Provide safe defaults for SSR
    console.warn('usePerformance called outside PerformanceProvider, using defaults');
    return {
      performance: defaultState,
      updatePerformanceSettings: () => {},
      setReducedMotion: () => {}
    };
  }
  return context;
}

// Custom hooks for specific performance aspects
export function useDeviceInfo() {
  const { performance } = usePerformance();
  return performance.viewport;
}

export function useAnimationSettings() {
  const { performance } = usePerformance();
  return {
    enableComplexAnimations: performance.enableComplexAnimations && !performance.reducedMotion,
    reducedMotion: performance.reducedMotion,
    deviceTier: performance.deviceTier,
  };
}

export function useWebGLSettings() {
  const { performance } = usePerformance();
  return {
    enableWebGL: performance.enableWebGL && !performance.reducedMotion,
    enableParticles: performance.enableParticles && !performance.reducedMotion,
    quality: performance.deviceTier,
  };
}
