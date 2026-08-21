"use client";

import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Hero from './components/sections/Hero';
import PerformanceIndicator from './components/ui/PerformanceIndicator';
import { ScrollTrigger } from '@/utils/gsap';

const Bento = dynamic(() => import('./components/sections/Bento'), {
  loading: () => <div className="min-h-[400px]" />,
  ssr: true
});

const About = dynamic(() => import('./components/sections/About'), {
  loading: () => <div className="min-h-[600px]" />,
  ssr: true
});

const GitHubStats = dynamic(() => import('./components/sections/GitHubStats'), {
  loading: () => <div className="min-h-[200px]" />,
  ssr: false
});

const Experience = dynamic(() => import('./components/sections/Experience'), {
  loading: () => <div className="min-h-[800px]" />,
  ssr: true
});

const Skills = dynamic(() => import('./components/sections/Skills'), {
  loading: () => <div className="min-h-[500px]" />,
  ssr: true
});

const Projects = dynamic(() => import('./components/sections/Projects'), {
  loading: () => <div className="min-h-[800px]" />,
  ssr: true
});

const Contact = dynamic(() => import('./components/sections/Contact'), {
  loading: () => <div className="min-h-[400px]" />,
  ssr: true
});

export default function Home() {
  useEffect(() => {
    const timer1 = setTimeout(() => ScrollTrigger.refresh(), 500);
    const timer2 = setTimeout(() => ScrollTrigger.refresh(), 1500);
    return () => { clearTimeout(timer1); clearTimeout(timer2); };
  }, []);

  return (
    <main className="relative w-full min-h-screen overflow-x-hidden">
      <PerformanceIndicator />
      <Navbar />
      
      <Hero />
      
      <Bento />

      <About />

      <GitHubStats showTitle={false} compact={true} />

      <Experience />

      <Skills />

      <Projects />

      <Contact />

      <Footer />
    </main>
  );
}
