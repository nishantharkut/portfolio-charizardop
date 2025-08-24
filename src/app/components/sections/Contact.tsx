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
        <div className="min-h-[200px] flex flex-col justify-center border-4 border-black shadow-[8px_8px_0px_black] p-8 max-w-xl" style={{ backgroundColor: 'var(--color-surface)' }}>
          <form className="grid gap-6">
            <div className="grid gap-2">
              <label className="text-sm font-medium uppercase tracking-wide" style={{ color: 'var(--color-text)' }}>Name</label>
              <input 
                type="text" 
                className="px-4 py-3 text-sm border-2 border-black focus:outline-none focus:shadow-[3px_3px_0px_black] transition-all" 
                placeholder="Ash Ketchum"
                style={{ color: 'var(--color-text)', backgroundColor: 'var(--color-surface-elevated)' }}
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium uppercase tracking-wide" style={{ color: 'var(--color-text)' }}>Email</label>
              <input 
                type="email" 
                className="px-4 py-3 text-sm border-2 border-black focus:outline-none focus:shadow-[3px_3px_0px_black] transition-all" 
                placeholder="you@example.com"
                style={{ color: 'var(--color-text)', backgroundColor: 'var(--color-surface-elevated)' }}
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium uppercase tracking-wide" style={{ color: 'var(--color-text)' }}>Message</label>
              <textarea 
                rows={4} 
                className="px-4 py-3 text-sm resize-none border-2 border-black focus:outline-none focus:shadow-[3px_3px_0px_black] transition-all" 
                placeholder="Let's build something amazing..."
                style={{ color: 'var(--color-text)', backgroundColor: 'var(--color-surface-elevated)' }}
              />
            </div>
            <button 
              type="submit" 
              className="justify-self-start px-6 py-3 font-medium bg-orange-500 text-white w-fit transition-all shadow-[3px_3px_0px_black] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] uppercase tracking-wide"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
