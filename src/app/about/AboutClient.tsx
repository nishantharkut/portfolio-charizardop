"use client";

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  FaBasketballBall,
  FaJava
} from 'react-icons/fa';
import type { IconType } from 'react-icons';
import {
  SiPython,
  SiGo,
  SiTypescript,
  SiJavascript,
  SiCplusplus,
  SiC,
  SiMysql,
  SiKotlin,
  SiGnubash,
  SiReact,
  SiNextdotjs,
  SiNodedotjs,
  SiExpress,
  SiHono,
  SiFastapi,
  SiTailwindcss,
  SiPytorch,
  SiScikitlearn,
  SiPandas,
  SiNumpy,
  SiOnnx,
  SiIntel,
  SiMongodb,
  SiPostgresql,
  SiAmazondynamodb,
  SiFirebase,
  SiSupabase,
  SiAmazonwebservices,
  SiAmazon,
  SiAmazonec2,
  SiAmazons3,
  SiAwslambda,
  SiAmazonapigateway,
  SiAmazonsqs,
  SiAmazoncloudwatch,
  SiGooglecloud,
  SiDocker,
  SiLinux,
  SiGithubactions,
  SiGit,
  SiGithub,
  SiPostman,
  SiPytest,
  SiJest,
  SiVitest,
  SiOpenapiinitiative,
  SiOpenid,
  SiJsonwebtokens
} from 'react-icons/si';
import {
  TbBrain,
  TbApi,
  TbWebhook,
  TbBroadcast,
  TbChartLine,
  TbActivity,
  TbWaveSine,
  TbGitMerge,
  TbChecklist,
  TbComponents,
  TbShieldLock,
  TbTerminal2,
  TbServer,
  TbDatabase,
  TbCloudComputing,
  TbShieldCheck,
  TbPalette,
  TbHeadphones,
  TbCamera,
  TbDeviceGamepad2
} from 'react-icons/tb';

import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { useTheme } from '../../contexts/ThemeContext';
import TiltedCard from '../components/ui/TiltedCard';
import StarBorder from '../components/ui/StarBorder';
import { usePageReload } from '../components/ui/LazyLoader';
import PixelBlast from '../components/ui/PixelBlast';
import { PageHeroCta } from '../components/ui/PageHeroCta';
// Lazy load FaultyTerminal with proper loading state
import { LazyFaultyTerminal } from '../../components/lazy/LazyBoundaries';
import { 
  getSkills, 
  getAboutData
} from '../../data';

// Technology brand icon mapping
const techIconMap: Record<string, IconType> = {
  // Languages
  "Python": SiPython,
  "Go": SiGo,
  "TypeScript": SiTypescript,
  "JavaScript": SiJavascript,
  "C++": SiCplusplus,
  "C": SiC,
  "SQL": SiMysql,
  "Kotlin": SiKotlin,
  "Java": FaJava,
  "Bash": SiGnubash,

  // Frontend & Backend
  "React": SiReact,
  "Next.js": SiNextdotjs,
  "Node.js": SiNodedotjs,
  "Express.js": SiExpress,
  "Hono": SiHono,
  "FastAPI": SiFastapi,
  "Tailwind CSS": SiTailwindcss,
  "REST APIs": TbApi,
  "WebSockets": TbWebhook,
  "Server-Sent Events": TbBroadcast,

  // Machine Learning & Data
  "PyTorch": SiPytorch,
  "scikit-learn": SiScikitlearn,
  "Pandas": SiPandas,
  "NumPy": SiNumpy,
  "XGBoost": TbChartLine,
  "LightGBM": TbActivity,
  "CatBoost": TbWaveSine,
  "SHAP": TbBrain,
  "openSMILE": TbWaveSine,
  "ONNX": SiOnnx,
  "OpenVINO": SiIntel,

  // Databases
  "MongoDB": SiMongodb,
  "PostgreSQL": SiPostgresql,
  "MySQL": SiMysql,
  "DynamoDB": SiAmazondynamodb,
  "MongoDB Atlas Vector Search": SiMongodb,
  "Firebase": SiFirebase,
  "Supabase": SiSupabase,

  // Cloud & DevOps
  "AWS": SiAmazonwebservices,
  "Amazon Bedrock": SiAmazon,
  "EC2": SiAmazonec2,
  "S3": SiAmazons3,
  "Lambda": SiAwslambda,
  "API Gateway": SiAmazonapigateway,
  "SQS": SiAmazonsqs,
  "CloudWatch": SiAmazoncloudwatch,
  "GCP": SiGooglecloud,
  "Docker": SiDocker,
  "Linux": SiLinux,
  "GitHub Actions": SiGithubactions,
  "CI/CD": TbGitMerge,

  // Testing, APIs & Security
  "Git": SiGit,
  "GitHub": SiGithub,
  "Postman": SiPostman,
  "pytest": SiPytest,
  "Jest": SiJest,
  "Vitest": SiVitest,
  "Unit Testing": TbChecklist,
  "Integration Testing": TbComponents,
  "OpenAPI": SiOpenapiinitiative,
  "OAuth 2.0": SiOpenid,
  "JWT": SiJsonwebtokens,
  "TLS/HTTPS": TbShieldLock,
};

