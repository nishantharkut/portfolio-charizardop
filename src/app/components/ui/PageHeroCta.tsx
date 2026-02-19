'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

type PageHeroCtaProps = {
  backHref?: string;
  primary: { label: string; href?: string; onClick?: (e: React.MouseEvent) => void };
  signature?: boolean;
  className?: string;
};

const baseButtonClass =
  'inline-flex items-center justify-center gap-1.5 sm:gap-2 rounded-lg sm:rounded-xl px-3 py-2 text-xs font-medium sm:px-5 sm:py-3 sm:text-sm transition-all duration-200';

const primaryContent = (label: string) => (
  <>
    {label}
    <span className="opacity-70" aria-hidden>://</span>
    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  </>
);

const primaryStyle = {
  backgroundColor: 'var(--color-accent)',
  borderColor: 'var(--color-accent)',
  color: 'var(--color-button-text)',
} as const;

export function PageHeroCta({ backHref = '/', primary, signature = true, className = '' }: PageHeroCtaProps) {
  const hasClick = typeof primary.onClick === 'function';
  const href = primary.href ?? '#';

  return (
    <div className={`flex flex-col items-center gap-3 sm:gap-4 ${className}`}>
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center items-center">
        <Link
          href={backHref}
          className={`${baseButtonClass} border bg-transparent hover:opacity-90`}
          style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
        >
          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Home
        </Link>

        {hasClick ? (
          <motion.a
            href={href}
            onClick={primary.onClick}
            className={`${baseButtonClass} border cursor-pointer`}
            style={primaryStyle}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {primaryContent(primary.label)}
          </motion.a>
        ) : href.startsWith('/') ? (
          <Link href={href} className={`${baseButtonClass} border`} style={primaryStyle}>
            {primaryContent(primary.label)}
          </Link>
        ) : (
          <a href={href} className={`${baseButtonClass} border`} style={primaryStyle}>
            {primaryContent(primary.label)}
          </a>
        )}
      </div>

      {signature && (
        <p className="text-[10px] sm:text-xs tracking-widest uppercase" style={{ color: 'var(--color-text-muted)' }}>
          <span style={{ color: 'var(--color-accent)' }}>nishant</span>.dev
        </p>
      )}
    </div>
  );
}
