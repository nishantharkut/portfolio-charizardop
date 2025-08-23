import { useCallback, useRef } from 'react';

export function useDebounced<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  immediate = false
): T {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  return useCallback(
    ((...args: any[]) => {
      const callNow = immediate && !timeoutRef.current;
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        timeoutRef.current = null;
        if (!immediate) callbackRef.current(...args);
      }, delay);
      
      if (callNow) callbackRef.current(...args);
    }) as T,
    [delay, immediate]
  );
}
