"use client";

import { motion } from 'framer-motion';
import TiltedCard from '../ui/TiltedCard';
  
export default function About() {
  return (
    <section id="about" className="relative py-12 sm:py-16 md:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold mb-12 section-heading"
          style={{ color: 'var(--color-text)' }}
        >
          About <span>Me</span>
        </motion.h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-8 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="space-y-6 order-2 lg:order-1"
          >
            <div className="space-y-4">
              <h3 
                className="text-xl sm:text-2xl font-semibold"
                style={{ color: 'var(--color-text)' }}
              >
                Full stack Developer
              </h3>
              <p
                className="text-sm sm:text-base leading-relaxed"
                style={{ color: 'var(--color-text-muted)' }}
              >
                I'm a full-stack developer focused on building exceptional web experiences where creative design meets cutting-edge technology. My approach centers on delivering digital solutions that captivate users while maintaining peak performance.
              </p>
              <p
                className="text-sm sm:text-base leading-relaxed"
                style={{ color: 'var(--color-text-muted)' }}
              >
                Whether building dynamic React applications, designing secure APIs, or orchestrating cloud deployments, I'm passionate about leveraging cutting-edge technologies to create resilient, high-performance web solutions.
              </p>
            </div>

            {/* Skills Tags */}
            <div className="flex flex-wrap gap-2 pt-4">
              {['Full-Stack', 'Frontend','Backend', '3D Graphics', 'AWS', 'UI/UX', 'WebAppSec', 'Graphic Design' ].map((skill, index) => (
                <motion.span
                  key={skill}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.6 + index * 0.05 }}
                  className="px-3 py-1.5 text-xs border-2 transition-all duration-300"
                  style={{ 
                    color: 'var(--color-text)',
                    borderColor: 'var(--color-accent)',
                    backgroundColor: 'var(--color-surface)',
                    boxShadow: '2px 2px 0px 0px var(--shadow-neubrutalism-small)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.transform = 'translate(2px, 2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '2px 2px 0px 0px var(--shadow-neubrutalism-small)';
                    e.currentTarget.style.transform = 'translate(0px, 0px)';
                  }}
                >
                  {skill}
                </motion.span>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 1.0 }}
              className="pt-4"
            >
              <a
                href="/about"
                className="inline-flex items-center gap-2 px-6 py-3 font-medium border-4 transition-all duration-300"
                style={{
                  backgroundColor: 'var(--color-accent)',
                  color: 'var(--color-button-text)',
                  borderColor: 'var(--color-text)',
                  boxShadow: '4px 4px 0px 0px var(--shadow-neubrutalism)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'translate(4px, 4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '4px 4px 0px 0px var(--shadow-neubrutalism)';
                  e.currentTarget.style.transform = 'translate(0px, 0px)';
                }}
              >
                Learn More
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
            </motion.div>
          </motion.div>

          {/* TiltedCard */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex justify-center order-1 lg:order-2"
          >
            <div className="w-64 sm:w-72 md:w-80 h-auto max-w-full">
              <TiltedCard
                imageSrc="/nishant-image.webp"
                altText="Nishant Harkut"
                captionText="Nishant Harkut"
                containerHeight="280px"
                containerWidth="280px"
                imageHeight="400px"
                imageWidth="300px"
                rotateAmplitude={9}
                scaleOnHover={1.2}
                showMobileWarning={false}
                showTooltip={true}
                displayOverlayContent={true}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
