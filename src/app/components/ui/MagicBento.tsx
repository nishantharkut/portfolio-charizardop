"use client";
import React, { useRef, useEffect, useState, useCallback } from "react";
import { gsap } from "gsap";
import { 
  ArrowTopRightOnSquareIcon, 
  ArrowDownTrayIcon,
  CodeBracketIcon,
  BriefcaseIcon,
  TrophyIcon,
  UserIcon
} from "@heroicons/react/24/outline";
import LogoLoop from "./LogoLoop";
// Import additional icons for more tech stacks
import { 
  SiReact, 
  SiNextdotjs, 
  SiTypescript, 
  SiJavascript, 
  SiPython, 
  SiCplusplus,
  SiSolidity,
  SiMysql,
  SiNodedotjs, 
  SiExpress, 
  SiRedux,
  SiFramer,
  SiMongodb, 
  SiPostgresql, 
  SiFirebase,
  SiSupabase,
  SiAmazonwebservices, 
  SiGit, 
  SiGithub, 
  SiDocker, 
  SiVercel,
  SiNetlify,
  SiLinux, 
  SiTailwindcss,
  SiHtml5,
  SiCss3,
  SiPhp,
  SiKubernetes,
  SiGraphql,
  SiFigma,
  SiAdobephotoshop,
  SiAdobeillustrator,
  SiPostman,
  SiJenkins,
  SiWordpress,
  SiBootstrap,
  SiSass,
  SiWebpack,
  SiVite,
  SiJest,
  SiCypress,
  SiRedis,
  SiElasticsearch,
  SiGooglecloud,
} from "react-icons/si";

export interface BentoCardProps {
  id: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
  href?: string;
  content?: React.ReactNode;
}

export interface BentoProps {
  textAutoHide?: boolean;
  enableStars?: boolean;
  enableSpotlight?: boolean;
  enableBorderGlow?: boolean;
  disableAnimations?: boolean;
  spotlightRadius?: number;
  particleCount?: number;
  enableTilt?: boolean;
  glowColor?: string;
  clickEffect?: boolean;
  enableMagnetism?: boolean;
}

const DEFAULT_PARTICLE_COUNT = 12;
const DEFAULT_SPOTLIGHT_RADIUS = 300;
const DEFAULT_GLOW_COLOR = "255, 179, 71";
const MOBILE_BREAKPOINT = 768;

// Simple text-based icon component for concepts without specific icons
const ConceptIcon: React.FC<{ text: string; className?: string }> = ({ text, className = "w-6 h-6" }) => (
  <div className={`${className} flex items-center justify-center text-xs font-bold border border-current rounded`}>
    {text}
  </div>
);

