"use client";

import { useState } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowTopRightOnSquareIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import type { IconType } from 'react-icons';
import { FcGoogle } from 'react-icons/fc';
import { SiAdobe, SiAmazon, SiFlipkart, SiGithub, SiIeee, SiOdoo } from 'react-icons/si';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import PixelBlast from '../components/ui/PixelBlast';
import { PageHeroCta } from '../components/ui/PageHeroCta';
import {
  getAchievements,
  getAwards,
  getCertifications,
  type Achievement,
  type Award,
} from '../../data';

type Milestone = Achievement | Award;

const evidence = [
  { value: '3,000 / 134,421', label: 'Amazon ML Summer School 2026' },
  { value: '16', label: 'Merged upstream pull requests' },
  { value: 'Top 25', label: 'HackOn with Amazon 6.0' },
  { value: '13+', label: 'Hackathon finalist appearances' },
];

const brandLogos: Record<string, IconType> = {
  adobe: SiAdobe,
  amazon: SiAmazon,
  flipkart: SiFlipkart,
  github: SiGithub,
  ieee: SiIeee,
  odoo: SiOdoo,
};

const coverCropLogos = new Set([
  '/achievements/aurora.png',
  '/achievements/iaeng.png',
  '/achievements/mood-indigo.png',
]);

const isAward = (item: Milestone): item is Award => 'event' in item;

function CertLogo({ src, name, issuer }: { src: string; name: string; issuer: string }) {
  const [error, setError] = useState(false);
  const initial = issuer.trim().charAt(0) || 'C';

  if (issuer === 'Google') {
    return <FcGoogle data-cert-brand="google" className="h-7 w-7" aria-label="Google logo" />;
  }

  if (!src || error) {
    return (
      <span className="text-lg font-bold" style={{ color: 'var(--color-accent)' }}>
        {initial}
      </span>
    );
  }

  return (
    <Image
      src={src}
      alt={`${name} logo`}
      fill
      className="object-contain p-2"
      sizes="48px"
      onError={() => setError(true)}
    />
  );
}

function IdentityLogo({ logo, label, className = '' }: { logo?: string; label: string; className?: string }) {
  if (!logo) return null;

  const BrandLogo = brandLogos[logo];
  const logoFit = coverCropLogos.has(logo) ? 'cover' : 'contain';

  return (
    <div
      data-identity-logo
      data-logo-fit={logoFit}
      data-logo-source={logo}
      className={`relative flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden border ${className}`}
      style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-start)' }}
      title={label}
    >
      {BrandLogo ? (
        <BrandLogo className="h-7 w-7" style={{ color: 'var(--color-text)' }} aria-label={`${label} logo`} />
      ) : (
        <Image
          src={logo}
          alt={`${label} logo`}
          fill
          className={logoFit === 'cover' ? 'object-cover' : 'object-contain p-1.5'}
          sizes="48px"
        />
      )}
    </div>
  );
}

function ExternalLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 text-xs font-semibold transition-colors hover:text-[var(--color-accent-hover)]"
      style={{ color: 'var(--color-accent)' }}
    >
      {label}
      <ArrowTopRightOnSquareIcon className="h-3.5 w-3.5" aria-hidden="true" />
    </a>
  );
}

function SectionHeading({ number, title }: { number: string; title: string }) {
  return (
    <div className="mb-8 flex items-baseline gap-4 sm:mb-10">
      <span className="text-xs font-semibold" style={{ color: 'var(--color-accent)' }}>
        {number}
      </span>
      <h2 className="text-2xl font-semibold sm:text-3xl" style={{ color: 'var(--color-text)' }}>
        {title}
      </h2>
    </div>
  );
}

