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
          className="text-3xl md:text-4xl font-bold mb-12"
          style={{ color: 'var(--color-text)' }}
        >
          About Me
        </motion.h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <h3 
                className="text-xl font-semibold"
                style={{ color: 'var(--color-text)' }}
              >
                Creative Technologist
              </h3>
              <p
                className="text-base leading-relaxed"
                style={{ color: 'var(--color-text-muted)' }}
              >
                I'm a passionate full-stack developer with over 7 years of experience creating immersive web experiences. I specialize in combining creative design with cutting-edge technology to build digital solutions that are both functional and beautiful.
              </p>
              <p
                className="text-base leading-relaxed"
                style={{ color: 'var(--color-text-muted)' }}
              >
                From React and Next.js to Three.js and WebGL, I love exploring new technologies and pushing the boundaries of what's possible on the web.
              </p>
            </div>

            {/* Skills Tags */}
            <div className="flex flex-wrap gap-2 pt-4">
              {['Frontend', '3D Graphics', 'Backend', 'UI/UX', 'WebGL', 'React', 'Next.js', 'Node.js'].map((skill, index) => (
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
            className="flex justify-center"
          >
            <div className="w-80 h-80 max-w-full">
              <TiltedCard
                imageSrc="https://i.scdn.co/image/ab67616d0000b273d9985092cd88bffd97653b58"
                altText="Nishant Harkut"
                captionText="Nishant Harkut"
                containerHeight="320px"
                containerWidth="320px"
                imageHeight="280px"
                imageWidth="280px"
                rotateAmplitude={6}
                scaleOnHover={1.02}
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
