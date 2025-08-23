"use client";

import React, { useState, useEffect } from 'react';
import { performanceManager } from '@/utils/performance';

export default function PerformanceIndicator() {
  const [settings, setSettings] = useState<any>(null);
  
  useEffect(() => {
    // Only run on client side to prevent hydration mismatch
    if (typeof window !== 'undefined') {
      setSettings(performanceManager.getOptimalSettings());
    }
  }, []);
  
  if (process.env.NODE_ENV !== 'development' || !settings) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-[9999] bg-black/80 text-white p-2 rounded text-xs font-mono pointer-events-none">
      <div>Device: {settings.deviceTier.toUpperCase()}</div>
      <div>WebGL: {settings.enableWebGL ? 'ON' : 'OFF'}</div>
      <div>Animations: {settings.enableComplexAnimations ? 'ON' : 'OFF'}</div>
      <div>Target FPS: {settings.targetFPS}</div>
      {settings.reducedMotion && <div className="text-yellow-400">REDUCED MOTION</div>}
      {settings.isLowPowerMode && <div className="text-red-400">LOW POWER</div>}
    </div>
  );
}
