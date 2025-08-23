"use client";

import { useState, useRef, useEffect } from 'react';
import LazyLoader from '../app/components/ui/LazyLoader';

interface UseLazyImageProps {
  src: string;
  threshold?: number;
}

export function useLazyImage({ src, threshold = 0.1 }: UseLazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  useEffect(() => {
    if (isInView && !isLoaded && !isLoading) {
      setIsLoading(true);
      const img = new Image();
      
      img.onload = () => {
        setIsLoaded(true);
        setIsLoading(false);
      };
      
      img.onerror = () => {
        setIsLoading(false);
      };
      
      img.src = src;
    }
  }, [isInView, isLoaded, isLoading, src]);

  return {
    imgRef,
    isLoaded,
    isLoading,
    shouldLoad: isInView
  };
}

// Lazy Image Component
interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  loadingMessage?: string;
  threshold?: number;
  [key: string]: any;
}

export function LazyImage({ 
  src, 
  alt, 
  className = '', 
  placeholder,
  loadingMessage = "Loading image...",
  threshold = 0.1,
  ...props 
}: LazyImageProps) {
  const { imgRef, isLoaded, isLoading, shouldLoad } = useLazyImage({ src, threshold });

  return (
    <div ref={imgRef} className={`relative ${className}`} {...props}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
          <LazyLoader 
            show={true} 
            message={loadingMessage} 
            size="sm" 
            duration={1000}
          />
        </div>
      )}
      
      {!shouldLoad && placeholder && (
        <div className="w-full h-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
      )}
      
      {shouldLoad && (
        <img
          src={src}
          alt={alt}
          className={`transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ display: isLoaded ? 'block' : 'none' }}
        />
      )}
    </div>
  );
}
