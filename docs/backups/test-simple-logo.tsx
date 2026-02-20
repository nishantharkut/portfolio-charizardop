'use client';

import { useState } from 'react';

export default function TestSimpleLogo() {
  const [imageStatus, setImageStatus] = useState<string>('loading...');

  const testImageLoad = (src: string, name: string) => {
    const img = new Image();
    img.onload = () => {
      setImageStatus(prev => prev + `\n✅ ${name}: Successfully loaded`);
    };
    img.onerror = () => {
      setImageStatus(prev => prev + `\n❌ ${name}: Failed to load`);
    };
    img.src = src;
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Logo Image Test</h1>
      
      <div className="space-y-4">
        <button 
          onClick={() => {
            setImageStatus('Testing...');
            testImageLoad('/nishantharkut-logo.png', 'Original Logo');
            testImageLoad('/logo-light.png', 'Logo Light');
            testImageLoad('/logo-dark.png', 'Logo Dark');
            testImageLoad('/icon-192.png', 'Icon 192');
            testImageLoad('/icon-512.png', 'Icon 512');
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Test Image Loading
        </button>
        
        <pre className="bg-gray-100 p-4 rounded whitespace-pre-wrap">
          {imageStatus}
        </pre>
        
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Direct Image Tags Test:</h2>
          
          <div>
            <p>Original Logo:</p>
            <img 
              src="/nishantharkut-logo.png" 
              alt="Original Logo"
              style={{ width: '72px', height: '72px' }}
              onLoad={() => console.log('✅ Original logo loaded')}
              onError={() => console.log('❌ Original logo failed')}
            />
          </div>
          
          <div>
            <p>Logo Light:</p>
            <img 
              src="/logo-light.png" 
              alt="Logo Light"
              style={{ width: '72px', height: '72px' }}
              onLoad={() => console.log('✅ Logo light loaded')}
              onError={() => console.log('❌ Logo light failed')}
            />
          </div>
          
          <div>
            <p>Icon 192:</p>
            <img 
              src="/icon-192.png" 
              alt="Icon 192"
              style={{ width: '72px', height: '72px' }}
              onLoad={() => console.log('✅ Icon 192 loaded')}
              onError={() => console.log('❌ Icon 192 failed')}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
