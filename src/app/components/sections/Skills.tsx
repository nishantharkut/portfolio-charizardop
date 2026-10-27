"use client";

import { motion } from "framer-motion";
import {
  SiC,
  SiCplusplus,
  SiPython,
  SiGo,
  SiTypescript,
  SiJavascript,
  SiKotlin,
  SiGnubash,
  SiHtml5,
  SiCss3,
  SiReact,
  SiNextdotjs,
  SiTailwindcss,
  SiThreedotjs,
  SiGreensock,
  SiFramer,
  SiFastapi,
  SiHono,
  SiNodedotjs,
  SiExpress,
  SiGraphql,
  SiPytorch,
  SiScikitlearn,
  SiPandas,
  SiNumpy,
  SiOnnx,
  SiMongodb,
  SiPostgresql,
  SiMysql,
  SiAmazondynamodb,
  SiFirebase,
  SiSupabase,
  SiAmazonwebservices,
  SiGooglecloud,
  SiVercel,
  SiDocker,
  SiNginx,
  SiGithubactions,
  SiGit,
  SiGithub,
  SiPostman,
  SiPytest,
  SiJest,
  SiVitest,
  SiLinux,
} from "react-icons/si";
import { TbApi, TbWebhook, TbBrain } from "react-icons/tb";
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
      { name: "Python", icon: SiPython },
      { name: "Go", icon: SiGo },
      { name: "TypeScript", icon: SiTypescript },
      { name: "JavaScript", icon: SiJavascript },
      { name: "C", icon: SiC },
      { name: "C++", icon: SiCplusplus },
      { name: "Kotlin", icon: SiKotlin },
      { name: "Bash", icon: SiGnubash },
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
      { name: "Framer Motion", icon: SiFramer },
    ],
  },
  {
    label: "Backend",
    items: [
      { name: "FastAPI", icon: SiFastapi },
      { name: "Hono", icon: SiHono },
      { name: "Node.js", icon: SiNodedotjs },
      { name: "Express", icon: SiExpress },
      { name: "REST", icon: TbApi },
      { name: "GraphQL", icon: SiGraphql },
      { name: "WebSockets", icon: TbWebhook },
      { name: "SSE", icon: TbWebhook },
    ],
  },
  {
    label: "Machine Learning / Data",
    items: [
      { name: "PyTorch", icon: SiPytorch },
      { name: "scikit-learn", icon: SiScikitlearn },
      { name: "Pandas", icon: SiPandas },
      { name: "NumPy", icon: SiNumpy },
      { name: "SHAP", icon: TbBrain },
      { name: "ONNX", icon: SiOnnx },
    ],
  },
  {
    label: "Databases",
    items: [
      { name: "MongoDB", icon: SiMongodb },
      { name: "PostgreSQL", icon: SiPostgresql },
      { name: "MySQL", icon: SiMysql },
      { name: "DynamoDB", icon: SiAmazondynamodb },
      { name: "Firebase", icon: SiFirebase },
      { name: "Supabase", icon: SiSupabase },
    ],
  },
  {
    label: "Cloud / DevOps",
    items: [
      { name: "AWS", icon: SiAmazonwebservices },
      { name: "GCP", icon: SiGooglecloud },
      { name: "Vercel", icon: SiVercel },
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
      { name: "pytest", icon: SiPytest },
      { name: "Jest", icon: SiJest },
      { name: "Vitest", icon: SiVitest },
      { name: "Linux", icon: SiLinux },
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
          className="section-heading-gradient text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-14"
        >
          Tech Stack
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
