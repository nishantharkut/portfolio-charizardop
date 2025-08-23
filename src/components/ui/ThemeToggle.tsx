"use client";

import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';

export function ThemeToggle() {
  const { theme, actualTheme, setTheme, toggleTheme } = useTheme();

  return (
    <div className="theme-toggle-container">
      <button
        onClick={toggleTheme}
        className="theme-toggle-button"
        aria-label={`Switch to ${actualTheme === 'light' ? 'dark' : 'light'} mode`}
        title={`Switch to ${actualTheme === 'light' ? 'dark' : 'light'} mode`}
      >
        <div className="theme-toggle-track">
          <div 
            className={`theme-toggle-thumb ${actualTheme === 'dark' ? 'dark' : 'light'}`}
          >
            {actualTheme === 'light' ? (
              <SunIcon />
            ) : (
              <MoonIcon />
            )}
          </div>
        </div>
      </button>
      
      {/* Advanced theme selector (optional) */}
      <div className="theme-selector-dropdown">
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value as 'light' | 'dark' | 'system')}
          className="theme-selector"
          aria-label="Select theme preference"
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="system">System</option>
        </select>
      </div>
    </div>
  );
}

function SunIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="5" />
      <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}