export default function AchievementsPage() {
  const achievements = getAchievements();
  const awards = getAwards();
  const certifications = getCertifications();
  const reduceMotion = useReducedMotion();

  const selectedMilestones = [
    achievements.find((item) => item.id === 1),
    achievements.find((item) => item.id === 2),
    awards.find((item) => item.id === 1),
    awards.find((item) => item.id === 2),
    awards.find((item) => item.id === 5),
  ].filter((item): item is Milestone => Boolean(item));

  const leadership = achievements
    .filter((item) => item.id !== 1 && item.id !== 2)
    .sort((a, b) => (b.sortDate ?? b.date).localeCompare(a.sortDate ?? a.date));
  const awardsByYear = [...awards]
    .sort((a, b) => Number(b.year) - Number(a.year))
    .reduce<Map<string, Award[]>>((groups, award) => {
    const current = groups.get(award.year) ?? [];
    current.push(award);
    groups.set(award.year, current);
    return groups;
    }, new Map());

  const reveal = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 18 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: '-80px' },
        transition: { duration: 0.45 },
      };

  return (
    <main
      className="relative min-h-screen w-full overflow-x-hidden"
      style={{ backgroundColor: 'var(--color-bg-start)' }}
    >
      <Navbar />

      <section
        data-achievements-hero
        className="relative flex h-screen items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0 z-0">
          <PixelBlast
            variant="circle"
            pixelSize={2}
            color="#c96f2e"
            patternScale={7}
            patternDensity={1.2}
            pixelSizeJitter={1.6}
            enableRipples
            rippleSpeed={0.4}
            rippleThickness={0.12}
            rippleIntensityScale={1.5}
            speed={0.6}
            edgeFade={0.25}
            transparent
          />
        </div>

        <div className="relative z-10 px-4 text-center">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.8, delay: reduceMotion ? 0 : 0.2 }}
          >
            <h1
              className="mb-4 text-2xl font-bold drop-shadow-2xl sm:mb-6 sm:text-4xl md:text-6xl lg:text-8xl"
              style={{ color: 'var(--color-text)' }}
            >
              My{' '}
              <span className="relative inline-block sm:inline">
                <span className="relative z-10" style={{ color: 'var(--color-accent)' }}>
                  Achievements
                </span>
                <motion.span
                  initial={reduceMotion ? false : { scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: reduceMotion ? 0 : 1, delay: reduceMotion ? 0 : 1.2 }}
                  className="absolute left-0 top-full mt-1 h-1 w-full origin-left sm:bottom-1 sm:top-auto sm:mt-0"
                  style={{ background: 'var(--color-accent-gradient)' }}
                  aria-hidden="true"
                />
              </span>
            </h1>
            <p
              className="mx-auto mb-6 max-w-2xl text-base drop-shadow-lg sm:mb-8 sm:text-lg md:text-xl"
              style={{ color: 'var(--color-text)' }}
            >
              Machine learning, open source, national hackathons, and campus leadership
            </p>
            <PageHeroCta
              primary={{
                label: 'View all',
                href: '#achievements',
                onClick: (event) => {
                  event.preventDefault();
                  document.getElementById('achievements')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                },
              }}
            />
          </motion.div>
        </div>
      </section>

      <section
        id="achievements"
        data-section="evidence"
        className="relative z-10 border-y"
        style={{ borderColor: 'var(--color-border)' }}
      >
        <div className="mx-auto grid max-w-6xl grid-cols-2 lg:grid-cols-4">
          {evidence.map((item, index) => (
            <div
              key={item.label}
              data-evidence-item
              className={`min-w-0 px-4 py-6 sm:px-6 sm:py-8 ${
                index % 2 === 0 ? 'border-r' : ''
              } ${index < 2 ? 'border-b lg:border-b-0' : ''} ${index === 1 ? 'lg:border-r' : ''} ${
                index === 2 ? 'lg:border-r' : ''
              }`}
              style={{ borderColor: 'var(--color-border)' }}
            >
              <p className="mb-1 text-xl font-semibold sm:text-2xl" style={{ color: 'var(--color-text)' }}>
                {item.value}
              </p>
              <p className="text-xs leading-relaxed sm:text-sm" style={{ color: 'var(--color-text-muted)' }}>
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <motion.section
        {...reveal}
        data-section="milestones"
        className="relative z-10 px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
      >
        <div className="mx-auto max-w-6xl">
          <SectionHeading number="01" title="Selected milestones" />
          <div className="border-b" style={{ borderColor: 'var(--color-border)' }}>
            {selectedMilestones.map((item) => {
              const award = isAward(item);
              const title = award ? item.event : item.title;
              const result = award ? item.position : item.badge ?? item.category;
              const date = award ? item.year : item.date;
              const organization = award ? item.event : item.organization;
              const link = award ? undefined : item.link;
              const hasLogo = Boolean(item.logo);

              return (
                <article
                  key={`${award ? 'award' : 'achievement'}-${item.id}`}
                  className={`grid gap-4 border-t py-6 sm:items-start lg:gap-8 ${
                    hasLogo
                      ? 'sm:grid-cols-[7rem_minmax(0,1fr)_3.5rem] lg:grid-cols-[8rem_minmax(16rem,0.7fr)_minmax(18rem,1fr)_3.5rem]'
                      : 'sm:grid-cols-[7rem_minmax(0,1fr)] lg:grid-cols-[8rem_minmax(16rem,0.7fr)_minmax(18rem,1fr)]'
                  }`}
                  style={{ borderColor: 'var(--color-border)' }}
                >
                  <p className="text-xs font-medium sm:pt-1" style={{ color: 'var(--color-text-muted)' }}>
                    {date}
                  </p>
                  <div className="min-w-0">
                    <p className="mb-1 text-xs font-semibold uppercase" style={{ color: 'var(--color-accent)' }}>
                      {result}
                    </p>
                    <h3 className="text-base font-semibold sm:text-lg" style={{ color: 'var(--color-text)' }}>
                      {title}
                    </h3>
                    {organization && organization !== title && (
                      <p className="mt-1 text-xs" style={{ color: 'var(--color-text-muted)' }}>
                        {organization}
                      </p>
                    )}
                  </div>
                  <div
                    className={`min-w-0 sm:col-start-2 lg:col-span-1 lg:col-start-auto ${
                      hasLogo ? 'sm:col-span-2' : ''
                    }`}
                  >
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                      {item.description}
                    </p>
                    {link && (
                      <div className="mt-3">
                        <ExternalLink href={link} label="View source" />
                      </div>
                    )}
                  </div>
                  <IdentityLogo
                    logo={item.logo}
                    label={organization || title}
                    className="row-start-1 justify-self-end sm:col-start-3 lg:col-start-4"
                  />
                </article>
              );
            })}
          </div>
        </div>
      </motion.section>

      <motion.section
        {...reveal}
        data-section="competitions"
        className="relative z-10 border-y px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
        style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}
      >
        <div className="mx-auto max-w-6xl">
          <SectionHeading number="02" title="Competition record" />
          <div className="space-y-10">
            {Array.from(awardsByYear.entries()).map(([year, yearAwards]) => (
              <div key={year} className="grid gap-4 lg:grid-cols-[5rem_minmax(0,1fr)] lg:gap-8">
                <p className="text-sm font-semibold" style={{ color: 'var(--color-accent)' }}>
                  {year}
                </p>
                <div className="grid border-t md:grid-cols-2" style={{ borderColor: 'var(--color-border)' }}>
                  {yearAwards.map((award, index) => (
                    <article
                      key={award.id}
                      data-competition
                      className={`grid min-w-0 border-b py-5 md:px-5 ${
                        award.logo ? 'grid-cols-[3rem_minmax(0,1fr)] gap-4' : 'grid-cols-1'
                      } ${
                        index % 2 === 0 ? 'md:border-r' : ''
                      }`}
                      style={{ borderColor: 'var(--color-border)' }}
                    >
                      <IdentityLogo logo={award.logo} label={award.event} />
                      <div className="min-w-0">
                        <div className="mb-1 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                          <p className="text-xs font-semibold uppercase" style={{ color: 'var(--color-accent)' }}>
                            {award.position}
                          </p>
                          <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                            {award.year}
                          </span>
                        </div>
                        <h3 className="text-sm font-semibold leading-snug sm:text-base" style={{ color: 'var(--color-text)' }}>
                          {award.event}
                        </h3>
                        {(award.id === 1 || award.id === 5 || award.id === 15) && (
                          <p className="mt-2 text-xs leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                            {award.description}
                          </p>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section
        {...reveal}
        data-section="leadership"
        className="relative z-10 px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
      >
        <div className="mx-auto max-w-6xl">
          <SectionHeading number="03" title="Leadership and campus work" />
          <div className="border-b" style={{ borderColor: 'var(--color-border)' }}>
            {leadership.map((item) => (
              <article
                key={item.id}
                className="grid gap-3 border-t py-5 sm:grid-cols-[10rem_minmax(0,1fr)_auto] sm:gap-6"
                style={{ borderColor: 'var(--color-border)' }}
              >
                <p className="text-xs font-medium sm:pt-1" style={{ color: 'var(--color-text-muted)' }}>
                  {item.date}
                </p>
                <div className="relative min-w-0 border-l pl-5" style={{ borderColor: 'var(--color-border)' }}>
                  <span
                    className="absolute -left-[4.5px] top-1.5 h-2 w-2 rounded-full"
                    style={{ backgroundColor: 'var(--color-accent)' }}
                    aria-hidden="true"
                  />
                  <div className="flex items-start gap-4">
                    <IdentityLogo logo={item.logo} label={item.organization || item.title} />
                    <div className="min-w-0 flex-1">
                      <p className="mb-1 text-xs font-semibold uppercase" style={{ color: 'var(--color-accent)' }}>
                        {item.category}
                      </p>
                      <h3
                        data-leadership-title
                        className="text-sm font-semibold sm:text-base"
                        style={{ color: 'var(--color-text)' }}
                      >
                        {item.title}
                      </h3>
                      {item.organization && (
                        <p className="mt-1 text-xs" style={{ color: 'var(--color-text-muted)' }}>
                          {item.organization}
                        </p>
                      )}
                      <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
                {item.link && (
                  <div className="sm:pt-1">
                    <ExternalLink href={item.link} label="Open" />
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section
        {...reveal}
        data-section="credentials"
        className="relative z-10 border-y px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
        style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}
      >
        <div className="mx-auto max-w-6xl">
          <SectionHeading number="04" title="Credentials" />
          <div className="border-b" style={{ borderColor: 'var(--color-border)' }}>
            {certifications.map((certification) => (
              <article
                key={certification.id}
                className="grid gap-4 border-t py-6 sm:grid-cols-[3rem_minmax(0,1fr)_auto] sm:gap-6"
                style={{ borderColor: 'var(--color-border)' }}
              >
                <div
                  className="relative flex h-12 w-12 items-center justify-center overflow-hidden border"
                  style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-start)' }}
                >
                  <CertLogo src={certification.image} name={certification.name} issuer={certification.issuer} />
                </div>
                <div className="min-w-0">
                  <p className="mb-1 text-xs font-semibold uppercase" style={{ color: 'var(--color-accent)' }}>
                    {certification.issuer}
                  </p>
                  <h3 className="text-sm font-semibold sm:text-base" style={{ color: 'var(--color-text)' }}>
                    {certification.name}
                  </h3>
                  <p className="mt-1 text-xs" style={{ color: 'var(--color-text-muted)' }}>
                    {certification.date}
                    {certification.credentialId && ` · ${certification.credentialId}`}
                  </p>

                  {certification.courses && certification.courses.length > 0 && (
                    <details className="group mt-4 border-t pt-3" style={{ borderColor: 'var(--color-border)' }}>
                      <summary
                        className="flex cursor-pointer list-none items-center gap-2 text-xs font-semibold"
                        style={{ color: 'var(--color-text)' }}
                      >
                        <ChevronDownIcon
                          className="h-4 w-4 transition-transform group-open:rotate-180"
                          aria-hidden="true"
                        />
                        Show four course credentials
                      </summary>
                      <div className="mt-3 divide-y" style={{ borderColor: 'var(--color-border)' }}>
                        {certification.courses.map((course) => (
                          <div
                            key={course.credentialId}
                            className="flex flex-col gap-2 py-3 sm:flex-row sm:items-start sm:justify-between"
                            style={{ borderColor: 'var(--color-border)' }}
                          >
                            <div className="min-w-0">
                              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                                {course.name}
                              </p>
                              <p className="mt-1 text-xs" style={{ color: 'var(--color-text-muted)' }}>
                                {course.date} · {course.credentialId}
                              </p>
                            </div>
                            {course.credentialUrl && (
                              <ExternalLink href={course.credentialUrl} label="Verify" />
                            )}
                          </div>
                        ))}
                      </div>
                    </details>
                  )}
                </div>
                {certification.credentialUrl && (
                  <div>
                    <ExternalLink href={certification.credentialUrl} label="Verify" />
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>
      </motion.section>

      <Footer />
    </main>
  );
}