// Tech skills organized by categories - expanded to fill entire card (42 icons)
// Dark mode: Light grey -> Yellowish-orange on hover
// Light mode: Dark colors -> Yellowish-orange on hover
const techSkillsData = {
  languages: [
    { icon: <SiCplusplus className="w-6 h-6" />, name: "C/C++", originalColor: "#00599C" },
    { icon: <SiPython className="w-6 h-6" />, name: "Python", originalColor: "#3776AB" },
    { icon: <SiJavascript className="w-6 h-6" />, name: "JavaScript", originalColor: "#F7DF1E" },
    { icon: <SiTypescript className="w-6 h-6" />, name: "TypeScript", originalColor: "#3178C6" },
    { icon: <SiMysql className="w-6 h-6" />, name: "SQL", originalColor: "#4479A1" },
    { icon: <SiSolidity className="w-6 h-6" />, name: "Solidity", originalColor: "#363636" },
    { icon: <SiHtml5 className="w-6 h-6" />, name: "HTML5", originalColor: "#E34F26" },
    { icon: <SiCss3 className="w-6 h-6" />, name: "CSS3", originalColor: "#1572B6" },
    { icon: <SiPhp className="w-6 h-6" />, name: "PHP", originalColor: "#777BB4" },
    { icon: <ConceptIcon text="Java" className="w-6 h-6" />, name: "Java", originalColor: "#007396" },
  ],
  frameworks: [
    { icon: <SiReact className="w-6 h-6" />, name: "React.js", originalColor: "#61DAFB" },
    { icon: <SiNextdotjs className="w-6 h-6" />, name: "Next.js", originalColor: "#000000" },
    { icon: <SiNodedotjs className="w-6 h-6" />, name: "Node.js", originalColor: "#339933" },
    { icon: <SiExpress className="w-6 h-6" />, name: "Express.js", originalColor: "#000000" },
    { icon: <SiRedux className="w-6 h-6" />, name: "Redux", originalColor: "#764ABC" },
    { icon: <SiTailwindcss className="w-6 h-6" />, name: "Tailwind CSS", originalColor: "#06B6D4" },
    { icon: <SiBootstrap className="w-6 h-6" />, name: "Bootstrap", originalColor: "#7952B3" },
    { icon: <SiSass className="w-6 h-6" />, name: "Sass", originalColor: "#CC6699" },
    { icon: <SiFramer className="w-6 h-6" />, name: "Framer Motion", originalColor: "#0055FF" },
    { icon: <SiWordpress className="w-6 h-6" />, name: "WordPress", originalColor: "#21759B" },
  ],
  databases: [
    { icon: <SiMongodb className="w-6 h-6" />, name: "MongoDB", originalColor: "#47A248" },
    { icon: <SiMysql className="w-6 h-6" />, name: "MySQL", originalColor: "#4479A1" },
    { icon: <SiPostgresql className="w-6 h-6" />, name: "PostgreSQL", originalColor: "#336791" },
    { icon: <SiFirebase className="w-6 h-6" />, name: "Firebase", originalColor: "#FFCA28" },
    { icon: <SiSupabase className="w-6 h-6" />, name: "Supabase", originalColor: "#3ECF8E" },
    { icon: <SiRedis className="w-6 h-6" />, name: "Redis", originalColor: "#DC382D" },
    { icon: <SiElasticsearch className="w-6 h-6" />, name: "Elasticsearch", originalColor: "#005571" },
  ],
  cloud: [
    { icon: <SiAmazonwebservices className="w-6 h-6" />, name: "AWS", originalColor: "#FF9900" },
    { icon: <SiGooglecloud className="w-6 h-6" />, name: "Google Cloud", originalColor: "#4285F4" },
    { icon: <SiGit className="w-6 h-6" />, name: "Git", originalColor: "#F05032" },
    { icon: <SiGithub className="w-6 h-6" />, name: "GitHub", originalColor: "#181717" },
    { icon: <SiDocker className="w-6 h-6" />, name: "Docker", originalColor: "#2496ED" },
    { icon: <SiKubernetes className="w-6 h-6" />, name: "Kubernetes", originalColor: "#326CE5" },
    { icon: <SiVercel className="w-6 h-6" />, name: "Vercel", originalColor: "#000000" },
    { icon: <SiNetlify className="w-6 h-6" />, name: "Netlify", originalColor: "#00C7B7" },
    { icon: <SiJenkins className="w-6 h-6" />, name: "Jenkins", originalColor: "#D33833" },
  ],
  tools: [
    { icon: <SiFigma className="w-6 h-6" />, name: "Figma", originalColor: "#F24E1E" },
    { icon: <SiAdobephotoshop className="w-6 h-6" />, name: "Photoshop", originalColor: "#31A8FF" },
    { icon: <SiAdobeillustrator className="w-6 h-6" />, name: "Illustrator", originalColor: "#FF9A00" },
    { icon: <SiPostman className="w-6 h-6" />, name: "Postman", originalColor: "#FF6C37" },
    { icon: <SiWebpack className="w-6 h-6" />, name: "Webpack", originalColor: "#8DD6F9" },
    { icon: <SiVite className="w-6 h-6" />, name: "Vite", originalColor: "#646CFF" },
    { icon: <SiJest className="w-6 h-6" />, name: "Jest", originalColor: "#C21325" },
    { icon: <SiCypress className="w-6 h-6" />, name: "Cypress", originalColor: "#17202C" },
    { icon: <SiGraphql className="w-6 h-6" />, name: "GraphQL", originalColor: "#E10098" },
    { icon: <SiLinux className="w-6 h-6" />, name: "Linux", originalColor: "#FCC624" },
  ],
};

