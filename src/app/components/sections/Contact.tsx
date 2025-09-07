"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function Contact() {
  return (
    <section id="contact" className="relative py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6" style={{ color: 'var(--color-text)' }}>
            Get In <span className="text-orange-500">Touch</span>
          </h2>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8" style={{ color: 'var(--color-text-secondary)' }}>
            I&apos;m open to collaborations, freelance opportunities, or just a good conversation about emerging tech, design systems, or creative 3D on the web.
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center"
        >
          <div className="w-full max-w-2xl neubrutalism-card p-8" 
            style={{ 
              backgroundColor: 'var(--color-surface)', 
              borderColor: 'var(--color-accent)'
            }}>
            <ContactForm />
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

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          type="submit"
          disabled={status === 'loading'}
          className="px-6 py-3 font-black uppercase tracking-wide text-center inline-flex items-center justify-center gap-2 text-sm w-fit neubrutalism-button"
          style={{
            backgroundColor: 'var(--color-accent)',
            color: 'var(--color-button-text)',
            borderColor: 'var(--color-text)'
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
