"use client";

import { usePageTransition } from '@/hooks/usePageTransition';
import { ReactNode, MouseEvent } from 'react';

interface TransitionLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
  [key: string]: any;
}

export default function TransitionLink({ 
  href, 
  children, 
  className = '', 
  onClick,
  ...props 
}: TransitionLinkProps) {
  const { navigateWithTransition, isTransitioning } = usePageTransition();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    
    console.log('TransitionLink clicked:', href, 'isTransitioning:', isTransitioning);
    
    // Call custom onClick if provided
    if (onClick) {
      onClick(e);
    }

    // Don't navigate if already transitioning
    if (isTransitioning) {
      console.log('Navigation blocked - already transitioning');
      return;
    }

    console.log('Starting navigation transition to:', href);
    
    // Set navigation state in sessionStorage for persistence across page loads
    try {
      sessionStorage.setItem('isNavigating', 'true');
    } catch (error) {
      console.warn('Cannot set sessionStorage:', error);
    }
    
    // Use transition navigation
    navigateWithTransition(href);
  };

  return (
    <a 
      href={href}
      className={className}
      onClick={handleClick}
      style={{ pointerEvents: isTransitioning ? 'none' : 'auto' }}
      {...props}
    >
      {children}
    </a>
  );
}