// Enhanced Tooltip component for LogoLoop integration
const TechIcon: React.FC<{ 
  children: React.ReactNode; 
  tooltip: string; 
  originalColor: string;
}> = ({ children, tooltip, originalColor }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = (e: React.MouseEvent) => {
    setIsVisible(true);
    const rect = e.currentTarget.getBoundingClientRect();
    setPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
    });

    // Animate icon scale on hover
    if (iconRef.current) {
      gsap.to(iconRef.current, {
        scale: 1.1,
        duration: 0.2,
        ease: "power2.out",
      });
    }
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
    
    // Reset icon scale
    if (iconRef.current) {
      gsap.to(iconRef.current, {
        scale: 1,
        duration: 0.2,
        ease: "power2.out",
      });
    }
  };

  return (
    <>
      <div
        ref={iconRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="tech-icon-container relative cursor-pointer transition-all duration-300 group"
        style={{
          "--original-color": originalColor,
          width: "28px",
          height: "28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        } as React.CSSProperties}
      >
        <div className="tech-icon-wrapper transition-all duration-300 ease-out w-full h-full flex items-center justify-center">
          {children}
        </div>
      </div>
      
      {isVisible && (
        <div
          ref={tooltipRef}
          className="fixed z-[9999] px-3 py-2 text-sm font-semibold text-white bg-gradient-to-r from-amber-600 to-orange-500 rounded-lg shadow-xl border border-amber-400/30 pointer-events-none backdrop-blur-sm transform -translate-x-1/2 -translate-y-full"
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            boxShadow: '0 10px 25px rgba(245, 158, 11, 0.3), 0 4px 10px rgba(0, 0, 0, 0.2)',
          }}
        >
          {tooltip}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-amber-600"></div>
        </div>
      )}
    </>
  );
};

// Skills content component - fills entire card with static grid layout (no scrolling)
const SkillsContent: React.FC = () => {
  // Create logo arrays following the correct LogoLoop format with proper node structure
  const languageLogos = techSkillsData.languages.map(tech => ({
    node: <TechIcon tooltip={tech.name} originalColor={tech.originalColor}>{tech.icon}</TechIcon>,
    title: tech.name,
    href: "#",
  }));

  const frameworkLogos = techSkillsData.frameworks.map(tech => ({
    node: <TechIcon tooltip={tech.name} originalColor={tech.originalColor}>{tech.icon}</TechIcon>,
    title: tech.name,
    href: "#",
  }));

  const databaseLogos = techSkillsData.databases.map(tech => ({
    node: <TechIcon tooltip={tech.name} originalColor={tech.originalColor}>{tech.icon}</TechIcon>,
    title: tech.name,
    href: "#",
  }));

  const cloudLogos = techSkillsData.cloud.map(tech => ({
    node: <TechIcon tooltip={tech.name} originalColor={tech.originalColor}>{tech.icon}</TechIcon>,
    title: tech.name,
    href: "#",
  }));

  const toolLogos = techSkillsData.tools.map(tech => ({
    node: <TechIcon tooltip={tech.name} originalColor={tech.originalColor}>{tech.icon}</TechIcon>,
    title: tech.name,
    href: "#",
  }));

  // Create a combined array with better distribution for static grid layout
  const allLogos = [
    ...languageLogos, 
    ...frameworkLogos, 
    ...databaseLogos, 
    ...cloudLogos, 
    ...toolLogos
  ];

  return (
    <div className="skills-content-wrapper w-full h-full flex flex-col justify-between overflow-hidden">
      {/* Static Grid Layout - No scrolling, fills entire card with exactly 42 icons (6x7) */}
      <div className="tech-grid w-full h-full grid grid-cols-6 gap-2 p-2 place-items-center content-center">
        {allLogos.slice(0, 42).map((logo, index) => (
          <div key={index} className="tech-item flex items-center justify-center">
            {logo.node}
          </div>
        ))}
      </div>
    </div>
  );
};

// Social icons data - matching your image
const socialIcons = [
  { name: "GitHub", icon: "🐙", href: "https://github.com", color: "#333" },
  { name: "LinkedIn", icon: "💼", href: "https://linkedin.com", color: "#0077B5" },
  { name: "Analytics", icon: "📊", href: "#", color: "#FF6B35" },
  { name: "Tools", icon: "🛠️", href: "#", color: "#4A90E2" },
  { name: "Shell", icon: "🐚", href: "#", color: "#FF5722" },
  { name: "Chat", icon: "💬", href: "#", color: "#25D366" },
];

