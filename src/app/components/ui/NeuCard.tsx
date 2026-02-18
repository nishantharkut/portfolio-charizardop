'use client';

import { ReactNode, HTMLAttributes } from 'react';

interface NeuCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'tag';
  hoverable?: boolean;
  children: ReactNode;
  as?: 'div' | 'article' | 'section';
}

/**
 * Neubrutalism card component with consistent styling
 * Replaces 20+ instances of inline neubrutalism styling across the codebase
 */
export default function NeuCard({
  variant = 'default',
  hoverable = true,
  className = '',
  children,
  as = 'div',
  ...rest
}: NeuCardProps) {
  const baseClasses = 'transition-all duration-200 ease-out';
  
  const variantClasses = {
    default: 'neu-card',
    elevated: 'neu-card-elevated',
    tag: 'neu-card-tag',
  };

  const classes = [
    baseClasses,
    variantClasses[variant],
    hoverable ? 'neu-hoverable' : '',
    className,
  ].filter(Boolean).join(' ');

  const Tag = as;

  return (
    <Tag 
      className={classes}
      {...rest}
    >
      {children}
    </Tag>
  );
}
