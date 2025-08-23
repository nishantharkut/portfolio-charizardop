import dynamic from 'next/dynamic';
import { Skeleton, ProjectCardSkeleton, HeroSkeleton } from '@/components/ui/Skeleton';
import LazyLoader from '@/app/components/ui/LazyLoader';

// Custom loading component using LazyLoader
const LazyLoadingComponent = ({ 
  message = "Loading component...", 
  size = 'md' as 'sm' | 'md' | 'lg' 
}) => (
  <div className="flex items-center justify-center py-8">
    <LazyLoader show={true} message={message} size={size} duration={2000} />
  </div>
);

// Heavy 3D components with dynamic imports
export const Experience = dynamic(
  () => import('@/app/components/sections/Experience'),
  {
    loading: () => <LazyLoadingComponent message="Loading experience..." size="lg" />,
    ssr: false, // Disable SSR for WebGL components
  }
);

// Animation-heavy components
export const Projects = dynamic(
  () => import('@/app/components/sections/Projects'),
  {
    loading: () => <LazyLoadingComponent message="Loading projects..." size="md" />,
  }
);

export const Hero = dynamic(
  () => import('@/app/components/sections/Hero'),
  {
    loading: () => <LazyLoadingComponent message="Loading hero..." size="lg" />,
  }
);

export const About = dynamic(
  () => import('@/app/components/sections/About'),
  {
    loading: () => <LazyLoadingComponent message="Loading about..." size="md" />,
  }
);

export const Skills = dynamic(
  () => import('@/app/components/sections/Skills'),
  {
    loading: () => <LazyLoadingComponent message="Loading skills..." size="md" />,
  }
);

// 3D Model lazy loading
export const CharizardModel = dynamic(
  () => import('@/app/components/3d/CharizardModel'),
  {
    loading: () => <LazyLoadingComponent message="Loading 3D model..." size="lg" />,
    ssr: false,
  }
);

// Heavy UI components
export const FaultyTerminal = dynamic(
  () => import('@/app/components/ui/FaultyTerminal'),
  {
    loading: () => <LazyLoadingComponent message="Initializing terminal..." size="sm" />,
    ssr: false,
  }
);

// Conditional loading based on performance
export function createConditionalComponent<T extends Record<string, any>>(
  heavyComponent: () => Promise<{ default: React.ComponentType<T> }>,
  lightComponent: React.ComponentType<T>,
  condition: boolean
) {
  if (condition) {
    return dynamic(heavyComponent, {
      loading: () => <Skeleton height="200px" />,
    });
  }
  return lightComponent;
}

// Performance-aware component loader
export function createPerformanceAwareComponent<T extends Record<string, any>>(
  components: {
    high: () => Promise<{ default: React.ComponentType<T> }>;
    medium: () => Promise<{ default: React.ComponentType<T> }>;
    low: React.ComponentType<T>;
  }
) {
  return function PerformanceAwareComponent(props: T) {
    // This would be used with the performance context
    // For now, return the medium performance version
    const Component = dynamic(components.medium, {
      loading: () => <Skeleton height="200px" />,
    });
    
    return <Component {...(props as any)} />;
  };
}
