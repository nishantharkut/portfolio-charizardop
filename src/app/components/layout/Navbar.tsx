"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useTheme } from '../../../contexts/ThemeContext';
import { getNavigationLinks } from '../../../data';

export default function Navbar() {
  const links = getNavigationLinks();
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();

  // Function to check if link is active
  const isActiveLink = (href: string) => {
    if (href === '/' && pathname === '/') return true;
    if (href !== '/' && pathname === href) return true;
    return false;
  };

  // Function to handle contact button click
  const handleContactClick = () => {
    if (pathname === '/') {
      // If on home page, scroll to contact section
      const contactSection = document.getElementById('contact');
      contactSection?.scrollIntoView({ behavior: 'smooth' });
    } else {
      // If on other pages, navigate to home page contact section
      window.location.href = '/#contact';
    }
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {/* Desktop Navbar */}
      <div className="fixed top-4 inset-x-0 z-50 flex justify-center px-4">
        <motion.nav
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="hidden lg:flex items-center gap-6 xl:gap-10 rounded-full pl-4 xl:pl-6 pr-3 h-14 xl:h-16 transition-all duration-300 max-w-7xl w-full glass"
        >
          <Link 
            href="/" 
            className="flex items-center justify-center w-10 xl:w-12 h-10 xl:h-12 glass-button text-xs xl:text-sm font-semibold tracking-widest hover:scale-105 transition-transform duration-300 overflow-hidden"
            style={{ color: 'var(--color-text)' }}
          >
            <Image
              src={theme === 'light' ? "/nishantharkut-logo-lightbg.png" : "/nishantharkut-logo.png"}
              alt="Nishant Arkut Logo"
              width={40}
              height={40}
              className="w-full h-full object-contain"
              priority
            />
          </Link>
          
          <div className="flex-1 flex items-center justify-center gap-6 xl:gap-8 text-xs xl:text-[13px]">
            {links.map(l => {
              const isActive = isActiveLink(l.href);
              return (
                <Link 
                  key={l.href} 
                  href={l.href} 
                  className={`relative py-1 transition-all duration-300 hover:opacity-80 group ${
                    isActive ? 'font-semibold' : ''
                  }`}
                  style={{ 
                    color: isActive ? 'var(--color-text)' : 'var(--color-text-muted)' 
                  }}
                >
                  {l.label}
                  <span 
                    className={`absolute left-1/2 -bottom-1 h-px transition-all duration-300 ${
                      isActive 
                        ? 'w-full left-0' 
                        : 'w-0 group-hover:w-full group-hover:left-0'
                    }`}
                    style={{ background: 'var(--color-accent-gradient)' }} 
                  />
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center w-8 xl:w-10 h-8 xl:h-10 glass-button transition-all duration-300"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" style={{ color: 'var(--color-accent)' }}>
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" style={{ color: 'var(--color-text-muted)' }}>
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
            
            <button 
              onClick={handleContactClick}
              className="glass-button text-xs xl:text-[12px] font-medium px-4 xl:px-6 py-2 xl:py-2.5 transition-all duration-300 fire-glow"
              style={{ 
                background: 'var(--color-accent-gradient)',
                color: 'white',
                border: 'none'
              }}
            >
              Connect Here
            </button>
          </div>
        </motion.nav>
      </div>

      {/* Mobile Navbar */}
      <div className="fixed top-4 inset-x-0 z-50 flex justify-center px-4 lg:hidden">
        <motion.nav
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="flex items-center justify-between rounded-full pl-4 pr-3 h-14 transition-all duration-300 w-full max-w-sm glass"
        >
          <Link 
            href="/" 
            className="flex items-center justify-center w-10 h-10 glass-button text-xs font-semibold tracking-widest hover:scale-105 transition-transform duration-300 overflow-hidden"
            style={{ color: 'var(--color-text)' }}
          >
            <Image
              src={theme === 'light' ? "/nishantharkut-logo-lightbg.png" : "/nishantharkut-logo.png"}
              alt="Nishant Arkut Logo"
              width={40}
              height={40}
              className="w-full h-full object-contain"
              priority
            />
          </Link>

          <div className="flex items-center gap-2">
            {/* Theme Toggle Mobile */}
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center w-8 h-8 glass-button transition-all duration-300"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" style={{ color: 'var(--color-accent)' }}>
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" style={{ color: 'var(--color-text-muted)' }}>
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
            
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex items-center justify-center w-8 h-8 glass-button transition-all duration-300"
              aria-label="Toggle menu"
            >
              <svg className="w-4 h-4" style={{ color: 'var(--color-text)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </motion.nav>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-20 left-4 right-4 z-40 lg:hidden"
          >
            <div className="glass-card rounded-2xl p-4">
              <div className="flex flex-col space-y-3">
                {links.map(l => {
                  const isActive = isActiveLink(l.href);
                  return (
                    <Link
                      key={l.href}
                      href={l.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`glass-button text-sm py-2 px-3 transition-all duration-300 ${
                        isActive ? 'font-semibold' : ''
                      }`}
                      style={{ 
                        color: isActive ? 'var(--color-text)' : 'var(--color-text-muted)',
                        background: isActive ? 'var(--color-accent-gradient)' : '',
                        border: isActive ? 'none' : ''
                      }}
                    >
                      {l.label}
                    </Link>
                  );
                })}
                <div className="pt-2">
                  <div className="section-divider mb-3" />
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleContactClick();
                    }}
                    className="block w-full text-center glass-button text-sm font-medium px-4 py-2.5 transition-all duration-300 fire-glow"
                    style={{ 
                      background: 'var(--color-accent-gradient)',
                      color: 'white',
                      border: 'none'
                    }}
                  >
                    Connect Here
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
