"use client";

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import StarBorder from '../components/ui/StarBorder';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  getAchievements, 
  getCertifications, 
  getAwards, 
  getFeaturedAchievements
} from '../../data';
import PixelBlast from '../components/ui/PixelBlast';
import { AchievementImage } from '../components/ui/AchievementImage';
import { PageHeroCta } from '../components/ui/PageHeroCta';
// Lazy load FaultyTerminal with proper loading state
import { LazyFaultyTerminal } from '../../components/lazy/LazyBoundaries';

function CertLogo({ src, name, issuer }: { src: string; name: string; issuer: string }) {
  const [err, setErr] = useState(false);
  const initial = issuer?.trim() ? issuer.charAt(0) : 'C';
  if (!src || err) {
    return (
      <span className="text-lg font-bold" style={{ color: 'var(--color-accent)' }}>
        {initial}
      </span>
    );
  }
  return (
    <Image
      src={src}
      alt={name}
      fill
      className="object-contain p-1"
      sizes="56px"
      onError={() => setErr(true)}
    />
  );
}

export default function AchievementsPage() {
  const achievements = getAchievements();
  const featuredAchievements = getFeaturedAchievements();
  const certifications = getCertifications();
  const awards = getAwards();
  const [particles, setParticles] = useState<Array<{left: number, top: number, delay: number}>>([]);
  const { theme } = useTheme();

  useEffect(() => {
    // Generate particle positions on client side only
    const newParticles = Array.from({ length: 20 }, () => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 2
    }));
    setParticles(newParticles);
  }, []);

  return (
    <main className="relative w-full min-h-screen overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* FaultyTerminal Background - Hero Section Only */}
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
    // liquid
    // liquidStrength={0.12}
    // liquidRadius={1.2}
    // liquidWobbleSpeed={5}
    speed={1}
    edgeFade={0.25}
    transparent
  />
          {/* <LazyFaultyTerminal
            scale={2}
            gridMul={[3, 2]}
            digitSize={1.2}
            timeScale={0.5}
            scanlineIntensity={0.4}
            glitchAmount={1.2}
            flickerAmount={0.8}
            noiseAmp={1.1}
            chromaticAberration={2}
            curvature={0.15}
            tint="#c96f2e"
            mouseReact={true}
            mouseStrength={0.3}
            brightness={typeof window !== 'undefined' && document.documentElement.classList.contains('light') ? 0.3 : 0.7}
          /> */}
        </div>
        
        <div className="relative z-10 text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-2xl sm:text-3xl md:text-6xl lg:text-8xl font-bold mb-4 sm:mb-6 drop-shadow-2xl" style={{ color: 'var(--color-text)' }}>
              My <span className="relative inline-block sm:inline">
                <span className="relative z-10" style={{ color: 'var(--color-accent)' }}>Achievements</span>
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1, delay: 1.2 }}
                  className="absolute left-0 w-full h-1 origin-left top-full mt-1 sm:top-auto sm:mt-0 sm:bottom-1"
                  style={{ background: 'var(--color-accent-gradient)' }}
                />
              </span>
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl max-w-2xl mx-auto mb-6 sm:mb-8 drop-shadow-lg" style={{ color: 'var(--color-text-secondary)' }}>
              Machine learning, open source, national hackathons, and campus leadership
            </p>
            
            <PageHeroCta
              primary={{
                label: 'View all',
                href: '#achievements',
                onClick: (e) => {
                  e.preventDefault();
                  document.getElementById('achievements')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                },
              }}
            />
          </motion.div>
        </div>

      </section>

      {/* Featured Achievements */}
      <section id="achievements" className="relative z-10 py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 sm:mb-12 lg:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4" style={{ color: 'var(--color-text)' }}>
              Major <span style={{ color: 'var(--color-accent)' }}>Achievements</span>
            </h2>
            <p className="text-base sm:text-lg max-w-2xl mx-auto px-2" style={{ color: 'var(--color-text-secondary)' }}>
              Hackathons, competitions, and leadership roles
            </p>
          </motion.div>

          {/* Featured — one hero: image-first with overlay (no duplicate cards) */}
          {featuredAchievements.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-12 sm:mb-16 lg:mb-20"
            >
              <div className="relative rounded-xl overflow-hidden border-2 min-h-[320px] sm:min-h-[380px] lg:min-h-[420px]" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
                <div className="absolute inset-0">
                  <AchievementImage
                    src={featuredAchievements[0].image}
                    alt={featuredAchievements[0].title}
                    category={featuredAchievements[0].category}
                    className="transition-transform duration-500 hover:scale-[1.02]"
                    sizes="(max-width: 1024px) 100vw, 1200px"
                    priority
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 lg:p-8 text-left">
                  <span className="inline-block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--color-accent)' }}>
                    {featuredAchievements[0].category}
                  </span>
                  <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-tight mb-2 text-white">
                    {featuredAchievements[0].title}
                  </h3>
                  <p className="text-sm sm:text-base text-white/90 max-w-2xl mb-4 line-clamp-2">
                    {featuredAchievements[0].description}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 text-sm">
                    <span className="text-white/80">{featuredAchievements[0].organization}</span>
                    <span className="text-white/60">·</span>
                    <span style={{ color: 'var(--color-accent)' }}>{featuredAchievements[0].date}</span>
                  </div>
                  {featuredAchievements[0].link && (
                    <a
                      href={featuredAchievements[0].link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-lg text-sm font-medium border transition-colors"
                      style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-button-text)', borderColor: 'var(--color-accent)' }}
                    >
                      View details
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* All Achievements — bento-style, type-based cards; image when present, graceful fallback */}
          <div className="space-y-4 sm:space-y-6 lg:space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
                All <span style={{ color: 'var(--color-accent)' }}>Achievements</span>
              </h3>
              <p className="text-sm sm:text-base px-2" style={{ color: 'var(--color-text-secondary)' }}>
                Clubs, roles, and other activities
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 auto-rows-fr">
              {achievements.filter(a => !a.featured).map((achievement, index) => {
                const isHackathon = /hackathon/i.test(achievement.category);
                const isDesign = /design|graphic|ui\/ux/i.test(achievement.category);
                const isLeadership = /leadership|community|welfare/i.test(achievement.category);
                const spanClass = isHackathon ? 'lg:col-span-2' : isDesign ? '' : '';
                return (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.06 }}
                    className={`${spanClass} min-h-0 flex`}
                  >
                    <div
                      className="relative w-full rounded-xl border-2 overflow-hidden flex flex-col min-h-[280px]"
                      style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}
                    >
                      {/* Image or fallback — prominent for design, smaller for others */}
                      <div className={`relative w-full overflow-hidden ${isDesign ? 'aspect-[4/3]' : 'aspect-[2/1] sm:aspect-[16/7]'}`}>
                        <AchievementImage
                          src={achievement.image}
                          alt={achievement.title}
                          category={achievement.category}
                          className="transition-transform duration-300 hover:scale-[1.03]"
                          sizes={isHackathon ? '(max-width: 1024px) 100vw, 66vw' : '(max-width: 1024px) 100vw, 33vw'}
                        />
                      </div>
                      <div className="p-4 sm:p-5 flex flex-col flex-1 min-h-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-accent)' }}>
                            {achievement.category}
                          </span>
                          <span className="text-xs font-medium shrink-0" style={{ color: 'var(--color-text-muted)' }}>
                            {achievement.date}
                          </span>
                        </div>
                        <h3 className="text-base sm:text-lg font-bold leading-tight mb-2" style={{ color: 'var(--color-text)' }}>
                          {achievement.title}
                        </h3>
                        <p className="text-sm leading-relaxed line-clamp-2 flex-1" style={{ color: 'var(--color-text-secondary)' }}>
                          {achievement.description}
                        </p>
                        {achievement.organization && (
                          <p className="text-xs mt-2" style={{ color: 'var(--color-text-muted)' }}>
                            {achievement.organization}
                          </p>
                        )}
                        {isHackathon && achievement.impact.length > 0 && (
                          <ul className="mt-3 space-y-1">
                            {achievement.impact.slice(0, 2).map((impact, i) => (
                              <li key={i} className="flex items-start gap-2 text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                                <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: 'var(--color-accent)' }} />
                                <span>{impact}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Certifications — compact badge strip: logo/initial + name + issuer + link */}
      <section className="relative z-10 py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4" style={{ color: 'var(--color-text)' }}>
              Professional <span style={{ color: 'var(--color-accent)' }}>Certifications</span>
            </h2>
            <p className="text-sm sm:text-base lg:text-lg px-2 max-w-3xl mx-auto" style={{ color: 'var(--color-text-secondary)' }}>
              Courses and certifications I&apos;ve completed
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            {certifications.map((cert, index) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="flex items-center gap-4 p-4 rounded-xl border-2 min-w-[280px] sm:min-w-0 sm:flex-1 sm:max-w-[360px]"
                style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}
              >
                <div className="relative w-14 h-14 rounded-lg flex-shrink-0 overflow-hidden flex items-center justify-center" style={{ backgroundColor: 'var(--color-surface-elevated)' }}>
                  <CertLogo src={cert.image} name={cert.name} issuer={cert.issuer} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold leading-tight mb-0.5" style={{ color: 'var(--color-text)' }}>
                    {cert.name}
                  </h3>
                  <p className="text-xs mb-2" style={{ color: 'var(--color-text-muted)' }}>
                    {cert.issuer}
                  </p>
                  <span className="text-xs font-medium" style={{ color: 'var(--color-accent)' }}>
                    {cert.date}
                    {cert.credentialId && ` · ${cert.credentialId}`}
                  </span>
                </div>
                <a
                  href="#"
                  className="text-xs font-semibold shrink-0 px-3 py-1.5 rounded-md border transition-colors"
                  style={{ color: 'var(--color-accent)', borderColor: 'var(--color-accent)' }}
                >
                  View credential
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Awards — trophy cards: image when present, position + event + year prominent */}
      <section className="relative z-10 py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 sm:mb-12 lg:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4" style={{ color: 'var(--color-text)' }}>
              Awards & <span style={{ color: 'var(--color-accent)' }}>Recognition</span>
            </h2>
            <p className="text-sm sm:text-base lg:text-lg px-2" style={{ color: 'var(--color-text-secondary)' }}>
              Competition wins and recognitions
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {awards.map((award, index) => (
              <motion.div
                key={award.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="flex"
              >
                <div className="relative w-full rounded-xl border-2 overflow-hidden flex flex-col min-h-0" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
                  <div className="relative w-full aspect-[16/10] flex items-center justify-center overflow-hidden" style={{ backgroundColor: 'var(--color-surface-elevated)' }}>
                    <AchievementImage
                      src={award.image}
                      alt={award.title}
                      category="Hackathon"
                      objectFit="cover"
                      className="transition-transform duration-300 hover:scale-[1.03]"
                      sizes="(max-width: 640px) 100vw, 50vw"
                    />
                    <div className="absolute top-3 right-3 flex items-center gap-2">
                      <span className="px-2 py-1 text-xs font-bold rounded" style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-button-text)' }}>
                        {award.position}
                      </span>
                      <span className="text-xs font-medium px-2 py-1 rounded border" style={{ color: 'var(--color-text)', borderColor: 'var(--color-border)' }}>
                        {award.year}
                      </span>
                    </div>
                  </div>
                  <div className="p-4 sm:p-5 flex flex-col flex-1 min-h-0">
                    <h3 className="text-base sm:text-lg font-bold leading-tight mb-1" style={{ color: 'var(--color-text)' }}>
                      {award.title}
                    </h3>
                    <p className="text-sm font-semibold mb-2" style={{ color: 'var(--color-accent)' }}>
                      {award.event}
                    </p>
                    <p className="text-sm leading-relaxed line-clamp-2" style={{ color: 'var(--color-text-secondary)' }}>
                      {award.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {/* <section className="relative z-10 py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-6 sm:mb-8 lg:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4" style={{ color: 'var(--color-text)' }}>
              Career <span style={{ color: 'var(--color-accent)' }}>Highlights</span>
            </h2>
            <p className="text-sm sm:text-base px-2" style={{ color: 'var(--color-text-secondary)' }}>
              Key metrics that define my professional journey
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {[
              { number: "20+", label: "Projects Completed", description: "Successfully delivered across various industries" },
              { number: "98%", label: "Client Satisfaction", description: "Consistent high-quality delivery and service" },
              { number: "50+", label: "Open Source Contributions", description: "Active community participation and sharing" },
              { number: "6", label: "Industry Awards", description: "Recognition for innovation and excellence" }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="h-full"
              > */}
                {/* Mobile-Optimized Stats Card */}
                {/* <div className="relative w-full h-[160px] sm:h-[180px] lg:h-[200px] neubrutalism-card flex flex-col"
                  style={{
                    backgroundColor: 'var(--color-surface)',
                  }}
                > */}
                  {/* Number Section - Better mobile sizing */}
                  {/* <div className="p-2 sm:p-3 border-b-4 border-black min-h-[50px] sm:min-h-[60px] lg:min-h-[70px] flex items-center justify-center flex-shrink-0">
                    <div className="text-xl sm:text-2xl lg:text-3xl font-black text-orange-400 transition-transform duration-300 group-hover:scale-110 uppercase tracking-wider">
                      {stat.number}
                    </div>
                  </div> */}
                  
                  {/* Content Section - Better mobile spacing */}
                  {/* <div className="p-2 sm:p-3 flex-1 flex flex-col justify-center text-center overflow-hidden"> */}
                    {/* Label - Better mobile typography */}
                    {/* <div className="mb-1 sm:mb-2">
                      <p className="text-xs sm:text-sm lg:text-base font-black uppercase tracking-wide leading-tight" style={{ color: 'var(--color-text)' }}>
                        {stat.label}
                      </p>
                    </div> */}
                    
                    {/* Description - Mobile responsive */}
                    {/* <div className="flex-1 flex items-center min-h-0">
                      <p className="text-xs sm:text-sm leading-tight font-medium line-clamp-2 overflow-hidden" style={{ color: 'var(--color-text-secondary)' }}>
                        {stat.description}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
       */}
      <Footer />
    </main>
  );
}
