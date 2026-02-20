"use client";

import React from 'react';
import Image from 'next/image';
import { useTheme } from '../contexts/ThemeContext';

// Simple test component to verify logo theme functionality
export default function TestLogo() {
  const { theme, actualTheme, setTheme } = useTheme();

  return (
    <div className="fixed bottom-4 right-4 p-4 bg-black/80 text-white rounded-lg z-50">
      <h3 className="text-sm font-bold mb-2">Logo Theme Test</h3>
      
      <div className="space-y-2">
        <div className="text-xs">
          <strong>Theme:</strong> {theme}
        </div>
        <div className="text-xs">
          <strong>Actual Theme:</strong> {actualTheme}
        </div>
        
        <div className="flex gap-2 mt-2">
          <button 
            onClick={() => setTheme('light')}
            className="px-2 py-1 bg-white text-black text-xs rounded"
          >
            Light
          </button>
          <button 
            onClick={() => setTheme('dark')}
            className="px-2 py-1 bg-gray-800 text-white text-xs rounded"
          >
            Dark
          </button>
          <button 
            onClick={() => setTheme('system')}
            className="px-2 py-1 bg-gray-600 text-white text-xs rounded"
          >
            System
          </button>
        </div>
        
        <div className="mt-3">
          <div className="text-xs mb-1">Current Logo:</div>
          <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center">
            <Image
              src={actualTheme === 'light' ? "/nishantharkut-logo-lightbg.png" : "/nishantharkut-logo.png"}
              alt="Test Logo"
              width={32}
              height={32}
              className="w-full h-full object-contain p-1"
            />
          </div>
          <div className="text-xs mt-1">
            Path: {actualTheme === 'light' ? "/nishantharkut-logo-lightbg.png" : "/nishantharkut-logo.png"}
          </div>
        </div>
      </div>
    </div>
  );
}
