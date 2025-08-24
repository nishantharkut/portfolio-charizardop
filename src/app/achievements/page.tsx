"use client";

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import StarBorder from '../components/ui/StarBorder';
import SplashCursor from '../components/ui/SplashCursor';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  getAchievements, 
  getCertifications, 
  getAwards, 
  getFeaturedAchievements
} from '../../data';

// Lazy load FaultyTerminal with proper loading state
import { LazyFaultyTerminal } from '../../components/lazy/LazyBoundaries';

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
      <SplashCursor SPLAT_RADIUS={0.05} />
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* FaultyTerminal Background - Hero Section Only */}
        <div className="absolute inset-0 z-0">
          <LazyFaultyTerminal
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
            tint="#ff8c42"
            mouseReact={true}
            mouseStrength={0.3}
            brightness={typeof window !== 'undefined' && document.documentElement.classList.contains('light') ? 0.3 : 0.7}
          />
        </div>
        
        <div className="relative z-10 text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold mb-6 drop-shadow-2xl" style={{ color: 'var(--color-text)' }}>
              My <span className="text-orange-500">Achievements</span>
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8 drop-shadow-lg" style={{ color: 'var(--color-text-secondary)' }}>
              A showcase of milestones, awards, and recognition that mark my journey as a creative technologist
            </p>
            <Link 
              href="/"
              className="inline-flex items-center gap-2 glass-button px-6 py-3 hover:text-orange-500 transition-colors duration-300"
              style={{ color: 'var(--color-text)' }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
          </motion.div>
        </div>

        {/* Floating Achievement Cards */}
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 hidden md:flex gap-8">
          {[
            { 
              icon: "🏆", 
              title: "AWS Certified", 
              subtitle: "Solutions Architect",
              year: "2024"
            },
            { 
              icon: "🎖️", 
              title: "Industry Award", 
              subtitle: "Best Innovation",
              year: "2023"
            },
            { 
              icon: "📜", 
              title: "GCP Certified", 
              subtitle: "Cloud Engineer",
              year: "2023"
            }
          ].map((achievement, index) => (
            <motion.div
              key={achievement.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.4 + index * 0.2 }}
              className="cursor-pointer"
            >
              {/* Neubrutalism Floating Achievement Card */}
              <div className="relative w-[140px] h-[160px] border-4 border-black transition-all duration-300 shadow-[var(--shadow-neubrutalism)] hover:shadow-[var(--shadow-neubrutalism-hover)] hover:translate-x-[3px] hover:translate-y-[3px] flex flex-col text-center"
                style={{
                  backgroundColor: 'var(--color-surface)',
                }}
              >
                {/* Icon Section - FIXED HEIGHT */}
                <div className="p-3 border-b-4 border-black h-[70px] flex items-center justify-center flex-shrink-0">
                  <motion.div 
                    className="text-2xl"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    {achievement.icon}
                  </motion.div>
                </div>
                
                {/* Content Section - FLEXIBLE */}
                <div className="p-3 flex-1 flex flex-col justify-center">
                  {/* Title - FIXED HEIGHT */}
                  <div className="h-[35px] mb-1">
                    <div className="text-sm font-black uppercase tracking-tight leading-tight line-clamp-2" style={{ color: 'var(--color-text)' }}>
                      {achievement.title}
                    </div>
                  </div>
                  
                  {/* Subtitle - FIXED HEIGHT */}
                  <div className="h-[20px] mb-2">
                    <p className="text-xs font-medium line-clamp-1" style={{ color: 'var(--color-text-secondary)' }}>
                      {achievement.subtitle}
                    </p>
                  </div>
                  
                  {/* Year Badge - FIXED HEIGHT */}
                  <div className="h-[20px] flex justify-center">
                    <div className="bg-orange-400 border-2 border-black px-2 py-0.5 text-xs font-black shadow-[var(--shadow-neubrutalism-small)] uppercase tracking-wide">
                      {achievement.year}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Achievements */}
      <section id="achievements" className="relative z-10 py-20 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 sm:mb-16 lg:mb-20"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4" style={{ color: 'var(--color-text)' }}>
              Major <span style={{ color: 'var(--color-accent)' }}>Achievements</span>
            </h2>
            <p className="text-base sm:text-lg max-w-2xl mx-auto px-4" style={{ color: 'var(--color-text-secondary)' }}>
              Significant milestones and recognition throughout my career
            </p>
          </motion.div>

          {/* Featured Achievement Cards */}
          <div className="space-y-8 sm:space-y-12 mb-16 sm:mb-20">
            {featuredAchievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                {/* Neubrutalism Featured Achievement Card */}
                <div className="relative neubrutalism-card overflow-hidden"
                  style={{
                    backgroundColor: 'var(--color-surface)',
                  }}
                >
                  <div className="flex flex-col lg:grid lg:grid-cols-5 lg:gap-0 h-full">
                    {/* Image Section */}
                    <div className="relative h-64 sm:h-72 lg:h-96 lg:col-span-2 border-b-4 lg:border-b-0 lg:border-r-4 border-black">
                      <Image
                        src={achievement.image}
                        alt={achievement.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 40vw"
                        priority={index === 0}
                      />
                      <div className="absolute top-4 left-4 text-3xl sm:text-4xl z-10 drop-shadow-lg">
                        {achievement.badge}
                      </div>
                      <div className="absolute top-4 right-4 bg-yellow-400 border-2 border-black px-3 py-2 font-black text-black text-sm shadow-[var(--shadow-neubrutalism-medium)] uppercase tracking-wide z-10">
                        FEATURED
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-6 sm:p-8 lg:p-10 lg:col-span-3 flex flex-col justify-center">
                      <div className="mb-4">
                        <p className="text-orange-500 text-sm uppercase tracking-wider font-black mb-2">
                          {achievement.category}
                        </p>
                        <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight mb-4 leading-tight" style={{ color: 'var(--color-text)' }}>
                          {achievement.title}
                        </h3>
                      </div>
                      
                      <p className="text-base sm:text-lg mb-6 leading-relaxed font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                        {achievement.description}
                      </p>
                      
                      <div className="space-y-4 mb-6">
                        <h4 className="font-black text-sm uppercase tracking-wide" style={{ color: 'var(--color-text)' }}>
                          KEY IMPACT
                        </h4>
                        <ul className="space-y-3">
                          {achievement.impact.slice(0, 3).map((impact, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm sm:text-base font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                              <span className="w-2 h-2 bg-orange-400 border border-black mt-2 flex-shrink-0"></span>
                              <span className="leading-relaxed">{impact}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t-4 border-black">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                          <span className="text-sm font-black uppercase tracking-wide" style={{ color: 'var(--color-text)' }}>
                            {achievement.organization}
                          </span>
                          <span className="text-orange-500 text-sm font-black hidden sm:inline">•</span>
                          <span className="text-sm text-orange-500 font-black uppercase tracking-wide">
                            {achievement.date}
                          </span>
                        </div>
                        {achievement.link && (
                          <a
                            href={achievement.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-orange-400 text-black font-black px-4 py-2 border-2 border-black shadow-[var(--shadow-neubrutalism)] hover:shadow-[var(--shadow-neubrutalism-hover-small)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 text-sm uppercase tracking-wide flex items-center gap-2 self-start sm:self-auto"
                          >
                            VIEW DETAILS 
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* All Achievements Grid */}
          <div className="space-y-6 sm:space-y-8">
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
              <p className="text-sm sm:text-base" style={{ color: 'var(--color-text-secondary)' }}>
                Complete collection of professional milestones
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {achievements.filter(a => !a.featured).map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="h-full"
                >
                  {/* Neubrutalism Achievement Card */}
                  <div className="relative w-full h-[420px] neubrutalism-card flex flex-col"
                    style={{
                      backgroundColor: 'var(--color-surface)',
                    }}
                  >
                    {/* Header Section - FIXED HEIGHT */}
                    <div className="p-6 border-b-4 border-black h-[120px] flex items-center justify-between flex-shrink-0">
                      <div className="text-4xl">{achievement.badge}</div>
                      <div className="bg-orange-400 border-2 border-black px-3 py-1.5 font-black text-black text-xs shadow-[var(--shadow-neubrutalism-medium)] uppercase tracking-wide">
                        {achievement.date}
                      </div>
                    </div>
                    
                    {/* Content Section - FLEXIBLE */}
                    <div className="p-6 flex-1 flex flex-col">
                      {/* Category & Title - FIXED HEIGHT */}
                      <div className="h-[80px] mb-4">
                        <p className="text-orange-500 text-xs uppercase tracking-wider font-black mb-2">
                          {achievement.category}
                        </p>
                        <h3 className="text-lg font-black uppercase tracking-tight leading-tight line-clamp-2" style={{ color: 'var(--color-text)' }}>
                          {achievement.title}
                        </h3>
                      </div>
                      
                      {/* Description - FIXED HEIGHT */}
                      <div className="h-[60px] mb-4">
                        <p className="text-sm leading-relaxed line-clamp-3 font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                          {achievement.description}
                        </p>
                      </div>
                      
                      {/* Organization - FIXED HEIGHT */}
                      <div className="h-[20px] mb-4">
                        {achievement.organization && (
                          <p className="text-xs font-black text-orange-400 uppercase tracking-wide">
                            {achievement.organization}
                          </p>
                        )}
                      </div>

                      {/* Impact Section - FLEXIBLE AT BOTTOM */}
                      <div className="mt-auto border-t-4 border-black pt-4">
                        <h4 className="text-xs uppercase tracking-wide font-black mb-3" style={{ color: 'var(--color-text)' }}>
                          KEY IMPACT
                        </h4>
                        <div className="space-y-2">
                          {achievement.impact.slice(0, 2).map((impact, i) => (
                            <div key={i} className="flex items-start gap-2 text-xs leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                              <span className="w-2 h-2 bg-orange-400 border border-black mt-1.5 flex-shrink-0"></span>
                              <span className="font-medium">{impact}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Certifications Section */}
      <section className="relative z-10 py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4" style={{ color: 'var(--color-text)' }}>
              Professional <span style={{ color: 'var(--color-accent)' }}>Certifications</span>
            </h2>
            <p className="text-sm sm:text-base lg:text-lg px-4" style={{ color: 'var(--color-text-secondary)' }}>
              Continuous learning and validation of technical expertise
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {certifications.map((cert, index) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="h-full"
              >
                {/* Neubrutalism Certification Card */}
                <div className="relative w-full h-[380px] neubrutalism-card flex flex-col"
                  style={{
                    backgroundColor: 'var(--color-surface)',
                  }}
                >
                  {/* Logo Section - FIXED HEIGHT */}
                  <div className="p-6 border-b-4 border-black h-[120px] flex items-center justify-center flex-shrink-0">
                    <div className="w-16 h-16 relative">
                      <Image
                        src={cert.image}
                        alt={cert.name}
                        fill
                        className="object-contain"
                        sizes="64px"
                      />
                    </div>
                  </div>
                  
                  {/* Content Section - FLEXIBLE */}
                  <div className="p-6 flex-1 flex flex-col text-center">
                    {/* Title & Issuer - FIXED HEIGHT */}
                    <div className="h-[80px] mb-4">
                      <h3 className="text-lg font-black uppercase tracking-tight leading-tight line-clamp-2 mb-2" style={{ color: 'var(--color-text)' }}>
                        {cert.name}
                      </h3>
                      <p className="text-orange-500 text-sm font-black uppercase tracking-wide">
                        {cert.issuer}
                      </p>
                    </div>

                    {/* Date Badge - FIXED HEIGHT */}
                    <div className="h-[32px] mb-6 flex justify-center">
                      <div className="bg-orange-400 border-2 border-black px-3 py-1.5 font-black text-black text-xs shadow-[var(--shadow-neubrutalism-medium)] uppercase tracking-wide">
                        {cert.date}
                      </div>
                    </div>
                    
                    {/* Skills Section - FLEXIBLE AT BOTTOM */}
                    <div className="mt-auto border-t-4 border-black pt-4">
                      <h4 className="text-xs mb-3 uppercase tracking-wide font-black" style={{ color: 'var(--color-text)' }}>
                        SKILLS VALIDATED
                      </h4>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {cert.skills.slice(0, 4).map((skill, i) => (
                          <span key={i} className="bg-orange-400 border-2 border-black text-black text-xs font-bold px-2 py-1 shadow-[var(--shadow-neubrutalism-small)] uppercase tracking-wide whitespace-nowrap">
                            {skill}
                          </span>
                        ))}
                        {cert.skills.length > 4 && (
                          <span className="border-2 border-black text-xs font-bold px-2 py-1 shadow-[var(--shadow-neubrutalism-small)] uppercase tracking-wide"
                            style={{ 
                              backgroundColor: 'var(--color-surface-hover)', 
                              color: 'var(--color-text)' 
                            }}
                          >
                            +{cert.skills.length - 4}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Credential ID - FIXED AT BOTTOM */}
                    {cert.credentialId && (
                      <div className="mt-4 pt-3 border-t-2 border-black">
                        <p className="text-xs text-center font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                          <span className="font-black uppercase tracking-wide">ID:</span><br />
                          <span className="font-mono text-orange-400 text-xs">{cert.credentialId}</span>
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Awards Section */}
      <section className="relative z-10 py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4" style={{ color: 'var(--color-text)' }}>
              Awards & <span style={{ color: 'var(--color-accent)' }}>Recognition</span>
            </h2>
            <p className="text-sm sm:text-base lg:text-lg px-4" style={{ color: 'var(--color-text-secondary)' }}>
              Industry recognition for outstanding work and innovation
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {awards.map((award, index) => (
              <motion.div
                key={award.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="h-full"
              >
                {/* Neubrutalism Award Card */}
                <div className="relative w-full h-[280px] neubrutalism-card flex"
                  style={{
                    backgroundColor: 'var(--color-surface)',
                  }}
                >
                  {/* Image Section - FIXED WIDTH */}
                  <div className="relative w-[120px] border-r-4 border-black overflow-hidden flex-shrink-0">
                    <Image
                      src={award.image}
                      alt={award.title}
                      fill
                      className="object-cover"
                      sizes="120px"
                    />
                  </div>
                  
                  {/* Content Section - FLEXIBLE */}
                  <div className="p-6 flex-1 flex flex-col justify-center">
                    {/* Badge & Position - FIXED HEIGHT */}
                    <div className="h-[40px] flex items-center gap-3 mb-4">
                      <span className="text-2xl">🏆</span>
                      <div className="bg-yellow-400 border-2 border-black px-3 py-1 font-black text-black text-xs shadow-[var(--shadow-neubrutalism-medium)] uppercase tracking-wide">
                        {award.position}
                      </div>
                    </div>
                    
                    {/* Title - FIXED HEIGHT */}
                    <div className="h-[50px] mb-3">
                      <h3 className="text-xl font-black uppercase tracking-tight leading-tight line-clamp-2" style={{ color: 'var(--color-text)' }}>
                        {award.title}
                      </h3>
                    </div>
                    
                    {/* Event & Year - FIXED HEIGHT */}
                    <div className="h-[40px] mb-4 flex flex-col justify-center">
                      <p className="text-sm font-black text-orange-400 uppercase tracking-wide line-clamp-1">
                        {award.event}
                      </p>
                      <p className="text-sm font-bold" style={{ color: 'var(--color-text-secondary)' }}>
                        {award.year}
                      </p>
                    </div>
                    
                    {/* Description - FLEXIBLE */}
                    <div className="flex-1">
                      <p className="text-sm leading-relaxed font-medium line-clamp-3" style={{ color: 'var(--color-text-secondary)' }}>
                        {award.description}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4" style={{ color: 'var(--color-text)' }}>
              Career <span style={{ color: 'var(--color-accent)' }}>Highlights</span>
            </h2>
            <p className="text-sm sm:text-base px-4" style={{ color: 'var(--color-text-secondary)' }}>
              Key metrics that define my professional journey
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
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
              >
                {/* Neubrutalism Stats Card */}
                <div className="relative w-full h-[200px] neubrutalism-card flex flex-col"
                  style={{
                    backgroundColor: 'var(--color-surface)',
                  }}
                >
                  {/* Number Section - FIXED HEIGHT */}
                  <div className="p-4 border-b-4 border-black h-[100px] flex items-center justify-center flex-shrink-0">
                    <div className="text-3xl md:text-4xl font-black text-orange-400 transition-transform duration-300 group-hover:scale-110 uppercase tracking-wider">
                      {stat.number}
                    </div>
                  </div>
                  
                  {/* Content Section - FLEXIBLE */}
                  <div className="p-4 flex-1 flex flex-col justify-center text-center">
                    {/* Label - FIXED HEIGHT */}
                    <div className="h-[40px] mb-2 flex items-center justify-center">
                      <p className="text-sm font-black uppercase tracking-wide leading-tight line-clamp-2" style={{ color: 'var(--color-text)' }}>
                        {stat.label}
                      </p>
                    </div>
                    
                    {/* Description - FLEXIBLE */}
                    <div className="flex-1 hidden md:flex items-center">
                      <p className="text-xs leading-tight font-medium line-clamp-3" style={{ color: 'var(--color-text-secondary)' }}>
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
      
      <Footer />
    </main>
  );
}
