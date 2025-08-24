"use client";

import { useTheme } from '../../../contexts/ThemeContext';
import { useState, useEffect } from 'react';

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
}

export default function LogoSimple({ 
  width = 40, 
  height = 40, 
  className = "w-full h-full object-contain", 
  priority = false 
}: LogoProps) {
  const { actualTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div 
        className={`${className} flex items-center justify-center text-orange-500 font-bold text-sm bg-orange-100 rounded-full`}
        style={{ width: `${width}px`, height: `${height}px` }}
      >
        NH
      </div>
    );
  }

  const logoSrc = actualTheme === 'light' 
    ? "/nishantharkut-logo-lightbg.png" 
    : "/nishantharkut-logo.png";

  if (imageError) {
    // Fallback to styled text logo
    return (
      <div 
        className={`${className} flex items-center justify-center text-orange-500 font-bold text-sm bg-orange-100 rounded-full border-2 border-orange-500`}
        style={{ width: `${width}px`, height: `${height}px` }}
      >
        NH
      </div>
    );
  }

  return (
    <img
      src={logoSrc}
      alt="Nishant Arkut Logo"
      width={width}
      height={height}
      className={className}
      onError={() => {
        console.error('Logo failed to load:', logoSrc);
        setImageError(true);
      }}
      onLoad={() => {
        console.log('Logo loaded successfully:', logoSrc);
        setImageError(false);
      }}
      style={{ width: `${width}px`, height: `${height}px` }}
    />
  );
}
