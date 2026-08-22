"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import React, { useState } from 'react';
import { FaGithub, FaLinkedin, FaTwitter, FaInstagram } from 'react-icons/fa';
import { HiMail } from 'react-icons/hi';
import { getFooterNavigationSections, getSocialLinks } from '../../../data';
import Logo from '../ui/Logo';

// Icon mapping for social links
const socialIconMap = {
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaInstagram
};

const charizardArt = String.raw`
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⠖⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡤⢤⡀⠀⠀⠀⠀⢸⠀⢱⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠳⡀⠈⠢⡀⠀⠀⢀⠀⠈⡄⠀⠀⠀⠀⠀⠀⠀⠀⡔⠦⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡤⠊⡹⠀⠀⠘⢄⠀⠈⠲⢖⠈⠀⠀⠱⡀⠀⠀⠀⠀⠀⠀⠀⠙⣄⠈⠢⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡠⠖⠁⢠⠞⠀⠀⠀⠀⠘⡄⠀⠀⠀⠀⠀⠀⠀⢱⠀⠀⠀⠀⠀⠀⠀⠀⠈⡆⠀⠀⠉⠑⠢⢄⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⡠⠚⠁⠀⠀⠀⡇⠀⠀⠀⠀⠀⢀⠇⠀⡤⡀⠀⠀⠀⢀⣼⠀⠀⠀⠀⠀⠀⠀⠀⠀⡇⢠⣾⣿⣷⣶⣤⣄⣉⠑⣄⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⢀⠞⢁⣴⣾⣿⣿⡆⢇⠀⠀⠀⠀⠀⠸⡀⠀⠂⠿⢦⡰⠀⠀⠋⡄⠀⠀⠀⠀⠀⠀⠀⢰⠁⣿⣿⣿⣿⣿⣿⣿⣿⣷⣌⢆⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⡴⢁⣴⣿⣿⣿⣿⣿⣿⡘⡄⠀⠀⠀⠀⠀⠱⣔⠤⡀⠀⠀⠀⠀⠀⠈⡆⠀⠀⠀⠀⠀⠀⡜⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣮⢣⠀⠀⠀⠀⠀
⠀⠀⠀⡼⢠⣾⣿⣿⣿⣿⣿⣿⣿⣧⡘⢆⠀⠀⠀⠀⠀⢃⠑⢌⣦⠀⠩⠉⠀⡜⠀⠀⠀⠀⠀⠀⢠⠃⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣧⣣⡀⠀⠀⠀
⠀⠀⢰⢃⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⠱⡀⠀⠀⠀⢸⠀⠀⠓⠭⡭⠙⠋⠀⠀⠀⠀⠀⠀⠀⡜⢰⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⡱⡄⠀⠀
⠀⠀⡏⣼⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣇⢃⠀⠀⠀⢸⠀⠀⠀⠀⢰⠀⠀⠀⠀⠀⠀⠀⢀⠜⢁⣼⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⠘⣆⠀
⠀⢸⢱⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡘⣆⠀⠀⡆⠀⠀⠀⠀⠘⡄⠀⠀⠀⠀⡠⠖⣡⣾⠁⣸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣧⢸⠀
⠀⡏⣾⣿⣿⣿⣿⡿⡛⢟⢿⣿⣿⣿⣿⣿⣿⣧⡈⢦⣠⠃⠀⠀⠀⠀⠀⢱⣀⠤⠒⢉⣾⡉⠻⠋⠈⢘⢿⣿⣿⣿⣿⠿⣿⣿⠏⠉⠻⢿⣿⣿⣿⣿⡘⡆
⢰⡇⣿⣿⠟⠁⢸⣠⠂⡄⣃⠜⣿⣿⠿⠿⣿⣿⡿⠦⡎⠀⠀⠀⠀⠀⠒⠉⠉⠑⣴⣿⣿⣎⠁⠠⠂⠮⢔⣿⡿⠉⠁⠀⠹⡛⢀⣀⡠⠀⠙⢿⣿⣿⡇⡇
⠘⡇⠏⠀⠀⠀⡾⠤⡀⠑⠒⠈⠣⣀⣀⡀⠤⠋⢀⡜⣀⣠⣤⣀⠀⠀⠀⠀⠀⠀⠙⢿⡟⠉⡃⠈⢀⠴⣿⣿⣀⡀⠀⠀⠀⠈⡈⠊⠀⠀⠀⠀⠙⢿⡇⡇
⠀⠿⠀⠀⠀⠀⠈⠀⠉⠙⠓⢤⣀⠀⠁⣀⡠⢔⡿⠊⠀⠀⠀⠀⠙⢦⡀⠀⠐⠢⢄⡀⠁⡲⠃⠀⡜⠀⠹⠟⠻⣿⣰⡐⣄⠎⠀⠀⠀⠀⠀⠀⠀⠀⢣⡇
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⠉⠁⠀⡜⠀⠀⠀⠀⠀⠀⠀⠀⠱⡀⠀⠀⠀⠙⢦⣀⢀⡴⠁⠀⠀⠀⠀⠉⠁⢱⠈⢆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢰⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⢱⠀⠀⠀⠀⠈⢏⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⡇⠈⡆⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡠⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡇⠀⠀⠀⠀⠀⠱⡄⠀⠀⠀⠀⠀⠀⠀⠀⡇⠀⢸⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡜⠀⢹⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⠀⠀⠀⠀⠀⠀⠘⣆⠀⠀⠀⠀⠀⠀⣰⠃⠀⠀⡇⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡾⠀⠀⠘⣆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠸⠁⠀⠀⠀⠀⠀⠀⠸⡄⠀⠀⠀⢀⡴⠁⠀⠀⢀⠇⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢧⠀⠀⠀⠘⢆⠀⠀⠀⠀⠀⠀⠀⠀⠀⡇⠀⠀⠀⠀⠀⠀⠀⠀⣧⣠⠤⠖⠋⠀⠀⠀⠀⡸⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠢⡀⠀⠀⠀⠳⢄⠀⠀⠀⠀⠀⠀⠀⢣⠀⠀⠀⠀⠀⠀⠀⠀⡏⠀⠀⠀⠀⠀⠀⢀⡴⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⡠⠊⠈⠁⠀⠀⠀⡔⠛⠲⣤⣀⣀⣀⠀⠈⢣⡀⠀⠀⠀⠀⠀⢸⠁⠀⠀⠀⢀⡠⢔⠝⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠐⢈⠤⠒⣀⠀⠀⠀⠀⣀⠟⠀⠀⠀⠑⠢⢄⡀⠀⠀⠈⡗⠂⠀⠀⠀⠙⢦⠤⠒⢊⡡⠚⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠆⠒⣒⡁⠬⠦⠒⠉⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⠒⢺⢠⠤⡀⢀⠤⡀⠠⠷⡊⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⠣⡀⡱⠧⡀⢰⠓⠤⡁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠁⠀⠈⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
`;

