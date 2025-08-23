"use client";

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Hero from './components/sections/Hero';
import SplashCursor from './components/ui/SplashCursor';
import PerformanceIndicator from './components/ui/PerformanceIndicator';

// Import sections directly - lazy loading was causing visibility issues
import Bento from './components/sections/Bento';
import About from './components/sections/About';
import Experience from './components/sections/Experience';
import Skills from './components/sections/Skills';
import Projects from './components/sections/Projects';
import Contact from './components/sections/Contact';

export default function Home() {

  return (
    <main className="relative w-full min-h-screen overflow-x-hidden">
      <SplashCursor SPLAT_RADIUS={0.05}/>
      <PerformanceIndicator />
      <Navbar />
      
      {/* Hero loads immediately - critical above fold content */}
      <Hero />
      
      <div className="section-divider my-8 sm:my-12 md:my-16" />
      
      {/* Test sections one by one */}
      <Bento />
      
      <div className="section-divider my-12 sm:my-16 md:my-20" />
      
      <About />
      
      <Experience />
      
      <div className="section-divider my-8 sm:my-12 md:my-16" />
      
      <Skills />
      
      <Projects />
      
      <div className="section-divider my-8 sm:my-12 md:my-16" />
      
      <Contact />
      
      <Footer />
    </main>
  );
}
