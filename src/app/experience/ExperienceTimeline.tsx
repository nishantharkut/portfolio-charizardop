"use client";

import Image from "next/image";
import { useLayoutEffect, useRef, useState } from "react";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import { gsap, ScrollTrigger } from "@/utils/gsap";
import {
  SiAdobeillustrator,
  SiAdobephotoshop,
  SiAmazonwebservices,
  SiFigma,
  SiGo,
  SiPostgresql,
  SiPython,
  SiReact,
  SiTypescript,
} from "react-icons/si";
import { TbCode } from "react-icons/tb";
import type { IconType } from "react-icons";
import type { ExperienceItem } from "../../data";

interface ExperienceTimelineProps {
  items: ExperienceItem[];
}

const technologyIcons: Record<string, IconType> = {
  Python: SiPython,
  Go: SiGo,
  TypeScript: SiTypescript,
  React: SiReact,
  PostgreSQL: SiPostgresql,
  AWS: SiAmazonwebservices,
  Figma: SiFigma,
  "Adobe Photoshop": SiAdobephotoshop,
  "Adobe Illustrator": SiAdobeillustrator,
};

function TechnologyLogos({ technologies }: { technologies: string[] }) {
  return (
    <ul data-technology-list className="mt-3 flex min-h-9 flex-wrap items-center gap-4" aria-label="Technologies used">
      {technologies.map((technology) => {
        const Icon = technologyIcons[technology] ?? TbCode;

        return (
          <li
            key={technology}
            data-technology-logo
            className="flex h-9 w-9 items-center justify-center"
            style={{ color: "var(--color-text-secondary)" }}
            aria-label={technology}
            title={technology}
            role="img"
          >
            <Icon className="h-7 w-7" aria-hidden="true" focusable="false" />
          </li>
        );
      })}
    </ul>
  );
}

