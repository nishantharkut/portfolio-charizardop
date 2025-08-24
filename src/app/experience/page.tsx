"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { gsap, ScrollTrigger } from "@/utils/gsap";
import Link from "next/link";
import { FaRocket, FaStar, FaUsers, FaBolt } from 'react-icons/fa';
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import ScrollVelocity from "../components/ui/ScrollVelocity";
import SplashCursorWrapper from "../components/ui/SplashCursorWrapper";
import { 
  getExperienceData, 
  getCoreSkills, 
  getCareerHighlights, 
  getTechnologyEvolution
} from '../../data';

// Lazy load FaultyTerminal with proper loading state
import { LazyFaultyTerminal } from '../../components/lazy/LazyBoundaries';

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Icon mapping
const iconMap = {
  FaRocket,
  FaStar,
  FaUsers,
  FaBolt
};

export default function ExperiencePage() {
  const experienceData = getExperienceData();
  const skills = getCoreSkills();
  const highlights = getCareerHighlights();
  const technologyEvolution = getTechnologyEvolution();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  const sectionRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const sparkRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const isMobile = window.innerWidth <= 768;

      // Timeline growth animation
      if (isMobile) {
        gsap.fromTo(
          timelineRef.current,
          { height: "0%" },
          {
            height: "calc(100% - 32px)",
            duration: 1.2,
            ease: "power1.inOut",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
              end: "bottom 20%",
              scrub: 1,
              refreshPriority: 1
            },
          }
        );

        gsap.fromTo(
          sparkRef.current,
          { top: "0%", scale: 0.8, opacity: 0.5 },
          {
            top: "calc(100% - 16px)",
            scale: 1.1,
            opacity: 1,
            duration: 1.2,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
              end: "bottom 20%",
              scrub: 0.7,
              refreshPriority: 1
            },
          }
        );
      } else {
        gsap.fromTo(
          timelineRef.current,
          { height: "0%" },
          {
            height: "100%",
            duration: 1.5,
            ease: "power1.inOut",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 70%",
              end: "bottom 30%",
              scrub: 1,
              refreshPriority: 1
            },
          }
        );
        gsap.fromTo(
          sparkRef.current,
          { top: "0%", scale: 0.8, opacity: 0.5 },
          {
            top: "100%",
            scale: 1,
            opacity: 1,
            duration: 1.5,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 70%",
              end: "bottom 30%",
              scrub: 0.5,
              refreshPriority: 1
            },
          }
        );
      }

      // Items fade in as you scroll
      itemsRef.current.forEach((item, index) => {
        if (item) {
          gsap.fromTo(
            item,
            {
              opacity: 0,
              y: 20,
            },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: "power2.out",
              scrollTrigger: {
                trigger: item,
                start: "top 85%",
                end: "bottom 15%",
                toggleActions: "play none none reverse",
                refreshPriority: 1,
                invalidateOnRefresh: true
              },
            }
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <main className="relative w-full min-h-screen overflow-x-hidden" style={{ color: 'var(--color-text)' }}>
      {/* <SplashCursor SPLAT_RADIUS={0.05} /> */}
      <SplashCursorWrapper SPLAT_RADIUS={0.05} />
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden pt-16 md:pt-0">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <LazyFaultyTerminal
            scale={2}
            gridMul={[3, 2]}
            digitSize={1.2}
            timeScale={0.5}
            scanlineIntensity={0.3}
            glitchAmount={0.8}
            flickerAmount={0.6}
            noiseAmp={0.9}
            chromaticAberration={1.5}
            curvature={0.1}
            tint="#ff8c42"
            mouseReact={true}
            mouseStrength={0.3}
            brightness={0.6}
          />
        </div>

        {/* Subtle Text Background */}
        <div className="absolute inset-0 opacity-5 z-10">
          <ScrollVelocity
            texts={["EXPERIENCE", "INNOVATION", "LEADERSHIP", "DEVELOPMENT"]}
            velocity={30}
            className="font-bold text-4xl md:text-6xl"
            scrollerStyle={{ color: 'var(--color-text)', opacity: 0.03 }}
            parallaxClassName="py-16"
            scrollerClassName="tracking-wider"
          />
        </div>
        
        {/* Main Content */}
        <div className="relative z-20 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {/* Badge with Neubrutalism Style */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="inline-flex items-center gap-2 px-4 py-2 mb-8 neubrutalism-button"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  borderColor: 'var(--color-accent)',
                }}
              >
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-black uppercase tracking-wide" style={{ color: 'var(--color-text)' }}>
                  7+ Years of Innovation
                </span>
              </motion.div>

              {/* Clean Title */}
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
                style={{ color: '#ffffff' }}
              >
                Professional
                <br />
                <span className="relative">
                  <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                    Journey
                  </span>
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 1, delay: 1.2 }}
                    className="absolute bottom-1 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-orange-600 origin-left"
                  />
                </span>
              </motion.h1>
              
              {/* Simple Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="text-lg sm:text-xl md:text-2xl max-w-4xl mx-auto mb-10 leading-relaxed"
                style={{ color: '#ffffff' }}
              >
                From junior developer to <span className="text-orange-400 font-semibold">technical leader</span>, 
                explore the milestones and achievements that shaped my career in 
                <span className="text-orange-400 font-semibold"> creative web development</span>
              </motion.p>
              
              {/* Neubrutalism Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.0 }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              >
                <Link 
                  href="/"
                  className="inline-flex items-center gap-2 px-6 py-3 neubrutalism-button font-black uppercase tracking-wide"
                  style={{ 
                    backgroundColor: 'var(--color-surface)',
                    borderColor: 'var(--color-accent)',
                    color: 'var(--color-text)'
                  }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Home
                </Link>
                <a 
                  href="#experience-timeline"
                  className="inline-flex items-center gap-2 px-6 py-3 neubrutalism-button border-orange-500 bg-orange-500 text-black font-black uppercase tracking-wide"
                >
                  View Experience
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </a>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Experience Timeline */}
      <section 
        ref={sectionRef}
        className="relative z-10 w-full py-12 sm:py-16 md:py-20 px-4"
        id="experience-timeline"
      >
        <div className="max-w-6xl mx-auto">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 sm:mb-16 md:mb-20"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
              Professional <span className="text-orange-500">Experience</span>
            </h2>
            <p className="text-base sm:text-lg max-w-2xl mx-auto px-4" style={{ color: 'var(--color-text-secondary)' }}>
              A journey through my career highlights and the impact I've made
            </p>
          </motion.div>

          {/* Mobile Experience Cards - Full Viewport Optimized */}
          <div className="block md:hidden">
            <div className="space-y-8 pt-4">
              {experienceData.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="w-full scroll-mt-20"
                >
                  {/* Neubrutalism Experience Card - Mobile */}
                  <div className="relative w-full min-h-[70vh] neubrutalism-card group"
                    style={{
                      backgroundColor: 'var(--color-surface)',
                      borderColor: 'var(--color-accent)',
                    }}
                  >
                    <div className="p-6 relative overflow-hidden min-h-[70vh] flex flex-col justify-center">
                      {/* Hover Gradient Effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      <div className="relative z-10 space-y-6">
                        {/* Year Badge - Top Center */}
                        <div className="text-center">
                          <motion.div 
                            className="neubrutalism-button"
                            whileHover={{ scale: 1.05, boxShadow: "2px 2px 0px 0px rgba(0,0,0,1)" }}
                            transition={{ duration: 0.3 }}
                          >
                            <span className="text-2xl font-black tracking-tight">
                              {item.year}
                            </span>
                            {item.year === "NOW" && (
                              <motion.div 
                                className="ml-2 w-2.5 h-2.5 bg-green-400 rounded-full shadow-lg"
                                animate={{ 
                                  scale: [1, 1.3, 1],
                                  opacity: [1, 0.6, 1],
                                  boxShadow: ["0 0 0 0 rgba(74, 222, 128, 0.7)", "0 0 0 4px rgba(74, 222, 128, 0)", "0 0 0 0 rgba(74, 222, 128, 0)"]
                                }}
                                transition={{ 
                                  duration: 2,
                                  repeat: Infinity,
                                  ease: "easeInOut"
                                }}
                              />
                            )}
                          </motion.div>
                        </div>
                        
                        {/* Position & Company - Center */}
                        <div className="text-center space-y-3">
                          <h3 className="text-xl font-black leading-tight group-hover:text-orange-300 transition-colors duration-300 uppercase tracking-wide" style={{ color: 'var(--color-text)' }}>
                            {item.position}
                          </h3>
                          
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-6 h-6 border-2 border-orange-500/60 bg-orange-500/30 flex items-center justify-center flex-shrink-0">
                              <div className="w-3 h-3 bg-orange-500 rounded-none"></div>
                            </div>
                            <h4 className="text-lg font-black bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent uppercase tracking-wide">
                              {item.company}
                            </h4>
                          </div>
                          
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-2 h-2 bg-orange-500 rounded-none"></div>
                            <p className="text-sm font-black tracking-wide opacity-90 uppercase" style={{ color: 'var(--color-text-secondary)' }}>
                              {item.duration}
                            </p>
                          </div>
                        </div>

                        {/* Description - Center */}
                        <div className="text-center px-2">
                          <p className="text-sm leading-relaxed group-hover:text-opacity-95 transition-all duration-300" style={{ color: 'var(--color-text-secondary)' }}>
                            {item.description}
                          </p>
                        </div>

                        {/* Technologies Section - Center */}
                        <div className="text-center">
                          <div className="mb-3">
                            <h5 className="font-black text-xs uppercase tracking-[0.2em] opacity-90 flex items-center justify-center gap-2" style={{ color: 'var(--color-text)' }}>
                              <span className="w-2 h-2 bg-orange-500 rounded-none"></span>
                              Technologies Used
                            </h5>
                          </div>
                          <div className="flex flex-wrap gap-2 justify-center">
                            {item.technologies.map((tech, i) => (
                              <motion.span 
                                key={i} 
                                className="px-3 py-1.5 border-2 border-orange-500 bg-orange-500/20 text-orange-300 text-xs font-black hover:bg-orange-500 hover:text-black transition-all duration-300 cursor-default shadow-[var(--shadow-neubrutalism)] hover:shadow-[var(--shadow-neubrutalism-hover-small)] hover:translate-x-[2px] hover:translate-y-[2px] uppercase tracking-wide"
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                custom={i}
                              >
                                {tech}
                              </motion.span>
                            ))}
                          </div>
                        </div>

                        {/* Key Achievements - Center */}
                        <div className="text-center">
                          <div className="mb-3">
                            <h5 className="font-black text-xs uppercase tracking-[0.2em] opacity-90 flex items-center justify-center gap-2" style={{ color: 'var(--color-text)' }}>
                              <span className="w-2 h-2 bg-orange-500 rounded-none"></span>
                              Key Achievements
                            </h5>
                          </div>
                          <div className="space-y-2">
                            {item.achievements.map((achievement, i) => (
                              <motion.div
                                key={i}
                                className="flex items-start justify-center gap-2 text-sm"
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                              >
                                <div className="w-2 h-2 bg-orange-500 rounded-none mt-2 flex-shrink-0"></div>
                                <span className="text-left max-w-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>{achievement}</span>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Desktop Timeline */}
          <div className="hidden md:block relative">
            {/* Timeline Line */}
            <div 
              ref={timelineRef}
              className="absolute left-1/2 -translate-x-1/2 w-[2px] h-full bg-gradient-to-b from-[#ff9a1c] to-transparent"
            />
            
            {/* Spark Effect */}
            <div 
              ref={sparkRef}
              className="absolute left-1/2 -translate-x-1/2 w-3 h-3 z-10"
              style={{
                background: '#ff9a1c',
                borderRadius: '50%',
                filter: 'blur(1px)',
                boxShadow: '0 0 8px 2px rgba(255, 154, 28, 0.8), 0 0 12px 5px rgba(255, 140, 64, 0.6)',
                animation: 'sparkle 0.6s ease-out infinite alternate'
              }}
            />

            {/* Experience Items */}
            <div className="relative">
              {experienceData.map((item, index) => (
                <div
                  key={item.id}
                  ref={(el) => { itemsRef.current[index] = el; }}
                  className={`mb-8 sm:mb-10 md:mb-12 relative ${
                    `pl-14 sm:pl-12 md:pl-0 ${
                      index % 2 === 0 
                      ? 'md:text-right md:pr-[calc(50%+40px)]' 
                      : 'md:text-left md:pl-[calc(50%+40px)]'
                    }`
                  }`}
                >
                  {/* Timeline Dot */}
                  <div className="absolute left-[16px] sm:left-3 md:left-1/2 md:-translate-x-1/2 w-3 sm:w-4 h-3 sm:h-4 bg-orange-500 rounded-full border-2 sm:border-4 border-gray-900 z-10 shadow-lg" 
                       style={{ borderColor: 'var(--color-bg-start)' }} />
                  
                  {/* Neubrutalism Desktop Experience Card */}
                  <div className="relative w-full min-h-[400px] neubrutalism-card group"
                    style={{
                      backgroundColor: 'var(--color-surface)',
                      borderColor: 'var(--color-accent)',
                    }}
                  >
                    <div className="p-4 md:p-6 relative overflow-hidden h-full">
                      {/* Hover Gradient Effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      <div className="relative z-10 h-full flex flex-col justify-between">
                        {/* Enhanced Card Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                            {/* Year Badge */}
                            <motion.div 
                              className={`neubrutalism-button ${index % 2 === 0 ? 'md:ml-auto' : ''}`}
                              whileHover={{ scale: 1.05, boxShadow: "2px 2px 0px 0px rgba(0,0,0,1)" }}
                              transition={{ duration: 0.3 }}
                            >
                              <span className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight">
                                {item.year}
                              </span>
                              {item.year === "NOW" && (
                                <motion.div 
                                  className="ml-1.5 sm:ml-2 w-2 sm:w-2.5 h-2 sm:h-2.5 bg-green-400 rounded-full shadow-lg"
                                  animate={{ 
                                    scale: [1, 1.3, 1],
                                    opacity: [1, 0.6, 1],
                                    boxShadow: ["0 0 0 0 rgba(74, 222, 128, 0.7)", "0 0 0 4px rgba(74, 222, 128, 0)", "0 0 0 0 rgba(74, 222, 128, 0)"]
                                  }}
                                  transition={{ 
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                  }}
                                />
                              )}
                            </motion.div>
                            
                            {/* Position & Company */}
                            <div className="space-y-1.5 sm:space-y-2 mb-3">
                              <h3 className="text-base sm:text-lg md:text-xl font-black leading-tight group-hover:text-orange-300 transition-colors duration-300 uppercase tracking-wide" style={{ color: 'var(--color-text)' }}>
                                {item.position}
                              </h3>
                              
                              <div className="flex items-center gap-2 flex-wrap">
                                {/* Company Logo Placeholder */}
                                <div className="w-5 sm:w-6 h-5 sm:h-6 border-2 border-orange-500/60 bg-orange-500/30 flex items-center justify-center flex-shrink-0">
                                  <div className="w-2.5 sm:w-3 h-2.5 sm:h-3 bg-orange-500 rounded-none"></div>
                                </div>
                                <h4 className="text-sm sm:text-base md:text-lg font-black bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent uppercase tracking-wide">
                                  {item.company}
                                </h4>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-orange-500 rounded-none"></div>
                                <p className="text-xs sm:text-sm font-black tracking-wide opacity-90 uppercase" style={{ color: 'var(--color-text-secondary)' }}>
                                  {item.duration}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Description */}
                        <div className={`mb-5 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                          <div className="relative">
                            <div className={`absolute top-0 ${index % 2 === 0 ? 'right-0' : 'left-0'} w-8 h-1 bg-orange-500 mb-3`}></div>
                            <p className="text-sm md:text-base leading-relaxed pt-4 group-hover:text-opacity-95 transition-all duration-300 font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                              {item.description}
                            </p>
                          </div>
                        </div>

                        {/* Technologies Section */}
                        <div className={`mb-4 sm:mb-5 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                          <div className="mb-2 sm:mb-3">
                            <h5 className="font-black text-xs uppercase tracking-[0.2em] opacity-90 flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
                              <span className="w-2 h-2 bg-orange-500 rounded-none"></span>
                              Technologies Used
                            </h5>
                          </div>
                          <div className={`flex flex-wrap gap-1.5 sm:gap-2 ${index % 2 === 0 ? 'md:justify-end' : 'md:justify-start'}`}>
                            {item.technologies.map((tech, i) => (
                              <motion.span 
                                key={i} 
                                className="px-2 sm:px-3 py-1 sm:py-1.5 border-2 border-orange-500 bg-orange-500/20 text-orange-300 text-xs font-black hover:bg-orange-500 hover:text-black transition-all duration-300 cursor-default shadow-[var(--shadow-neubrutalism)] hover:shadow-[var(--shadow-neubrutalism-hover-small)] hover:translate-x-[2px] hover:translate-y-[2px] uppercase tracking-wide"
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                custom={i}
                              >
                                {tech}
                              </motion.span>
                            ))}
                          </div>
                        </div>

                        {/* Key Achievements Section */}
                        <div className={`${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                          <div className="mb-2 sm:mb-3">
                            <h5 className="font-black text-xs uppercase tracking-[0.2em] opacity-90 flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
                              <span className="w-2 h-2 bg-orange-500 rounded-none"></span>
                              Key Achievements
                            </h5>
                          </div>
                          <div className="space-y-2 sm:space-y-2.5">
                            {item.achievements.map((achievement, i) => (
                              <motion.div 
                                key={i} 
                                className={`flex items-start gap-2 sm:gap-3 group/achievement p-1.5 sm:p-2 hover:bg-orange-500/5 transition-all duration-300 ${index % 2 === 0 ? 'md:flex-row-reverse md:text-right' : ''}`}
                                initial={{ opacity: 0, x: index % 2 === 0 ? 30 : -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: i * 0.1 }}
                                whileHover={{ scale: 1.01 }}
                              >
                                <motion.div 
                                  className="flex-shrink-0 w-2 sm:w-2.5 h-2 sm:h-2.5 bg-orange-500 rounded-none mt-0.5 sm:mt-1 shadow-sm group-hover/achievement:shadow-md group-hover/achievement:shadow-orange-500/40 transition-all duration-300"
                                  whileHover={{ 
                                    scale: 1.3,
                                    boxShadow: "0 0 15px rgba(255, 140, 66, 0.5)"
                                  }}
                                  transition={{ duration: 0.2 }}
                                />
                                <span className="text-xs sm:text-sm leading-relaxed group-hover/achievement:text-opacity-100 transition-all duration-300 font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                                  {achievement}
                                </span>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Additional Skills Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8" style={{ color: 'var(--color-text)' }}>
              Core <span className="text-orange-500">Competencies</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {skills.map((skill, index) => (
                <motion.div
                  key={skill}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="h-full"
                >
                  {/* Neubrutalism Skills Card */}
                  <div className="relative w-full h-[80px] neubrutalism-button flex items-center justify-center"
                    style={{
                      backgroundColor: 'var(--color-surface)',
                      borderColor: 'var(--color-accent)',
                    }}
                  >
                    <span className="font-black text-xs sm:text-sm uppercase tracking-wide text-center px-2" style={{ color: 'var(--color-text)' }}>
                      {skill}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Career Highlights Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
              Career <span className="text-orange-500">Highlights</span>
            </h2>
            <p className="text-base sm:text-lg max-w-2xl mx-auto px-4" style={{ color: 'var(--color-text-secondary)' }}>
              Key metrics and achievements throughout my professional journey
            </p>
          </motion.div>

          {/* Mobile View - Simple Grid */}
          <div className="block md:hidden">
            <div className="grid grid-cols-1 gap-6">
              {highlights.map((stat, index) => {
                const IconComponent = iconMap[stat.icon as keyof typeof iconMap];
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="h-full"
                  >
                    {/* Neubrutalism Career Highlights Card - Mobile */}
                    <div className="relative w-full h-[260px] neubrutalism-card"
                      style={{
                        backgroundColor: 'var(--color-surface)',
                        borderColor: 'var(--color-accent)',
                      }}
                    >
                      <div className="flex flex-col items-center justify-center h-full p-6 space-y-4">
                        <div className="text-4xl text-orange-500">
                          {IconComponent && <IconComponent />}
                        </div>
                        <div className="text-4xl font-black bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                          {stat.number}
                        </div>
                        <h3 className="font-black text-lg text-center uppercase tracking-wide" style={{ color: 'var(--color-text)' }}>
                          {stat.label}
                        </h3>
                        <p className="text-sm leading-relaxed text-center line-clamp-3" style={{ color: 'var(--color-text-secondary)' }}>
                          {stat.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Desktop/Tablet View */}
          <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {highlights.map((stat, index) => {
              const IconComponent = iconMap[stat.icon as keyof typeof iconMap];
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="h-full"
                >
                  {/* Neubrutalism Career Highlights Card - Desktop */}
                  <div className="relative w-full h-[280px] neubrutalism-card"
                    style={{
                      backgroundColor: 'var(--color-surface)',
                      borderColor: 'var(--color-accent)',
                    }}
                  >
                    <div className="flex flex-col items-center justify-center h-full p-4 lg:p-6 space-y-3">
                      <div className="text-2xl lg:text-3xl text-orange-500">
                        {IconComponent && <IconComponent />}
                      </div>
                      <div className="text-2xl lg:text-3xl xl:text-4xl font-black bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                        {stat.number}
                      </div>
                      <h3 className="font-black text-sm lg:text-base text-center uppercase tracking-wide" style={{ color: 'var(--color-text)' }}>
                        {stat.label}
                      </h3>
                      <p className="text-xs lg:text-sm leading-relaxed text-center line-clamp-4" style={{ color: 'var(--color-text-secondary)' }}>
                        {stat.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Technologies Evolution Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
              Technology <span className="text-orange-500">Evolution</span>
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--color-text-secondary)' }}>
              How my technical stack has evolved throughout my career
            </p>
          </motion.div>

          <div className="space-y-8">
            {technologyEvolution.map((era, index) => (
              <motion.div
                key={era.period}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="h-full"
              >
                {/* Neubrutalism Technology Evolution Card */}
                <div className="relative w-full min-h-[280px] neubrutalism-card"
                  style={{
                    backgroundColor: 'var(--color-surface)',
                    borderColor: 'var(--color-accent)',
                  }}
                >
                  <div className="flex flex-col md:flex-row gap-4 lg:gap-6 p-4 sm:p-6 lg:p-8 h-full">
                    <div className="md:w-1/3 flex flex-col justify-start">
                      <div className={`inline-block px-3 py-2 rounded-none border-2 border-black bg-gradient-to-r from-orange-400 to-orange-600 text-black text-xs sm:text-sm font-black mb-3 lg:mb-4 shadow-[var(--shadow-neubrutalism)] uppercase tracking-wide`}>
                        {era.period}
                      </div>
                      <h3 className="text-xl sm:text-2xl font-black mb-2 lg:mb-3 uppercase tracking-wide" style={{ color: 'var(--color-text)' }}>
                        {era.title}
                      </h3>
                      <p className="text-sm sm:text-base leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                        {era.description}
                      </p>
                    </div>
                    <div className="md:w-2/3 flex flex-col justify-start">
                      <h4 className="font-black mb-3 lg:mb-4 text-xs sm:text-sm uppercase tracking-wider" style={{ color: 'var(--color-text)' }}>
                        Key Technologies
                      </h4>
                      <div className="flex flex-wrap gap-2 sm:gap-3">
                        {era.technologies.map((tech, i) => (
                          <motion.span
                            key={tech}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.3, delay: 0.6 + i * 0.05 }}
                            className="px-3 py-1.5 sm:px-4 sm:py-2 border-2 border-orange-500 bg-orange-500/20 text-orange-500 text-xs sm:text-sm font-black hover:bg-orange-500 hover:text-black transition-all duration-300 shadow-[var(--shadow-neubrutalism)] hover:shadow-[var(--shadow-neubrutalism-hover-small)] hover:translate-x-[2px] hover:translate-y-[2px] uppercase tracking-wide"
                          >
                            {tech}
                          </motion.span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative z-10 py-16 sm:py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6" style={{ color: 'var(--color-text)' }}>
              Ready to <span className="text-orange-500">Collaborate?</span>
            </h2>
            <p className="text-base sm:text-lg mb-6 sm:mb-8 max-w-2xl mx-auto px-4" style={{ color: 'var(--color-text-secondary)' }}>
              Let's bring your next project to life with innovative technology and creative design
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
              <Link 
                href="/projects"
                className="px-6 sm:px-8 py-3 neubrutalism-button font-black uppercase tracking-wide text-center"
                style={{ 
                  backgroundColor: 'var(--color-surface)',
                  borderColor: 'var(--color-accent)',
                  color: 'var(--color-text)'
                }}
              >
                View My Projects
              </Link>
              <Link 
                href="/about"
                className="px-6 sm:px-8 py-3 neubrutalism-button border-orange-500 bg-orange-500 hover:bg-orange-600 text-black font-black uppercase tracking-wide text-center"
              >
                Get In Touch
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <style jsx>{`
        @keyframes sparkle {
          0% {
            opacity: 0.6;
            transform: translate(-50%, 0) scale(0.8);
            box-shadow: 0 0 5px 2px rgba(255, 154, 28, 0.5), 0 0 8px 4px rgba(255, 140, 64, 0.4);
          }
          100% {
            opacity: 1;
            transform: translate(-50%, 0) scale(1.2);
            box-shadow: 0 0 10px 4px rgba(255, 154, 28, 0.8), 0 0 20px 6px rgba(255, 140, 64, 0.6),
                        0 0 30px 10px rgba(255, 140, 64, 0.2);
          }
        }
      `}</style>
      
      <Footer />
    </main>
  );
}
