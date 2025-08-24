"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Props interface to match SplashCursor
interface SplashCursorWrapperProps {
  SPLAT_RADIUS?: number;
  onError?: () => void;
}

// dynamic import of the heavy component; keep ssr false and simple loading fallback
const SplashCursorNoSSR = dynamic(() => import("./SplashCursor"), {
  ssr: false,
  loading: () => null,
});

function deviceEligibleForFX() {
  if (typeof window === "undefined") return false;

  // honor user preference
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return false;
  }

  // Comprehensive mobile detection
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  if (isMobile) return false;

  // Touch device detection
  const hasTouch =
    (navigator as any)?.maxTouchPoints > 0 ||
    "ontouchstart" in window ||
    (window.matchMedia && window.matchMedia("(pointer: coarse)").matches) ||
    (window.matchMedia && window.matchMedia("(hover: none)").matches);

  if (hasTouch) return false;

  // Tablet detection via orientation support
  if ("orientation" in window || "onorientationchange" in window) {
    return false;
  }

  // Check for mobile viewport sizes
  const windowObj = window as any;
  if (windowObj.innerWidth < 1024 || windowObj.innerHeight < 600) return false;

  // Hardware heuristics for low-end devices
  const deviceMemory = (navigator as any)?.deviceMemory || 0;
  const hwConcurrency = navigator.hardwareConcurrency || 2;

  if (deviceMemory && deviceMemory < 2) return false; // <2GB devices -> skip
  if (hwConcurrency && hwConcurrency < 4) return false; // <4 cores -> skip

  // Check WebGL support before enabling
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return false;
  } catch {
    return false;
  }

  return true;
}

export default function SplashCursorWrapper(props: SplashCursorWrapperProps) {
  const [enabled, setEnabled] = useState<boolean | null>(null);

  useEffect(() => {
    // determine once on mount
    try {
      setEnabled(deviceEligibleForFX());
    } catch {
      setEnabled(false);
    }
    // no need to re-run on resize by default — keeps stability and avoids re-init bugs
  }, []);

  if (enabled === null) return null; // avoid flicker
  return enabled ? <SplashCursorNoSSR {...props} /> : null;
}