// Brand colors on hover
const techBrandColors: Record<string, string> = {
  "Python": "#3776AB",
  "Go": "#00ADD8",
  "TypeScript": "#3178C6",
  "JavaScript": "#F7DF1E",
  "C++": "#00599C",
  "C": "#A8B9CC",
  "SQL": "#4479A1",
  "Kotlin": "#7F52FF",
  "Java": "#007396",
  "Bash": "#4EAA25",
  "React": "#61DAFB",
  "Next.js": "#000000",
  "Node.js": "#5FA04E",
  "Express.js": "#000000",
  "Hono": "#E36002",
  "FastAPI": "#009688",
  "Tailwind CSS": "#06B6D4",
  "PyTorch": "#EE4C2C",
  "scikit-learn": "#F7931E",
  "Pandas": "#150458",
  "NumPy": "#013243",
  "ONNX": "#005CED",
  "OpenVINO": "#0054FF",
  "MongoDB": "#47A248",
  "PostgreSQL": "#4169E1",
  "MySQL": "#4479A1",
  "DynamoDB": "#4053D6",
  "Firebase": "#FFCA28",
  "Supabase": "#3ECF8E",
  "AWS": "#FF9900",
  "Docker": "#2496ED",
  "Linux": "#FCC624",
  "GitHub Actions": "#2088FF",
  "Git": "#F05032",
  "GitHub": "#181717",
  "Postman": "#FF6C37",
  "pytest": "#0A9EDC",
  "Jest": "#C21325",
  "Vitest": "#6E9F18"
};

// Category icons for the 6 Stack groups
const categoryIcons: Record<string, IconType> = {
  "Languages": TbTerminal2,
  "Frontend & Backend": TbServer,
  "Machine Learning & Data": TbBrain,
  "Databases": TbDatabase,
  "Cloud & DevOps": TbCloudComputing,
  "Testing, APIs & Security": TbShieldCheck,
};

// Concise, authentic interests
const interestsList = [
  {
    title: "Graphic Design",
    icon: TbPalette,
    description: "Logos, posters, and design systems",
    tags: ["UI/UX", "Figma", "Typography"]
  },
  {
    title: "Basketball",
    icon: FaBasketballBall,
    description: "Pickup games, court vision, and gym sessions",
    tags: ["Pickup", "Court Vision", "Endurance"]
  },
  {
    title: "Gaming",
    icon: TbDeviceGamepad2,
    description: "BGMI and tactical co-op matches with friends",
    tags: ["Tactics", "Squad Comms", "Reflexes"]
  },
  {
    title: "AI & ML",
    icon: TbBrain,
    description: "Models, evaluation, and applied research preprints",
    tags: ["TinyML", "arXiv", "Distillation"]
  },
  {
    title: "Photography",
    icon: TbCamera,
    description: "Street framing, symmetry, and architectural light",
    tags: ["Framing", "Symmetry", "Light"]
  },
  {
    title: "Music",
    icon: TbHeadphones,
    description: "Listening, acoustics, and experiments",
    tags: ["Ambient", "Lo-Fi", "Acoustics"]
  }
];

