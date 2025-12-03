"use client";

import { motion } from "framer-motion";
import { FaGithub } from "react-icons/fa";
import { useTheme } from "@/contexts/ThemeContext";
import { useState } from "react";

interface GitHubStatsProps {
  username?: string;
  showTitle?: boolean;
  compact?: boolean;
}

const GitHubStats: React.FC<GitHubStatsProps> = ({ 
  username = "nishantharkut",
  showTitle = true,
  compact = false
}) => {
  const { actualTheme } = useTheme();
  const isDark = actualTheme === 'dark';
  
  // Track loading errors for heatmap
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  // Theme-aware colors
  const chartColor = isDark ? 'ff8c42' : 'ff6b1a';

  return (
    <section className={`relative z-10 ${compact ? 'py-8' : 'py-12 sm:py-16 md:py-20'} px-4`}>
      <div className="max-w-6xl mx-auto">
        {showTitle && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 md:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
              GitHub <span className="text-orange-500">Activity</span>
            </h2>
            <p className="text-sm sm:text-base max-w-2xl mx-auto px-4" style={{ color: 'var(--color-text-secondary)' }}>
              My coding journey and contributions visualized
            </p>
          </motion.div>
        )}

        {/* GitHub Contribution Heatmap - Full Width */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div 
            className="neubrutalism-card p-4 md:p-6"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-accent)',
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <FaGithub className="text-2xl md:text-3xl text-orange-500" />
              <h3 className="text-base md:text-lg font-black uppercase tracking-wide" style={{ color: 'var(--color-text)' }}>
                Contribution Heatmap
              </h3>
            </div>
            
            <div className="w-full overflow-x-auto scrollbar-thin">
              {!imageError ? (
                <div className="min-w-[600px] md:min-w-[700px]">
                  <img 
                    src={`https://ghchart.rshah.org/${chartColor}/${username}`}
                    alt="GitHub Contribution Chart"
                    className="w-full h-auto"
                    style={{ 
                      filter: isDark ? 'brightness(1.1) contrast(1.05)' : 'brightness(0.95) contrast(1.1)',
                      imageRendering: 'pixelated',
                      maxHeight: 'none',
                      aspectRatio: 'auto'
                    }}
                    loading="lazy"
                    onError={handleImageError}
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <FaGithub className="text-4xl mb-3 opacity-30" style={{ color: 'var(--color-text-secondary)' }} />
                  <p className="text-sm font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>
                    Unable to load contribution chart
                  </p>
                  <p className="text-xs opacity-70" style={{ color: 'var(--color-text-secondary)' }}>
                    Visit my GitHub profile to view contribution activity
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* View Profile Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center mt-6"
        >
          <a 
            href={`https://github.com/${username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 neubrutalism-button font-black uppercase tracking-wide text-xs md:text-sm"
            style={{
              borderColor: 'var(--color-accent)',
              backgroundColor: 'var(--color-accent)',
              color: 'var(--color-button-text)'
            }}
          >
            <FaGithub className="text-base md:text-lg" />
            View GitHub Profile
            <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default GitHubStats;
