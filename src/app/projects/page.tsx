"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { getProjects, type Project } from '../../data';

// Lazy load components with proper error boundaries
import { LazyFaultyTerminal } from '../../components/lazy/LazyBoundaries';

// Dynamically import SplashCursor with error handling
const SplashCursor = dynamic(
  () => import('../components/ui/SplashCursor'),
  { 
    ssr: false,
    loading: () => null,
  }
);

export default function ProjectsPage() {
  const projects = getProjects();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());
  const [splashCursorError, setSplashCursorError] = useState(false);

  const handleCardHover = (projectId: number, isHovered: boolean) => {
    setFlippedCards(prev => {
      const newSet = new Set(prev);
      if (isHovered) {
        newSet.add(projectId);
      } else {
        newSet.delete(projectId);
      }
      return newSet;
    });
  };

  const handleCardClick = (project: Project) => {
    setSelectedProject(project);
  };

  const closeProjectDetail = () => {
    setSelectedProject(null);
  };

  return (
    <main className="relative w-full min-h-screen overflow-x-hidden">
      {!splashCursorError && (
        <SplashCursor 
          SPLAT_RADIUS={0.05}
          onError={() => setSplashCursorError(true)}
        />
      )}
      <Navbar />
      
      {/* Hero Section with FaultyTerminal Background */}
      <section className="relative h-screen flex items-center justify-center">
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
            className="w-full h-full"
          />
        </div>
        
        <div className="relative z-10 text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold mb-6 drop-shadow-2xl" style={{ color: '#fff' }}>
              My <span className="text-orange-500">Projects</span>
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8 drop-shadow-lg" style={{ color: '#fff' }}>
              Explore my collection of innovative projects spanning web development, 3D experiences, and mobile applications
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
      </section>

      {/* Projects Grid */}
      <section className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-5xl font-bold text-center mb-16"
            style={{ color: 'var(--color-text)' }}
          >
            Featured <span className="text-orange-500">Work</span>
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative group"
              >
                <div
                  className="cursor-pointer"
                  onMouseEnter={() => handleCardHover(project.id, true)}
                  onMouseLeave={() => handleCardHover(project.id, false)}
                  onClick={() => handleCardClick(project)}
                >
                  {/* Neubrutalism Card - FIXED HEIGHT */}
                  <div 
                    className="relative w-full h-[560px] neubrutalism-card flex flex-col"
                    style={{
                      backgroundColor: 'var(--color-surface)',
                    }}
                  >
                    {/* Project Image - FIXED HEIGHT */}
                    <div className="relative w-full h-[280px] border-b-4 border-black overflow-hidden flex-shrink-0">
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      
                      {/* Badges Container */}
                      <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
                        {/* Category Badge */}
                        <div className="bg-orange-400 border-2 border-black px-3 py-1.5 font-black text-black text-xs shadow-[var(--shadow-neubrutalism-medium)] uppercase tracking-wide">
                          {project.category}
                        </div>
                        
                        {/* Featured Badge */}
                        {project.featured && (
                          <div className="bg-yellow-400 border-2 border-black px-3 py-1.5 font-black text-black text-xs shadow-[var(--shadow-neubrutalism-medium)] uppercase tracking-wide">
                            ⭐ FEATURED
                          </div>
                        )}
                      </div>

                      {/* Hover Description Overlay */}
                      <div className={`absolute inset-0 bg-black/95 flex items-center justify-center p-4 transition-all duration-300 z-20 overflow-hidden ${
                        flippedCards.has(project.id) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
                      }`}>
                        <div className="text-center text-white max-w-full h-full flex flex-col justify-center">
                          <div className="max-h-[180px] overflow-hidden mb-4">
                            <p className="text-sm leading-relaxed font-medium line-clamp-6">
                              {project.shortDescription}
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-1 justify-center max-h-[80px] overflow-hidden">
                            {project.techStack.slice(0, 4).map((tech, i) => (
                              <span key={i} className="bg-orange-400 text-black border-2 border-white px-2 py-1 text-xs font-bold shadow-[var(--shadow-neubrutalism-small)] uppercase truncate max-w-[60px]">
                                {tech}
                              </span>
                            ))}
                            {project.techStack.length > 4 && (
                              <span className="bg-white text-black border-2 border-white px-2 py-1 text-xs font-bold uppercase">
                                +{project.techStack.length - 4}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card Content - FLEXIBLE WITH FIXED STRUCTURE */}
                    <div className="p-4 sm:p-6 flex-1 flex flex-col min-h-0 overflow-hidden">
                      {/* Title - FIXED HEIGHT */}
                      <div className="h-[60px] mb-4 overflow-hidden">
                        <h3 className="text-xl font-black uppercase tracking-tight leading-tight line-clamp-2" 
                          style={{ color: 'var(--color-text)' }}
                        >
                          {project.title}
                        </h3>
                      </div>

                      {/* Description - FIXED HEIGHT */}
                      <div className="h-[40px] mb-6 overflow-hidden">
                        <p className="text-sm leading-relaxed line-clamp-2 font-medium" 
                          style={{ color: 'var(--color-text-secondary)' }}
                        >
                          {project.shortDescription}
                        </p>
                      </div>

                      {/* Tech Stack - FIXED HEIGHT */}
                      <div className="h-[32px] mb-6 overflow-hidden">
                        <div className="flex flex-wrap gap-1 h-full items-start">
                          {project.techStack.slice(0, 3).map((tech, i) => (
                            <span key={i} className="bg-orange-400 text-black border-2 border-black px-2 py-0.5 text-xs font-bold shadow-[var(--shadow-neubrutalism-medium)] uppercase tracking-wide whitespace-nowrap truncate max-w-[80px]">
                              {tech}
                            </span>
                          ))}
                          {project.techStack.length > 3 && (
                            <span className="border-2 border-black px-2 py-0.5 text-xs font-bold shadow-[var(--shadow-neubrutalism-medium)] uppercase tracking-wide whitespace-nowrap" 
                              style={{ 
                                backgroundColor: 'var(--color-surface-hover)', 
                                color: 'var(--color-text)' 
                              }}
                            >
                              +{project.techStack.length - 3}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons - FIXED HEIGHT AT BOTTOM */}
                      <div className="mt-auto">
                        <div className="flex gap-3 h-[48px]">
                          <button className="neubrutalism-button flex-1 bg-orange-400 text-black text-xs sm:text-sm uppercase tracking-wide overflow-hidden">
                            <span className="truncate">VIEW DETAILS</span>
                          </button>
                          {project.liveLink && (
                            <a
                              href={project.liveLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="w-12 h-12 border-2 border-black font-bold shadow-[var(--shadow-neubrutalism)] hover:shadow-[var(--shadow-neubrutalism-hover)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 flex items-center justify-center flex-shrink-0"
                              style={{ 
                                backgroundColor: 'var(--color-surface-hover)',
                                color: 'var(--color-text)'
                              }}
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'var(--color-glass-bg)' }}
            onClick={closeProjectDetail}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ duration: 0.3 }}
              className="relative backdrop-blur-xl border rounded-2xl p-4 sm:p-8 max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
              style={{ 
                backgroundColor: 'var(--color-surface-elevated)',
                borderColor: 'var(--color-border)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={closeProjectDetail}
                className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 rounded-full hover:bg-opacity-80 flex items-center justify-center transition-colors duration-300 z-10"
                style={{ 
                  backgroundColor: 'var(--color-surface-hover)',
                  color: 'var(--color-text)'
                }}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 overflow-y-auto flex-1 pr-2">
                {/* Project Image */}
                <div className="relative aspect-video rounded-xl overflow-hidden">
                  <Image
                    src={selectedProject.image}
                    alt={selectedProject.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1200px) 100vw, 50vw"
                  />
                  {selectedProject.featured && (
                    <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Featured
                    </div>
                  )}
                </div>

                {/* Project Details */}
                <div className="overflow-hidden">
                  <div className="mb-4">
                    <h2 className="text-2xl sm:text-3xl font-bold mb-2 line-clamp-2" style={{ color: 'var(--color-text)' }}>{selectedProject.title}</h2>
                    <p className="text-orange-500 text-base sm:text-lg truncate">{selectedProject.category}</p>
                  </div>
                  
                  <div className="space-y-4 sm:space-y-6 overflow-y-auto max-h-[60vh]">
                    <div>
                      <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3" style={{ color: 'var(--color-text)' }}>Description</h3>
                      <p className="leading-relaxed text-sm sm:text-base line-clamp-6" style={{ color: 'var(--color-text-secondary)' }}>{selectedProject.fullDescription}</p>
                    </div>

                    <div>
                      <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3" style={{ color: 'var(--color-text)' }}>Tech Stack</h3>
                      <div className="flex flex-wrap gap-2 max-h-[100px] overflow-y-auto">
                        {selectedProject.techStack.map((tech, i) => (
                          <span key={i} className="px-2 sm:px-3 py-1 bg-orange-500/20 text-orange-500 text-xs sm:text-sm rounded-full whitespace-nowrap">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3" style={{ color: 'var(--color-text)' }}>Key Implementation</h3>
                      <ul className="space-y-2 max-h-[120px] overflow-y-auto">
                        {selectedProject.implementation.map((item, i) => (
                          <li key={i} className="flex items-start gap-3" style={{ color: 'var(--color-text-secondary)' }}>
                            <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
                            <span className="text-xs sm:text-sm leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Links */}
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4">
                      {selectedProject.liveLink && (
                        <a
                          href={selectedProject.liveLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors duration-300 text-sm sm:text-base"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          <span className="truncate">Live Demo</span>
                        </a>
                      )}
                      {selectedProject.githubLink && (
                        <a
                          href={selectedProject.githubLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors duration-300 text-sm sm:text-base"
                          style={{ 
                            backgroundColor: 'var(--color-surface-hover)',
                            color: 'var(--color-text)'
                          }}
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                          </svg>
                          <span className="truncate">GitHub</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <Footer />
    </main>
  );
}
