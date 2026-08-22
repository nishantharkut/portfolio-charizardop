"use client";

import { motion } from "framer-motion";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import PixelBlast from "../components/ui/PixelBlast";
import { PageHeroCta } from "../components/ui/PageHeroCta";
import { getExperienceData } from "../../data";

export default function ExperiencePage() {
  const experienceData = getExperienceData();

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

      <section
        id="experience-timeline"
        data-section="work-history"
        className="relative z-10 px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
      >
        <div className="mx-auto max-w-6xl">
          <motion.header
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.45 }}
            className="mb-10 border-b pb-7 sm:mb-12"
            style={{ borderColor: "var(--color-border)" }}
          >
            <p className="mb-2 text-xs font-semibold uppercase" style={{ color: "var(--color-accent)" }}>
              Work history
            </p>
            <h2 className="text-3xl font-semibold sm:text-4xl" style={{ color: "var(--color-text)" }}>
              Experience
            </h2>
          </motion.header>

          <div className="border-b" style={{ borderColor: "var(--color-border)" }}>
            {experienceData.map((item, index) => (
              <motion.article
                key={item.id}
                data-work-entry
                data-company={item.company}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                className="grid gap-6 border-t py-10 lg:grid-cols-[11rem_minmax(0,1fr)] lg:gap-12 lg:py-12"
                style={{ borderColor: "var(--color-border)" }}
              >
                <div>
                  <p className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>
                    {item.duration}
                  </p>
                  <p className="mt-1 text-xs" style={{ color: "var(--color-text-muted)" }}>
                    {item.months}
                  </p>
                </div>

                <div className="min-w-0">
                  <div className="mb-5">
                    <h3 className="text-xl font-semibold leading-snug sm:text-2xl" style={{ color: "var(--color-text)" }}>
                      {item.position}
                    </h3>
                    <p className="mt-1 text-sm font-semibold" style={{ color: "var(--color-accent)" }}>
                      {item.company}
                    </p>
                  </div>

                  <p className="max-w-4xl text-sm leading-7 sm:text-base" style={{ color: "var(--color-text-secondary)" }}>
                    {item.description}
                  </p>

                  <div className="mt-7 border-t pt-5" style={{ borderColor: "var(--color-border-light)" }}>
                    <h4 className="text-xs font-semibold uppercase" style={{ color: "var(--color-text-muted)" }}>
                      Technologies
                    </h4>
                    <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2" aria-label={`${item.company} technologies`}>
                      {item.technologies.map((technology) => (
                        <li key={technology} className="flex items-center gap-2 text-sm" style={{ color: "var(--color-text-secondary)" }}>
                          <span className="h-1.5 w-1.5 flex-shrink-0" style={{ backgroundColor: "var(--color-accent)" }} aria-hidden="true" />
                          {technology}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-7">
                    <h4 className="text-xs font-semibold uppercase" style={{ color: "var(--color-text-muted)" }}>
                      Selected work
                    </h4>
                    <ol className="mt-3 border-y" style={{ borderColor: "var(--color-border-light)" }}>
                      {item.achievements.map((achievement, achievementIndex) => (
                        <li
                          key={achievement}
                          className="grid grid-cols-[1.75rem_minmax(0,1fr)] gap-3 border-b py-4 last:border-b-0"
                          style={{ borderColor: "var(--color-border-light)" }}
                        >
                          <span className="pt-0.5 text-xs font-semibold" style={{ color: "var(--color-accent)" }}>
                            {String(achievementIndex + 1).padStart(2, "0")}
                          </span>
                          <span className="text-sm leading-6 sm:text-base sm:leading-7" style={{ color: "var(--color-text-secondary)" }}>
                            {achievement}
                          </span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
