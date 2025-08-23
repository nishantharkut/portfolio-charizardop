"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/utils/gsap";
import "../styles/Experience.css";

interface ExperienceItem {
  position: string;
  company: string;
  year: string;
  description: string;
}

const experienceData: ExperienceItem[] = [
  {
    position: "Senior web developer",
    company: "Blue Cube Digital",
    year: "2017",
    description: "Developed and managed web projects, including frontend/backend, CMS dashboards, and responsive, accessible web pages with PHP, MySQL, and JavaScript."
  },
  {
    position: "Associate Solution Leader",
    company: "Brane Enterprises",
    year: "2020",
    description: "Built web features, product prototypes, and reusable components/microservices, implemented UI improvements and 3D UI interface compatible with Typescript."
  },
  {
    position: "Freelance & Upskilling",
    company: "Freelance",
    year: "NOW",
    description: "During this period, I worked as a freelancer for various clients, providing 3D and web services, while actively upskilling also in multiple areas increasing my Techstack."
  }
];

const Experience = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const sparkRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    console.log('Experience: Starting GSAP setup');
    
    const ctx = gsap.context(() => {
      const isMobile = window.innerWidth <= 768;
      console.log('Experience: Device type:', { isMobile, width: window.innerWidth });

      // Timeline growth animation
      if (isMobile) {
        // Animate only the visible part of the timeline for mobile
        gsap.fromTo(
          timelineRef.current,
          { height: "0%" },
          {
            height: "calc(100% - 32px)", // leave space for last dot
            duration: 1.2,
            ease: "power1.inOut",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
              end: "bottom 20%",
              scrub: 1,
              refreshPriority: 1,
              markers: process.env.NODE_ENV === 'development' // Add markers for debugging
            },
          }
        );

        // Spark follows the timeline and aligns with the current dot
        gsap.fromTo(
          sparkRef.current,
          { top: "0%", scale: 0.8, opacity: 0.5 },
          {
            top: "calc(100% - 16px)", // aligns with last dot
            scale: 1.1,
            opacity: 1,
            duration: 1.2,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
              end: "bottom 20%",
              scrub: 0.7,
              refreshPriority: 1
            },
          }
        );
      } else {
        // Desktop: keep original animation
        gsap.fromTo(
          timelineRef.current,
          { height: "0%" },
          {
            height: "100%",
            duration: 1.5,
            ease: "power1.inOut",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 70%",
              end: "bottom 30%",
              scrub: 1,
              refreshPriority: 1
            },
          }
        );
        gsap.fromTo(
          sparkRef.current,
          { top: "0%", scale: 0.8, opacity: 0.5 },
          {
            top: "100%",
            scale: 1,
            opacity: 1,
            duration: 1.5,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 70%",
              end: "bottom 30%",
              scrub: 0.5,
              refreshPriority: 1
            },
          }
        );
      }

      // Items fade in as you scroll
      itemsRef.current.forEach((item, index) => {
        if (item) {
          gsap.fromTo(
            item,
            {
              opacity: 0,
              y: 20,
            },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: "power2.out",
              scrollTrigger: {
                trigger: item,
                start: "top 85%",
                end: "bottom 15%",
                toggleActions: "play none none reverse",
                refreshPriority: 1,
                invalidateOnRefresh: true
              },
            }
          );
          // Mobile-specific dot animation
          const dot = item.querySelector('.timeline-dot');
          if (dot && isMobile) {
            gsap.fromTo(
              dot,
              {
                scale: 0.5,
                opacity: 0.3
              },
              {
                scale: 1,
                opacity: 1,
                duration: 0.4,
                ease: "back.out(1.7)",
                scrollTrigger: {
                  trigger: item,
                  start: "top 80%",
                  end: "bottom 20%",
                  toggleActions: "play none none reverse",
                  refreshPriority: 1
                }
              }
            );
          }
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="experience-section py-8 sm:py-12 md:py-20 px-3 sm:px-4 mt-8 sm:mt-12 md:mt-16 lg:mt-20 mb-4 sm:mb-8 md:mb-12 lg:mb-16"
      id="experience-section"
    >
      <div className="max-w-5xl mx-auto">
        {/* Title */}
        <div className="experience-title mb-12 sm:mb-16 md:mb-20 lg:mb-24">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl xl:text-7xl font-light leading-tight">
            <span className="career-text">My career</span>{' '}
            <span className="ampersand">&</span>
            <br />
            <span className="experience-text">experience</span>
          </h2>
        </div>

        {/* Experience Timeline */}
        <div className="timeline-container relative">
          {/* Timeline - Mobile: Left positioned, Desktop: Center */}
          <div 
            ref={timelineRef}
            className="timeline-line"
          />
          
          {/* Spark Effect - Mobile: Left positioned, Desktop: Center */}
          <div 
            ref={sparkRef}
            className="timeline-spark"
          />

          {/* Experience Items */}
          <div className="relative md:pb-20">
            {experienceData.map((item, index) => (
              <div
                key={index}
                ref={(el) => { itemsRef.current[index] = el; }}
                className={`experience-item ${
                  index % 2 === 0 ? 'left-aligned' : 'right-aligned'
                }`}
              >
                {/* Timeline Dot removed for mobile, effect handled by spark and line */}

                <div className="w-full">
                  {/* Position & Year - Desktop (keep exactly as is) */}
                  <div className="experience-desktop">
                    {index % 2 === 0 ? (
                      <>
                        <div className="experience-year">{item.year}</div>
                        <div>
                          <h3 className="experience-position">{item.position}</h3>
                          <h4 className="experience-company">{item.company}</h4>
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <h3 className="experience-position">{item.position}</h3>
                          <h4 className="experience-company">{item.company}</h4>
                        </div>
                        <div className="experience-year">{item.year}</div>
                      </>
                    )}
                  </div>

                  {/* Position & Year - Mobile (improved layout) */}
                  <div className="experience-mobile">
                    <div className="experience-mobile-header">
                      <div className="experience-mobile-content">
                        <h3 className="experience-position">{item.position}</h3>
                        <h4 className="experience-company">{item.company}</h4>
                      </div>
                      <div className="experience-year">{item.year}</div>
                    </div>
                    {/* Description - Mobile */}
                    <p className="experience-description mobile">{item.description}</p>
                  </div>

                  {/* Description - Desktop only */}
                  <p className="experience-description desktop">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* View Full Experience Button */}
        <div className="text-center mt-16">
          <a
            href="/experience"
            className="experience-button"
          >
            View Full Experience Journey
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Experience;