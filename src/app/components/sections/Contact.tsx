"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function Contact() {
  return (
    <section id="contact" className="relative py-12 sm:py-16 md:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
           <h2 className="section-heading">
          Get in <span>touch</span>
        </h2>
           <p
             className="text-lg max-w-2xl mx-auto -mt-8"
             style={{ color: 'var(--color-text-muted)' }}
           >
            I&apos;m open to collaborations, freelance opportunities, or just a good conversation about emerging tech, design systems, or creative 3D on the web.
          </p>
        </motion.div>

        {/* Unified Contact Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8 }}
          className="border-4 p-8 lg:p-12 neubrutalism-card"
          style={{ 
            backgroundColor: 'var(--color-surface)', 
            borderColor: 'var(--color-accent)',
            boxShadow: '12px 12px 0px 0px var(--shadow-neubrutalism)'
          }}
        >
          {/* Two Column Layout Inside Card */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 relative">
            {/* Left Column - Contact Form */}
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl lg:text-3xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
                  Send me a message
                </h3>
                <p className="text-sm lg:text-base leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                  Ready to collaborate? Drop me a line and let&apos;s discuss your next project or opportunity.
                </p>
              </div>
              <ContactForm />
            </div>

            {/* Vertical Separator Line */}
            <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-orange-500/30 to-transparent transform -translate-x-1/2"></div>

            {/* Right Column - Contact Info */}
            <div className="space-y-8">
              <div>
                <p className="text-sm lg:text-base leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                  Connect with me through these channels for faster communication and collaboration.
                </p>
              </div>

              {/* Contact Details */}
              <div className="space-y-6">
                {/* Email Contact */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 border-2 border-orange-500 bg-orange-500 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm uppercase tracking-wide mb-2" style={{ color: 'var(--color-text)' }}>
                      Email me
                    </h4>
                    <p className="text-orange-400 font-medium text-sm">nishantharkut@gmail.com</p>
                  </div>
                </div>

                {/* LinkedIn Contact */}
                <a href="https://linkedin.com/in/nishant-harkut" target="_blank" rel="noopener noreferrer" className="flex items-start gap-4 hover:opacity-80 transition-opacity duration-300">
                  <div className="w-12 h-12 border-2 border-orange-500 bg-orange-500 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm uppercase tracking-wide mb-2" style={{ color: 'var(--color-text)' }}>
                      Connect on LinkedIn
                    </h4>
                    <p className="text-orange-400 font-medium text-sm">linkedin.com/in/nishant-harkut</p>
                  </div>
                </a>

                {/* GitHub Contact */}
                <a href="https://github.com/nishantharkut" target="_blank" rel="noopener noreferrer" className="flex items-start gap-4 hover:opacity-80 transition-opacity duration-300">
                  <div className="w-12 h-12 border-2 border-orange-500 bg-orange-500 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm uppercase tracking-wide mb-2" style={{ color: 'var(--color-text)' }}>
                      Checkout my Repos
                    </h4>
                    <p className="text-orange-400 font-medium text-sm">github.com/nishantharkut</p>
                  </div>
                </a>
              </div>

              {/* Divider */}
              <div className="border-t-2" style={{ borderColor: 'var(--color-accent)' }}></div>

              {/* Social Media & Response Info */}
              <div className="space-y-6">
                <div className="text-center">
                  <h4 className="font-bold text-base mb-4" style={{ color: 'var(--color-text)' }}>
                    Let's Connect on Socials
                  </h4>
                  <div className="flex gap-3 justify-center">
                    <a href="https://x.com/HarkutNishant" target="_blank" rel="noopener noreferrer" className="w-10 h-10 border-2 border-orange-500 bg-orange-500 flex items-center justify-center hover:opacity-80 transition-opacity duration-300">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                      </svg>
                    </a>
                    <a href="https://devfolio.co/@CharizardOP" target="_blank" rel="noopener noreferrer" className="w-10 h-10 border-2 border-orange-500 bg-orange-500 flex items-center justify-center hover:opacity-80 transition-opacity duration-300">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z"/>
                      </svg>
                    </a>
                    <a href="https://www.instagram.com/nishant.harkut/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 border-2 border-orange-500 bg-orange-500 flex items-center justify-center hover:opacity-80 transition-opacity duration-300">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </a>
                  </div>
                </div>

                {/* Response Time */}
                <div className="p-4 border-2 neubrutalism-button"
                  style={{ 
                    backgroundColor: 'var(--color-surface-elevated)', 
                    borderColor: 'var(--color-accent)',
                    boxShadow: '4px 4px 0px 0px var(--shadow-neubrutalism)'
                  }}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-6 h-6 border-2 border-orange-500 bg-orange-500 flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h4 className="font-bold text-sm" style={{ color: 'var(--color-text)' }}>
                      Quick Response
                    </h4>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                    I typically respond within <span className="text-orange-400 font-semibold">24 hours</span>. 
                    For urgent matters, reach out on LinkedIn.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg('');
    if (!email || !message) {
      setErrorMsg('Please provide your email and a message.');
      return;
    }
    setStatus('loading');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject: `Message from ${name || email}`, message, from: email }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStatus('success');
        setName('');
        setEmail('');
        setMessage('');
      } else {
        setStatus('error');
        setErrorMsg(data?.error || 'Failed to send message');
      }
    } catch (err) {
      setStatus('error');
      setErrorMsg('Network error');
    }
    setTimeout(() => setStatus('idle'), 3500);
  }

  return (
    <form className="grid gap-6" onSubmit={handleSubmit}>
      <div className="grid gap-2">
        <label className="text-sm font-medium uppercase tracking-wide" style={{ color: 'var(--color-text)' }}>Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
          className="px-4 py-3 text-sm border-2 focus:outline-none transition-all"
          placeholder="Ash Ketchum"
          style={{
            color: 'var(--color-text)',
            backgroundColor: 'var(--color-surface-elevated)',
            borderColor: 'var(--color-accent)'
          }}
        />
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-medium uppercase tracking-wide" style={{ color: 'var(--color-text)' }}>Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          className="px-4 py-3 text-sm border-2 focus:outline-none transition-all"
          placeholder="you@example.com"
          style={{
            color: 'var(--color-text)',
            backgroundColor: 'var(--color-surface-elevated)',
            borderColor: 'var(--color-accent)'
          }}
          required
        />
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-medium uppercase tracking-wide" style={{ color: 'var(--color-text)' }}>Message</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          className="px-4 py-3 text-sm resize-none border-2 focus:outline-none transition-all"
          placeholder="Let's build something amazing..."
          style={{
            color: 'var(--color-text)',
            backgroundColor: 'var(--color-surface-elevated)',
            borderColor: 'var(--color-accent)'
          }}
          required
        />
      </div>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={status === 'loading'}
          className="justify-self-start px-6 py-3 font-medium w-fit transition-all duration-300 uppercase tracking-wide border-4 neubrutalism-button"
          style={{
            backgroundColor: 'var(--color-accent)',
            color: 'var(--color-button-text)',
            borderColor: 'var(--color-text)',
            boxShadow: '3px 3px 0px 0px var(--shadow-neubrutalism)'
          }}
        >
          {status === 'loading' ? 'Sending...' : 'Send Message'}
        </button>
        {status === 'success' && <span className="text-sm font-bold text-green-400">Sent ✓</span>}
        {status === 'error' && <span className="text-sm font-bold text-red-400">{errorMsg}</span>}
      </div>
    </form>
  );
}