// Updated card data to match your layout
const cardData: BentoCardProps[] = [
  {
    id: "about",
    title: "About Me",
    description: "UI/UX Designer passionate about creating innovative digital experiences",
    icon: <UserIcon className="w-5 h-5" />,
    className: "bento-card--about",
  },
  {
    id: "skills",
    title: "Top Skills",
    description: "Full-stack development with modern technologies",
    icon: <CodeBracketIcon className="w-5 h-5" />,
    className: "bento-card--skills",
    content: <SkillsContent />,
  },
  {
    id: "projects",
    title: "Featured Projects",
    description: "Showcase of my best creative work and developments",
    icon: <ArrowTopRightOnSquareIcon className="w-5 h-5" />,
    className: "bento-card--projects",
    content: (
      <div className="mt-auto flex flex-col gap-4">
        <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <button className="w-full py-3 px-4 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-sm font-medium backdrop-blur-sm border border-white/10">
          All Projects
        </button>
      </div>
    ),
  },
  {
    id: "experience",
    title: "Experience",
    description: "3+ years in full-stack development and creative design",
    icon: <BriefcaseIcon className="w-5 h-5" />,
    className: "bento-card--experience",
  },
  {
    id: "achievements",
    title: "Achievements",
    description: "Awards, certifications and recognitions",
    icon: <TrophyIcon className="w-5 h-5" />,
    className: "bento-card--achievements",
  },
];

const createParticleElement = (
  x: number,
  y: number,
  color: string = DEFAULT_GLOW_COLOR
): HTMLDivElement => {
  const el = document.createElement("div");
  el.className = "particle";
  el.style.cssText = `
    position: absolute;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: rgba(${color}, 1);
    box-shadow: 0 0 6px rgba(${color}, 0.6);
    pointer-events: none;
    z-index: 5;
    left: ${x}px;
    top: ${y}px;
  `;
  return el;
};

const calculateSpotlightValues = (radius: number) => ({
  proximity: radius * 0.5,
  fadeDistance: radius * 0.75,
});

const updateCardGlowProperties = (
  card: HTMLElement,
  mouseX: number,
  mouseY: number,
  glow: number,
  radius: number
) => {
  const rect = card.getBoundingClientRect();
  const relativeX = ((mouseX - rect.left) / rect.width) * 100;
  const relativeY = ((mouseY - rect.top) / rect.height) * 100;

  card.style.setProperty("--glow-x", `${relativeX}%`);
  card.style.setProperty("--glow-y", `${relativeY}%`);
  card.style.setProperty("--glow-intensity", glow.toString());
  card.style.setProperty("--glow-radius", `${radius}px`);
};

const ParticleCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  disableAnimations?: boolean;
  style?: React.CSSProperties;
  particleCount?: number;
  glowColor?: string;
  enableTilt?: boolean;
  clickEffect?: boolean;
  enableMagnetism?: boolean;
}> = ({
  children,
  className = "",
  disableAnimations = false,
  style,
  particleCount = DEFAULT_PARTICLE_COUNT,
  glowColor = DEFAULT_GLOW_COLOR,
  enableTilt = true,
  clickEffect = false,
  enableMagnetism = false,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement[]>([]);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const isHoveredRef = useRef(false);
  const memoizedParticles = useRef<HTMLDivElement[]>([]);
  const particlesInitialized = useRef(false);
  const magnetismAnimationRef = useRef<gsap.core.Tween | null>(null);

  const initializeParticles = useCallback(() => {
    if (particlesInitialized.current || !cardRef.current) return;

    const { width, height } = cardRef.current.getBoundingClientRect();
    memoizedParticles.current = Array.from({ length: particleCount }, () =>
      createParticleElement(
        Math.random() * width,
        Math.random() * height,
        glowColor
      )
    );
    particlesInitialized.current = true;
  }, [particleCount, glowColor]);

  const clearAllParticles = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    magnetismAnimationRef.current?.kill();

    particlesRef.current.forEach((particle) => {
      gsap.to(particle, {
        scale: 0,
        opacity: 0,
        duration: 0.3,
        ease: "back.in(1.7)",
        onComplete: () => {
          particle.parentNode?.removeChild(particle);
        },
      });
    });
    particlesRef.current = [];
  }, []);

  const animateParticles = useCallback(() => {
    if (!cardRef.current || !isHoveredRef.current) return;

    if (!particlesInitialized.current) {
      initializeParticles();
    }

    memoizedParticles.current.forEach((particle, index) => {
      const timeoutId = setTimeout(() => {
        if (!isHoveredRef.current || !cardRef.current) return;

        const clone = particle.cloneNode(true) as HTMLDivElement;
        cardRef.current.appendChild(clone);
        particlesRef.current.push(clone);

        gsap.fromTo(
          clone,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.7)" }
        );

        gsap.to(clone, {
          x: (Math.random() - 0.5) * 100,
          y: (Math.random() - 0.5) * 100,
          rotation: Math.random() * 360,
          duration: 2 + Math.random() * 2,
          ease: "none",
          repeat: -1,
          yoyo: true,
        });

        gsap.to(clone, {
          opacity: 0.3,
          duration: 1.5,
          ease: "power2.inOut",
          repeat: -1,
          yoyo: true,
        });
      }, index * 100);

      timeoutsRef.current.push(timeoutId);
    });
  }, [initializeParticles]);

  useEffect(() => {
    if (disableAnimations || !cardRef.current) return;

    const element = cardRef.current;

    const handleMouseEnter = () => {
      isHoveredRef.current = true;
      animateParticles();

      if (enableTilt) {
        gsap.to(element, {
          rotateX: 5,
          rotateY: 5,
          duration: 0.1,
          ease: "power2.out",
          transformPerspective: 1000,
        });
      }
    };

    const handleMouseLeave = () => {
      isHoveredRef.current = false;
      clearAllParticles();

      if (enableTilt) {
        gsap.to(element, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.3,
          ease: "power2.out",
        });
      }

      if (enableMagnetism) {
        gsap.to(element, {
          x: 0,
          y: 0,
          duration: 0.3,
          ease: "power2.out",
        });
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!enableTilt && !enableMagnetism) return;

      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      if (enableTilt) {
        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;

        gsap.to(element, {
          rotateX,
          rotateY,
          duration: 0.1,
          ease: "power2.out",
          transformPerspective: 1000,
        });
      }

      if (enableMagnetism) {
        const magnetX = (x - centerX) * 0.05;
        const magnetY = (y - centerY) * 0.05;

        magnetismAnimationRef.current = gsap.to(element, {
          x: magnetX,
          y: magnetY,
          duration: 0.3,
          ease: "power2.out",
        });
      }
    };

    const handleClick = (e: MouseEvent) => {
      if (!clickEffect) return;

      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const maxDistance = Math.max(
        Math.hypot(x, y),
        Math.hypot(x - rect.width, y),
        Math.hypot(x, y - rect.height),
        Math.hypot(x - rect.width, y - rect.height)
      );

      const ripple = document.createElement("div");
      ripple.style.cssText = `
        position: absolute;
        width: ${maxDistance * 2}px;
        height: ${maxDistance * 2}px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(${glowColor}, 0.4) 0%, rgba(${glowColor}, 0.2) 30%, transparent 70%);
        left: ${x - maxDistance}px;
        top: ${y - maxDistance}px;
        pointer-events: none;
        z-index: 3;
      `;

      element.appendChild(ripple);

      gsap.fromTo(
        ripple,
        {
          scale: 0,
          opacity: 1,
        },
        {
          scale: 1,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
          onComplete: () => ripple.remove(),
        }
      );
    };

    element.addEventListener("mouseenter", handleMouseEnter);
    element.addEventListener("mouseleave", handleMouseLeave);
    element.addEventListener("mousemove", handleMouseMove);
    element.addEventListener("click", handleClick);

    return () => {
      isHoveredRef.current = false;
      element.removeEventListener("mouseenter", handleMouseEnter);
      element.removeEventListener("mouseleave", handleMouseLeave);
      element.removeEventListener("mousemove", handleMouseMove);
      element.removeEventListener("click", handleClick);
      clearAllParticles();
    };
  }, [
    animateParticles,
    clearAllParticles,
    disableAnimations,
    enableTilt,
    enableMagnetism,
    clickEffect,
    glowColor,
  ]);

  return (
    <div
      ref={cardRef}
      className={`${className} relative overflow-hidden`}
      style={{ ...style, position: "relative", overflow: "hidden" }}
    >
      {children}
    </div>
  );
};

