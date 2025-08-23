"use client";

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

export function usePageTransition() {
  const router = useRouter();

  // Simple navigation without artificial loading delays
  const navigateWithTransition = useCallback(async (path: string) => {
    router.push(path);
  }, [router]);

  const refreshWithTransition = useCallback(async () => {
    router.refresh();
  }, [router]);

  return {
    navigateWithTransition,
    refreshWithTransition,
    isTransitioning: false // No longer transitioning
  };
}
