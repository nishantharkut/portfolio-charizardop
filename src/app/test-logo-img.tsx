"use client";

import { useTheme } from '../contexts/ThemeContext';
import { useState, useEffect } from 'react';

export default function TestLogoWithImg() {
  const { actualTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div>Loading...</div>;
  }

  const logoPath = actualTheme === 'light' ? "/nishantharkut-logo-lightbg.png" : "/nishantharkut-logo.png";

  return (
    <div className="fixed bottom-4 left-4 p-4 bg-black/90 text-white rounded-lg z-50">
      <h3 className="font-bold mb-2">Test Logo with IMG</h3>
      
      <div className="space-y-2 text-sm">
        <div>Actual Theme: {actualTheme}</div>
        <div>Logo Path: {logoPath}</div>
      </div>

      <div className="mt-4">
        <div className="w-16 h-16 bg-orange-500 rounded flex items-center justify-center overflow-hidden">
          <img
            src={logoPath}
            alt="Test Logo"
            className="w-full h-full object-contain p-1"
            onError={(e) => {
              console.error('Image failed to load:', e.currentTarget.src);
              e.currentTarget.style.border = '2px solid red';
            }}
            onLoad={() => {
              console.log('Image loaded successfully:', logoPath);
            }}
          />
        </div>
      </div>

      <div className="mt-2 space-x-2">
        <button 
          onClick={() => {
            // Test direct access to the image
            fetch(logoPath)
              .then(res => {
                console.log('Direct fetch response:', res.status, res.statusText);
                alert(`Image fetch: ${res.status} ${res.statusText}`);
              })
              .catch(err => {
                console.error('Direct fetch error:', err);
                alert(`Image fetch error: ${err.message}`);
              });
          }}
          className="px-2 py-1 bg-blue-600 text-white text-xs rounded"
        >
          Test Fetch
        </button>
      </div>
    </div>
  );
}
