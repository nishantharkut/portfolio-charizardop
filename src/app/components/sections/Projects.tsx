"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { gsap, ScrollTrigger } from "@/utils/gsap";
import "../styles/Projects.css";
import Link from "next/link";
import Image from "next/image";
import { getProjects } from "../../../data";
import { performanceManager } from '@/utils/performance';

const Projects = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const projectFlexRef = useRef<HTMLDivElement>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Memoize performance settings to prevent re-renders
  const performanceSettings = useMemo(() => performanceManager.getOptimalSettings(), []);
  
  // State for hydration-safe device detection
  const [deviceInfo, setDeviceInfo] = useState({
    isMobile: false,
    isTablet: false,
    viewportWidth: 1200,
    viewportHeight: 800
  });
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydration-safe device detection
  useEffect(() => {
    const updateDeviceInfo = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setDeviceInfo({
        isMobile: width <= 768,
        isTablet: width > 768 && width <= 1024,
        viewportWidth: width,
        viewportHeight: height
      });
    };

    updateDeviceInfo();
    setIsHydrated(true);

    const handleResize = () => {
      updateDeviceInfo();
    };

    window.addEventListener('resize', handleResize, { passive: true });
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  // Optimized ScrollTrigger setup - runs once after hydration
  useEffect(() => {
    if (!containerRef.current || !isHydrated || isInitialized) return;

    const initializeScrollTrigger = () => {
      const container = containerRef.current;
      const projectFlex = container?.querySelector('.project-flex') as HTMLElement;
      
      if (!container || !projectFlex) {
        console.log('Projects: Elements not found for ScrollTrigger');
        return;
      }

      // Clean up any existing triggers
      scrollTriggerRef.current?.kill();

      // Get project boxes for width calculation
      const projectBoxes = projectFlex.querySelectorAll('.project-box');
      if (projectBoxes.length === 0) {
        console.log('Projects: No project boxes found');
        return;
      }

      // Calculate scroll distance based on actual content width
      const containerWidth = container.offsetWidth;
      const totalWidth = projectFlex.scrollWidth;
      const scrollDistance = totalWidth - containerWidth;
      
      console.log('Projects: Creating horizontal scroll animation', {
        containerWidth,
        totalWidth,
        scrollDistance,
        projectCount: projectBoxes.length
      });

      // Only create animation if there's content to scroll
      if (scrollDistance > 0) {
        const timeline = gsap.timeline({
          scrollTrigger: {
            id: "projects-horizontal",
            trigger: container,
            pin: true,
            scrub: 1,
            start: "top top",
            end: `+=${scrollDistance * 2}`, // Adjust scroll distance
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self: any) => {
              // Transform the project flex container horizontally
              gsap.set(projectFlex, {
                x: -scrollDistance * self.progress,
                force3D: true
              });
            },
            onRefresh: () => {
              console.log('Projects: ScrollTrigger refreshed');
            }
          }
        });

        if (timeline.scrollTrigger) {
          scrollTriggerRef.current = timeline.scrollTrigger;
        }
        console.log('Projects: Horizontal scroll ScrollTrigger created successfully');
        setIsInitialized(true);
      }
    };

    // Initialize after a short delay to ensure DOM is ready
    const timer = setTimeout(initializeScrollTrigger, 100);

    // Handle resize events
    const handleResize = () => {
      if (scrollTriggerRef.current) {
        setTimeout(() => {
          ScrollTrigger.refresh();
        }, 100);
      }
    };

    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
      scrollTriggerRef.current?.kill();
    };
  }, [isHydrated]); // Depend on hydration state

  // Get all projects from JSON data for a comprehensive showcase
  const allProjects = getProjects(); // Show all 6 projects
  
  // Transform data for compatibility with existing component structure
  const projects = allProjects.map((project, index) => ({
    number: String(index + 1).padStart(2, '0'),
    title: project.title,
    category: project.category,
    tools: project.techStack.join(', '),
    image: project.image
  }));

  return (
    <div 
      className={`projects-section scroll-container contained-layout ${
        isHydrated && deviceInfo.isMobile ? 'mobile' : ''
      } ${
        isHydrated && deviceInfo.isTablet ? 'tablet' : ''
      } ${
        performanceSettings.deviceTier === 'low' ? 'mobile-optimized' : ''
      }`} 
      id="projects" 
      ref={containerRef}
    >
      <div className="project-container section-container">
        <h2 className="section-heading">
          My <span>Work</span>
        </h2>
        <div className="project-flex" ref={projectFlexRef}>
          {projects.map((project, index) => (
            <div className="project-box" key={index}>
              <div className="project-header">
                <div className="project-number">{project.number}</div>
                <div className="project-title">
                  <h3>{project.title}</h3>
                  <p>{project.category}</p>
                </div>
              </div>
              
              <div className="project-info">
                <h4>Tools and features</h4>
                <p>{project.tools}</p>
              </div>
              
              <div className="project-image">
                <Image 
                  src={project.image} 
                  alt={project.title}
                  width={400}
                  height={300}
                  quality={performanceSettings.deviceTier === 'low' ? 60 : 75}
                  priority={index === 0}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={{ 
                    objectFit: 'cover',
                    willChange: 'transform'
                  }}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  className="optimized-image"
                />
              </div>
            </div>
          ))}
          
          {/* View all projects card */}
          <div className="project-box view-all-box">
            <Link href="/projects" className="view-all-link">
              <div className="view-all-content">
                <div className="view-all-text">
                  <h3>View All Projects</h3>
                  <span className="arrow-icon">→</span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projects;