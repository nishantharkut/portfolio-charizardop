"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const details = [
  { label: "Location", value: "Surat, India" },
  { label: "Focus", value: "Backend systems, DevOps, testing, applied AI/ML" },
  { label: "Education", value: "Integrated Dual Degree with B.Tech in Information Technology (Major), IIIT Gwalior" },
  { label: "Experience", value: "Completed 1-year Software Engineering Internship at QuickIntell" },
];

export default function About() {
  return (
    <section id="about" className="relative py-16 sm:py-20 md:py-24 lg:py-28">
      <div className="section-container">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="section-heading-gradient text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-12 sm:mb-14"
        >
          About Me
        </motion.h2>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-10 lg:gap-16 items-start">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="order-2 lg:order-1"
          >
            <p
              className="text-base sm:text-lg md:text-xl leading-relaxed mb-8"
              style={{ color: "var(--color-text-muted)" }}
            >
              I completed a one-year software engineering internship at QuickIntell, working on healthcare document processing, product features, testing, and production debugging. Outside that work, I build products end to end, conduct applied ML research on edge security and respiratory audio, and actively contribute to open source and hackathons.
            </p>

            {/* Detail rows */}
            <dl className="grid gap-4 sm:gap-5">
              {details.map((d, i) => (
                <motion.div
                  key={d.label}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: 0.2 + i * 0.07 }}
                  className="flex gap-4 items-baseline"
                >
                  <dt
                    className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.15em] w-24 sm:w-28 flex-shrink-0"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    {d.label}
                  </dt>
                  <dd
                    className="text-sm sm:text-base font-medium"
                    style={{ color: "var(--color-text)" }}
                  >
                    {d.value}
                  </dd>
                </motion.div>
              ))}
            </dl>

            {/* Read more — plain text link, no button */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.5 }}
              className="mt-8"
            >
              <Link
                href="/about"
                className="text-sm font-medium inline-flex items-center gap-1.5 transition-colors duration-200 hover:opacity-80"
                style={{ color: "var(--color-accent)" }}
              >
                Full story
                <span aria-hidden className="text-base">&rarr;</span>
              </Link>
            </motion.div>
          </motion.div>

          {/* Photo */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="order-1 lg:order-2 flex justify-center lg:justify-end"
          >
            <div
              className="w-[200px] h-[250px] sm:w-[240px] sm:h-[300px] lg:w-[280px] lg:h-[350px] rounded-2xl overflow-hidden"
              style={{
                border: "1px solid var(--color-border-light)",
              }}
            >
              <img
                src="/nishant-image.webp"
                alt="Nishant Harkut"
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                loading="lazy"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
