"use client";

import dynamic from 'next/dynamic';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Hero from './components/sections/Hero';
import SplashCursorWrapper from './components/ui/SplashCursorWrapper';
import PerformanceIndicator from './components/ui/PerformanceIndicator';

// Lazy load non-critical sections with loading states that match existing heights
const Bento = dynamic(() => import('./components/sections/Bento'), {
  loading: () => <div className="min-h-[400px] flex items-center justify-center">
    <div className="animate-pulse bg-gray-200 dark:bg-gray-800 rounded-lg w-full h-full"></div>
  </div>,
  ssr: true
});

const About = dynamic(() => import('./components/sections/About'), {
  loading: () => <div className="min-h-[600px] flex items-center justify-center">
    <div className="animate-pulse bg-gray-200 dark:bg-gray-800 rounded-lg w-full h-full"></div>
  </div>,
  ssr: true
});

const Experience = dynamic(() => import('./components/sections/Experience'), {
  loading: () => <div className="min-h-[800px] flex items-center justify-center">
    <div className="animate-pulse bg-gray-200 dark:bg-gray-800 rounded-lg w-full h-full"></div>
  </div>,
  ssr: true
});

const Skills = dynamic(() => import('./components/sections/Skills'), {
  loading: () => <div className="min-h-[500px] flex items-center justify-center">
    <div className="animate-pulse bg-gray-200 dark:bg-gray-800 rounded-lg w-full h-full"></div>
  </div>,
  ssr: true
});

const Projects = dynamic(() => import('./components/sections/Projects'), {
  loading: () => <div className="min-h-[800px] flex items-center justify-center">
    <div className="animate-pulse bg-gray-200 dark:bg-gray-800 rounded-lg w-full h-full"></div>
  </div>,
  ssr: true
});

const Contact = dynamic(() => import('./components/sections/Contact'), {
  loading: () => <div className="min-h-[400px] flex items-center justify-center">
    <div className="animate-pulse bg-gray-200 dark:bg-gray-800 rounded-lg w-full h-full"></div>
  </div>,
  ssr: true
});

const CodingStats = dynamic(() => import('./components/sections/CodingStats'), {
  loading: () => <div className="min-h-[600px] flex items-center justify-center">
    <div className="animate-pulse bg-gray-200 dark:bg-gray-800 rounded-lg w-full h-full"></div>
  </div>,
  ssr: false
});

export default function Home() {

  return (
    <main className="relative w-full min-h-screen overflow-x-hidden">
      <SplashCursorWrapper SPLAT_RADIUS={0.05}/>
      <PerformanceIndicator />
      <Navbar />
      
      {/* Hero loads immediately - critical above fold content */}
      <Hero />
      
      <div className="section-divider my-8 sm:my-12 md:my-16" />
      
      {/* Test sections one by one */}
      <Bento />
      
      <div className="section-divider my-12 sm:my-16 md:my-20" />
      
      <About />
      
      <div className="section-divider my-8 sm:my-12 md:my-16" />
      
      <Experience />
      
      <div className="section-divider my-8 sm:my-12 md:my-16" />
      
      <CodingStats />
      
      <div className="section-divider my-8 sm:my-12 md:my-16" />
      
      <Skills />
      
      <div className="section-divider my-8 sm:my-12 md:my-16" />
      
      <Projects />
      
      <div className="section-divider my-8 sm:my-12 md:my-16" />
      
      <Contact />
      
      <Footer />
    </main>
  );
}
