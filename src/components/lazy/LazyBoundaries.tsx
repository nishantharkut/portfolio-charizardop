"use client";

import { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import LazyLoader from '@/app/components/ui/LazyLoader';

// Hook for intersection observer-based lazy loading
function useLazyComponent({
  threshold = 0.1,
  rootMargin = '200px',
  fallbackHeight = '400px'
}: {
  threshold?: number;
  rootMargin?: string;
  fallbackHeight?: string;
}) {
  const [shouldLoad, setShouldLoad] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasLoaded) {
          setShouldLoad(true);
          setHasLoaded(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [threshold, rootMargin, hasLoaded]);

  const LazyContainer = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
    <div 
      ref={elementRef} 
      className={className} 
      style={{ minHeight: shouldLoad ? 'auto' : fallbackHeight }}
    >
      {children}
    </div>
  );

  return { shouldLoad, LazyContainer };
}

// ============================================================================
// LAZY SECTION LOADER - Load heavy sections only when visible
// ============================================================================
export function LazySectionLoader() {
  const { shouldLoad: shouldLoadBento, LazyContainer: BentoContainer } = useLazyComponent({
    threshold: 0.1,
    rootMargin: '200px',
    fallbackHeight: '400px'
  });

  const { shouldLoad: shouldLoadAbout, LazyContainer: AboutContainer } = useLazyComponent({
    threshold: 0.1,
    rootMargin: '200px',
    fallbackHeight: '600px'
  });

  const { shouldLoad: shouldLoadExperience, LazyContainer: ExperienceContainer } = useLazyComponent({
    threshold: 0.1,
    rootMargin: '200px',
    fallbackHeight: '800px'
  });

  const { shouldLoad: shouldLoadSkills, LazyContainer: SkillsContainer } = useLazyComponent({
    threshold: 0.1,
    rootMargin: '200px',
    fallbackHeight: '500px'
  });

  const { shouldLoad: shouldLoadProjects, LazyContainer: ProjectsContainer } = useLazyComponent({
    threshold: 0.1,
    rootMargin: '200px',
    fallbackHeight: '800px'
  });

  const { shouldLoad: shouldLoadContact, LazyContainer: ContactContainer } = useLazyComponent({
    threshold: 0.1,
    rootMargin: '100px',
    fallbackHeight: '400px'
  });

  return {
    BentoContainer,
    shouldLoadBento,
    AboutContainer,
    shouldLoadAbout,
    ExperienceContainer,
    shouldLoadExperience,
    SkillsContainer,
    shouldLoadSkills,
    ProjectsContainer,
    shouldLoadProjects,
    ContactContainer,
    shouldLoadContact
  };
}

// ============================================================================
// SKELETON LOADERS - Prevent CLS while components load
// ============================================================================
function BentoSkeleton() {
  return (
    <div className="w-full py-16">
      <LazyLoader show={true} message="Loading bento..." size="md" duration={1500} />
    </div>
  );
}

function AboutSkeleton() {
  return (
    <div className="w-full py-20">
      <LazyLoader show={true} message="Loading about..." size="md" duration={1500} />
    </div>
  );
}

function ExperienceSkeleton() {
  return (
    <div className="w-full py-24">
      <LazyLoader show={true} message="Loading experience..." size="lg" duration={2000} />
    </div>
  );
}

function SkillsSkeleton() {
  return (
    <div className="w-full py-20">
      <LazyLoader show={true} message="Loading skills..." size="md" duration={1500} />
    </div>
  );
}

function ProjectsSkeleton() {
  return (
    <div className="w-full py-24">
      <LazyLoader show={true} message="Loading projects..." size="lg" duration={2000} />
    </div>
  );
}

function ContactSkeleton() {
  return (
    <div className="w-full py-16">
      <LazyLoader show={true} message="Loading contact..." size="sm" duration={1000} />
    </div>
  );
}

// ============================================================================
// LAZY COMPONENT EXPORTS
// ============================================================================

// Heavy sections with proper lazy loading
export const LazyBento = dynamic(
  () => import('@/app/components/sections/Bento'),
  {
    loading: BentoSkeleton,
    ssr: true // Allow SSR for content sections
  }
);

export const LazyAbout = dynamic(
  () => import('@/app/components/sections/About'),
  {
    loading: AboutSkeleton,
    ssr: true
  }
);

export const LazyExperience = dynamic(
  () => import('@/app/components/sections/Experience'),
  {
    loading: ExperienceSkeleton,
    ssr: true
  }
);

export const LazySkills = dynamic(
  () => import('@/app/components/sections/Skills'),
  {
    loading: SkillsSkeleton,
    ssr: true
  }
);

export const LazyProjects = dynamic(
  () => import('@/app/components/sections/Projects'),
  {
    loading: ProjectsSkeleton,
    ssr: true
  }
);

export const LazyContact = dynamic(
  () => import('@/app/components/sections/Contact'),
  {
    loading: ContactSkeleton,
    ssr: true
  }
);

// Heavy WebGL/3D components - disable SSR
export const LazyHeroModel = dynamic(
  () => import('@/app/components/3d/HeroModel'),
  {
    loading: () => <LazyLoader show={true} message="Loading 3D model..." size="lg" duration={2000} />,
    ssr: false
  }
);

export const LazyCharizardModel = dynamic(
  () => import('@/app/components/3d/CharizardModel'),
  {
    loading: () => <LazyLoader show={true} message="Loading Charizard..." size="lg" duration={2500} />,
    ssr: false
  }
);

export const LazyFaultyTerminal = dynamic(
  () => import('@/app/components/ui/FaultyTerminal'),
  {
    loading: () => <LazyLoader show={true} message="Loading terminal..." size="sm" duration={1000} />,
    ssr: false
  }
);

export const LazySplashCursor = dynamic(
  () => import('@/app/components/ui/SplashCursor'),
  {
    loading: () => null, // No loading state for cursor
    ssr: false
  }
);

// Scene component for complex WebGL
export const LazyScene = dynamic(
  () => import('@/app/components/3d/HeroModel'),
  {
    loading: () => <LazyLoader show={true} message="Loading scene..." size="lg" duration={2000} />,
    ssr: false
  }
);

// Performance-aware WebGL loading
export function ConditionalWebGL({ 
  children, 
  fallback 
}: { 
  children: React.ReactNode; 
  fallback?: React.ReactNode; 
}) {
  const [canUseWebGL, setCanUseWebGL] = useState(false);

  useEffect(() => {
    // Check WebGL support
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (gl) {
      // Check for basic performance indicators
      const isLowEnd = navigator.hardwareConcurrency <= 2 || 
                      (navigator as any).deviceMemory <= 2 ||
                      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      
      setCanUseWebGL(!isLowEnd);
    }
  }, []);

  return canUseWebGL ? <>{children}</> : <>{fallback}</>;
}

// Component-level lazy boundary
export function LazyBoundary({ 
  children, 
  fallback, 
  threshold = 0.1,
  rootMargin = '100px' 
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  threshold?: number;
  rootMargin?: string;
}) {
  const { shouldLoad, LazyContainer } = useLazyComponent({ threshold, rootMargin });

  return (
    <LazyContainer>
      {shouldLoad ? children : (fallback || <LazyLoader show={true} message="Loading..." size="md" duration={1500} />)}
    </LazyContainer>
  );
}
