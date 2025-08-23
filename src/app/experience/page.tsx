"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { gsap, ScrollTrigger } from "@/utils/gsap";
import Link from "next/link";
import { FaRocket, FaStar, FaUsers, FaBolt } from 'react-icons/fa';
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import ScrollVelocity from "../components/ui/ScrollVelocity";
import StarBorder from "../components/ui/StarBorder";
import SplashCursor from "../components/ui/SplashCursor";
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
      <SplashCursor SPLAT_RADIUS={0.05} />
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
              {/* Simple Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-8 border border-orange-500/20"
              >
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
                  7+ Years of Innovation
                </span>
              </motion.div>

              {/* Clean Title */}
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
                style={{ color: 'var(--color-text)' }}
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
                style={{ color: 'var(--color-text-secondary)' }}
              >
                From junior developer to <span className="text-orange-400 font-semibold">technical leader</span>, 
                explore the milestones and achievements that shaped my career in 
                <span className="text-orange-400 font-semibold"> creative web development</span>
              </motion.p>
              
              {/* Clean Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.0 }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              >
                <Link 
                  href="/"
                  className="inline-flex items-center gap-2 glass-button px-6 py-3 transition-all duration-300 hover:scale-105"
                  style={{ color: 'var(--color-text)' }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Home
                </Link>
                <a 
                  href="#experience-timeline"
                  className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-500/30 px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 backdrop-blur-sm"
                  style={{ color: 'var(--color-text)' }}
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
                  <StarBorder
                    as="div"
                    className="w-full group hover:scale-[1.02] transition-all duration-500 ease-out"
                    color="#ff8c42"
                    speed="6s"
                    style={{
                      backdropFilter: 'blur(20px)',
                      border: '1px solid var(--color-border)',
                      backgroundColor: 'var(--color-glass-bg)',
                    }}
                  >
                    <div className="p-6 relative overflow-hidden min-h-[70vh] flex flex-col justify-center">
                      {/* Hover Gradient Effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      <div className="relative z-10 space-y-6">
                        {/* Year Badge - Top Center */}
                        <div className="text-center">
                          <motion.div 
                            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-500/25 via-orange-400/20 to-orange-500/15 border border-orange-500/40 rounded-xl mb-4 backdrop-blur-sm shadow-md"
                            whileHover={{ scale: 1.05, boxShadow: "0 8px 25px rgba(255, 140, 66, 0.25)" }}
                            transition={{ duration: 0.3 }}
                          >
                            <span className="text-2xl font-black bg-gradient-to-r from-orange-300 via-orange-400 to-orange-500 bg-clip-text text-transparent tracking-tight">
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
                          <h3 className="text-xl font-bold leading-tight group-hover:text-orange-300 transition-colors duration-300" style={{ color: 'var(--color-text)' }}>
                            {item.position}
                          </h3>
                          
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-6 h-6 bg-gradient-to-br from-orange-400/30 to-orange-500/20 rounded border border-orange-500/30 flex items-center justify-center flex-shrink-0">
                              <div className="w-3 h-3 bg-orange-500/60 rounded-sm"></div>
                            </div>
                            <h4 className="text-lg font-bold bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">
                              {item.company}
                            </h4>
                          </div>
                          
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-1 h-1 bg-orange-500/60 rounded-full"></div>
                            <p className="text-sm font-semibold tracking-wide opacity-90" style={{ color: 'var(--color-text-secondary)' }}>
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
                            <h5 className="font-bold text-xs uppercase tracking-[0.2em] opacity-90 flex items-center justify-center gap-2" style={{ color: 'var(--color-text)' }}>
                              <span className="w-1.5 h-1.5 bg-orange-500/60 rounded-full"></span>
                              Technologies Used
                            </h5>
                          </div>
                          <div className="flex flex-wrap gap-2 justify-center">
                            {item.technologies.map((tech, i) => (
                              <motion.span 
                                key={i} 
                                className="px-3 py-1.5 bg-gradient-to-r from-orange-500/25 via-orange-400/15 to-orange-500/10 text-orange-300 text-xs font-semibold rounded-lg border border-orange-500/30 hover:bg-orange-500/35 hover:text-orange-200 hover:border-orange-400/60 hover:shadow-md hover:shadow-orange-500/20 transition-all duration-300 cursor-default backdrop-blur-sm"
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
                            <h5 className="font-bold text-xs uppercase tracking-[0.2em] opacity-90 flex items-center justify-center gap-2" style={{ color: 'var(--color-text)' }}>
                              <span className="w-1.5 h-1.5 bg-orange-500/60 rounded-full"></span>
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
                                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                                <span className="text-left max-w-xs" style={{ color: 'var(--color-text-secondary)' }}>{achievement}</span>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </StarBorder>
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
                  
                  <StarBorder
                    as="div"
                    className="w-full group hover:scale-[1.02] transition-all duration-500 ease-out"
                    color="#ff8c42"
                    speed="6s"
                    style={{
                      backdropFilter: 'blur(20px)',
                      border: '1px solid var(--color-border)',
                      backgroundColor: 'var(--color-glass-bg)',
                    }}
                  >
                    <div className="p-4 md:p-6 relative overflow-hidden">
                      {/* Hover Gradient Effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      <div className="relative z-10">
                        {/* Enhanced Card Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                            {/* Year Badge */}
                            <motion.div 
                              className={`inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-orange-500/25 via-orange-400/20 to-orange-500/15 border border-orange-500/40 rounded-lg sm:rounded-xl mb-3 backdrop-blur-sm shadow-md ${index % 2 === 0 ? 'md:ml-auto' : ''}`}
                              whileHover={{ scale: 1.05, boxShadow: "0 8px 25px rgba(255, 140, 66, 0.25)" }}
                              transition={{ duration: 0.3 }}
                            >
                              <span className="text-xl sm:text-2xl md:text-3xl font-black bg-gradient-to-r from-orange-300 via-orange-400 to-orange-500 bg-clip-text text-transparent tracking-tight">
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
                              <h3 className="text-base sm:text-lg md:text-xl font-bold leading-tight group-hover:text-orange-300 transition-colors duration-300" style={{ color: 'var(--color-text)' }}>
                                {item.position}
                              </h3>
                              
                              <div className="flex items-center gap-2 flex-wrap">
                                {/* Company Logo Placeholder */}
                                <div className="w-5 sm:w-6 h-5 sm:h-6 bg-gradient-to-br from-orange-400/30 to-orange-500/20 rounded border border-orange-500/30 flex items-center justify-center flex-shrink-0">
                                  <div className="w-2.5 sm:w-3 h-2.5 sm:h-3 bg-orange-500/60 rounded-sm"></div>
                                </div>
                                <h4 className="text-sm sm:text-base md:text-lg font-bold bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">
                                  {item.company}
                                </h4>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <div className="w-1 h-1 bg-orange-500/60 rounded-full"></div>
                                <p className="text-xs sm:text-sm font-semibold tracking-wide opacity-90" style={{ color: 'var(--color-text-secondary)' }}>
                                  {item.duration}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Description */}
                        <div className={`mb-5 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                          <div className="relative">
                            <div className={`absolute top-0 ${index % 2 === 0 ? 'right-0' : 'left-0'} w-8 h-0.5 bg-gradient-to-r from-orange-500/50 to-transparent mb-3`}></div>
                            <p className="text-sm md:text-base leading-relaxed pt-4 group-hover:text-opacity-95 transition-all duration-300" style={{ color: 'var(--color-text-secondary)' }}>
                              {item.description}
                            </p>
                          </div>
                        </div>

                        {/* Technologies Section */}
                        <div className={`mb-4 sm:mb-5 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                          <div className="mb-2 sm:mb-3">
                            <h5 className="font-bold text-xs uppercase tracking-[0.2em] opacity-90 flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
                              <span className="w-1.5 h-1.5 bg-orange-500/60 rounded-full"></span>
                              Technologies Used
                            </h5>
                          </div>
                          <div className={`flex flex-wrap gap-1.5 sm:gap-2 ${index % 2 === 0 ? 'md:justify-end' : 'md:justify-start'}`}>
                            {item.technologies.map((tech, i) => (
                              <motion.span 
                                key={i} 
                                className="px-2 sm:px-3 py-1 sm:py-1.5 bg-gradient-to-r from-orange-500/25 via-orange-400/15 to-orange-500/10 text-orange-300 text-xs font-semibold rounded-md sm:rounded-lg border border-orange-500/30 hover:bg-orange-500/35 hover:text-orange-200 hover:border-orange-400/60 hover:shadow-md hover:shadow-orange-500/20 transition-all duration-300 cursor-default backdrop-blur-sm"
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
                            <h5 className="font-bold text-xs uppercase tracking-[0.2em] opacity-90 flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
                              <span className="w-1.5 h-1.5 bg-orange-500/60 rounded-full"></span>
                              Key Achievements
                            </h5>
                          </div>
                          <div className="space-y-2 sm:space-y-2.5">
                            {item.achievements.map((achievement, i) => (
                              <motion.div 
                                key={i} 
                                className={`flex items-start gap-2 sm:gap-3 group/achievement p-1.5 sm:p-2 rounded hover:bg-orange-500/5 transition-all duration-300 ${index % 2 === 0 ? 'md:flex-row-reverse md:text-right' : ''}`}
                                initial={{ opacity: 0, x: index % 2 === 0 ? 30 : -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: i * 0.1 }}
                                whileHover={{ scale: 1.01 }}
                              >
                                <motion.div 
                                  className="flex-shrink-0 w-2 sm:w-2.5 h-2 sm:h-2.5 bg-gradient-to-r from-orange-500 to-orange-400 rounded-full mt-0.5 sm:mt-1 shadow-sm group-hover/achievement:shadow-md group-hover/achievement:shadow-orange-500/40 transition-all duration-300"
                                  whileHover={{ 
                                    scale: 1.3,
                                    boxShadow: "0 0 15px rgba(255, 140, 66, 0.5)"
                                  }}
                                  transition={{ duration: 0.2 }}
                                />
                                <span className="text-xs sm:text-sm leading-relaxed group-hover/achievement:text-opacity-100 transition-all duration-300" style={{ color: 'var(--color-text-secondary)' }}>
                                  {achievement}
                                </span>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </StarBorder>
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
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
              {skills.map((skill, index) => (
                <motion.div
                  key={skill}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="glass-card p-3 sm:p-4 text-center hover:bg-orange-500/10 transition-colors duration-300"
                >
                  <span className="font-medium text-xs sm:text-sm" style={{ color: 'var(--color-text)' }}>{skill}</span>
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
            <div className="grid grid-cols-1 gap-4 sm:gap-6">
              {highlights.map((stat, index) => {
                const IconComponent = iconMap[stat.icon as keyof typeof iconMap];
                return (
                  <motion.div
                    key={stat.label}
                    className="glass-card p-6 text-center"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="text-4xl mb-4 text-orange-500">
                      {IconComponent && <IconComponent />}
                    </div>
                    <div className="text-4xl font-bold text-orange-500 mb-3">{stat.number}</div>
                    <h3 className="font-semibold mb-3 text-lg" style={{ color: 'var(--color-text)' }}>{stat.label}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>{stat.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Desktop/Tablet View */}
          <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {highlights.map((stat, index) => {
              const IconComponent = iconMap[stat.icon as keyof typeof iconMap];
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="glass-card p-4 lg:p-6 text-center hover:bg-orange-500/5 transition-colors duration-300"
                >
                  <div className="text-2xl lg:text-3xl mb-3 text-orange-500">
                    {IconComponent && <IconComponent />}
                  </div>
                  <div className="text-2xl lg:text-3xl xl:text-4xl font-bold text-orange-500 mb-2">{stat.number}</div>
                  <h3 className="font-semibold mb-3 text-sm lg:text-base" style={{ color: 'var(--color-text)' }}>{stat.label}</h3>
                  <p className="text-xs lg:text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>{stat.description}</p>
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
                className="glass-card p-4 sm:p-6 lg:p-8"
              >
                <div className="flex flex-col md:flex-row gap-4 lg:gap-6">
                  <div className="md:w-1/3">
                    <div className={`inline-block px-3 py-2 rounded-full bg-gradient-to-r ${era.color} text-white text-xs sm:text-sm font-semibold mb-3 lg:mb-4`}>
                      {era.period}
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold mb-2 lg:mb-3" style={{ color: 'var(--color-text)' }}>{era.title}</h3>
                    <p className="text-sm sm:text-base leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>{era.description}</p>
                  </div>
                  <div className="md:w-2/3">
                    <h4 className="font-semibold mb-3 lg:mb-4 text-xs sm:text-sm uppercase tracking-wide" style={{ color: 'var(--color-text)' }}>Key Technologies</h4>
                    <div className="flex flex-wrap gap-2 sm:gap-3">
                      {era.technologies.map((tech, i) => (
                        <motion.span
                          key={tech}
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.3, delay: 0.6 + i * 0.05 }}
                          className="px-3 py-1.5 sm:px-4 sm:py-2 bg-orange-500/20 text-orange-500 rounded-full text-xs sm:text-sm font-medium hover:bg-orange-500/30 transition-colors duration-300"
                        >
                          {tech}
                        </motion.span>
                      ))}
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
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
              <Link 
                href="/projects"
                className="glass-button px-6 sm:px-8 py-3 transition-colors duration-300"
                style={{ color: 'var(--color-text)' }}
              >
                View My Projects
              </Link>
              <Link 
                href="/about"
                className="glass-button bg-orange-500 hover:bg-orange-600 px-6 sm:px-8 py-3 text-white transition-colors duration-300"
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
