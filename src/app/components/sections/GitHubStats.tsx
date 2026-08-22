"use client";

import { motion } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";
import { useEffect, useState } from "react";

interface GitHubStatsProps {
  username?: string;
  showTitle?: boolean;
  compact?: boolean;
}

const skeletonRows = Array.from({ length: 7 });
const skeletonColumns = Array.from({ length: 38 });

function ContributionChartSkeleton({ hidden }: { hidden: boolean }) {
  return (
    <div
      data-github-chart-skeleton
      className={`absolute inset-0 flex flex-col px-2 py-2 transition-opacity duration-200 ${
        hidden ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      role={hidden ? undefined : "status"}
      aria-hidden={hidden}
    >
      <div className="flex h-5 shrink-0 items-center gap-2 px-1">
        <span
          className="h-2 w-2 animate-pulse rounded-full"
          style={{ backgroundColor: "var(--color-accent)" }}
          aria-hidden="true"
        />
        <span
          data-github-chart-loading-label
          className="text-xs font-semibold"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Loading GitHub activity
        </span>
      </div>

      <div className="mt-1.5 flex min-h-0 flex-1 animate-pulse flex-col gap-1" aria-hidden="true">
        {skeletonRows.map((_, rowIndex) => (
          <div key={rowIndex} className="flex min-h-[3px] flex-1 gap-1.5">
            {skeletonColumns.map((__, columnIndex) => (
              <span
                key={columnIndex}
                className="block h-full flex-1 rounded-[1px]"
                style={{
                  backgroundColor: "var(--color-skeleton)",
                  opacity: 0.3 + ((rowIndex * 5 + columnIndex * 3) % 4) * 0.1,
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

const GitHubStats: React.FC<GitHubStatsProps> = ({
  username = "nishantharkut",
  showTitle = true,
  compact = false,
}) => {
  const { actualTheme } = useTheme();
  const isDark = actualTheme === "dark";
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const chartColor = isDark ? "e07a38" : "c96f2e";

  useEffect(() => {
    setImageError(false);
    setImageLoaded(false);
  }, [chartColor, username]);

  return (
    <section
      className={`relative z-10 ${compact ? "py-2 sm:py-4" : "py-16 sm:py-20 md:py-24"}`}
    >
      <div className="section-container" style={{ maxWidth: 900 }}>
        {showTitle && (
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-center"
            style={{ color: "var(--color-text)" }}
          >
            GitHub <span style={{ color: "var(--color-accent)" }}>Activity</span>
          </motion.h2>
        )}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="w-full overflow-x-auto"
        >
          <div
            data-github-chart-shell
            data-chart-state={imageError ? "error" : imageLoaded ? "loaded" : "loading"}
            className="relative min-w-[500px] overflow-hidden"
            style={{ aspectRatio: "5.55 / 1" }}
          >
            <ContributionChartSkeleton hidden={imageLoaded || imageError} />

            {!imageError && (
              <img
                key={`${chartColor}-${username}`}
                data-github-chart-image
                src={`https://ghchart.rshah.org/${chartColor}/${username}`}
                alt="GitHub Contribution Chart"
                className={`absolute inset-0 block h-full w-full object-contain transition-opacity duration-200 ${
                  imageLoaded ? "opacity-100" : "opacity-0"
                }`}
                style={{
                  filter: isDark
                    ? "brightness(1.1) contrast(1.05)"
                    : "brightness(0.95) contrast(1.1)",
                  imageRendering: "pixelated",
                }}
                loading="lazy"
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
              />
            )}

            {imageError && (
              <p
                className="absolute inset-0 flex items-center justify-center px-4 text-center text-xs opacity-50"
                style={{ color: "var(--color-text-muted)" }}
              >
                Unable to load contribution chart
              </p>
            )}
          </div>
        </motion.div>

        {imageLoaded && (
          <a
            data-github-chart-attribution
            href={`https://github.com/${username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-1.5 text-[11px] opacity-30 transition-opacity hover:opacity-60"
            style={{ color: "var(--color-text-muted)" }}
          >
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            @{username}
          </a>
        )}
      </div>
    </section>
  );
};

export default GitHubStats;
