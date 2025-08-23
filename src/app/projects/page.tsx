"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import StarBorder from '../components/ui/StarBorder';
import SplashCursor from '../components/ui/SplashCursor';
import { getProjects, type Project } from '../../data';

// Lazy load FaultyTerminal with proper loading state
import { LazyFaultyTerminal } from '../../components/lazy/LazyBoundaries';

export default function ProjectsPage() {
  const projects = getProjects();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());

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
      <SplashCursor SPLAT_RADIUS={0.05} />
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
            <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold mb-6 drop-shadow-2xl" style={{ color: 'var(--color-text)' }}>
              My <span className="text-orange-500">Projects</span>
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8 drop-shadow-lg" style={{ color: 'var(--color-text-secondary)' }}>
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                  <StarBorder
                    as="div"
                    className="w-full h-[400px]"
                    color="#ff8c42"
                    speed="6s"
                    style={{
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(20px)',
                    }}
                  >
                    <div className="relative w-full h-full p-6 flex flex-col">
                      {/* Card Front */}
                      <div className={`absolute inset-6 transition-all duration-700 ${
                        flippedCards.has(project.id) ? 'opacity-0 transform rotateY-180' : 'opacity-100'
                      }`}>
                        <div className="relative w-full h-48 mb-4 rounded-xl overflow-hidden">
                          <Image
                            src={project.image}
                            alt={project.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                          {project.featured && (
                            <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                              Featured
                            </div>
                          )}
                        </div>
                        <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>{project.title}</h3>
                        <p className="text-orange-500 text-sm mb-4">{project.category}</p>
                      </div>

                      {/* Card Back */}
                      <div className={`absolute inset-6 transition-all duration-700 ${
                        flippedCards.has(project.id) ? 'opacity-100' : 'opacity-0 transform rotateY-180'
                      }`}>
                        <div className="h-full flex flex-col justify-center">
                          <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>{project.title}</h3>
                          <p className="text-sm mb-6 line-clamp-4" style={{ color: 'var(--color-text-secondary)' }}>{project.shortDescription}</p>
                          <div className="flex flex-wrap gap-2 mb-6">
                            {project.techStack.slice(0, 3).map((tech, i) => (
                              <span key={i} className="px-2 py-1 bg-orange-500/20 text-orange-500 text-xs rounded-full">
                                {tech}
                              </span>
                            ))}
                            {project.techStack.length > 3 && (
                              <span className="px-2 py-1 text-xs rounded-full" style={{ backgroundColor: 'var(--color-glass-bg)', color: 'var(--color-text-secondary)' }}>
                                +{project.techStack.length - 3} more
                              </span>
                            )}
                          </div>
                          <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-medium transition-colors duration-300">
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </StarBorder>
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
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeProjectDetail}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={closeProjectDetail}
                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors duration-300"
                style={{ color: 'var(--color-text)' }}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                <div>
                  <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>{selectedProject.title}</h2>
                  <p className="text-orange-500 text-lg mb-6">{selectedProject.category}</p>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold mb-3" style={{ color: 'var(--color-text)' }}>Description</h3>
                      <p className="leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>{selectedProject.fullDescription}</p>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold mb-3" style={{ color: 'var(--color-text)' }}>Tech Stack</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedProject.techStack.map((tech, i) => (
                          <span key={i} className="px-3 py-1 bg-orange-500/20 text-orange-500 text-sm rounded-full">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold mb-3" style={{ color: 'var(--color-text)' }}>Key Implementation</h3>
                      <ul className="space-y-2">
                        {selectedProject.implementation.map((item, i) => (
                          <li key={i} className="flex items-start gap-3" style={{ color: 'var(--color-text-secondary)' }}>
                            <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
                            <span className="text-sm">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Links */}
                    <div className="flex gap-4 pt-4">
                      {selectedProject.liveLink && (
                        <a
                          href={selectedProject.liveLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-300"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          Live Demo
                        </a>
                      )}
                      {selectedProject.githubLink && (
                        <a
                          href={selectedProject.githubLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg font-medium transition-colors duration-300"
                          style={{ color: 'var(--color-text)' }}
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                          </svg>
                          GitHub
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
