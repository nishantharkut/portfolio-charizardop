'use client';

import { useState } from 'react';
import Image from 'next/image';

type Category = 'Hackathon' | 'UI/UX Design' | 'Graphic Design' | 'Leadership' | 'Community Service' | 'Technology Leadership' | 'Community Leadership' | string;

function CategoryIcon({ category, className, size = 'md' }: { category: Category; className?: string; size?: 'md' | 'lg' }) {
  const c = category?.toLowerCase() ?? '';
  const iconClass = size === 'lg' ? `w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 ${className ?? ''}` : `w-10 h-10 sm:w-12 sm:h-12 ${className ?? ''}`;
  const stroke = 'currentColor';
  const strokeWidth = size === 'lg' ? 1.25 : 1.5;
  if (c.includes('hackathon')) {
    return (
      <svg className={iconClass} fill="none" stroke={stroke} strokeWidth={strokeWidth} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    );
  }
  if (c.includes('design') || c.includes('graphic') || c.includes('ui')) {
    return (
      <svg className={iconClass} fill="none" stroke={stroke} strokeWidth={strokeWidth} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    );
  }
  if (c.includes('leadership') || c.includes('community') || c.includes('welfare')) {
    return (
      <svg className={iconClass} fill="none" stroke={stroke} strokeWidth={strokeWidth} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    );
  }
  return (
    <svg className={iconClass} fill="none" stroke={stroke} strokeWidth={strokeWidth} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
  );
}

interface AchievementImageProps {
  src?: string | null;
  alt: string;
  category?: Category;
  fill?: boolean;
  sizes?: string;
  className?: string;
  priority?: boolean;
  /** For non-fill layout */
  width?: number;
  height?: number;
  objectFit?: 'cover' | 'contain';
}

export function AchievementImage({
  src,
  alt,
  category = 'Achievement',
  fill = true,
  sizes,
  className = '',
  priority,
  width,
  height,
  objectFit = 'cover',
}: AchievementImageProps) {
  const [error, setError] = useState(false);
  const hasValidSrc = src && src.trim() !== '' && !error;

  if (!hasValidSrc) {
    return (
      <div
        className={`relative flex flex-col items-center justify-center min-h-0 w-full h-full bg-gradient-to-br from-[var(--color-surface-elevated)] via-[var(--color-surface)] to-[var(--color-surface-hover)] ${className}`}
        style={{
          color: 'var(--color-accent)',
          boxShadow: 'inset 0 0 0 1px var(--color-border)',
        }}
      >
        {/* Subtle pattern so it feels like a content block, not empty */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, var(--color-accent) 1px, transparent 1px)`,
            backgroundSize: '16px 16px',
          }}
        />
        <div className="relative z-10 flex flex-col items-center justify-center gap-3 text-center px-4">
          <CategoryIcon category={category} size="lg" />
          <span
            className="text-xs font-semibold uppercase tracking-wider max-w-[140px] truncate"
            style={{ color: 'var(--color-text-muted)' }}
          >
            {category}
          </span>
        </div>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      sizes={sizes ?? '(max-width: 768px) 100vw, 50vw'}
      className={objectFit === 'cover' ? `object-cover ${className}` : `object-contain ${className}`}
      priority={priority}
      width={!fill ? width : undefined}
      height={!fill ? height : undefined}
      onError={() => setError(true)}
    />
  );
}