const GlobalSpotlight: React.FC<{
  gridRef: React.RefObject<HTMLDivElement | null>;
  disableAnimations?: boolean;
  enabled?: boolean;
  spotlightRadius?: number;
  glowColor?: string;
}> = ({
  gridRef,
  disableAnimations = false,
  enabled = true,
  spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
  glowColor = DEFAULT_GLOW_COLOR,
}) => {
  const spotlightRef = useRef<HTMLDivElement | null>(null);
  const isInsideSection = useRef(false);

  useEffect(() => {
    if (disableAnimations || !gridRef?.current || !enabled) return;

    const spotlight = document.createElement("div");
    spotlight.className = "global-spotlight";
    spotlight.style.cssText = `
      position: absolute;
      width: 600px;
      height: 600px;
      border-radius: 50%;
      pointer-events: none;
      background: radial-gradient(circle,
        rgba(${glowColor}, 0.15) 0%,
        rgba(${glowColor}, 0.08) 15%,
        rgba(${glowColor}, 0.04) 25%,
        rgba(${glowColor}, 0.02) 40%,
        rgba(${glowColor}, 0.01) 65%,
        transparent 70%
      );
      z-index: 10;
      opacity: 0;
      transform: translate(-50%, -50%);
      mix-blend-mode: screen;
    `;
    
    // Append to the bento section instead of body
    const bentoSection = gridRef.current?.closest('.bento-section');
    if (bentoSection) {
      bentoSection.appendChild(spotlight);
    } else {
      document.body.appendChild(spotlight);
    }
    spotlightRef.current = spotlight;

    const handleMouseMove = (e: MouseEvent) => {
      if (!spotlightRef.current || !gridRef.current) return;

      const section = gridRef.current.closest(".bento-section");
      const rect = section?.getBoundingClientRect();
      const mouseInside =
        rect &&
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

      isInsideSection.current = mouseInside || false;
      const cards = gridRef.current.querySelectorAll(".bento-card");

      if (!mouseInside) {
        gsap.to(spotlightRef.current, {
          opacity: 0,
          duration: 0.3,
          ease: "power2.out",
        });
        cards.forEach((card) => {
          (card as HTMLElement).style.setProperty("--glow-intensity", "0");
        });
        return;
      }

      const { proximity, fadeDistance } =
        calculateSpotlightValues(spotlightRadius);
      let minDistance = Infinity;

      cards.forEach((card) => {
        const cardElement = card as HTMLElement;
        const cardRect = cardElement.getBoundingClientRect();
        const centerX = cardRect.left + cardRect.width / 2;
        const centerY = cardRect.top + cardRect.height / 2;
        const distance =
          Math.hypot(e.clientX - centerX, e.clientY - centerY) -
          Math.max(cardRect.width, cardRect.height) / 2;
        const effectiveDistance = Math.max(0, distance);

        minDistance = Math.min(minDistance, effectiveDistance);

        let glowIntensity = 0;
        if (effectiveDistance <= proximity) {
          glowIntensity = 1;
        } else if (effectiveDistance <= fadeDistance) {
          glowIntensity =
            (fadeDistance - effectiveDistance) / (fadeDistance - proximity);
        }

        updateCardGlowProperties(
          cardElement,
          e.clientX,
          e.clientY,
          glowIntensity,
          spotlightRadius
        );
      });

      gsap.to(spotlightRef.current, {
        left: e.clientX,
        top: e.clientY,
        duration: 0.1,
        ease: "power2.out",
      });

      const targetOpacity =
        minDistance <= proximity
          ? 0.8
          : minDistance <= fadeDistance
            ? ((fadeDistance - minDistance) / (fadeDistance - proximity)) * 0.8
            : 0;

      gsap.to(spotlightRef.current, {
        opacity: targetOpacity,
        duration: targetOpacity > 0 ? 0.2 : 0.5,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      isInsideSection.current = false;
      gridRef.current?.querySelectorAll(".bento-card").forEach((card) => {
        (card as HTMLElement).style.setProperty("--glow-intensity", "0");
      });
      if (spotlightRef.current) {
        gsap.to(spotlightRef.current, {
          opacity: 0,
          duration: 0.3,
          ease: "power2.out",
        });
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      spotlightRef.current?.parentNode?.removeChild(spotlightRef.current);
    };
  }, [gridRef, disableAnimations, enabled, spotlightRadius, glowColor]);

  return null;
};

const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () =>
      setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
};

const MagicBento: React.FC<BentoProps> = ({
  textAutoHide = true,
  enableStars = true,
  enableSpotlight = true,
  enableBorderGlow = true,
  disableAnimations = false,
  spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
  particleCount = DEFAULT_PARTICLE_COUNT,
  enableTilt = false,
  glowColor = DEFAULT_GLOW_COLOR,
  clickEffect = true,
  enableMagnetism = true,
}) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const isMobile = useMobileDetection();
  const shouldDisableAnimations = disableAnimations || isMobile;

  return (
    <>
      <style>
        {`
          .bento-section {
            --glow-x: 50%;
            --glow-y: 50%;
            --glow-intensity: 0;
            --glow-radius: 200px;
            --glow-color: ${glowColor};
            position: relative;
            z-index: 2;
          }
          
          .bento-grid {
            display: grid;
            grid-template-columns: repeat(11, 1fr);
            grid-template-rows: repeat(5, minmax(140px, auto));
            gap: 1rem;
            width: 100%;
            position: relative;
            z-index: 1;
          }
          
          .bento-card {
            background: rgba(40, 40, 43, 0.6);
            backdrop-filter: blur(20px) saturate(180%);
            -webkit-backdrop-filter: blur(20px) saturate(180%);
            border: 1px solid rgba(255, 179, 71, 0.2);
            border-radius: 20px;
            padding: 1.5rem;
            position: relative;
            overflow: hidden;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            color: white;
            display: flex;
            flex-direction: column;
            box-shadow: 
              0 4px 6px -1px rgba(0, 0, 0, 0.1),
              0 2px 4px -1px rgba(0, 0, 0, 0.06),
              inset 0 1px 0 rgba(255, 255, 255, 0.1);
            z-index: 2;
            min-height: 140px;
          }
          
          .bento-card:hover {
            transform: translateX(-2px) scale(1.02);
            box-shadow: 
              0 20px 25px -5px rgba(255, 179, 71, 0.1),
              0 10px 10px -5px rgba(255, 179, 71, 0.04),
              inset 0 1px 0 rgba(255, 255, 255, 0.2);
            border-color: rgba(255, 179, 71, 0.4);
          }
          
          .bento-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(
              135deg, 
              rgba(255, 179, 71, 0.1) 0%, 
              transparent 50%, 
              rgba(255, 179, 71, 0.05) 100%
            );
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
            z-index: 1;
          }
          
          .bento-card:hover::before {
            opacity: 1;
          }
          
          .bento-card--border-glow::after {
            content: '';
            position: absolute;
            inset: 0;
            padding: 2px;
            background: radial-gradient(
              var(--glow-radius) circle at var(--glow-x) var(--glow-y),
              rgba(${glowColor}, calc(var(--glow-intensity) * 0.8)) 0%,
              rgba(${glowColor}, calc(var(--glow-intensity) * 0.4)) 30%,
              transparent 60%
            );
            border-radius: inherit;
            mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            mask-composite: subtract;
            -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            -webkit-mask-composite: xor;
            pointer-events: none;
            transition: opacity 0.3s ease;
            z-index: 1;
          }
          
          .bento-card > * {
            position: relative;
            z-index: 1;
          }
          
          /* Exact layout matching your image */
          .bento-card--about {
            grid-column: 1 / 5;
            grid-row: 1 / 4;
          }
          
          .bento-card--skills {
            grid-column: 5 / 8;
            grid-row: 1 / 4;
            overflow: hidden;
            position: relative;
          }
          
          .skills-content-wrapper {
            width: 100%;
            height: 100%;
            overflow: hidden;
            position: relative;
          }
          
          .tech-grid {
            width: 100%;
            height: 100%;
            display: grid;
            grid-template-columns: repeat(6, 1fr);
            grid-template-rows: repeat(7, 1fr);
            gap: 0.5rem;
            padding: 0.5rem;
            place-items: center;
            align-content: center;
            overflow: hidden;
          }
          
          .tech-item {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            min-height: 32px;
            min-width: 32px;
          }
          
          .tech-icon-container {
            filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            display: flex;
            align-items: center;
            justify-content: center;
            height: 28px;
            width: 28px;
          }
          
          .tech-icon-wrapper {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            /* Dark mode: Light grey */
            color: #e5e7eb;
          }
          
          .tech-icon-container:hover .tech-icon-wrapper {
            /* Dark mode: Yellowish-orange on hover */
            color: #f59e0b !important;
            filter: brightness(1.1) saturate(1.2) drop-shadow(0 0 8px #f59e0b);
          }
          
          /* Light mode styles */
          @media (prefers-color-scheme: light) {
            .tech-icon-wrapper {
              /* Light mode: Dark colors */
              color: #374151;
            }
            
            .tech-icon-container:hover .tech-icon-wrapper {
              /* Light mode: Yellowish-orange on hover */
              color: #f59e0b !important;
              filter: brightness(1.1) saturate(1.2) drop-shadow(0 0 8px #f59e0b);
            }
          }
          
          .bento-card--projects {
            grid-column: 8 / 12;
            grid-row: 1 / 5;
          }
          
          .bento-card--experience {
            grid-column: 1 / 5;
            grid-row: 4 / 6;
          }
          
          .bento-card--achievements {
            grid-column: 5 / 8;
            grid-row: 4 / 6;
          }
          
          .bento-card--social {
            grid-column: 8 / 12;
            grid-row: 5 / 6;
            display: flex;
            flex-direction: column;
          }
          
          /* Download icon styling */
          .download-icon {
            position: absolute;
            bottom: 1.5rem;
            right: 1.5rem;
            width: 2.5rem;
            height: 2.5rem;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(8px);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            cursor: pointer;
            transition: all 0.2s ease;
            border: 1px solid rgba(255, 255, 255, 0.1);
            z-index: 5;
          }
          
          .download-icon:hover {
            background: rgba(0, 0, 0, 0.9);
            transform: scale(1.1);
            border-color: rgba(255, 179, 71, 0.5);
          }

          /* Mobile responsiveness */
          @media (max-width: 768px) {
            .bento-section {
              margin-bottom: 1rem;
            }
            
            .bento-grid {
              grid-template-columns: 1fr !important;
              grid-template-rows: auto !important;
              height: auto !important;
              gap: 1rem;
              margin-bottom: 1rem;
            }
            
            .bento-card--about,
            .bento-card--skills,
            .bento-card--projects,
            .bento-card--experience,
            .bento-card--achievements,
            .bento-card--social {
              grid-column: 1 !important;
              grid-row: auto !important;
              min-height: 200px;
            }
            
            .bento-card {
              padding: 1.25rem;
            }
          }
        `}
      </style>

      {enableSpotlight && (
        <GlobalSpotlight
          gridRef={gridRef}
          disableAnimations={shouldDisableAnimations}
          enabled={enableSpotlight}
          spotlightRadius={spotlightRadius}
          glowColor={glowColor}
        />
      )}

      <div className="bento-section" ref={gridRef}>
        <div className="bento-grid">
          {cardData.map((card) => {
            const CardComponent = enableStars ? ParticleCard : "div";
            const cardProps = enableStars
              ? {
                  disableAnimations: shouldDisableAnimations,
                  particleCount,
                  glowColor,
                  enableTilt,
                  clickEffect,
                  enableMagnetism,
                }
              : {};

            return (
              <CardComponent
                key={card.id}
                {...cardProps}
                className={`bento-card ${card.className} ${
                  enableBorderGlow ? "bento-card--border-glow" : ""
                }`}
                style={{
                  "--glow-x": "50%",
                  "--glow-y": "50%",
                  "--glow-intensity": "0",
                  "--glow-radius": "200px",
                } as React.CSSProperties}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {card.icon}
                    <h3 className="text-lg font-semibold">{card.title}</h3>
                  </div>
                  <ArrowTopRightOnSquareIcon className="w-5 h-5 opacity-60" />
                </div>
                
                {card.description && (
                  <p className="text-sm opacity-80 mb-4">{card.description}</p>
                )}
                
                {card.content}
                
                {/* Add download icon to About Me card */}
                {card.id === "about" && (
                  <div className="download-icon">
                    <ArrowDownTrayIcon className="w-4 h-4" />
                  </div>
                )}
              </CardComponent>
            );
          })}
          
          {/* Social icons card - separate from cardData for better layout control */}
          <div className={`bento-card bento-card--social ${
            enableBorderGlow ? "bento-card--border-glow" : ""
          }`}>
            <div className="flex flex-wrap gap-2 mt-auto">
              {socialIcons.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center text-lg backdrop-blur-sm border border-white/10"
                  title={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MagicBento;