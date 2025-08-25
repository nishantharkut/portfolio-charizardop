"use client";

import Image from 'next/image';
import { useTheme } from '../../../contexts/ThemeContext';
import { useState, useEffect } from 'react';
import lightLogo from '../../../../public/nishantharkut-logo.png';
import darkLogo from '../../../../public/nishantharkut-logo-lightbg.png';
interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
}

export default function Logo({ 
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
        className={className}
        style={{ width: `${width}px`, height: `${height}px` }}
      />
    );
  }

  const logoSrc = actualTheme === 'light' 
    ? darkLogo
    : lightLogo;

  if (imageError) {
    // Fallback to text if image fails
    return (
      <div 
        className={`${className} flex items-center justify-center text-orange-500 font-bold text-sm`}
        style={{ width: `${width}px`, height: `${height}px` }}
      >
        NH
      </div>
    );
  }

  return (
    <Image
      src={logoSrc}
      alt="Nishant Harkut Logo"
      width={width}
      height={height}
      className={className}
      priority={priority}
      unoptimized={true}
      onError={() => setImageError(true)}
      onLoad={() => setImageError(false)}
    />
  );
}
