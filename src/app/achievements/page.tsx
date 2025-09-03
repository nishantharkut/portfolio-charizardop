"use client";

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import StarBorder from '../components/ui/StarBorder';
import SplashCursorWrapper from '../components/ui/SplashCursorWrapper';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  getAchievements, 
  getCertifications, 
  getAwards, 
  getFeaturedAchievements
} from '../../data';
import PixelBlast from '../components/ui/PixelBlast';
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
      <SplashCursorWrapper SPLAT_RADIUS={0.05} />
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* FaultyTerminal Background - Hero Section Only */}
        <div className="absolute inset-0 z-0">
          <PixelBlast
    variant="circle"
    pixelSize={2}
    color="#ff8c42"
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
            tint="#ff8c42"
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
            <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold mb-6 drop-shadow-2xl" style={{ color: 'var(--color-text)' }}>
              My <span className="text-orange-500">Achievements</span>
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8 drop-shadow-lg" style={{ color: 'var(--color-text-secondary)' }}>
              A showcase of milestones, awards, and recognition that mark my journey as a creative technologist
            </p>
            
            {/* Updated button container with consistent sizing and View All button */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
              <Link 
                href="/"
                className="px-6 py-3 neubrutalism-button font-black uppercase tracking-wide text-center inline-flex items-center gap-2 text-sm w-fit"
                style={{ 
                  backgroundColor: 'var(--color-surface)',
                  borderColor: 'var(--color-accent)',
                  color: 'var(--color-text)'
                }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Home
              </Link>
              
              <motion.a 
                href="#achievements"
                onClick={(e) => {
                  e.preventDefault();
                  const achievementsSection = document.getElementById('achievements');
                  if (achievementsSection) {
                    achievementsSection.scrollIntoView({
                      behavior: 'smooth',
                      block: 'start'
                    });
                  }
                }}
                className="px-6 py-3 neubrutalism-button font-black uppercase tracking-wide text-center inline-flex items-center gap-2 text-sm w-fit"
                style={{ 
                  borderColor: 'var(--color-accent)',
                  backgroundColor: 'var(--color-accent)',
                  color: 'var(--color-button-text)'
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                View All
                <motion.svg 
                  className="w-4 h-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  animate={{ y: [0, 2, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </motion.svg>
              </motion.a>
            </div>
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
              Significant milestones and recognition throughout my career
            </p>
          </motion.div>

          {/* Featured Achievement Cards */}
          <div className="space-y-6 sm:space-y-8 lg:space-y-12 mb-12 sm:mb-16 lg:mb-20">
            {featuredAchievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                {/* Mobile-Optimized Featured Achievement Card */}
                <div className="relative neubrutalism-card overflow-hidden h-[500px] sm:h-[520px] lg:h-[540px]"
                  style={{
                    backgroundColor: 'var(--color-surface)',
                  }}
                >
                  {/* Mobile: Stack vertically, Desktop: Side by side */}
                  <div className="flex flex-col lg:grid lg:grid-cols-5 lg:gap-0 h-full">
                    {/* Image Section - Responsive height */}
                    <div className="relative h-48 sm:h-56 lg:h-80 lg:col-span-2 border-b-4 lg:border-b-0 lg:border-r-4 border-black">
                      <Image
                        src={achievement.image}
                        alt={achievement.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 40vw"
                        priority={index === 0}
                      />
                      <div className="absolute top-3 left-3 text-2xl sm:text-3xl lg:text-4xl z-10 drop-shadow-lg">
                        {achievement.badge}
                      </div>
                      <div className="absolute top-3 right-3 bg-yellow-400 border-2 border-black px-2 py-1 sm:px-3 sm:py-2 font-black text-black text-xs sm:text-sm shadow-[var(--shadow-neubrutalism-medium)] uppercase tracking-wide z-10">
                        FEATURED
                      </div>
                    </div>

                    {/* Content Section - Better mobile padding */}
                    <div className="p-4 sm:p-6 lg:p-8 lg:col-span-3 flex flex-col justify-center">
                      <div className="mb-3 sm:mb-4">
                        <p className="text-orange-500 text-xs sm:text-sm uppercase tracking-wider font-black mb-2">
                          {achievement.category}
                        </p>
                        <h3 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-black uppercase tracking-tight mb-3 sm:mb-4 leading-tight" style={{ color: 'var(--color-text)' }}>
                          {achievement.title}
                        </h3>
                      </div>
                      
                      <p className="text-sm sm:text-base lg:text-lg mb-4 sm:mb-6 leading-relaxed font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                        {achievement.description}
                      </p>
                      
                      <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                        <h4 className="font-black text-xs sm:text-sm uppercase tracking-wide" style={{ color: 'var(--color-text)' }}>
                          KEY IMPACT
                        </h4>
                        <ul className="space-y-2 sm:space-y-3">
                          {achievement.impact.slice(0, 3).map((impact, i) => (
                            <li key={i} className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                              <span className="w-2 h-2 bg-orange-400 border border-black mt-2 flex-shrink-0"></span>
                              <span className="leading-relaxed">{impact}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="flex flex-col gap-3 sm:gap-4 pt-3 sm:pt-4 border-t-4 border-black">
                        <div className="flex flex-col gap-2">
                          <span className="text-sm sm:text-base font-black uppercase tracking-wide" style={{ color: 'var(--color-text)' }}>
                            {achievement.organization}
                          </span>
                          <span className="text-orange-500 text-sm sm:text-base font-black uppercase tracking-wide">
                            {achievement.date}
                          </span>
                        </div>
                        {achievement.link && (
                          <a
                            href={achievement.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full sm:w-auto px-4 py-3 sm:px-6 lg:px-8 neubrutalism-button bg-orange-500 hover:bg-orange-600 text-black font-black uppercase tracking-wide text-center border-2 border-black shadow-[var(--shadow-neubrutalism)] inline-flex items-center justify-center gap-2 text-sm sm:text-base"
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
                Complete collection of professional milestones
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {achievements.filter(a => !a.featured).map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="h-full"
                >
                  {/* Mobile-Optimized Achievement Card */}
                  <div
                    className="relative w-full h-[440px] sm:h-[460px] lg:h-[480px] neubrutalism-card flex flex-col p-4 sm:p-5 lg:p-6"
                    style={{
                      backgroundColor: 'var(--color-surface)',
                    }}
                  >
                    {/* Header Section - Better mobile sizing */}
                    <div className="pb-4 border-b-4 border-black flex items-center justify-between flex-shrink-0 min-h-[60px] sm:min-h-[70px]">
                      <div className="text-2xl sm:text-3xl lg:text-4xl">{achievement.badge}</div>
                      <div className="bg-orange-400 border-2 border-black px-2 py-1 sm:px-3 sm:py-2 font-black text-black text-xs sm:text-sm shadow-[var(--shadow-neubrutalism-medium)] uppercase tracking-wide">
                        {achievement.date}
                      </div>
                    </div>
                    
                    {/* Content Section - Better spacing */}
                    <div className="flex-1 flex flex-col pt-4 space-y-3 sm:space-y-4">
                      {/* Category & Title */}
                      <div>
                        <p className="text-orange-500 text-xs sm:text-sm uppercase tracking-wider font-black mb-2">
                          {achievement.category}
                        </p>
                        <h3 className="text-base sm:text-lg lg:text-xl font-black uppercase tracking-tight leading-tight" style={{ color: 'var(--color-text)' }}>
                          {achievement.title}
                        </h3>
                      </div>
                      
                      {/* Description */}
                      <div className="flex-1 min-h-0">
                        <p className="text-sm sm:text-base leading-relaxed font-medium line-clamp-3 overflow-hidden" style={{ color: 'var(--color-text-secondary)' }}>
                          {achievement.description}
                        </p>
                      </div>
                      
                      {/* Organization */}
                      {achievement.organization && (
                        <div>
                          <p className="text-xs sm:text-sm font-black text-orange-400 uppercase tracking-wide">
                            {achievement.organization}
                          </p>
                        </div>
                      )}

                      {/* Impact Section */}
                      <div className="mt-auto border-t-4 border-black pt-3 sm:pt-4">
                        <h4 className="text-xs sm:text-sm uppercase tracking-wide font-black mb-2 sm:mb-3" style={{ color: 'var(--color-text)' }}>
                          KEY IMPACT
                        </h4>
                        <div className="space-y-2">
                          {achievement.impact.slice(0, 2).map((impact, i) => (
                            <div key={i} className="flex items-start gap-2 text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
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

      {/* Certifications Section - Fixed with proper globals.css colors */}
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
              Professional <span style={{ color: 'var(--color-accent)' }}>Certifications</span>
            </h2>
            <p className="text-sm sm:text-base lg:text-lg px-2 max-w-3xl mx-auto" style={{ color: 'var(--color-text-secondary)' }}>
              Continuous learning and validation of technical expertise across industry-leading platforms
            </p>
          </motion.div>

          {/* Grid Layout - Using proper responsive grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {certifications.map((cert, index) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -4, transition: { duration: 0.3 } }}
                className="h-full group"
              >
                {/* Certification Card with proper neubrutalism styling */}
                <div className="relative w-full h-[420px] sm:h-[440px] lg:h-[460px] neubrutalism-card flex flex-col overflow-hidden"
                  style={{
                    backgroundColor: 'var(--color-surface)',
                    borderColor: 'var(--color-accent)'
                  }}
                >
                  {/* Header Section with proper colors */}
                  <div className="relative p-3 sm:p-4 lg:p-5 border-b-4 border-black"
                    style={{ backgroundColor: 'var(--color-surface-elevated)' }}>
                    
                    {/* Year Badge - using proper globals colors */}
                    <div className="absolute top-2 right-2">
                      <div className="px-2 py-1 sm:px-3 sm:py-1 font-black text-black text-xs sm:text-sm shadow-[var(--shadow-neubrutalism-small)] uppercase tracking-wide border-2 border-black transform rotate-2 group-hover:rotate-3 transition-transform duration-300"
                        style={{ backgroundColor: 'var(--color-accent)' }}>
                        {cert.date}
                      </div>
                    </div>

                    {/* Verification Badge */}
                    <div className="absolute top-2 left-2">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 bg-green-400 border-2 border-black rounded-full flex items-center justify-center shadow-[var(--shadow-neubrutalism-small)]">
                        <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-black" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>

                    {/* Company Logo */}
                    <div className="flex justify-center pt-2 sm:pt-3">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 relative group-hover:scale-105 transition-transform duration-300">
                        <Image
                          src={cert.image}
                          alt={cert.name}
                          fill
                          className="object-contain"
                          sizes="(max-width: 640px) 48px, (max-width: 1024px) 64px, 80px"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Content Section */}
                  <div className="flex-1 flex flex-col p-3 sm:p-4 lg:p-5 space-y-3 sm:space-y-4">
                    {/* Title & Issuer */}
                    <div className="text-center">
                      <h3 className="text-sm sm:text-base lg:text-lg font-black uppercase tracking-tight leading-tight mb-2" style={{ color: 'var(--color-text)' }}>
                        {cert.name}
                      </h3>
                      <div className="inline-flex items-center gap-2 px-2 py-1 sm:px-3 sm:py-1 border-2 border-black shadow-[var(--shadow-neubrutalism-small)]"
                        style={{ 
                          backgroundColor: 'var(--color-accent)',
                          color: 'var(--color-button-text)'
                        }}>
                        <span className="text-xs sm:text-sm font-black uppercase tracking-wide">
                          {cert.issuer}
                        </span>
                      </div>
                    </div>
                    
                    {/* Skills Section */}
                    <div className="flex-1">
                      <div className="mb-3">
                        <h4 className="text-xs sm:text-sm font-black uppercase tracking-wide mb-2 text-center" style={{ color: 'var(--color-text)' }}>
                          SKILLS VALIDATED
                        </h4>
                      </div>
                      
                      <div className="space-y-1.5 sm:space-y-2">
                        {cert.skills.slice(0, 4).map((skill, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: index * 0.1 + i * 0.1 }}
                            className="flex items-center gap-2 p-1.5 sm:p-2 border-2 border-black shadow-[var(--shadow-neubrutalism-small)] transition-colors duration-300"
                            style={{ 
                              backgroundColor: 'var(--color-surface-elevated)',
                              borderColor: 'black'
                            }}
                          >
                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--color-accent)' }}></div>
                            <span className="text-xs sm:text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
                              {skill}
                            </span>
                          </motion.div>
                        ))}
                        
                        {/* Always render the extra skills placeholder to maintain consistent height */}
                        <div className="flex items-center justify-center p-1.5 sm:p-2 border-2 border-black shadow-[var(--shadow-neubrutalism-small)]"
                          style={{ 
                            backgroundColor: cert.skills.length > 4 ? 'var(--color-surface-hover)' : 'transparent',
                            borderColor: cert.skills.length > 4 ? 'black' : 'transparent',
                            color: cert.skills.length > 4 ? 'var(--color-text)' : 'transparent'
                          }}>
                          <span className="text-xs sm:text-sm font-bold">
                            {cert.skills.length > 4 ? `+${cert.skills.length - 4} more skills` : 'placeholder'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Credential ID Section */}
                    {cert.credentialId && (
                      <div className="mt-auto pt-2 sm:pt-3 border-t-4 border-black">
                        <div className="text-center">
                          <p className="text-xs uppercase tracking-wider font-black mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
                            Credential ID
                          </p>
                          <div className="inline-flex items-center gap-1.5 px-2 py-1 sm:px-3 sm:py-1.5 border-2 border-black shadow-[var(--shadow-neubrutalism-small)]"
                            style={{ 
                              backgroundColor: 'var(--color-surface-elevated)',
                              color: 'var(--color-text)'
                            }}>
                            <svg className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: 'var(--color-text-secondary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <code className="text-xs sm:text-sm font-mono font-semibold">
                              {cert.credentialId}
                            </code>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Call to Action with proper styling */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-center mt-12 sm:mt-16"
          >
            <div className="inline-flex items-center gap-3 px-6 py-4 border-2 border-black shadow-[var(--shadow-neubrutalism-medium)]"
              style={{ 
                backgroundColor: 'var(--color-surface-elevated)',
                color: 'var(--color-text)'
              }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center border-2 border-black"
                style={{ backgroundColor: 'var(--color-accent)' }}>
                <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="text-sm font-black" style={{ color: 'var(--color-text)' }}>
                  Industry-Validated Skills
                </p>
                <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                  Certified expertise from leading technology companies
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

     {/* Awards & Recognition Section - Clean & Minimal */}
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
              Industry recognition for outstanding work and innovation
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            {awards.map((award, index) => (
              <motion.div
                key={award.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="h-full"
              >
                {/* Clean Award Card */}
                <div className="relative w-full h-[320px] sm:h-[340px] lg:h-[360px] neubrutalism-card flex flex-col"
                  style={{
                    backgroundColor: 'var(--color-surface)',
                  }}
                >
                  {/* Header with Trophy and Position */}
                  <div className="p-4 sm:p-5 lg:p-6 border-b-4 border-black">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl sm:text-3xl">🏆</span>
                        <div className="bg-yellow-400 border-2 border-black px-3 py-1 font-black text-black text-sm shadow-[var(--shadow-neubrutalism-small)] uppercase tracking-wide">
                          {award.position}
                        </div>
                      </div>
                      <div className="text-sm sm:text-base font-bold" style={{ color: 'var(--color-text-secondary)' }}>
                        {award.year}
                      </div>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-4 sm:p-5 lg:p-6 flex-1 flex flex-col">
                    {/* Title */}
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-black uppercase tracking-tight leading-tight mb-3" style={{ color: 'var(--color-text)' }}>
                      {award.title}
                    </h3>
                    
                    {/* Event */}
                    <p className="text-sm sm:text-base font-black uppercase tracking-wide mb-4" style={{ color: 'var(--color-accent)' }}>
                      {award.event}
                    </p>
                    
                    {/* Description */}
                    <div className="flex-1 min-h-0">
                      <p className="text-sm sm:text-base leading-relaxed font-medium line-clamp-2 overflow-hidden" style={{ color: 'var(--color-text-secondary)' }}>
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
      <section className="relative z-10 py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
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
              >
                {/* Mobile-Optimized Stats Card */}
                <div className="relative w-full h-[160px] sm:h-[180px] lg:h-[200px] neubrutalism-card flex flex-col"
                  style={{
                    backgroundColor: 'var(--color-surface)',
                  }}
                >
                  {/* Number Section - Better mobile sizing */}
                  <div className="p-2 sm:p-3 border-b-4 border-black min-h-[50px] sm:min-h-[60px] lg:min-h-[70px] flex items-center justify-center flex-shrink-0">
                    <div className="text-xl sm:text-2xl lg:text-3xl font-black text-orange-400 transition-transform duration-300 group-hover:scale-110 uppercase tracking-wider">
                      {stat.number}
                    </div>
                  </div>
                  
                  {/* Content Section - Better mobile spacing */}
                  <div className="p-2 sm:p-3 flex-1 flex flex-col justify-center text-center overflow-hidden">
                    {/* Label - Better mobile typography */}
                    <div className="mb-1 sm:mb-2">
                      <p className="text-xs sm:text-sm lg:text-base font-black uppercase tracking-wide leading-tight" style={{ color: 'var(--color-text)' }}>
                        {stat.label}
                      </p>
                    </div>
                    
                    {/* Description - Mobile responsive */}
                    <div className="flex-1 flex items-center min-h-0">
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
      
      <Footer />
    </main>
  );
}
