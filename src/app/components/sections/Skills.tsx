"use client";

import { motion } from 'framer-motion';
import { getSkillGroups } from '../../../data';

export default function Skills() {
  const skillGroups = getSkillGroups();

  return (
    <section id="skills" className="relative py-12 sm:py-16 md:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold mb-12"
          style={{ color: 'var(--color-text)' }}
        >
          Skills Stack
        </motion.h2>
        <div className="grid gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((group, i) => (
            <motion.div
              key={group.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.55, delay: i * 0.05 }}
              className="group p-6 min-h-[200px] flex flex-col border-4 transition-all duration-300 neubrutalism-card"
              style={{ 
                backgroundColor: 'var(--color-surface)',
                borderColor: 'var(--color-accent)',
                boxShadow: '8px 8px 0px 0px var(--shadow-neubrutalism)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '4px 4px 0px 0px var(--shadow-neubrutalism-hover)';
                e.currentTarget.style.transform = 'translate(4px, 4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '8px 8px 0px 0px var(--shadow-neubrutalism)';
                e.currentTarget.style.transform = 'translate(0px, 0px)';
              }}
            >
              <h3 className="font-bold mb-4 text-lg tracking-wide uppercase" style={{ color: 'var(--color-accent)' }}>{group.title}</h3>
              <ul className="flex flex-wrap gap-2 flex-1 content-start overflow-hidden">
                {group.items.map(item => (
                  <li 
                    key={item} 
                    className="text-xs px-3 py-1 font-medium w-fit transition-all duration-300 uppercase tracking-wide border-2"
                    style={{
                      backgroundColor: 'var(--color-surface-elevated)',
                      color: 'var(--color-text)',
                      borderColor: 'var(--color-accent)',
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
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
