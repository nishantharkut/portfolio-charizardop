"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  actualTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dark'); // Start with dark to match SSR
  const [actualTheme, setActualTheme] = useState<'light' | 'dark'>('dark'); // Default to dark for SSR
  const [mounted, setMounted] = useState(false);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', newTheme);
    }
  };

  const toggleTheme = () => {
    const newTheme = actualTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  useEffect(() => {
    setMounted(true);
    
    // Get saved theme from localStorage only on client
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') as Theme;
      if (savedTheme) {
        setThemeState(savedTheme);
      }
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const updateActualTheme = () => {
      let resolvedTheme: 'light' | 'dark';

      if (theme === 'system') {
        if (typeof window !== 'undefined') {
          resolvedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        } else {
          resolvedTheme = 'dark'; // Default for SSR
        }
      } else {
        resolvedTheme = theme;
      }

      setActualTheme(resolvedTheme);
      
      // Update CSS custom properties and classes only on client
      if (typeof window !== 'undefined') {
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(resolvedTheme);
        document.documentElement.setAttribute('data-theme', resolvedTheme);
      }
    };

    updateActualTheme();

    // Listen for system theme changes only on client
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleSystemThemeChange = () => {
        if (theme === 'system') {
          updateActualTheme();
        }
      };

      mediaQuery.addEventListener('change', handleSystemThemeChange);

      return () => {
        mediaQuery.removeEventListener('change', handleSystemThemeChange);
      };
    }
  }, [theme, mounted]);

  return (
    <ThemeContext.Provider value={{
      theme,
      actualTheme,
      setTheme,
      toggleTheme,
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    // Provide default values for SSR or when provider isn't available
    console.warn('useTheme called outside ThemeProvider, using default values');
    return {
      theme: 'dark' as Theme,
      actualTheme: 'dark' as 'light' | 'dark',
      setTheme: () => {},
      toggleTheme: () => {}
    };
  }
  return context;
}
