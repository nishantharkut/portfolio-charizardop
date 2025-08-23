"use client";

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import LazyLoader from '@/app/components/ui/LazyLoader';

// Simple lazy loading hook that loads after initial render
function useSimpleLazyLoad(delay: number = 100) {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldLoad(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return shouldLoad;
}

// Simple lazy loading hook for scroll-based loading
function useScrollLazyLoad() {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!shouldLoad && window.scrollY > 100) {
        setShouldLoad(true);
      }
    };

    handleScroll(); // Check immediately
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [shouldLoad]);

  return shouldLoad;
}

// Skeleton components
const BentoSkeleton = () => (
  <div className="w-full py-16">
    <LazyLoader show={true} message="Loading bento..." size="md" duration={1500} />
  </div>
);

const AboutSkeleton = () => (
  <div className="w-full py-20">
    <LazyLoader show={true} message="Loading about..." size="md" duration={1500} />
  </div>
);

const ExperienceSkeleton = () => (
  <div className="w-full py-24">
    <LazyLoader show={true} message="Loading experience..." size="lg" duration={2000} />
  </div>
);

const SkillsSkeleton = () => (
  <div className="w-full py-20">
    <LazyLoader show={true} message="Loading skills..." size="md" duration={1500} />
  </div>
);

const ProjectsSkeleton = () => (
  <div className="w-full py-24">
    <LazyLoader show={true} message="Loading projects..." size="lg" duration={2000} />
  </div>
);

const ContactSkeleton = () => (
  <div className="w-full py-16">
    <LazyLoader show={true} message="Loading contact..." size="sm" duration={1000} />
  </div>
);

// Lazy components with simple loading
export const LazyBento = dynamic(
  () => import('@/app/components/sections/Bento'),
  {
    loading: BentoSkeleton,
    ssr: true
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

// Hook for simple lazy loading with minimal delays
export function useSimpleLazySections() {
  const loadBento = useSimpleLazyLoad(50);
  const loadAbout = useScrollLazyLoad();
  const loadExperience = useScrollLazyLoad();
  const loadSkills = useScrollLazyLoad();
  const loadProjects = useScrollLazyLoad();
  const loadContact = useScrollLazyLoad();

  return {
    loadBento,
    loadAbout,
    loadExperience,
    loadSkills,
    loadProjects,
    loadContact
  };
}
