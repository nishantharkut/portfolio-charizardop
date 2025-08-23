"use client";

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';
import LazyLoader from './LazyLoader';

// Global navigation loading manager
export default function NavigationLoader() {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check if we're in a navigation state
    const isNavigating = sessionStorage.getItem('isNavigating');
    if (isNavigating === 'true') {
      setIsLoading(true);
      
      // Clear the navigation state and hide loader after animation
      const timer = setTimeout(() => {
        setIsLoading(false);
        sessionStorage.removeItem('isNavigating');
      }, 1200);
      
      return () => clearTimeout(timer);
    }
  }, [pathname, searchParams]);

  return (
    <AnimatePresence>
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <LazyLoader
            show={isLoading}
            onComplete={() => setIsLoading(false)}
            duration={1200}
            message="Loading page"
            size="md"
          />
        </div>
      )}
    </AnimatePresence>
  );
}