export default function Footer() {
  const navigationSections = getFooterNavigationSections();
  const socialLinks = getSocialLinks();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [subscribeError, setSubscribeError] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribeError('');
    if (!email.trim()) return setSubscribeError('Please enter your email');
    setIsLoading(true);
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsSubscribed(true);
        setEmail('');
        setTimeout(() => setIsSubscribed(false), 3000);
      } else {
        setSubscribeError(data?.error || 'Failed to subscribe');
      }
    } catch {
      setSubscribeError('Network error');
    }
    setIsLoading(false);
  };

  return (
    <footer className="relative overflow-hidden">
      {/* Main Footer Section — uses site color scheme */}
      <div
        className="relative border-t rounded-t-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(to bottom right, var(--color-bg-start), var(--color-surface), var(--color-bg-end))',
          color: 'var(--color-text)',
          borderColor: 'var(--color-border)',
        }}
      >
        {/* Grid Background Pattern */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="grid grid-cols-12 sm:grid-cols-24 lg:grid-cols-36 h-full opacity-[0.06]">
            {Array.from({ length: 72 }).map((_, i) => (
              <div key={i} className="border-r" style={{ borderColor: 'var(--color-accent)' }} />
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10 py-12 px-6 sm:px-8 lg:px-12">
          <div className="grid items-start gap-10 lg:grid-cols-[20rem_minmax(0,1fr)] xl:grid-cols-[20rem_18rem_minmax(0,1fr)] xl:gap-12">
            
            {/* Contact Section */}
            <div className="flex-shrink-0 w-full lg:w-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="space-y-4"
              >
                <div>
                  <h3 className="text-base sm:text-lg font-bold leading-tight mb-1" style={{ color: 'var(--color-text-muted)' }}>
                    LET&apos;S
                  </h3>
                  <h3 className="text-2xl sm:text-3xl font-bold leading-tight mb-4" style={{ color: 'var(--color-text)' }}>
                    <span className="block">WORK</span>
                    <span className="block" style={{ color: 'var(--color-accent)' }}>TOGETHER</span>
                  </h3>
                </div>
                
                <form onSubmit={handleSubscribe} className="mb-3 flex flex-col gap-2 sm:flex-row sm:gap-0 sm:rounded-xl overflow-hidden">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="EMAIL"
                    className="w-full sm:flex-1 px-3 py-2.5 font-bold text-sm rounded-l-xl sm:rounded-r-none border outline-none transition-colors placeholder:opacity-60"
                    style={{
                      backgroundColor: 'var(--color-surface-elevated)',
                      color: 'var(--color-text)',
                      borderColor: 'var(--color-accent)',
                    }}
                    required
                  />
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full sm:w-auto px-4 py-2.5 font-bold text-sm rounded-r-xl sm:rounded-l-none border-l-0 border transition-colors disabled:opacity-60"
                    style={{
                      backgroundColor: 'var(--color-accent)',
                      color: 'var(--color-button-text)',
                      borderColor: 'var(--color-accent)',
                    }}
                  >
                    {isLoading ? '...' : 'OK'}
                  </button>
                </form>
                
                {isSubscribed && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm font-bold"
                    style={{ color: 'var(--color-success)' }}
                  >
                    ✓ Thanks! I&apos;ll be in touch soon.
                  </motion.p>
                )}
                {subscribeError && <p className="text-sm font-bold" style={{ color: 'var(--color-error)' }}>{subscribeError}</p>}
                
                <p className="text-sm font-bold leading-tight" style={{ color: 'var(--color-text-secondary)' }}>
                  LET&apos;S TALK!!
                </p>
                
                <div className="flex items-center gap-2 text-sm font-bold mt-3" style={{ color: 'var(--color-text-muted)' }}>
                  <HiMail className="w-4 h-4" style={{ color: 'var(--color-accent)' }} />
                  <span>nhnishantharkut@gmail.com</span>
                </div>
              </motion.div>
            </div>

            <nav data-footer-navigation aria-label="Footer navigation" className="w-full">
              {navigationSections.map((section, idx) => (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 * (idx + 1) }}
                >
                  <h4 className="mb-4 text-base font-bold" style={{ color: 'var(--color-text)' }}>
                    {section.title}
                  </h4>
                  <ul className="grid grid-cols-2 gap-x-8 gap-y-3">
                    {section.links.map((link) => {
                      const linkClassName = 'block text-sm font-medium transition-colors hover:underline';
                      const linkStyle = { color: 'var(--color-text-secondary)' };
                      const isExternal = link.href.startsWith('http');

                      return (
                        <li key={link.href}>
                          {isExternal ? (
                            <a
                              href={link.href}
                              className={linkClassName}
                              style={linkStyle}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {link.label}
                            </a>
                          ) : (
                            <Link href={link.href} className={linkClassName} style={linkStyle}>
                              {link.label}
                            </Link>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </motion.div>
              ))}
            </nav>

            <pre
              data-footer-character-art
              aria-hidden="true"
              className="pointer-events-none hidden max-w-full select-none self-center justify-self-center overflow-hidden whitespace-pre font-mono text-[8px] leading-none xl:block"
              style={{ color: 'var(--color-text-muted)', opacity: 0.38 }}
            >
              {charizardArt}
            </pre>
          </div>
        </div>

        {/* Large Name Section */}
        <div
          className="relative z-10 mx-auto max-w-7xl border-t px-6 pb-5 pt-8 sm:px-8 lg:px-12"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col lg:flex-row items-center justify-between gap-6"
          >
            <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-bold leading-none tracking-tighter text-center lg:text-left" style={{ color: 'var(--color-text)' }}>
              NISHANT
            </h1>
            
            <div className="flex flex-col items-center lg:items-end text-center lg:text-right space-y-2">
              <p className="text-sm font-bold" style={{ color: 'var(--color-text-secondary)' }}>
                Open to work & collaborations
              </p>
              <p className="text-xs font-bold" style={{ color: 'var(--color-text-muted)' }}>
                © {new Date().getFullYear()} Nishant. All Rights Reserved
              </p>
              <Link
                href="/#contact"
                className="neubrutalism-button px-4 py-2.5 text-xs font-bold rounded-xl inline-block mt-2 text-center"
                style={{
                  backgroundColor: 'var(--color-accent)',
                  color: 'var(--color-button-text)',
                  borderColor: 'var(--color-text)',
                }}
              >
                HIRE ME
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Social Icons Bottom Bar */}
      <div
        className="py-4 rounded-b-2xl border-t"
        style={{
          backgroundColor: 'var(--color-bg-start)',
          borderColor: 'var(--color-border)',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center border"
              style={{
                backgroundColor: 'var(--color-surface-elevated)',
                borderColor: 'var(--color-accent)',
              }}
            >
              <Logo width={28} height={28} />
            </div>
            
            <div className="flex items-center gap-5">
              {socialLinks.map((link, index) => {
                const IconComponent = socialIconMap[link.icon as keyof typeof socialIconMap];
                return (
                  <a
                    key={index}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors duration-200"
                    style={{ color: 'var(--color-text-muted)' }}
                    aria-label={link.label}
                    onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-accent)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-muted)'; }}
                  >
                    {IconComponent && <IconComponent className="w-6 h-6" />}
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
