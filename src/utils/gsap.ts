// Optimized GSAP imports - only import what we need
import { gsap } from "gsap/dist/gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

// Only register plugins we actually use
const REQUIRED_PLUGINS = [ScrollTrigger] as const;

// Global GSAP setup - only initialize once on client side
if (typeof window !== "undefined") {
  // Register only required plugins
  REQUIRED_PLUGINS.forEach(plugin => {
    gsap.registerPlugin(plugin);
  });
  
  // Performance-optimized ScrollTrigger defaults
  ScrollTrigger.defaults({
    toggleActions: "play none none reverse",
    markers: process.env.NODE_ENV === 'development', // Only show in dev
    invalidateOnRefresh: true,
    refreshPriority: 0,
    anticipatePin: 1, // Better performance for pinned elements
  });
  
  // Optimized resize handling with passive listeners
  let resizeTimeout: NodeJS.Timeout;
  const handleResize = () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 250);
  };
  
  window.addEventListener('resize', handleResize, { passive: true });
  
  // Mobile orientation change handling
  const handleOrientationChange = () => {
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 500);
  };
  
  window.addEventListener('orientationchange', handleOrientationChange, { passive: true });
}

// Performance utility functions
export const gsapUtils = {
  // Optimized timeline creation
  createTimeline: (options: gsap.TimelineVars = {}) => {
    return gsap.timeline({
      paused: true,
      ...options
    });
  },
  
  // Batch animations for better performance
  batchAnimate: (targets: gsap.TweenTarget[], vars: gsap.TweenVars, stagger = 0.1) => {
    return gsap.fromTo(targets, 
      { opacity: 0, y: 50 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.6,
        stagger,
        ease: "power2.out",
        ...vars 
      }
    );
  },
  
  // Cleanup utility
  killAllTweens: () => {
    gsap.killTweensOf("*");
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  }
};

export { gsap, ScrollTrigger };
