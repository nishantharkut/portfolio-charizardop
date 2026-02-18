"use client";

import { motion } from "framer-motion";
import {
  SiC,
  SiCplusplus,
  SiJavascript,
  SiTypescript,
  SiPython,
  SiGo,
  SiHtml5,
  SiCss3,
  SiReact,
  SiNextdotjs,
  SiTailwindcss,
  SiThreedotjs,
  SiGreensock,
  SiWebgl,
  SiFramer,
  SiNodedotjs,
  SiExpress,
  SiPrisma,
  SiPostgresql,
  SiGraphql,
  SiFastapi,
  SiMongodb,
  SiMysql,
  SiSqlite,
  SiFirebase,
  SiRedis,
  SiGooglecloud,
  SiAmazonwebservices,
  SiVercel,
  SiRender,
  SiRailway,
  SiDocker,
  SiNginx,
  SiGithubactions,
  SiGit,
  SiGithub,
  SiPostman,
  SiJsonwebtokens,
  SiAuth0,
  SiOwasp,
} from "react-icons/si";
import { TbApi, TbWebhook } from "react-icons/tb";
import type { IconType } from "react-icons";

interface TechItem {
  name: string;
  icon: IconType;
}

interface TechGroup {
  label: string;
  items: TechItem[];
}

const techGroups: TechGroup[] = [
  {
    label: "Languages",
    items: [
      { name: "C", icon: SiC },
      { name: "C++", icon: SiCplusplus },
      { name: "JavaScript", icon: SiJavascript },
      { name: "TypeScript", icon: SiTypescript },
      { name: "Python", icon: SiPython },
      { name: "Go", icon: SiGo },
      { name: "HTML", icon: SiHtml5 },
      { name: "CSS", icon: SiCss3 },
    ],
  },
  {
    label: "Frontend",
    items: [
      { name: "React", icon: SiReact },
      { name: "Next.js", icon: SiNextdotjs },
      { name: "Tailwind", icon: SiTailwindcss },
      { name: "Three.js", icon: SiThreedotjs },
      { name: "GSAP", icon: SiGreensock },
      { name: "WebGL", icon: SiWebgl },
      { name: "Framer Motion", icon: SiFramer },
    ],
  },
  {
    label: "Backend",
    items: [
      { name: "Node.js", icon: SiNodedotjs },
      { name: "Express", icon: SiExpress },
      { name: "Prisma", icon: SiPrisma },
      { name: "PostgreSQL", icon: SiPostgresql },
      { name: "REST", icon: TbApi },
      { name: "GraphQL", icon: SiGraphql },
      { name: "FastAPI", icon: SiFastapi },
      { name: "WebSockets", icon: TbWebhook },
    ],
  },
  {
    label: "Databases",
    items: [
      { name: "MongoDB", icon: SiMongodb },
      { name: "MySQL", icon: SiMysql },
      { name: "PostgreSQL", icon: SiPostgresql },
      { name: "SQLite", icon: SiSqlite },
      { name: "Firebase", icon: SiFirebase },
      { name: "Redis", icon: SiRedis },
    ],
  },
  {
    label: "DevOps / Cloud",
    items: [
      { name: "GCP", icon: SiGooglecloud },
      { name: "AWS", icon: SiAmazonwebservices },
      { name: "Vercel", icon: SiVercel },
      { name: "Render", icon: SiRender },
      { name: "Railway", icon: SiRailway },
      { name: "Docker", icon: SiDocker },
      { name: "Nginx", icon: SiNginx },
      { name: "GitHub Actions", icon: SiGithubactions },
    ],
  },
  {
    label: "Tools",
    items: [
      { name: "Git", icon: SiGit },
      { name: "GitHub", icon: SiGithub },
      { name: "Postman", icon: SiPostman },
      { name: "JWT", icon: SiJsonwebtokens },
      { name: "OAuth", icon: SiAuth0 },
      { name: "OWASP", icon: SiOwasp },
    ],
  },
];

export default function Skills() {
  return (
    <section id="skills" className="relative py-16 sm:py-20 md:py-24 lg:py-28">
      <div className="section-container">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-14"
          style={{ color: "var(--color-text)", fontWeight: 500 }}
        >
          Tech <span style={{ color: "var(--color-accent)" }}>Stack</span>
        </motion.h2>

        <div className="flex flex-col gap-10 sm:gap-12">
          {techGroups.map((group, gi) => (
            <motion.div
              key={group.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: gi * 0.06 }}
            >
              {/* Category label */}
              <p
                className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.15em] mb-5"
                style={{ color: "var(--color-text-muted)" }}
              >
                {group.label}
              </p>

              {/* Icon grid */}
              <div className="flex flex-wrap gap-x-6 gap-y-5 sm:gap-x-8 sm:gap-y-6">
                {group.items.map((item) => (
                  <div
                    key={item.name}
                    className="group flex items-center gap-2.5 transition-colors duration-200"
                  >
                    <item.icon
                      className="w-5 h-5 sm:w-[22px] sm:h-[22px] flex-shrink-0 transition-colors duration-200"
                      style={{ color: "var(--color-text-muted)" }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "var(--color-accent)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "var(--color-text-muted)")
                      }
                    />
                    <span
                      className="text-[13px] sm:text-sm font-medium whitespace-nowrap transition-colors duration-200 group-hover:text-[var(--color-text)]"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      {item.name}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
