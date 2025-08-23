import { useEffect, useRef, useState, useCallback } from 'react';

interface UseIntersectionObserverOptions {
  threshold?: number | number[];
  rootMargin?: string;
  root?: Element | null;
  triggerOnce?: boolean;
}

export function useIntersectionObserver(
  options: UseIntersectionObserverOptions = {}
) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const elementRef = useRef<Element | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const { threshold = 0.1, rootMargin = '0px', root = null, triggerOnce = false } = options;

  useEffect(() => {
    const element = elementRef.current;
    if (!element || typeof window === 'undefined') return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        const isElementIntersecting = entry.isIntersecting;
        setIsIntersecting(isElementIntersecting);
        
        if (isElementIntersecting && !hasIntersected) {
          setHasIntersected(true);
          
          if (triggerOnce) {
            observerRef.current?.unobserve(element);
          }
        }
      },
      { threshold, rootMargin, root }
    );

    observerRef.current.observe(element);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [threshold, rootMargin, root, triggerOnce, hasIntersected]);

  const setRef = useCallback((element: Element | null) => {
    if (observerRef.current && elementRef.current) {
      observerRef.current.unobserve(elementRef.current);
    }
    
    elementRef.current = element;
    
    if (observerRef.current && element) {
      observerRef.current.observe(element);
    }
  }, []);

  return { ref: setRef, isIntersecting, hasIntersected };
}