export default function AboutClient() {
  const aboutData = getAboutData();
  const skills = getSkills();
  const { reloadWithTransition } = usePageReload();
  const { actualTheme } = useTheme();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // If data hasn't loaded yet, show loading state
  if (!aboutData.aboutSections || aboutData.aboutSections.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-bg-start)', color: 'var(--color-text)' }}>
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <main className="relative w-full min-h-screen overflow-x-hidden" style={{ color: 'var(--color-text)' }}>
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* FaultyTerminal Background - Hero Section Only */}
        <div className="absolute inset-0 z-0">
  <PixelBlast
    variant="circle"
    pixelSize={2}
    color="#c96f2e"
    patternScale={7}
    patternDensity={1.2}
    pixelSizeJitter={1.6}
    enableRipples
    rippleSpeed={0.4}
    rippleThickness={0.12}
    rippleIntensityScale={1.5}
    // liquid
    // liquidStrength={0.12}
    // liquidRadius={1.2}
    // liquidWobbleSpeed={5}
    speed={0.6}
    edgeFade={0.25}
    transparent
  />
          {/* <LazyFaultyTerminal
            scale={2}
            gridMul={[3, 2]}
            digitSize={1.2}
            timeScale={0.5}
            scanlineIntensity={0.4}
            glitchAmount={1.2}
            flickerAmount={0.8}
            noiseAmp={1.1}
            chromaticAberration={2}
            curvature={0.15}
            tint="#c96f2e"
            mouseReact={true}
            mouseStrength={0.3}
            brightness={actualTheme === 'light' ? 0.3 : 0.7}
          /> */}
        </div>
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-20">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center lg:text-left"
          >
            {/* Neubrutalism Badge */}

            <h1 className="text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 drop-shadow-2xl" style={{ color: 'var(--color-text)' }}>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                style={{ color: 'var(--color-text)' }}
              >
                {aboutData.hero.title}
              </motion.span>{" "}
              <span className="text-gradient-fire relative inline-block sm:inline">
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  className="relative z-10"
                >
                  Me
                </motion.span>
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1, delay: 1.2 }}
                  className="absolute left-0 w-full h-1 origin-left top-full mt-1 sm:top-auto sm:mt-0 sm:bottom-2"
                  style={{ background: 'var(--color-accent-gradient)' }}
                />
              </span>
            </h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
              className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 leading-relaxed drop-shadow-lg"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              {aboutData.hero.subtitle}
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.4 }}
              className="flex justify-center lg:justify-start"
            >
              <PageHeroCta
                primary={{
                  label: 'Scroll to story',
                  href: '#who-i-am',
                  onClick: (e) => {
                    e.preventDefault();
                    document.getElementById('who-i-am')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  },
                }}
                signature={true}
              />
            </motion.div>
          </motion.div>

          {/* 3D Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex justify-center relative"
          >
            {/* Glow Effect */}
            <div 
              className="absolute inset-0 rounded-full blur-3xl scale-150 opacity-50"
              style={{ backgroundColor: 'var(--color-accent-glow)' }}
            ></div>
            
            <div className="w-56 h-56 sm:w-64 sm:h-64 lg:w-80 lg:h-80 xl:w-96 xl:h-96 relative z-10">
              {isMobile ? (
                <img
                  src={aboutData.hero.profileImage}
                  alt={aboutData.hero.profileAlt}
                  className="w-full h-full object-cover rounded-sm"
                />
              ) : (
                <TiltedCard
                  imageSrc={aboutData.hero.profileImage}
                  altText={aboutData.hero.profileAlt}
                  captionText={aboutData.hero.profileCaption}
                  containerHeight="100%"
                  containerWidth="100%"
                  imageHeight="100%"
                  imageWidth="100%"
                  rotateAmplitude={10}
                  scaleOnHover={1.05}
                  showMobileWarning={false}
                  showTooltip={true}
                  displayOverlayContent={true}
                />
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Who I Am - Complete Description Section */}
      <section id="who-i-am" className="relative z-10 py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6" style={{ color: 'var(--color-text)' }}>
              Story
            </h2>
            <div className="w-24 h-1 mx-auto mb-8" style={{ background: 'var(--color-accent-gradient)' }}></div>
          </motion.div>

          {/* Who I Am Content - Neubrutalism Layout */}
          <div className="space-y-8">
            {aboutData.aboutSections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="h-full"
              >
                {/* Neubrutalism About Section Card */}
                <div className="relative w-full min-h-[280px] neubrutalism-card"
                  style={{
                    backgroundColor: 'var(--color-surface)',
                    borderColor: 'var(--color-accent)',
                  }}
                >
                  <div className="p-6 md:p-8 h-full flex flex-col">
                    <h3 className="text-xl md:text-2xl font-black mb-4 uppercase tracking-wide" style={{ color: 'var(--color-text)' }}>
                      {section.title}
                    </h3>
                    <div className="flex-1">
                      {section.content.map((paragraph, pIndex) => (
                        <p key={pIndex} className="leading-relaxed mb-4 text-sm md:text-base font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                          {paragraph.split(/(\*\*.*?\*\*)/).map((part, partIndex) => {
                            if (part.startsWith('**') && part.endsWith('**')) {
                              return (
                                <span key={partIndex} className="text-orange-500 font-black">
                                  {part.slice(2, -2)}
                                </span>
                              );
                            }
                            return part;
                          })}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-center pt-8"
            >
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
                <Link 
                  href="/projects"
                  className="px-6 py-3 neubrutalism-button font-black uppercase tracking-wide text-center inline-flex items-center gap-2 text-sm w-fit"
                  style={{ 
                    backgroundColor: 'var(--color-surface)',
                    borderColor: 'var(--color-accent)',
                    color: 'var(--color-text)'
                  }}
                >
                  Projects
                </Link>
                <Link 
                  href="/experience"
                  className="px-6 py-3 neubrutalism-button font-black uppercase tracking-wide text-center inline-flex items-center gap-2 text-sm w-fit"
                  style={{ 
                    borderColor: 'var(--color-accent)',
                    backgroundColor: 'var(--color-accent)',
                    color: 'var(--color-button-text)'
                  }}
                >
                  Experience
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="relative z-10 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
              Stack
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--color-text-secondary)' }}>
              What I use day to day
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.map((skill, index) => {
              const CategoryIcon = categoryIcons[skill.category] || TbTerminal2;

              return (
                <motion.div
                  key={skill.category}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className="h-full"
                >
                  {/* Neubrutalism Skills Card */}
                  <div 
                    className="h-full flex flex-col p-6 neubrutalism-card"
                    style={{
                      backgroundColor: 'var(--color-surface)',
                      borderColor: 'var(--color-accent)',
                    }}
                  >
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-5 pb-3 border-b-2"
                      style={{ borderColor: 'var(--color-border)' }}
                    >
                      <div 
                        className="w-9 h-9 rounded-lg border-2 flex items-center justify-center flex-shrink-0"
                        style={{ 
                          borderColor: 'var(--color-accent)', 
                          backgroundColor: 'var(--color-surface-elevated)',
                          color: 'var(--color-accent)',
                          boxShadow: '2px 2px 0px 0px var(--shadow-neubrutalism-small)'
                        }}
                      >
                        <CategoryIcon className="w-5 h-5" />
                      </div>
                      <h3 className="text-lg font-black uppercase tracking-wide" style={{ color: 'var(--color-text)' }}>
                        {skill.category}
                      </h3>
                    </div>

                    {/* Technologies */}
                    <div className="flex-1 flex flex-wrap gap-2 content-start">
                      {skill.technologies.map((tech) => {
                        const TechIcon = techIconMap[tech];
                        const brandColor = techBrandColors[tech];

                        return (
                          <span
                            key={tech}
                            className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-lg border-2 text-xs font-bold transition-all duration-200 cursor-default"
                            style={{
                              backgroundColor: 'var(--color-surface-elevated)',
                              borderColor: 'var(--color-border)',
                              color: 'var(--color-text)'
                            }}
                            onMouseEnter={(e) => {
                              if (brandColor) {
                                e.currentTarget.style.borderColor = brandColor;
                              }
                              e.currentTarget.style.transform = 'translate(-1px, -1px)';
                              e.currentTarget.style.boxShadow = '2px 2px 0px 0px var(--shadow-neubrutalism-small)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.borderColor = 'var(--color-border)';
                              e.currentTarget.style.transform = 'none';
                              e.currentTarget.style.boxShadow = 'none';
                            }}
                          >
                            {TechIcon ? (
                              <TechIcon 
                                className="w-4 h-4 flex-shrink-0 transition-colors duration-200" 
                                style={{ color: 'var(--color-accent)' }}
                              />
                            ) : (
                              <span 
                                className="w-1.5 h-1.5 rounded-full" 
                                style={{ backgroundColor: 'var(--color-accent)' }} 
                              />
                            )}
                            <span className="tracking-tight">{tech}</span>
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Interests Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
              Off the keyboard
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--color-text-secondary)' }}>
              Hobbies and side interests
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {interestsList.map((interest, index) => {
              const InterestIcon = interest.icon;

              return (
                <motion.div
                  key={interest.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className="h-full"
                >
                  {/* Neubrutalism Interests Card */}
                  <div 
                    className="h-full flex flex-col justify-between p-6 neubrutalism-card"
                    style={{
                      backgroundColor: 'var(--color-surface)',
                      borderColor: 'var(--color-accent)',
                    }}
                  >
                    <div>
                      {/* Icon */}
                      <div 
                        className="w-11 h-11 rounded-lg border-2 flex items-center justify-center mb-4"
                        style={{ 
                          borderColor: 'var(--color-accent)', 
                          backgroundColor: 'var(--color-surface-elevated)',
                          color: 'var(--color-accent)',
                          boxShadow: '2px 2px 0px 0px var(--shadow-neubrutalism-small)'
                        }}
                      >
                        <InterestIcon className="w-5 h-5" />
                      </div>

                      {/* Title */}
                      <h3 className="text-lg font-black uppercase tracking-wide mb-2" style={{ color: 'var(--color-text)' }}>
                        {interest.title}
                      </h3>

                      {/* Description */}
                      <p className="text-sm font-medium mb-4" style={{ color: 'var(--color-text-secondary)' }}>
                        {interest.description}
                      </p>
                    </div>

                    {/* Tags */}
                    <div className="pt-3 border-t flex flex-wrap gap-1.5" style={{ borderColor: 'var(--color-border)' }}>
                      {interest.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs font-semibold px-2 py-0.5 rounded border"
                          style={{
                            backgroundColor: 'var(--color-surface-elevated)',
                            borderColor: 'var(--color-border)',
                            color: 'var(--color-text-muted)'
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: 'var(--color-text)' }}>
              Contact
            </h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto" style={{ color: 'var(--color-text-secondary)' }}>
              Open to internships and interesting projects.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
              <Link 
                href="/projects"
                className="px-6 py-3 neubrutalism-button font-black uppercase tracking-wide text-center inline-flex items-center gap-2 text-sm w-fit"
                style={{ 
                  backgroundColor: 'var(--color-surface)',
                  borderColor: 'var(--color-accent)',
                  color: 'var(--color-text)'
                }}
              >
                Projects
              </Link>
              <a 
                href="#contact"
                className="px-6 py-3 neubrutalism-button font-black uppercase tracking-wide text-center inline-flex items-center gap-2 text-sm w-fit"
                style={{ 
                  borderColor: 'var(--color-accent)',
                  backgroundColor: 'var(--color-accent)',
                  color: 'var(--color-button-text)'
                }}
              >
                Get in touch
              </a>
            </div>
          </motion.div>
        </div>
      </section>
      
      <Footer />
    </main>
  );
}
