"use client";

import { useEffect } from 'react';
import { performanceManager } from '@/utils/performance';

export default function PerformanceProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Initialize performance manager
    const settings = performanceManager.getOptimalSettings();
    
    // Add performance classes based on device capability
    document.documentElement.classList.add(`device-${settings.deviceTier}`);
    
    if (settings.isLowPowerMode) {
      document.documentElement.classList.add('low-power-mode');
    }
    
    if (settings.reducedMotion) {
      document.documentElement.classList.add('motion-reduce');
    }
    
    // Add performance monitoring in development
    if (process.env.NODE_ENV === 'development') {
      const fpsIndicator = document.createElement('div');
      fpsIndicator.className = 'fps-indicator';
      fpsIndicator.id = 'fps-indicator';
      document.body.appendChild(fpsIndicator);
      
      let animationId: number;
      const updateFPS = () => {
        const fps = performanceManager.monitorFPS();
        const indicator = document.getElementById('fps-indicator');
        if (indicator) {
          indicator.textContent = `FPS: ${fps} | ${settings.deviceTier.toUpperCase()}`;
        }
        animationId = requestAnimationFrame(updateFPS);
      };
      updateFPS();
      
      return () => {
        cancelAnimationFrame(animationId);
        const indicator = document.getElementById('fps-indicator');
        if (indicator) {
          indicator.remove();
        }
      };
    }
    
    return () => {
      performanceManager.cleanup();
    };
  }, []);

  return <>{children}</>;
}
