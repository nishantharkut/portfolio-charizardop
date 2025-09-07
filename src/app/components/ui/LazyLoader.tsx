"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useLoading } from '../../contexts/LoadingContext';

interface LazyLoaderProps {
  show: boolean;
  onComplete?: () => void;
  duration?: number;
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function LazyLoader({ 
  show, 
  onComplete, 
  duration = 2000,
  message = "Loading...",
  size = 'md'
}: LazyLoaderProps) {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(show);

  // Size configurations
  const sizeConfig = {
    sm: {
      container: 'w-8 h-8',
      text: 'text-[8px]',
      message: 'text-[9px]'
    },
    md: {
      container: 'w-12 h-12',
      text: 'text-[10px]',
      message: 'text-[11px]'
    },
    lg: {
      container: 'w-16 h-16',
      text: 'text-xs',
      message: 'text-[12px]'
    }
  };

  const config = sizeConfig[size];
  const radius = size === 'sm' ? 14 : size === 'md' ? 22 : 30;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    if (!show) {
      setIsVisible(false);
      return;
    }

    setIsVisible(true);
    setProgress(0);

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      
      setProgress(newProgress);

      if (newProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsVisible(false);
          onComplete?.();
        }, 300); // Small delay for smooth completion
      }
    }, 16); // ~60fps

    return () => clearInterval(interval);
  }, [show, duration, onComplete]);

  const strokeDashoffset = circumference * (1 - progress / 100);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="flex flex-col items-center gap-3 select-none"
        >
          {/* Circular Progress Loader */}
          <div className={`relative ${config.container}`}>
            {/* Background Circle */}
            <div 
              className="absolute inset-0 rounded-full border-[1.5px] opacity-20" 
              style={{ borderColor: '#ff9f1c' }} 
            />
            
            {/* Animated Progress Circle */}
            <svg 
              className={`${config.container} -rotate-90`} 
              viewBox={`0 0 ${(radius + 2) * 2} ${(radius + 2) * 2}`}
            >
              <circle
                cx={radius + 2}
                cy={radius + 2}
                r={radius}
                fill="none"
                stroke="url(#lazy-fire-gradient)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                style={{
                  transition: 'stroke-dashoffset 0.1s ease-out',
                  filter: 'drop-shadow(0 0 4px rgba(255, 159, 28, 0.3))'
                }}
              />
              <defs>
                <linearGradient id="lazy-fire-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ff9f1c" />
                  <stop offset="30%" stopColor="#ffb347" />
                  <stop offset="70%" stopColor="#ffd700" />
                  <stop offset="100%" stopColor="#ffed4e" />
                </linearGradient>
              </defs>
            </svg>
            
            {/* Progress Percentage */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.span 
                className={`${config.text} font-medium text-[#ff9f1c]`}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                key={Math.floor(progress / 10)} // Re-animate every 10%
              >
                {Math.round(progress)}%
              </motion.span>
            </div>

            {/* Rotating Accent Dots */}
            <motion.div
              className="absolute inset-0"
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <div 
                className="absolute w-1 h-1 bg-[#ffed4e] rounded-full"
                style={{ 
                  top: '2px', 
                  left: '50%', 
                  transform: 'translateX(-50%)',
                  filter: 'drop-shadow(0 0 2px rgba(255, 237, 78, 0.6))'
                }}
              />
            </motion.div>
          </div>

          {/* Loading Message */}
          <motion.p 
            className={`${config.message} tracking-wider uppercase text-[#ff9f1c] opacity-80 font-light`}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 0.8, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            {message}
          </motion.p>

          {/* Pulsating Background Glow */}
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-radial from-[#ff9f1c] to-transparent opacity-5"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.05, 0.1, 0.05]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            style={{
              width: size === 'sm' ? '60px' : size === 'md' ? '80px' : '100px',
              height: size === 'sm' ? '60px' : size === 'md' ? '80px' : '100px',
              marginTop: size === 'sm' ? '-30px' : size === 'md' ? '-40px' : '-50px',
              marginLeft: size === 'sm' ? '-30px' : size === 'md' ? '-40px' : '-50px',
              zIndex: -1
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Utility component for common lazy loading scenarios
export function InlineLoader({ 
  loading, 
  children, 
  message = "Loading content...",
  size = 'sm'
}: {
  loading: boolean;
  children: React.ReactNode;
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <LazyLoader show={loading} message={message} size={size} />
      </div>
    );
  }

  return <>{children}</>;
}

// Hook for managing lazy loading state with page transitions
export function useLazyLoader(initialLoading = false) {
  const [isLoading, setIsLoading] = useState(initialLoading);

  const startLoading = () => setIsLoading(true);
  const stopLoading = () => setIsLoading(false);

  return {
    isLoading,
    startLoading,
    stopLoading,
    setLoading: setIsLoading
  };
}

// Hook for page refresh with loading animation
export function usePageReload() {
  const reloadWithTransition = async () => {
    console.log('reloadWithTransition called');
    
    // Set navigation state in sessionStorage for persistence
    try {
      sessionStorage.setItem('isNavigating', 'true');
    } catch (error) {
      console.warn('Cannot set sessionStorage:', error);
    }
    
    console.log('About to reload page with navigation state set');
    
    // Small delay then reload
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  return { reloadWithTransition };
}
