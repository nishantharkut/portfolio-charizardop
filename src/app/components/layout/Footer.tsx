"use client";

import { motion } from 'framer-motion';
import { useState } from 'react';
import { FaGithub, FaLinkedin, FaTwitter, FaInstagram } from 'react-icons/fa';
import { HiMail } from 'react-icons/hi';
import { getFooterNavigationSections, getSocialLinks } from '../../../data';
import { useTheme } from '../../../contexts/ThemeContext';
import Logo from '../ui/Logo';

// Icon mapping for social links
const socialIconMap = {
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaInstagram
};

export default function Footer() {
  const navigationSections = getFooterNavigationSections();
  const socialLinks = getSocialLinks();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const [subStatus, setSubStatus] = useState("");
  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubStatus("");
    if (email.trim()) {
      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        const data = await res.json();
        if (data.success) {
          setSubStatus("✓ Thanks! Check your inbox for updates.");
          setEmail("");
        } else {
          setSubStatus(data.error || "Failed to send email.");
        }
      } catch {
        setSubStatus("Network error. Please try again.");
      }
    }
  setTimeout(() => setSubStatus("");, 4000);
  };

  return (
    <footer className="relative overflow-hidden">
      {/* Main Footer Section */}
      <div className="bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 text-white relative">
        
        {/* Grid Background Pattern */}
        <div className="absolute inset-0">
          <div className="grid grid-cols-12 sm:grid-cols-24 lg:grid-cols-36 h-full opacity-5">
            {Array.from({ length: 72 }).map((_, i) => (
              <div key={i} className="border-r border-orange-500/10"></div>
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10 py-12 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-12 lg:gap-20">
            
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
                  <h3 className="text-base sm:text-lg font-black leading-tight mb-1">
                    LET&apos;S BUILD
                  </h3>
                  <h3 className="text-2xl sm:text-3xl font-black leading-tight mb-4">
                    <span className="block">SOMETHING</span>
                    <span className="block">AMAZING</span>
                  </h3>
                </div>
                
                {/* Mobile-friendly form */}
                <form onSubmit={handleSubscribe} className="mb-3 flex flex-col gap-2 sm:flex-row sm:gap-0">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="EMAIL"
                    className="w-full sm:flex-1 bg-white/10 text-white px-3 py-2 font-bold text-sm placeholder-white/60 
                               border border-white/20 outline-none focus:border-orange-500/50 backdrop-blur-sm"
                    required
                  />
                  <button
                    type="submit"
                    className="w-full sm:w-auto bg-orange-600 text-white px-4 py-2 font-bold text-sm 
                               border border-orange-600 hover:bg-orange-700 transition-colors"
                  >
                    OK
                  </button>
                </form>
                
                {subStatus && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`text-sm font-bold ${subStatus.startsWith('✓') ? 'text-green-400' : 'text-red-400'}`}
                  >
                    {subStatus}
                  </motion.p>
                )}
                
                <p className="text-sm font-bold leading-tight">
                  GET PROJECT UPDATES & INSIGHTS!
                </p>
                
                <div className="flex items-center gap-2 text-sm font-bold mt-3">
                  <HiMail className="w-4 h-4" />
                  <span>contact@nishant.dev</span>
                </div>
              </motion.div>
            </div>

            {/* Navigation Sections */}
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-12 flex-1 w-full">
              {navigationSections.map((section, idx) => (
                <div key={idx} className="flex-1">
                  
                  {/* Mobile: Accordion */}
                  <div className="block lg:hidden">
                    <details>
                      <summary className="text-base font-black cursor-pointer mb-2">
                        {section.title}
                      </summary>
                      <ul className="space-y-2 pl-2">
                        {section.links.map((link, index) => (
                          <li key={index}>
                            <a
                              href={link.href}
                              className="text-sm font-medium hover:underline block"
                              target={link.href.startsWith('http') ? '_blank' : '_self'}
                              rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                            >
                              {link.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </details>
                  </div>

                  {/* Desktop: Normal list */}
                  <div className="hidden lg:block">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.1 * (idx + 1) }}
                    >
                      <h4 className="text-base font-black mb-3">{section.title}</h4>
                      <ul className="space-y-2">
                        {section.links.map((link, index) => (
                          <li key={index}>
                            <a
                              href={link.href}
                              className="text-sm font-medium hover:underline block"
                              target={link.href.startsWith('http') ? '_blank' : '_self'}
                              rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                            >
                              {link.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Large Name Section */}
        <div className="max-w-7xl mx-auto relative z-10 px-4 sm:px-6 lg:px-8 mt-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col lg:flex-row items-center justify-between gap-6"
          >
            <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black text-white leading-none tracking-tighter text-center lg:text-left">
              NISHANT
            </h1>
            
            <div className="flex flex-col items-center lg:items-end text-center lg:text-right space-y-2">
              <p className="text-sm font-bold text-white/90">
                Open to work & collaborations
              </p>
              <p className="text-xs font-bold text-white/70">
                © {new Date().getFullYear()} Nishant. All Rights Reserved
              </p>
              <a 
                href="#contact"
                className="bg-orange-600 text-white px-4 py-2 text-xs font-bold hover:bg-orange-700 transition-colors inline-block mt-2"
              >
                HIRE ME
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Social Icons Bottom Bar */}
      <div className="bg-black py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-600 to-orange-700 rounded-full flex items-center justify-center">
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
                    className="text-white/70 hover:text-orange-500 transition-colors"
                    aria-label={link.label}
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