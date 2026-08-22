"use client";

import { motion } from "framer-motion";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import PixelBlast from "../components/ui/PixelBlast";
import { PageHeroCta } from "../components/ui/PageHeroCta";
import { getExperienceData, getOpenSourceContributions } from "../../data";
import ExperienceTimeline from "./ExperienceTimeline";
import OpenSourceExperience from "./OpenSourceExperience";

export default function ExperiencePage() {
  const experienceData = getExperienceData();
  const openSourceContributions = getOpenSourceContributions();

  const scrollToExperience = (event: React.MouseEvent) => {
    event.preventDefault();
    document.getElementById("experience-timeline")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden" style={{ color: "var(--color-text)" }}>
      <Navbar />

      <section className="relative flex h-screen items-center justify-center overflow-hidden pt-16 md:pt-0">
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
            speed={0.6}
            edgeFade={0.25}
            transparent
          />
        </div>

        <div className="relative z-10 px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mb-4 text-2xl font-bold leading-tight drop-shadow-2xl sm:mb-6 sm:text-4xl md:text-6xl lg:text-7xl"
              style={{ color: "var(--color-text)" }}
            >
              Professional
              <br />
              <span className="relative inline-block sm:inline">
                <span className="relative z-10" style={{ color: "var(--color-accent)" }}>
                  Experience
                </span>
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1, delay: 1.2 }}
                  className="absolute left-0 top-full mt-1 h-1 w-full origin-left sm:bottom-1 sm:top-auto sm:mt-0"
                  style={{ background: "var(--color-accent-gradient)" }}
                  aria-hidden="true"
                />
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="mx-auto mb-6 max-w-2xl text-base drop-shadow-lg sm:mb-8 sm:text-lg md:text-xl"
              style={{ color: "var(--color-text)" }}
            >
              Work across <span className="font-semibold" style={{ color: "var(--color-accent)" }}>software engineering</span>, product QA, and{" "}
              <span className="font-semibold" style={{ color: "var(--color-accent)" }}>design</span>
            </motion.p>

            <PageHeroCta
              primary={{
                label: "View experience",
                href: "#experience-timeline",
                onClick: scrollToExperience,
              }}
            />
          </motion.div>
        </div>
      </section>

      <ExperienceTimeline items={experienceData} />
      <OpenSourceExperience contributions={openSourceContributions} />

      <Footer />
    </main>
  );
}
