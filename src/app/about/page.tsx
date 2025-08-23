"use client";

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  FaPalette, 
  FaRocket, 
  FaGamepad, 
  FaRobot, 
  FaCamera, 
  FaMusic 
} from 'react-icons/fa';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { useTheme } from '../../contexts/ThemeContext';
import TiltedCard from '../components/ui/TiltedCard';
import StarBorder from '../components/ui/StarBorder';
import SplashCursor from '../components/ui/SplashCursor';
import { usePageReload } from '../components/ui/LazyLoader';

// Lazy load FaultyTerminal with proper loading state
import { LazyFaultyTerminal } from '../../components/lazy/LazyBoundaries';
import { 
  getSkills, 
  getInterests, 
  getTimeline, 
  getAboutData
} from '../../data';

// Icon mapping for interests
const iconMap = {
  FaPalette,
  FaRocket,
  FaGamepad,
  FaRobot,
  FaCamera,
  FaMusic
};

export default function AboutPage() {
  const aboutData = getAboutData();
  const skills = getSkills();
  const interests = getInterests();
  const timeline = getTimeline();
  const { reloadWithTransition } = usePageReload();
  const { theme } = useTheme();
  const [floatingElements, setFloatingElements] = useState<Array<{left: number, top: number, delay: number, xOffset: number, duration: number}>>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Generate floating element positions on client side only
    const newElements = Array.from({ length: 15 }, () => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 2,
      xOffset: (Math.random() - 0.5) * 100,
      duration: 3 + Math.random() * 4
    }));
    setFloatingElements(newElements);
  }, []);

  // If data hasn't loaded yet, show loading state
  if (!aboutData.aboutSections || aboutData.aboutSections.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-bg-start)', color: 'var(--color-text)' }}>
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <main className="relative w-full min-h-screen overflow-x-hidden" style={{ color: 'var(--color-text)' }}>
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
            brightness={theme === 'light' ? 0.3 : 0.7}
          />
        </div>
        {/* Floating Elements */}
        <div className="absolute inset-0 opacity-10 z-10">
          {isMounted && floatingElements.map((element, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-orange-500 rounded-full"
              style={{
                left: `${element.left}%`,
                top: `${element.top}%`,
              }}
              animate={{
                y: [0, -30, 0],
                x: [0, element.xOffset, 0],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: element.duration,
                repeat: Infinity,
                delay: element.delay,
              }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-20">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center lg:text-left"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-8"
            >
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--color-accent)' }}></div>
              <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>Creative Technologist</span>
            </motion.div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 drop-shadow-2xl" style={{ color: 'var(--color-text)' }}>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                style={{ color: '#ffffff' }}
              >
                {aboutData.hero.title}
              </motion.span>{" "}
              <span className="text-gradient-fire relative">
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                >
                  Me
                </motion.span>
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1, delay: 1.2 }}
                  className="absolute bottom-2 left-0 w-full h-1 bg-gradient-to-r from-[#ff9a1c] to-[#ff6b35] origin-left"
                />
              </span>
            </h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
              className="text-lg md:text-xl mb-8 leading-relaxed drop-shadow-lg"
              style={{ color: '#ffffff' }}
            >
              {aboutData.hero.subtitle}
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Link 
                href="/"
                className="inline-flex items-center gap-2 glass-button px-6 py-3 transition-colors duration-300"
                style={{ color: 'var(--color-text)' }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Home
              </Link>
              <a 
                href="#who-i-am"
                className="inline-flex items-center gap-2 glass-button bg-orange-500/20 border-orange-500/30 px-6 py-3 transition-colors duration-300"
                style={{ color: 'var(--color-text)' }}
              >
                Learn More
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </a>
            </motion.div>
          </motion.div>

          {/* 3D Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex justify-center relative"
          >
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-orange-500/20 rounded-full blur-3xl scale-150 opacity-50"></div>
            
            <div className="w-80 h-80 lg:w-96 lg:h-96 relative z-10">
              <TiltedCard
                imageSrc={aboutData.hero.profileImage}
                altText={aboutData.hero.profileAlt}
                captionText={aboutData.hero.profileCaption}
                containerHeight="100%"
                containerWidth="100%"
                imageHeight="100%"
                imageWidth="100%"
                rotateAmplitude={10}
                scaleOnHover={1.05}
                showMobileWarning={false}
                showTooltip={true}
                displayOverlayContent={true}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Who I Am - Complete Description Section */}
      <section id="who-i-am" className="relative z-10 py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6" style={{ color: 'var(--color-text)' }}>
              Who <span className="text-gradient-fire">I Am</span>
            </h2>
            <div className="w-24 h-1 mx-auto mb-8" style={{ background: 'var(--color-accent-gradient)' }}></div>
          </motion.div>

          {/* Who I Am Content - Unified Layout */}
          <div className="space-y-8">
            {aboutData.aboutSections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="glass-card p-6 md:p-8"
              >
                <h3 className="text-xl md:text-2xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>{section.title}</h3>
                {section.content.map((paragraph, pIndex) => (
                  <p key={pIndex} className="leading-relaxed mb-4 text-sm md:text-base" style={{ color: 'var(--color-text-secondary)' }}>
                    {paragraph.split(/(\*\*.*?\*\*)/).map((part, partIndex) => {
                      if (part.startsWith('**') && part.endsWith('**')) {
                        return (
                          <span key={partIndex} className="text-orange-500 font-medium">
                            {part.slice(2, -2)}
                          </span>
                        );
                      }
                      return part;
                    })}
                  </p>
                ))}
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-center pt-8"
            >
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/projects"
                  className="glass-button px-8 py-3 transition-colors duration-300"
                  style={{ color: 'var(--color-text)' }}
                >
                  Explore My Work
                </Link>
                <Link 
                  href="/experience"
                  className="glass-button px-8 py-3 transition-colors duration-300"
                  style={{ color: 'var(--color-text)' }}
                >
                  View Experience
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="relative z-10 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
              Technical <span className="text-orange-500">Expertise</span>
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--color-text-secondary)' }}>
              A comprehensive skill set spanning frontend, backend, 3D graphics, and emerging technologies
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.map((skill, index) => (
              <motion.div
                key={skill.category}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <StarBorder
                  as="div"
                  className="w-full h-[280px]"
                  color="#ff8c42"
                  speed="6s"
                  style={{
                    backdropFilter: 'blur(20px)',
                    border: '1px solid var(--color-border)',
                    backgroundColor: 'var(--color-glass-bg)',
                  }}
                >
                  <div className="p-6 h-full flex flex-col">
                    <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>{skill.category}</h3>
                    
                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Proficiency</span>
                        <span className="text-sm text-orange-500 font-semibold">{skill.level}%</span>
                      </div>
                      <div className="w-full rounded-full h-2" style={{ backgroundColor: 'var(--color-surface)' }}>
                        <motion.div 
                          className="bg-gradient-to-r from-[#ff9a1c] to-[#ff6b35] h-2 rounded-full"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.5 }}
                        />
                      </div>
                    </div>

                    {/* Technologies */}
                    <div className="flex-1">
                      <h4 className="text-sm mb-3 uppercase tracking-wide" style={{ color: 'var(--color-text-muted)' }}>Technologies</h4>
                      <div className="flex flex-wrap gap-2">
                        {skill.technologies.map((tech, i) => (
                          <span key={i} className="px-2 py-1 bg-orange-500/20 text-orange-500 text-xs rounded-full">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </StarBorder>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Journey Timeline */}
      <section id="journey" className="relative z-10 py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
              My <span className="text-orange-500">Journey</span>
            </h2>
            <p className="text-lg" style={{ color: 'var(--color-text-secondary)' }}>
              Key milestones in my development as a creative technologist
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-[#ff9a1c] to-transparent" />

            {timeline.map((item, index) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative mb-12 ${
                  index % 2 === 0 
                    ? 'md:text-right md:pr-[calc(50%+2rem)]' 
                    : 'md:text-left md:pl-[calc(50%+2rem)]'
                } pl-12 md:pl-0`}
              >
                {/* Timeline Dot */}
                <div className="absolute left-3 md:left-1/2 md:-translate-x-1/2 w-3 h-3 bg-orange-500 rounded-full border-4" style={{ borderColor: 'var(--color-bg-start)' }} />

                <div className="glass-card p-6">
                  <div className="flex items-center gap-4 mb-3">
                    <span className="text-2xl font-bold text-orange-500">{item.year}</span>
                    <h3 className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>{item.title}</h3>
                  </div>
                  <p style={{ color: 'var(--color-text-secondary)' }}>{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interests Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
              Beyond <span className="text-orange-500">Code</span>
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--color-text-secondary)' }}>
              My passions and interests that fuel creativity and innovation
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {interests.map((interest, index) => {
              const IconComponent = iconMap[interest.icon as keyof typeof iconMap];
              return (
                <motion.div
                  key={interest.title}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <StarBorder
                    as="div"
                    className="w-full h-[200px]"
                    color="#ff8c42"
                    speed="6s"
                    style={{
                      backdropFilter: 'blur(20px)',
                      border: '1px solid var(--color-border)',
                      backgroundColor: 'var(--color-glass-bg)',
                    }}
                  >
                    <div className="p-6 h-full flex flex-col items-center justify-center text-center">
                      <div className="text-4xl mb-4 text-orange-500">
                        {IconComponent && <IconComponent />}
                      </div>
                      <h3 className="text-lg font-bold mb-3" style={{ color: 'var(--color-text)' }}>{interest.title}</h3>
                      <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{interest.description}</p>
                    </div>
                  </StarBorder>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: 'var(--color-text)' }}>
              Let's Create Something <span className="text-orange-500">Amazing</span>
            </h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto" style={{ color: 'var(--color-text-secondary)' }}>
              I'm always excited to collaborate on innovative projects that push creative and technical boundaries.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/projects"
                className="glass-button px-8 py-3 transition-colors duration-300"
                style={{ color: 'var(--color-text)' }}
              >
                View My Work
              </Link>
              <a 
                href="#contact"
                className="glass-button px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white transition-colors duration-300"
              >
                Get In Touch
              </a>
              <button 
                onClick={reloadWithTransition}
                className="glass-button px-6 py-3 transition-colors duration-300 border border-orange-500/30 hover:border-orange-500/50"
                style={{ color: 'var(--color-accent)' }}
              >
                🔄 Test Reload
              </button>
            </div>
          </motion.div>
        </div>
      </section>
      
      <Footer />
    </main>
  );
}
