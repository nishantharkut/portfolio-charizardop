"use client";

import React from 'react';

interface SkeletonProps {
  className?: string;
  height?: string | number;
  width?: string | number;
  animate?: boolean;
}

export function Skeleton({ 
  className = '', 
  height = '1rem', 
  width = '100%',
  animate = true 
}: SkeletonProps) {
  return (
    <div
      className={`skeleton ${animate ? 'animate-pulse' : ''} ${className}`}
      style={{
        height: typeof height === 'number' ? `${height}px` : height,
        width: typeof width === 'number' ? `${width}px` : width,
        backgroundColor: 'var(--color-skeleton)',
        borderRadius: '0.25rem',
      }}
      role="progressbar"
      aria-label="Loading content"
    />
  );
}

export function ProjectCardSkeleton() {
  return (
    <div className="project-card-skeleton">
      <div className="project-header-skeleton">
        <Skeleton height="3rem" width="3rem" />
        <div className="project-title-skeleton">
          <Skeleton height="1.5rem" width="70%" />
          <Skeleton height="1rem" width="50%" />
        </div>
      </div>
      <div className="project-info-skeleton">
        <Skeleton height="1.25rem" width="40%" />
        <Skeleton height="1rem" width="80%" />
      </div>
      <Skeleton height="240px" width="100%" />
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="hero-skeleton">
      <div className="hero-content-skeleton">
        <Skeleton height="4rem" width="80%" />
        <Skeleton height="1.5rem" width="60%" />
        <Skeleton height="1rem" width="70%" />
        <div className="hero-buttons-skeleton">
          <Skeleton height="3rem" width="120px" />
          <Skeleton height="3rem" width="100px" />
        </div>
      </div>
    </div>
  );
}

export function SkillCardSkeleton() {
  return (
    <div className="skill-card-skeleton">
      <Skeleton height="3rem" width="3rem" />
      <Skeleton height="1.25rem" width="70%" />
      <Skeleton height="0.5rem" width="100%" />
    </div>
  );
}

export function AboutSkeleton() {
  return (
    <div className="about-skeleton">
      <Skeleton height="3rem" width="60%" />
      <div className="about-content-skeleton">
        <Skeleton height="1rem" width="100%" />
        <Skeleton height="1rem" width="90%" />
        <Skeleton height="1rem" width="95%" />
        <Skeleton height="1rem" width="85%" />
      </div>
    </div>
  );
}

export function ExperienceSkeleton() {
  return (
    <div className="experience-skeleton">
      <Skeleton height="3rem" width="50%" />
      <div className="experience-items-skeleton">
        {[1, 2, 3].map((item) => (
          <div key={item} className="experience-item-skeleton">
            <Skeleton height="1.5rem" width="70%" />
            <Skeleton height="1rem" width="40%" />
            <Skeleton height="1rem" width="90%" />
            <Skeleton height="1rem" width="80%" />
          </div>
        ))}
      </div>
    </div>
  );
}