export default function ExperienceTimeline({ items }: ExperienceTimelineProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const entriesContainerRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const entriesRef = useRef<(HTMLElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const entriesContainer = entriesContainerRef.current;
    const rail = railRef.current;
    const progress = progressRef.current;

    if (!section || !entriesContainer || !rail || !progress) return;

    const positionRail = () => {
      const nodes = entriesRef.current
        .map((entry) => entry?.querySelector<HTMLElement>("[data-timeline-node]"))
        .filter((node): node is HTMLElement => Boolean(node));
      const firstNode = nodes.at(0);
      const lastNode = nodes.at(-1);
      if (!firstNode || !lastNode) return;

      const containerRect = entriesContainer.getBoundingClientRect();
      const firstRect = firstNode.getBoundingClientRect();
      const lastRect = lastNode.getBoundingClientRect();
      const top = firstRect.top + firstRect.height / 2 - containerRect.top;
      const bottom = lastRect.top + lastRect.height / 2 - containerRect.top;

      rail.style.top = `${top}px`;
      rail.style.height = `${Math.max(0, bottom - top)}px`;
    };

    positionRail();
    const railObserver = new ResizeObserver(positionRail);
    railObserver.observe(entriesContainer);

    const media = gsap.matchMedia();
    const context = gsap.context(() => {
      media.add(
        {
          motion: "(prefers-reduced-motion: no-preference)",
          reducedMotion: "(prefers-reduced-motion: reduce)",
        },
        (mediaContext) => {
          const { motion, reducedMotion } = mediaContext.conditions as {
            motion: boolean;
            reducedMotion: boolean;
          };

          if (reducedMotion) {
            gsap.set(progress, { scaleY: 1 });
            setActiveIndex(-1);
            return;
          }

          if (!motion) return;

          gsap.set(progress, { scaleY: 0, transformOrigin: "top center" });
          gsap.to(progress, {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top 62%",
              end: "bottom 58%",
              scrub: 0.35,
            },
          });

          entriesRef.current.forEach((entry, index) => {
            if (!entry) return;

            ScrollTrigger.create({
              trigger: entry,
              start: "top 62%",
              end: "bottom 42%",
              onEnter: () => setActiveIndex(index),
              onEnterBack: () => setActiveIndex(index),
            });
          });
        },
      );
    }, section);

    return () => {
      railObserver.disconnect();
      media.revert();
      context.revert();
    };
  }, [items.length]);

  return (
    <section
      ref={sectionRef}
      id="experience-timeline"
      data-section="work-history"
      data-experience-timeline
      className="relative z-10 px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
    >
      <div className="mx-auto max-w-6xl">
        <header className="border-b pb-8" style={{ borderColor: "var(--color-border)" }}>
          <h2 className="text-3xl font-semibold sm:text-4xl" style={{ color: "var(--color-text)" }}>
            Work History
          </h2>
        </header>

        <div ref={entriesContainerRef} className="relative">
          <div
            ref={railRef}
            data-timeline-rail
            className="absolute left-[0.6875rem] w-px md:left-[12.1875rem]"
            style={{ backgroundColor: "var(--color-border)" }}
            aria-hidden="true"
          >
            <div
              ref={progressRef}
              data-timeline-progress
              className="h-full w-full"
              style={{ backgroundColor: "var(--color-accent)", transformOrigin: "top center" }}
            />
          </div>

          {items.map((item, index) => {
            const isActive = activeIndex === -1 || activeIndex === index;

            return (
              <article
                key={item.id}
                ref={(element) => {
                  entriesRef.current[index] = element;
                }}
                data-work-entry
                data-company={item.company}
                data-active={isActive ? "true" : "false"}
                className="grid grid-cols-[1.5rem_minmax(0,1fr)] gap-x-4 border-b py-12 first:border-t md:grid-cols-[10rem_1.5rem_minmax(0,1fr)] md:gap-x-6 md:py-16"
                style={{ borderColor: "var(--color-border)" }}
              >
                <div className="col-start-2 row-start-1 mb-7 md:col-start-1 md:mb-0 md:pt-0.5 md:text-right">
                  <p
                    data-employment-duration
                    className="text-xl font-semibold leading-none"
                    style={{ color: "var(--color-text)" }}
                  >
                    {item.months}
                  </p>
                  <p className="mt-2 text-sm leading-5" style={{ color: "var(--color-text-secondary)" }}>
                    {item.duration}
                  </p>
                </div>

                <div className="relative z-10 col-start-1 row-start-1 flex justify-center pt-1 md:col-start-2">
                  <span
                    data-timeline-node
                    className={`block h-3 w-3 border-2 transition-[background-color,border-color,transform] duration-300 ${
                      isActive ? "scale-100" : "scale-75"
                    }`}
                    style={{
                      backgroundColor: isActive ? "var(--color-accent)" : "var(--color-bg-start)",
                      borderColor: isActive ? "var(--color-accent)" : "var(--color-border)",
                    }}
                    aria-hidden="true"
                  />
                </div>

                <div className="col-start-2 row-start-2 min-w-0 md:col-start-3 md:row-start-1">
                  <div className="mb-5">
                    <h3 className="text-xl font-semibold leading-snug sm:text-2xl" style={{ color: "var(--color-text)" }}>
                      {item.position}
                    </h3>
                    <div className="mt-2 flex min-h-9 items-center gap-3">
                      {item.logo && (
                        <div className={`relative shrink-0 ${item.logoDark ? "h-9 w-32" : "h-7 w-7"}`}>
                          <Image
                            data-company-logo
                            data-company-logo-variant
                            src={item.logo}
                            alt={`${item.company} logo`}
                            fill
                            sizes={item.logoDark ? "128px" : "28px"}
                            className={`company-logo object-contain object-left ${item.logoDark ? "company-logo--light" : ""}`}
                            loading="eager"
                            unoptimized
                          />
                          {item.logoDark && (
                            <Image
                              data-company-logo-variant
                              src={item.logoDark}
                              alt=""
                              fill
                              sizes="128px"
                              className="company-logo company-logo--dark object-contain object-left"
                              aria-hidden="true"
                              loading="eager"
                              unoptimized
                            />
                          )}
                        </div>
                      )}
                      {item.website ? (
                        <a
                          data-company-link
                          href={item.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm font-semibold transition-colors hover:text-[var(--color-accent-hover)]"
                          style={{ color: "var(--color-accent)" }}
                        >
                          {item.company}
                          <ArrowTopRightOnSquareIcon className="h-3.5 w-3.5" aria-hidden="true" />
                        </a>
                      ) : (
                        <p className="text-sm font-semibold" style={{ color: "var(--color-accent)" }}>
                          {item.company}
                        </p>
                      )}
                    </div>
                  </div>

                  <p className="max-w-4xl text-sm leading-7 sm:text-base" style={{ color: "var(--color-text-secondary)" }}>
                    {item.description}
                  </p>

                  <div className="mt-6 border-t pt-4" style={{ borderColor: "var(--color-border-light)" }}>
                    <p className="text-xs font-semibold uppercase" style={{ color: "var(--color-text-muted)" }}>
                      Technologies
                    </p>
                    <TechnologyLogos technologies={item.technologies} />
                  </div>

                  <div className="mt-7">
                    <p className="text-xs font-semibold uppercase" style={{ color: "var(--color-text-muted)" }}>
                      Selected work
                    </p>
                    <ul className="mt-3 space-y-3">
                      {item.achievements.map((achievement) => (
                        <li key={achievement} className="grid grid-cols-[0.5rem_minmax(0,1fr)] gap-3">
                          <span className="mt-[0.65rem] h-px w-2" style={{ backgroundColor: "var(--color-accent)" }} aria-hidden="true" />
                          <span className="text-sm leading-6 sm:text-base sm:leading-7" style={{ color: "var(--color-text-secondary)" }}>
                            {achievement}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
