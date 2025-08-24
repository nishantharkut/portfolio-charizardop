"use client";

import { motion } from 'framer-motion';

export default function Contact() {
  return (
    <section id="contact" className="relative py-28">
      <div className="max-w-4xl mx-auto px-6 md:px-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold mb-8"
          style={{ color: 'var(--color-text)' }}
        >
          Get In Touch
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.65 }}
          className="text-lg mb-8 max-w-2xl"
          style={{ color: 'var(--color-text-muted)' }}
        >
          I&apos;m open to collaborations, freelance opportunities, or just a good conversation about emerging tech, design systems, or creative 3D on the web.
        </motion.p>
        <div className="min-h-[200px] flex flex-col justify-center border-4 p-8 max-w-xl neubrutalism-card" 
          style={{ 
            backgroundColor: 'var(--color-surface)', 
            borderColor: 'var(--color-accent)',
            boxShadow: '8px 8px 0px 0px var(--shadow-neubrutalism)'
          }}>
          <form className="grid gap-6">
            <div className="grid gap-2">
              <label className="text-sm font-medium uppercase tracking-wide" style={{ color: 'var(--color-text)' }}>Name</label>
              <input 
                type="text" 
                className="px-4 py-3 text-sm border-2 focus:outline-none transition-all" 
                placeholder="Ash Ketchum"
                style={{ 
                  color: 'var(--color-text)', 
                  backgroundColor: 'var(--color-surface-elevated)',
                  borderColor: 'var(--color-accent)'
                }}
                onFocus={(e) => {
                  e.target.style.boxShadow = '3px 3px 0px 0px var(--shadow-neubrutalism)';
                }}
                onBlur={(e) => {
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium uppercase tracking-wide" style={{ color: 'var(--color-text)' }}>Email</label>
              <input 
                type="email" 
                className="px-4 py-3 text-sm border-2 focus:outline-none transition-all" 
                placeholder="you@example.com"
                style={{ 
                  color: 'var(--color-text)', 
                  backgroundColor: 'var(--color-surface-elevated)',
                  borderColor: 'var(--color-accent)'
                }}
                onFocus={(e) => {
                  e.target.style.boxShadow = '3px 3px 0px 0px var(--shadow-neubrutalism)';
                }}
                onBlur={(e) => {
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium uppercase tracking-wide" style={{ color: 'var(--color-text)' }}>Message</label>
              <textarea 
                rows={4} 
                className="px-4 py-3 text-sm resize-none border-2 focus:outline-none transition-all" 
                placeholder="Let's build something amazing..."
                style={{ 
                  color: 'var(--color-text)', 
                  backgroundColor: 'var(--color-surface-elevated)',
                  borderColor: 'var(--color-accent)'
                }}
                onFocus={(e) => {
                  e.target.style.boxShadow = '3px 3px 0px 0px var(--shadow-neubrutalism)';
                }}
                onBlur={(e) => {
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
            <button 
              type="submit" 
              className="justify-self-start px-6 py-3 font-medium w-fit transition-all duration-300 uppercase tracking-wide border-4 neubrutalism-button"
              style={{
                backgroundColor: 'var(--color-accent)',
                color: 'var(--color-button-text)',
                borderColor: 'var(--color-text)',
                boxShadow: '3px 3px 0px 0px var(--shadow-neubrutalism)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'translate(3px, 3px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '3px 3px 0px 0px var(--shadow-neubrutalism)';
                e.currentTarget.style.transform = 'translate(0px, 0px)';
              }}
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
