"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { getProjects, type Project } from '../../data';
import SplashCursorWrapper from '../components/ui/SplashCursorWrapper';

// Lazy load components with proper error boundaries
import { LazyFaultyTerminal } from '../../components/lazy/LazyBoundaries';

function ProjectCard({ project }: { project: Project }) {
  const reservedDescLength = 200;
  const descToShow = project.shortDescription.length > reservedDescLength
    ? project.shortDescription.slice(0, reservedDescLength) + '...'
    : project.shortDescription;

  return (
    <div
      className="relative w-full neubrutalism-card flex flex-col transition-all duration-300"
      style={{ height: '500px' }} // slightly increased height
    >
      {/* Project Image - 16:9 aspect ratio */}
      <div className="relative w-full aspect-[16/9] border-b-4 border-black overflow-hidden flex-shrink-0">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Badges and Title */}
        <div className="flex flex-col gap-2 mb-2">
          <div className="flex gap-2 w-full">
            {project.featured && (
              <span className="bg-yellow-400 border-2 border-black px-2 py-1 font-black text-black text-xs shadow-[var(--shadow-neubrutalism-medium)] uppercase tracking-wide flex items-center justify-center min-w-[110px]">
                <span className="w-full text-center">FEATURED</span>
              </span>
            )}
            <span className="bg-orange-400 border-2 border-black px-2 py-1 font-black text-black text-xs shadow-[var(--shadow-neubrutalism-medium)] uppercase tracking-wide flex-1 flex items-center">
              {project.category}
            </span>
          </div>
          <h3 className="text-xl font-black uppercase tracking-tight leading-tight mt-1" style={{ color: 'var(--color-text)' }}>
            {project.title}
          </h3>
        </div>
        {/* Description - truncated for better card layout */}
        <p className="text-xs sm:text-sm text-white/70 leading-relaxed mb-3 flex-1 overflow-hidden" style={{ color: 'var(--color-text-secondary)' }}>
          {descToShow}
        </p>
        {/* Tech Stack */}
        <div className="flex flex-wrap gap-1 mb-3">
          {project.techStack.slice(0, 3).map((tech, index) => (
            <span
              key={index}
              className="bg-blue-500/20 border border-blue-300/30 px-2 py-1 text-xs font-bold text-blue-300 uppercase tracking-wide"
            >
              {tech}
            </span>
          ))}
          {project.techStack.length > 3 && (
            <span className="bg-white/10 border border-white/30 px-2 py-1 text-xs font-bold text-white/50 uppercase tracking-wide">
              +{project.techStack.length - 3}
            </span>
          )}
        </div>
        {/* Action Links */}
        <div className="flex gap-2">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="neubrutalism-button flex-1 text-center bg-green-500 border-green-500 text-black font-black uppercase tracking-wide text-xs px-2 py-2 hover:bg-green-400 transition-all duration-300"
            >
              Live Demo
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="neubrutalism-button flex-1 text-center border-white bg-transparent text-white font-black uppercase tracking-wide text-xs px-2 py-2 hover:bg-white hover:text-black transition-all duration-300"
            >
              GitHub
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProjectsClient() {
  const [filter, setFilter] = useState('all');
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<string[]>(['all']);
  const projects = getProjects();

  useEffect(() => {
    // Extract unique categories
    const uniqueCategories = ['all', ...Array.from(new Set(projects.map(project => project.category)))];
    setCategories(uniqueCategories);
    
    // Filter projects
    const filtered = filter === 'all' 
      ? projects 
      : projects.filter(project => project.category === filter);
    setFilteredProjects(filtered);
  }, [filter, projects]);

  const filterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    }),
    exit: { opacity: 0, scale: 0.8 }
  };

  return (
    <main className="relative w-full min-h-screen overflow-x-hidden" style={{ color: 'var(--color-text)' }}>
      <SplashCursorWrapper SPLAT_RADIUS={0.05} />
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* FaultyTerminal Background */}
        <div className="absolute inset-0 z-0">
          <LazyFaultyTerminal
            scale={1.5}
            gridMul={[4, 3]}
            digitSize={1.0}
            timeScale={0.8}
            scanlineIntensity={0.3}
            glitchAmount={0.8}
            flickerAmount={0.6}
            noiseAmp={0.9}
            chromaticAberration={1.5}
            curvature={0.1}
            tint="#ff8c42"
            mouseReact={true}
            mouseStrength={0.2}
            brightness={0.6}
          />
        </div>
        
        <div className="max-w-4xl mx-auto px-4 text-center relative z-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 drop-shadow-2xl" style={{ color: 'var(--color-text)' }}>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                style={{ color: '#ffffff' }}
              >
                My
              </motion.span>{" "}
              <span className="text-gradient-fire relative">
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                >
                  Projects
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
              className="text-lg md:text-xl mb-8 leading-relaxed drop-shadow-lg max-w-2xl mx-auto"
              style={{ color: '#ffffff' }}
            >
              A showcase of innovative digital experiences blending cutting-edge technology with creative design
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link 
                href="/"
                className="neubrutalism-button font-black uppercase tracking-wide"
                style={{ 
                  backgroundColor: 'var(--color-surface)',
                  borderColor: 'var(--color-accent)',
                  color: 'var(--color-text)'
                }}
              >
                ← Back to Home
              </Link>
              <a 
                href="#projects"
                className="neubrutalism-button border-orange-500 bg-orange-500 text-black font-black uppercase tracking-wide"
              >
                Explore Projects
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="relative z-10 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
              Featured <span className="text-orange-500">Work</span>
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--color-text-secondary)' }}>
              From concept to deployment - each project represents a unique challenge solved with modern technologies
            </p>
          </motion.div>

          {/* Filter Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            {categories.map((category) => (
              <motion.button
                key={category}
                onClick={() => setFilter(category)}
                className={`neubrutalism-button font-black uppercase tracking-wide px-4 py-2 text-xs ${
                  filter === category
                    ? 'bg-orange-500 border-orange-500 text-black'
                    : 'bg-transparent border-white text-white hover:bg-white hover:text-black'
                } transition-all duration-300`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category.replace(/([A-Z])/g, ' $1').trim()}
              </motion.button>
            ))}
          </motion.div>

          {/* Projects Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={filter}
              variants={filterVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={`${filter}-${project.id}`}
                  custom={index}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="h-full"
                >
                  <ProjectCard project={project} />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* No Projects Message */}
          {filteredProjects.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="text-xl" style={{ color: 'var(--color-text-secondary)' }}>
                No projects found for this category.
              </p>
            </motion.div>
          )}

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mt-20"
          >
            <h3 className="text-2xl md:text-3xl font-bold mb-6" style={{ color: 'var(--color-text)' }}>
              Interested in <span className="text-orange-500">Collaborating?</span>
            </h3>
            <p className="text-lg mb-8 max-w-2xl mx-auto" style={{ color: 'var(--color-text-secondary)' }}>
              I'm always excited to work on new challenges and innovative projects
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/about"
                className="neubrutalism-button font-black uppercase tracking-wide"
                style={{ 
                  backgroundColor: 'var(--color-surface)',
                  borderColor: 'var(--color-accent)',
                  color: 'var(--color-text)'
                }}
              >
                About Me
              </Link>
              <a 
                href="#contact"
                className="neubrutalism-button border-orange-500 bg-orange-500 text-black font-black uppercase tracking-wide"
              >
                Get In Touch
              </a>
            </div>
          </motion.div>
        </div>
      </section>
      
      <Footer />
    </main>
  );
}
