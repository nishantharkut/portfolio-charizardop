"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "../../../contexts/ThemeContext";
import { downloadResume } from "../../../utils/resume";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import Logo from "../ui/Logo";
import "../styles/Navbar.css";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { actualTheme, toggleTheme } = useTheme();
  const pathname = usePathname();

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  const isActiveLink = (href: string) => {
    if (href === "/" && pathname === "/") return true;
    if (href !== "/" && pathname.startsWith(href)) return true;
    return false;
  };

  const handleDownloadResume = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    downloadResume();
  }, []);

  // Navigation items — always link to their dedicated pages
  const navItems = [
    { href: "/experience", label: "EXPERIENCE" },
    { href: "/projects", label: "PROJECTS" },
    { href: "/achievements", label: "MILESTONES" },
  ];

  const handleNavClick = useCallback(() => {
    closeMobileMenu();
  }, [closeMobileMenu]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  // Close menu on ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMobileMenuOpen) closeMobileMenu();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isMobileMenuOpen, closeMobileMenu]);

  return (
    <>
      {/* Gradient fade below navbar */}
      <div className="navbar-fade" aria-hidden="true" />

      {/* Desktop navbar: [logo nishant.tech]   (empty center)   [EXPERIENCE  PROJECTS  MILESTONES] */}
      <header className="navbar navbar-desktop" role="banner">
        <div className="navbar-group navbar-group-left">
          <Link href="/" className="navbar-logo-link" aria-label="Home">
            <Logo width={40} height={40} className="navbar-logo-desktop flex-shrink-0" priority />
            <span className="navbar-brand">nishant.tech</span>
          </Link>
        </div>
        <div className="navbar-group navbar-group-center" />
        <nav className="navbar-group navbar-group-right" aria-label="Main">
          <ul className="navbar-links">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={isActiveLink(item.href) ? "navbar-link-active" : ""}
                  onClick={handleNavClick}
                  aria-current={isActiveLink(item.href) ? "page" : undefined}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      {/* Mobile navbar: logo + hamburger */}
      <header className="navbar navbar-mobile" role="banner">
        <div className="navbar-group navbar-group-left">
          <Link href="/" className="navbar-logo-link" aria-label="Home">
            <Logo width={32} height={32} className="navbar-logo-mobile flex-shrink-0" priority />
            <span className="navbar-brand">nishant.tech</span>
          </Link>
        </div>
        <button
          type="button"
          className={`navbar-hamburger ${isMobileMenuOpen ? "navbar-hamburger-open" : ""}`}
          onClick={toggleMobileMenu}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMobileMenuOpen}
        >
          <span className="navbar-hamburger-line" />
          <span className="navbar-hamburger-line" />
          <span className="navbar-hamburger-line" />
        </button>
      </header>

      {/* Mobile menu overlay */}
      <div
        className={`navbar-overlay ${isMobileMenuOpen ? "navbar-overlay-open" : ""}`}
        aria-hidden={!isMobileMenuOpen}
        aria-modal="true"
        role="dialog"
      >
        <div className="navbar-overlay-backdrop" onClick={closeMobileMenu} aria-hidden="true" />
        <div className="navbar-overlay-full">
          <header className="navbar-overlay-header">
            <Link href="/" className="navbar-overlay-brand" onClick={closeMobileMenu}>
              <Logo width={32} height={32} className="navbar-logo-mobile flex-shrink-0" priority />
              <span>nishant.tech</span>
            </Link>
            <div className="navbar-overlay-actions">
              <button type="button" onClick={toggleTheme} aria-label="Toggle theme" className="navbar-overlay-close">
                {actualTheme === "dark" ? (
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>
              <button type="button" className="navbar-overlay-close" onClick={closeMobileMenu} aria-label="Close menu">
                <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </header>
          <nav className="navbar-overlay-nav" aria-label="Mobile menu">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`navbar-overlay-link ${isActiveLink(item.href) ? 'navbar-overlay-link-active' : ''}`}
                onClick={handleNavClick}
                aria-current={isActiveLink(item.href) ? 'page' : undefined}
              >
                {item.label}
              </Link>
            ))}
            <button
              type="button"
              className="navbar-overlay-link navbar-overlay-download"
              onClick={(e) => {
                handleDownloadResume(e);
                closeMobileMenu();
              }}
            >
              RESUME
            </button>
          </nav>
        </div>
      </div>

      {/* Floating actions: theme + resume */}
      <div className="navbar-float-actions">
        <button type="button" onClick={toggleTheme} aria-label="Toggle theme" className="navbar-float-btn">
          {actualTheme === "dark" ? (
            <svg className="navbar-float-icon" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg className="navbar-float-icon" fill="currentColor" viewBox="0 0 20 20">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          )}
        </button>
        <button type="button" onClick={handleDownloadResume} aria-label="Download resume" className="navbar-float-btn">
          <ArrowDownTrayIcon className="navbar-float-icon" />
        </button>
      </div>
    </>
  );
}
