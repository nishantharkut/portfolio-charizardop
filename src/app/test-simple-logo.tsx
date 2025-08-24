"use client";

import Image from 'next/image';
import { useTheme } from '../contexts/ThemeContext';
import { useState, useEffect } from 'react';

export default function TestSimpleLogo() {
  const { actualTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div>Loading...</div>;
  }

  const logoPath = actualTheme === 'light' ? "/logo-light.png" : "/logo-dark.png";

  return (
    <div className="fixed top-20 left-4 p-4 bg-green-800/90 text-white rounded-lg z-50">
      <h3 className="font-bold mb-2">Simple Logo Test</h3>
      
      <div className="space-y-2 text-sm">
        <div>Actual Theme: {actualTheme}</div>
        <div>Logo Path: {logoPath}</div>
      </div>

      <div className="mt-4">
        <div className="w-16 h-16 bg-orange-500 rounded flex items-center justify-center overflow-hidden">
          <Image
            src={logoPath}
            alt="Simple Test Logo"
            width={64}
            height={64}
            className="w-full h-full object-contain p-1"
            unoptimized
            onError={(e) => {
              console.error('Simple logo failed to load:', e.currentTarget.src);
            }}
            onLoad={() => {
              console.log('Simple logo loaded successfully:', logoPath);
            }}
          />
        </div>
      </div>
    </div>
  );
}
