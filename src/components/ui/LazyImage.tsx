"use client";

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import LazyLoader from '@/app/components/ui/LazyLoader';

interface LazyImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fill?: boolean;
  priority?: boolean;
  quality?: number;
  sizes?: string;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  threshold?: number;
  rootMargin?: string;
  loadingMessage?: string;
  [key: string]: any;
}

export default function LazyImage({
  src,
  alt,
  width,
  height,
  className = '',
  fill = false,
  priority = false,
  quality = 75,
  sizes,
  placeholder = 'empty',
  blurDataURL,
  threshold = 0.1,
  rootMargin = '50px',
  loadingMessage = "Loading image...",
  ...props
}: LazyImageProps) {
  const [isInView, setIsInView] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (priority) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [threshold, rootMargin, priority]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(true);
  };

  return (
    <div 
      ref={imgRef} 
      className={`relative overflow-hidden ${className}`} 
      style={{ width: fill ? '100%' : width, height: fill ? '100%' : height }}
      {...props}
    >
      {!isInView && !priority && (
        <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 animate-pulse flex items-center justify-center">
          <div className="text-gray-400 text-xs opacity-60">Image placeholder</div>
        </div>
      )}

      {isInView && !isLoaded && (
        <div className="absolute inset-0 bg-gray-50 dark:bg-gray-900 flex items-center justify-center z-10">
          <LazyLoader 
            show={true} 
            message={loadingMessage} 
            size="sm" 
            duration={1000}
          />
        </div>
      )}

      {isInView && (
        <>
          {hasError ? (
            <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <div className="text-gray-500 text-sm">Failed to load image</div>
            </div>
          ) : (
            <Image
              src={src}
              alt={alt}
              width={fill ? undefined : width}
              height={fill ? undefined : height}
              fill={fill}
              quality={quality}
              sizes={sizes}
              placeholder={placeholder}
              blurDataURL={blurDataURL}
              className={`transition-opacity duration-300 ${
                isLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={handleLoad}
              onError={handleError}
              priority={priority}
            />
          )}
        </>
      )}
    </div>
  );
}

// Hook for manual lazy image loading
export function useLazyImage({ 
  src, 
  threshold = 0.1, 
  rootMargin = '50px' 
}: { 
  src: string; 
  threshold?: number; 
  rootMargin?: string; 
}) {
  const [isInView, setIsInView] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  useEffect(() => {
    if (isInView && !isLoaded && !isLoading) {
      setIsLoading(true);
      const img = new window.Image();
      
      img.onload = () => {
        setIsLoaded(true);
        setIsLoading(false);
      };
      
      img.onerror = () => {
        setHasError(true);
        setIsLoading(false);
      };
      
      img.src = src;
    }
  }, [isInView, isLoaded, isLoading, src]);

  return {
    ref: elementRef,
    isInView,
    isLoaded,
    isLoading,
    hasError,
    shouldLoad: isInView
  };
}
