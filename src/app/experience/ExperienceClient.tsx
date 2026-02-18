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
import PixelBlast from "../components/ui/PixelBlast";
// Lazy load FaultyTerminal with proper loading state
import { LazyFaultyTerminal } from '../../components/lazy/LazyBoundaries';
import CodingStats from "../components/sections/CodingStats";
import "../components/styles/Experience.css";

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
      const isMobile = window.innerWidth <= 900;

      // Timeline growth animation - matching Career.css reference
      const startPoint = isMobile ? "top 80%" : "top 70%";
      const endPoint = isMobile ? "bottom 20%" : "bottom 30%";

      // Grow timeline line from top to bottom
      gsap.fromTo(
        timelineRef.current,
        { height: "0%" },
        {
          height: "100%",
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: startPoint,
            end: endPoint,
            scrub: 1,
          },
        }
      );

      // Move the glowing dot along the timeline
      gsap.fromTo(
        sparkRef.current,
        { top: "0%", opacity: 0.5 },
        {
          top: "100%",
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: startPoint,
            end: endPoint,
            scrub: 0.5,
          },
        }
      );

      // Fade in each career item as you scroll
      itemsRef.current.forEach((item) => {
        if (item) {
          gsap.fromTo(
            item,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              scrollTrigger: {
                trigger: item,
                start: "top 85%",
                end: "bottom 15%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Smooth scroll to experience timeline section
  const scrollToExperience = (e: React.MouseEvent) => {
    e.preventDefault();
    const experienceSection = document.getElementById('experience-timeline');
    if (experienceSection) {
      experienceSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <main className="relative w-full min-h-screen overflow-x-hidden" style={{ color: 'var(--color-text)' }}>
      {/* <SplashCursor SPLAT_RADIUS={0.05} /> */}
      <SplashCursorWrapper SPLAT_RADIUS={0.025} />
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden pt-16 md:pt-0">
        {/* Background */}
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
              speed={0.6}
              edgeFade={0.25}
              transparent
            />
          {/* <LazyFaultyTerminal
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
          /> */}
        </div>

        <div className="relative z-10 text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Clean Title */}
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 drop-shadow-2xl leading-tight"
              style={{ color: 'var(--color-text)' }}
            >
              Professional
              <br />
              <span className="relative">
                <span className="text-orange-500">Journey</span>
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
              className="text-lg md:text-xl max-w-2xl mx-auto mb-8 drop-shadow-lg"
              style={{ color: 'var(--color-text)' }}
            >
              From junior developer to <span className="text-orange-400 font-semibold">technical leader</span>, 
              explore the milestones and achievements that shaped my career in 
              <span className="text-orange-400 font-semibold"> creative web development</span>
            </motion.p>
            
            {/* Button container with consistent sizing */}
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
                href="#experience-timeline"
                onClick={scrollToExperience}
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
                View Experience
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

      {/* Experience Timeline - Inspired by Career Design */}
      <section 
        ref={sectionRef}
        className="relative z-10 w-full section-container career-section-redesign"
        id="experience-timeline"
      >
        <div className="career-container max-w-5xl mx-auto px-4 sm:px-6">
          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="career-title"
          >
            My career <span>&</span>
            <br /> experience
          </motion.h2>

          {/* Experience Items with Timeline */}
          <div className="career-info relative">
            {/* Timeline Line with Gradient */}
            <div 
              ref={timelineRef}
              className="career-timeline"
            />
            
            {/* Spark/Dot Effect */}
            <div 
              ref={sparkRef}
              className="career-dot"
            />

            {/* Experience Cards */}
            {experienceData.map((item, index) => (
              <div
                key={item.id}
                ref={(el) => { itemsRef.current[index] = el; }}
                className="career-info-box"
              >
                <div className="career-info-in">
                  <div className="career-role">
                    <h4>{item.position}</h4>
                    <h5>{item.company}</h5>
                  </div>
                  <h3>{item.year}</h3>
                </div>
                <p>{item.description}</p>
              </div>
            ))}
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
      {/* <section className="relative z-10 py-20 px-4">
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
          </motion.div> */}

          {/* Mobile View - Simple Grid */}
          {/* <div className="block md:hidden">
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
                  > */}
                    {/* Neubrutalism Career Highlights Card - Mobile */}
                    {/* <div className="relative w-full h-[260px] neubrutalism-card"
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
          </div> */}

          {/* Desktop/Tablet View */}
          {/* <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                > */}
                  {/* Neubrutalism Career Highlights Card - Desktop */}
                  {/* <div className="relative w-full h-[280px] neubrutalism-card"
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
      </section> */}

      {/* Technologies Evolution Section */}
      {/* <section className="relative z-10 py-20 px-4">
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
      </section> */}

      {/* Coding Stats Section */}
      <CodingStats showTitle={true} />

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
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4">
              <Link 
                href="/projects"
                className="px-6 py-3 neubrutalism-button font-black uppercase tracking-wide text-center inline-flex items-center gap-2 text-sm w-fit"
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
                className="px-6 py-3 neubrutalism-button font-black uppercase tracking-wide text-center inline-flex items-center gap-2 text-sm w-fit"
                style={{
                  borderColor: 'var(--color-accent)',
                  backgroundColor: 'var(--color-accent)',
                  color: 'var(--color-button-text)'
                }}
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
