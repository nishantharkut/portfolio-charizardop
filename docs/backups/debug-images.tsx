"use client";

import Image from 'next/image';
import { useTheme } from '../contexts/ThemeContext';
import { useState, useEffect } from 'react';

export default function DebugImages() {
  const { theme, actualTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [lightImageError, setLightImageError] = useState<string | null>(null);
  const [darkImageError, setDarkImageError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="fixed top-4 left-4 p-4 bg-red-500 text-white rounded-lg z-50 max-w-md">
        <h3 className="font-bold mb-2">Loading...</h3>
      </div>
    );
  }

  return (
    <div className="fixed top-4 left-4 p-4 bg-black/90 text-white rounded-lg z-50 max-w-md">
      <h3 className="font-bold mb-2">Debug Images</h3>
      
      <div className="space-y-2 text-sm">
        <div>Theme: {theme}</div>
        <div>Actual Theme: {actualTheme}</div>
        <div>Mounted: {mounted ? 'Yes' : 'No'}</div>
      </div>

      <div className="mt-4 space-y-4">
        <div>
          <h4 className="font-semibold mb-2">Light Logo Test:</h4>
          <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
            <Image
              src="/nishantharkut-logo-lightbg.png"
              alt="Light Logo"
              width={64}
              height={64}
              className="w-full h-full object-contain"
              onError={(e) => setLightImageError(`Failed to load: ${e.currentTarget.src}`)}
              onLoad={() => setLightImageError(null)}
            />
          </div>
          {lightImageError && <div className="text-red-400 text-xs mt-1">{lightImageError}</div>}
        </div>

        <div>
          <h4 className="font-semibold mb-2">Dark Logo Test:</h4>
          <div className="w-16 h-16 bg-gray-800 rounded flex items-center justify-center">
            <Image
              src="/nishantharkut-logo.png"
              alt="Dark Logo"
              width={64}
              height={64}
              className="w-full h-full object-contain"
              onError={(e) => setDarkImageError(`Failed to load: ${e.currentTarget.src}`)}
              onLoad={() => setDarkImageError(null)}
            />
          </div>
          {darkImageError && <div className="text-red-400 text-xs mt-1">{darkImageError}</div>}
        </div>

        <div>
          <h4 className="font-semibold mb-2">Current Theme Logo:</h4>
          <div className="w-16 h-16 bg-orange-500 rounded flex items-center justify-center">
            <Image
              src={actualTheme === 'light' ? "/nishantharkut-logo-lightbg.png" : "/nishantharkut-logo.png"}
              alt="Current Logo"
              width={64}
              height={64}
              className="w-full h-full object-contain"
            />
          </div>
          <div className="text-xs mt-1">
            Using: {actualTheme === 'light' ? "/nishantharkut-logo-lightbg.png" : "/nishantharkut-logo.png"}
          </div>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button 
          onClick={() => window.location.reload()}
          className="px-2 py-1 bg-blue-600 text-white text-xs rounded"
        >
          Reload
        </button>
      </div>
    </div>
  );
}
