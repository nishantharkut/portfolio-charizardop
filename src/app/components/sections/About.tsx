"use client";

import { motion } from 'framer-motion';
import TiltedCard from '../ui/TiltedCard';
  
export default function About() {
  return (
    <section id="about" className="relative py-12 md:py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-8 md:mb-12 text-center"
          style={{ color: 'var(--color-text)' }}
        >
          About Me
        </motion.h2>
        
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16">
          {/* Mobile/Tablet: Content First, Desktop: TiltedCard Left */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:order-2 space-y-6"
          >
            <div className="space-y-4">
              <h3 
                className="text-xl sm:text-2xl font-semibold"
                style={{ color: 'var(--color-text)' }}
              >
                Multi-Disciplinary Creator
              </h3>
              <p
                className="text-base sm:text-lg leading-relaxed"
                style={{ color: 'var(--color-text-muted)' }}
              >
                I am a multi-disciplinary creator blending engineering and design to craft immersive, performant web experiences. From <span className="font-medium" style={{ color: 'var(--color-text)' }}>frontend</span> micro-interactions and visually rich <span className="font-medium" style={{ color: 'var(--color-text)' }}>3D interfaces</span> to scalable <span className="font-medium" style={{ color: 'var(--color-text)' }}>backend architecture</span>, I enjoy owning the full stack.
              </p>
            </div>

            <div className="space-y-4">
              <h4 
                className="text-lg sm:text-xl font-medium"
                style={{ color: 'var(--color-text)' }}
              >
                Creative & Technical Expertise
              </h4>
              <p
                className="text-sm sm:text-base leading-relaxed"
                style={{ color: 'var(--color-text-muted)' }}
              >
                My creative background in <span className="font-medium" style={{ color: 'var(--color-text)' }}>UI/UX</span>, <span className="font-medium" style={{ color: 'var(--color-text)' }}>graphic design</span>, and <span className="font-medium" style={{ color: 'var(--color-text)' }}>video editing</span> helps me ship cohesive, branded experiences. I'm continuously exploring <span className="font-medium" style={{ color: 'var(--color-text)' }}>cybersecurity practices</span> and leveraging emerging <span className="font-medium" style={{ color: 'var(--color-text)' }}>AI/ML</span> tools to accelerate development and creativity.
              </p>
            </div>

            {/* Skills/Interests Tags */}
            <div className="flex flex-wrap gap-2 pt-4">
              {['Frontend', '3D Interfaces', 'Backend', 'UI/UX', 'Graphic Design', 'Video Editing', 'Cybersecurity', 'AI/ML'].map((skill, index) => (
                <motion.span
                  key={skill}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.6 + index * 0.05 }}
                  className="px-3 py-1.5 text-xs sm:text-sm rounded-full border transition-all duration-200 hover:scale-105 hover:shadow-sm"
                  style={{ 
                    color: 'var(--color-text)',
                    borderColor: 'var(--color-border)',
                    backgroundColor: 'var(--color-background-muted)'
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
              className="pt-6"
            >
              <a
                href="/about#who-i-am"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#ff9a1c] to-[#ff6b35] text-white rounded-full font-medium transition-all duration-300 hover:shadow-lg hover:shadow-[#ff9a1c]/25 hover:scale-105"
              >
                Learn More About Me
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
            </motion.div>
          </motion.div>

          {/* TiltedCard - Mobile: Second, Desktop: Left */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="lg:order-1 flex justify-center lg:justify-start mt-8 lg:mt-0"
          >
            <div className="w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-full lg:h-auto lg:max-w-sm lg:aspect-square">
              <TiltedCard
                imageSrc="https://i.scdn.co/image/ab67616d0000b273d9985092cd88bffd97653b58"
                altText="Nishant Harkut"
                captionText="Nishant Harkut"
                containerHeight="100%"
                containerWidth="100%"
                imageHeight="100%"
                imageWidth="100%"
                rotateAmplitude={8}
                scaleOnHover={1.03}
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
