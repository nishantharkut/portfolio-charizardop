'use client';

import { ReactNode, AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react';

interface BaseNeuButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children: ReactNode;
  disabled?: boolean;
}

interface NeuButtonAsLink extends BaseNeuButtonProps {
  href: string;
  external?: boolean;
  onClick?: never;
}

interface NeuButtonAsButton extends BaseNeuButtonProps {
  href?: never;
  external?: never;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

type NeuButtonProps = NeuButtonAsLink | NeuButtonAsButton;

/**
 * Neubrutalism button component with consistent styling
 * Replaces inline button styles and JS hover handlers across the codebase
 */
export default function NeuButton({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  disabled = false,
  ...props
}: NeuButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center text-center font-medium transition-all duration-200 ease-out border-2';
  
  const variantClasses = {
    primary: 'neu-button-primary',
    secondary: 'neu-button-secondary',
    ghost: 'neu-button-ghost',
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-fluid-xs',
    md: 'px-6 py-2.5 text-fluid-sm',
    lg: 'px-8 py-3.5 text-fluid-base',
  };

  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';

  const classes = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    disabledClasses,
    className,
  ].filter(Boolean).join(' ');

  if ('href' in props && props.href) {
    const { href, external } = props;
    return (
      <a
        href={href}
        className={classes}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {children}
      </a>
    );
  }

  const { onClick, type = 'button' } = props as NeuButtonAsButton;
  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
