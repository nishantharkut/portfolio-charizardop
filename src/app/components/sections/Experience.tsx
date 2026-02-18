"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/utils/gsap";
import { getExperienceData } from "../../../data";
import "../styles/Experience.css";

const Experience = () => {
  const experienceData = getExperienceData().slice(0, 3);
  const sectionRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const boxesRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!sectionRef.current || !timelineRef.current) return;

    // Small delay to ensure DOM is fully rendered (dynamic import)
    const timer = setTimeout(() => {
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 30%",
            end: "bottom center",
            scrub: true,
            invalidateOnRefresh: true,
          },
        });

        // Grow timeline line from 0 to full height
        tl.fromTo(
          timelineRef.current,
          { maxHeight: "0%" },
          { maxHeight: "100%", duration: 0.5 },
          0
        );

        // Fade in timeline
        tl.fromTo(
          timelineRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.1 },
          0
        );

        // Stagger fade-in each experience box
        boxesRef.current.forEach((box, i) => {
          if (box) {
            tl.fromTo(
              box,
              { opacity: 0 },
              { opacity: 1, duration: 0.15 },
              i * 0.1
            );
          }
        });

        // Stop dot pulsing at end
        if (dotRef.current) {
          tl.fromTo(
            dotRef.current,
            { animationIterationCount: "infinite" },
            { animationIterationCount: "1", duration: 0.1 },
            0.3
          );
        }
      }, sectionRef);

      return () => ctx.revert();
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="experience-section"
      id="experience-section"
    >
      <div className="experience-container section-container">
        <h2 className="experience-title">
          My career <span>&amp;</span>
          <br /> experience
        </h2>

        <div className="experience-info">
          {/* Timeline line + glowing dot — grows via GSAP */}
          <div className="experience-timeline" ref={timelineRef}>
            <div className="experience-dot" ref={dotRef} />
          </div>

          {experienceData.map((item, index) => (
            <div
              key={index}
              ref={(el) => { boxesRef.current[index] = el; }}
              className="experience-info-box"
            >
              <div className="experience-info-in">
                <div className="experience-role">
                  <h4>{item.position}</h4>
                  <h5>{item.company}</h5>
                </div>
                <h3>{item.year}</h3>
              </div>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="experience-cta-wrap">
        <a href="/experience" className="experience-cta" aria-label="View full experience journey">
          View full experience
          <span className="experience-cta-arrow" aria-hidden>→</span>
        </a>
      </div>
    </section>
  );
};

export default Experience;
