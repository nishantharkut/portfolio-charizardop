"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { gsap, ScrollTrigger } from "@/utils/gsap";
import "../styles/Projects.css";
import Link from "next/link";
import Image from "next/image";
import { getProjects, type Project } from "../../../data";
import { performanceManager } from '@/utils/performance';

const Projects = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const handleProjectClick = (project: Project) => setSelectedProject(project);
  const closeProjectDetail = () => setSelectedProject(null);

  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [selectedProject]);

  const performanceSettings = useMemo(() => performanceManager.getOptimalSettings(), []);

  // GSAP horizontal scroll — matches moncy.dev Work section
  useEffect(() => {
    if (!sectionRef.current) return;

    let translateX = 0;

    function setTranslateX() {
      const boxes = sectionRef.current!.getElementsByClassName('project-box');
      const container = sectionRef.current!.querySelector('.project-container');
      if (!boxes.length || !container) return;
      const rectLeft = container.getBoundingClientRect().left;
      const rect = boxes[0].getBoundingClientRect();
      const parentWidth = boxes[0].parentElement!.getBoundingClientRect().width;
      const padding = parseInt(window.getComputedStyle(boxes[0]).padding) / 2;
      translateX = rect.width * boxes.length - (rectLeft + parentWidth) + padding;
    }

    setTranslateX();

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: `+=${translateX}`,
        scrub: true,
        pin: true,
        id: 'work',
      },
    });

    tl.to('.project-flex', {
      x: -translateX,
      ease: 'none',
    });

    return () => {
      tl.kill();
      ScrollTrigger.getById('work')?.kill();
    };
  }, []);

  const allProjects = getProjects();
  const featuredProjects = allProjects.filter(p => p.featured).slice(0, 3);
  const projects = featuredProjects.map((project, index) => ({
    number: String(index + 1).padStart(2, '0'),
    title: project.title,
    category: project.category,
    tools: project.techStack.join(', '),
    image: project.image,
    originalProject: project,
  }));

  return (
    <div className="projects-section" id="projects" ref={sectionRef}>
      <div className="project-container section-container">
        <h2 className="section-heading">
          My <span>Work</span>
        </h2>
        <div className="project-flex">
          {projects.map((project, index) => (
            <div
              className="project-box"
              key={index}
              onClick={() => handleProjectClick(project.originalProject)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleProjectClick(project.originalProject);
                }
              }}
            >
              <div className="project-header">
                <div className="project-number">{project.number}</div>
                <div className="project-title">
                  <h3>{project.title}</h3>
                  <p>{project.category}</p>
                </div>
              </div>

              <div className="project-info">
                <h4>Tools and features</h4>
                <p>{project.tools}</p>
              </div>

              <div className="project-image">
                <Image
                  src={project.image}
                  alt={project.title}
                  width={400}
                  height={300}
                  quality={performanceSettings.deviceTier === 'low' ? 60 : 75}
                  priority={index === 0}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={{ objectFit: 'cover' }}
                  loading={index === 0 ? 'eager' : 'lazy'}
                />
              </div>
            </div>
          ))}

          {/* View all projects card */}
          <div className="project-box view-all-box">
            <Link href="/projects" className="view-all-link">
              <div className="view-all-content">
                <div className="view-all-text">
                  <h3>View All Projects</h3>
                  <span className="arrow-icon">→</span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Project Detail Modal - Copy from page.tsx with mobile and desktop views */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50"
            style={{ backgroundColor: 'var(--color-glass-bg)' }}
            onClick={closeProjectDetail}
          >
            {/* Mobile View - Full Screen */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="h-full w-full flex flex-col bg-[var(--color-surface-elevated)] lg:hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Mobile Header with Close Button */}
              <div className="flex items-center justify-between p-4 border-b-2 border-black bg-[var(--color-surface)] relative z-10">
                <h2 className="text-lg font-black uppercase tracking-tight truncate pr-2" style={{ color: 'var(--color-text)' }}>
                  {selectedProject.title}
                </h2>
                <button
                  onClick={closeProjectDetail}
                  className="w-10 h-10 rounded-full border-2 border-black flex items-center justify-center transition-colors duration-300 shadow-[var(--shadow-neubrutalism-medium)] flex-shrink-0"
                  style={{ backgroundColor: 'var(--color-surface-hover)', color: 'var(--color-text)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-accent)';
                    e.currentTarget.style.color = '#000';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-surface-hover)';
                    e.currentTarget.style.color = 'var(--color-text)';
                  }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Mobile Content - Scrollable */}
              <div className="flex-1 overflow-y-auto overscroll-contain">
                {/* Project Image */}
                <div className="relative w-full aspect-[16/9] border-b-2 border-black bg-[var(--color-surface)]">
                  <Image
                    src={selectedProject.image}
                    alt={selectedProject.title}
                    fill
                    className="object-cover"
                    sizes="100vw"
                    priority
                  />
                  {selectedProject.featured && (
                    <div className="absolute top-3 right-3 bg-yellow-400 border-2 border-black px-3 py-1 rounded font-black text-black text-xs shadow-[var(--shadow-neubrutalism-medium)] uppercase tracking-wide">
                      FEATURED
                    </div>
                  )}
                </div>

                {/* Mobile Content Sections */}
                <div className="p-4 space-y-6 pb-24">
                  {/* Category Badge */}
                  <div>
                    <span className="border-2 border-black px-3 py-2 font-black text-black text-sm shadow-[var(--shadow-neubrutalism-medium)] uppercase tracking-wide" style={{ backgroundColor: 'var(--color-accent-light)' }}>
                      {selectedProject.category}
                    </span>
                  </div>

                  {/* Description */}
                  <div>
                    <h3 className="text-lg font-black uppercase mb-3 border-b-2 pb-2 inline-block" style={{ color: 'var(--color-text)', borderColor: 'var(--color-accent)' }}>
                      About Project
                    </h3>
                    <p className="leading-relaxed text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                      {selectedProject.fullDescription}
                    </p>
                  </div>

                  {/* Tech Stack */}
                  <div>
                    <h3 className="text-lg font-black uppercase mb-3 border-b-2 pb-2 inline-block" style={{ color: 'var(--color-text)', borderColor: 'var(--color-accent)' }}>
                      Technologies
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedProject.techStack.map((tech, i) => (
                        <div 
                          key={i} 
                          className="px-3 py-2 border-2 text-sm font-black rounded-lg shadow-[var(--shadow-neubrutalism-medium)] uppercase tracking-wide text-center transition-all duration-300"
                          style={{ 
                            borderColor: 'var(--color-accent)', 
                            backgroundColor: 'var(--color-accent-transparent)',
                            color: 'var(--color-accent)'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--color-accent)';
                            e.currentTarget.style.color = '#000';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--color-accent-transparent)';
                            e.currentTarget.style.color = 'var(--color-accent)';
                          }}
                        >
                          {tech}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Key Features */}
                  <div>
                    <h3 className="text-lg font-black uppercase mb-3 border-b-2 pb-2 inline-block" style={{ color: 'var(--color-text)', borderColor: 'var(--color-accent)' }}>
                      Key Features
                    </h3>
                    <div className="space-y-3">
                      {selectedProject.implementation.map((item, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 border-2 border-[var(--color-border)] rounded-lg bg-[var(--color-surface)]">
                          <span className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: 'var(--color-accent)' }}></span>
                          <span className="text-sm leading-relaxed font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile Sticky Bottom Actions */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-[var(--color-surface-elevated)] border-t-2 border-black shadow-[0_-4px_20px_rgba(0,0,0,0.3)]">
                <div className="flex gap-3">
                  {selectedProject.liveLink && (
                    <a
                      href={selectedProject.liveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 px-4 py-3 neubrutalism-button text-black font-black uppercase tracking-wide text-center border-2 border-black shadow-[var(--shadow-neubrutalism)] text-sm inline-flex items-center justify-center gap-2"
                      style={{ backgroundColor: 'var(--color-accent)' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-accent-hover)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--color-accent)'}
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
                      className="flex-1 px-4 py-3 neubrutalism-button font-black uppercase tracking-wide text-center border-2 border-black shadow-[var(--shadow-neubrutalism)] text-sm inline-flex items-center justify-center gap-2"
                      style={{
                        backgroundColor: 'var(--color-surface-hover)',
                        color: 'var(--color-text)'
                      }}
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.30 3.297-1.30.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                      </svg>
                      GitHub
                    </a>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Desktop View - Modal */}
            <div className="hidden lg:flex items-center justify-center p-4 h-full">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="relative neubrutalism-card border-2 max-w-4xl w-full h-[80vh] flex shadow-[var(--shadow-neubrutalism)] bg-[var(--color-surface-elevated)] rounded-lg overflow-hidden"
                style={{ borderColor: 'var(--color-accent)' }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Desktop Close Button */}
                <button
                  onClick={closeProjectDetail}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full border-2 border-black flex items-center justify-center transition-colors duration-300 z-30 shadow-[var(--shadow-neubrutalism-medium)]"
                  style={{ backgroundColor: 'var(--color-surface-hover)', color: 'var(--color-text)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-accent)';
                    e.currentTarget.style.color = '#000';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-surface-hover)';
                    e.currentTarget.style.color = 'var(--color-text)';
                  }}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                {/* Desktop Layout */}
                <div className="grid grid-cols-2 h-full">
                  {/* Desktop Image */}
                  <div className="relative border-r-4 border-black bg-[var(--color-surface)] flex items-center justify-center">
                    <Image
                      src={selectedProject.image}
                      alt={selectedProject.title}
                      fill
                      className="object-contain p-4"
                      sizes="40vw"
                    />
                    {selectedProject.featured && (
                      <div className="absolute top-4 right-4 bg-yellow-400 border-2 border-black px-4 py-2 rounded font-black text-black text-xs shadow-[var(--shadow-neubrutalism-medium)] uppercase tracking-wide">
                        FEATURED
                      </div>
                    )}
                  </div>

                  {/* Desktop Content - Scrollable */}
                  <div className="flex flex-col h-full overflow-hidden">
                    {/* Scrollable Content Area */}
                    <div className="flex-1 overflow-y-auto">
                      <div className="p-6 space-y-4">
                        {/* Desktop Header */}
                        <div>
                          <h2 className="text-2xl font-black uppercase tracking-tight mb-2 pr-12" style={{ color: 'var(--color-text)' }}>
                            {selectedProject.title}
                          </h2>
                          <span className="border-2 border-black px-3 py-1 font-black text-black text-xs shadow-[var(--shadow-neubrutalism-medium)] uppercase tracking-wide" style={{ backgroundColor: 'var(--color-accent-light)' }}>
                            {selectedProject.category}
                          </span>
                        </div>

                        {/* Desktop Description */}
                        <div>
                          <h3 className="text-base font-black uppercase mb-2" style={{ color: 'var(--color-text)' }}>Description</h3>
                          <p className="leading-relaxed text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                            {selectedProject.fullDescription}
                          </p>
                        </div>

                        {/* Desktop Tech Stack */}
                        <div>
                          <h3 className="text-base font-black uppercase mb-2" style={{ color: 'var(--color-text)' }}>Tech Stack</h3>
                          <div className="flex flex-wrap gap-2">
                            {selectedProject.techStack.map((tech, i) => (
                              <span 
                                key={i} 
                                className="px-2 py-1 border-2 text-xs font-black rounded shadow-[var(--shadow-neubrutalism-medium)] uppercase tracking-wide transition-all duration-300"
                                style={{ 
                                  borderColor: 'var(--color-accent)', 
                                  backgroundColor: 'var(--color-accent-transparent)',
                                  color: 'var(--color-accent)'
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.backgroundColor = 'var(--color-accent)';
                                  e.currentTarget.style.color = '#000';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor = 'var(--color-accent-transparent)';
                                  e.currentTarget.style.color = 'var(--color-accent)';
                                }}
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Desktop Features */}
                        <div>
                          <h3 className="text-base font-black uppercase mb-2" style={{ color: 'var(--color-text)' }}>Key Features</h3>
                          <ul className="space-y-2">
                            {selectedProject.implementation.map((item, i) => (
                              <li key={i} className="flex items-start gap-2" style={{ color: 'var(--color-text-secondary)' }}>
                                <span className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: 'var(--color-accent)' }}></span>
                                <span className="text-sm leading-relaxed">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        {/* Add bottom padding to ensure content is scrollable to the end */}
                        <div className="pb-6"></div>
                      </div>
                    </div>

                    {/* Desktop Actions - Fixed at Bottom */}
                    <div className="flex gap-3 p-6 pt-4 border-t-2 border-black bg-[var(--color-surface-elevated)] flex-shrink-0">
                      {selectedProject.liveLink && (
                        <a
                          href={selectedProject.liveLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 px-6 py-3 neubrutalism-button text-black font-black uppercase tracking-wide text-center border-2 border-black shadow-[var(--shadow-neubrutalism)] text-sm inline-flex items-center justify-center gap-2"
                          style={{ backgroundColor: 'var(--color-accent)' }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-accent-hover)'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--color-accent)'}
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
                          className="flex-1 px-6 py-3 neubrutalism-button font-black uppercase tracking-wide text-center border-2 border-black shadow-[var(--shadow-neubrutalism)] text-sm inline-flex items-center justify-center gap-2"
                          style={{
                            backgroundColor: 'var(--color-surface-hover)',
                            color: 'var(--color-text)'
                          }}
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.30 3.297-1.30.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                          </svg>
                          GitHub
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Projects;