"use client";

import { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

/**
 * Safe theme hook that handles SSR by providing default values
 * and only accessing theme context after mounting
 */
export function useSafeTheme() {
  const [mounted, setMounted] = useState(false);
  const [safeTheme, setSafeTheme] = useState<'light' | 'dark'>('dark');
  
  useEffect(() => {
    setMounted(true);
  }, []);

  // Only access theme context after mounting
  let themeContext = null;
  try {
    if (mounted) {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      themeContext = useTheme();
    }
  } catch (error) {
    // Context not available, use default
    console.warn('Theme context not available:', error);
  }

  useEffect(() => {
    if (mounted && themeContext) {
      setSafeTheme(themeContext.actualTheme);
    }
  }, [mounted, themeContext]);

  return {
    theme: safeTheme,
    isDarkMode: safeTheme === 'dark',
    mounted
  };
}
