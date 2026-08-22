"use client";

import { useState } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowTopRightOnSquareIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import PixelBlast from '../components/ui/PixelBlast';
import { AchievementImage } from '../components/ui/AchievementImage';
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
  { value: '3 roles', label: 'Student Activity Council progression' },
];

const isAward = (item: Milestone): item is Award => 'event' in item;

function CertLogo({ src, name, issuer }: { src: string; name: string; issuer: string }) {
  const [error, setError] = useState(false);
  const initial = issuer.trim().charAt(0) || 'C';

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
    awards.find((item) => item.id === 5),
    achievements.find((item) => item.id === 4),
  ].filter((item): item is Milestone => Boolean(item));

  const leadership = achievements.filter((item) => item.id !== 1 && item.id !== 2);
  const awardsByYear = awards.reduce<Map<string, Award[]>>((groups, award) => {
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

      <section className="relative flex min-h-[76vh] items-center justify-center overflow-hidden px-4 pb-16 pt-28">
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
            speed={1}
            edgeFade={0.25}
            transparent
          />
        </div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.7 }}
          className="relative z-10 mx-auto max-w-3xl text-center"
        >
          <h1
            className="mb-5 text-4xl font-semibold sm:text-6xl lg:text-7xl"
            style={{ color: 'var(--color-text)' }}
          >
            Achievements
          </h1>
          <p
            className="mx-auto mb-8 max-w-2xl text-sm sm:text-base md:text-lg"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Machine learning, open source, national hackathons, and campus leadership
          </p>
          <PageHeroCta
            primary={{
              label: 'View record',
              href: '#achievements',
              onClick: (event) => {
                event.preventDefault();
                document.getElementById('achievements')?.scrollIntoView({ behavior: 'smooth' });
              },
            }}
          />
        </motion.div>
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

              return (
                <article
                  key={`${award ? 'award' : 'achievement'}-${item.id}`}
                  className="grid gap-4 border-t py-6 sm:grid-cols-[7rem_minmax(0,1fr)_3.5rem] sm:items-start lg:grid-cols-[8rem_minmax(16rem,0.7fr)_minmax(18rem,1fr)_3.5rem] lg:gap-8"
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
                  <div className="min-w-0 sm:col-span-2 sm:col-start-2 lg:col-span-1 lg:col-start-auto">
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                      {item.description}
                    </p>
                    {link && (
                      <div className="mt-3">
                        <ExternalLink href={link} label="View source" />
                      </div>
                    )}
                  </div>
                  <div
                    className="relative row-start-1 h-12 w-12 justify-self-end overflow-hidden border sm:col-start-3 lg:col-start-4"
                    style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}
                  >
                    <AchievementImage
                      src={item.image}
                      alt={`${title} mark`}
                      category={award ? 'Hackathon' : item.category}
                      objectFit="contain"
                      sizes="48px"
                    />
                  </div>
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
                      className={`grid min-w-0 grid-cols-[3rem_minmax(0,1fr)] gap-4 border-b py-5 md:px-5 ${
                        index % 2 === 0 ? 'md:border-r' : ''
                      }`}
                      style={{ borderColor: 'var(--color-border)' }}
                    >
                      <div
                        className="relative h-12 w-12 overflow-hidden border"
                        style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-start)' }}
                      >
                        <AchievementImage
                          src={award.image}
                          alt={`${award.event} mark`}
                          category="Hackathon"
                          objectFit="contain"
                          sizes="48px"
                        />
                      </div>
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
                  <p className="mb-1 text-xs font-semibold uppercase" style={{ color: 'var(--color-accent)' }}>
                    {item.category}
                  </p>
                  <h3 className="text-sm font-semibold sm:text-base" style={{ color: 'var(--color-text)' }}>
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
                  className="relative h-12 w-12 overflow-hidden border"
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
