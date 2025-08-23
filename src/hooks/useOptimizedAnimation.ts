import { useEffect, useRef, useCallback } from 'react';
import { performanceManager } from '@/utils/performance';

interface AnimationOptions {
  fps?: number;
  priority?: 'low' | 'medium' | 'high';
  condition?: () => boolean;
}

export function useOptimizedAnimation(
  callback: (deltaTime: number) => void,
  options: AnimationOptions = {}
) {
  const frameRef = useRef<number | undefined>(undefined);
  const lastTimeRef = useRef<number>(0);
  const isActiveRef = useRef<boolean>(true);
  const { fps = 60, priority = 'medium', condition } = options;
  
  const frameInterval = 1000 / fps;
  const settings = performanceManager.getOptimalSettings();

  const animate = useCallback((currentTime: number) => {
    if (!isActiveRef.current) return;

    const deltaTime = currentTime - lastTimeRef.current;
    
    if (deltaTime >= frameInterval) {
      // Check if animation should run based on device performance
      if (condition && !condition()) {
        frameRef.current = requestAnimationFrame(animate);
        return;
      }

      // Skip frames on low-end devices for non-critical animations
      if (settings.deviceTier === 'low' && priority === 'low') {
        if (Math.random() > 0.5) {
          frameRef.current = requestAnimationFrame(animate);
          return;
        }
      }

      // Skip animations if reduced motion is preferred
      if (settings.reducedMotion && priority !== 'high') {
        frameRef.current = requestAnimationFrame(animate);
        return;
      }

      callback(deltaTime);
      lastTimeRef.current = currentTime;
      performanceManager.monitorFPS();
    }
    
    frameRef.current = requestAnimationFrame(animate);
  }, [callback, frameInterval, condition, priority, settings.deviceTier, settings.reducedMotion]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    frameRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      isActiveRef.current = false;
    };
  }, [animate]);

  const pause = useCallback(() => {
    isActiveRef.current = false;
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
    }
  }, []);

  const resume = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    isActiveRef.current = true;
    frameRef.current = requestAnimationFrame(animate);
  }, [animate]);

  return { pause, resume };
}
