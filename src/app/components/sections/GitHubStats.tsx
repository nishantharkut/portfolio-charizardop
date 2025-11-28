"use client";

import { motion } from "framer-motion";
import { FaGithub, FaCodeBranch, FaCode, FaStar, FaGitAlt } from "react-icons/fa";
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
  
  // Track loading errors for each stat
  const [imageErrors, setImageErrors] = useState({
    contributions: false,
    stats: false,
    languages: false,
    streak: false,
    trophies: false
  });

  const handleImageError = (type: keyof typeof imageErrors) => {
    setImageErrors(prev => ({ ...prev, [type]: true }));
  };

  // Theme-aware colors
  const accentColor = 'ff8c42';
  const bgColor = isDark ? '1a1a1a' : 'ffffff';
  const textColor = isDark ? 'ffffff' : '000000';
  const chartColor = isDark ? 'ff8c42' : 'ff6b1a';

  const stats = [
    { icon: FaGitAlt, label: "Commits", value: "500+", color: "text-green-500" },
    { icon: FaCodeBranch, label: "PRs", value: "120+", color: "text-blue-500" },
    { icon: FaCode, label: "Reviews", value: "80+", color: "text-purple-500" },
    { icon: FaStar, label: "Stars", value: "50+", color: "text-yellow-500" },
  ];

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
              Coding <span className="text-orange-500">Activity</span>
            </h2>
            <p className="text-sm sm:text-base max-w-2xl mx-auto px-4" style={{ color: 'var(--color-text-secondary)' }}>
              GitHub contributions and programming statistics
            </p>
          </motion.div>
        )}

        {/* Compact Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ scale: 1.03 }}
                className="h-full"
              >
                <div 
                  className="neubrutalism-card p-3 md:p-4 h-full flex flex-col items-center justify-center text-center min-h-[100px]"
                  style={{
                    backgroundColor: 'var(--color-surface)',
                    borderColor: 'var(--color-accent)',
                  }}
                >
                  <div className={`text-2xl md:text-3xl mb-2 ${stat.color}`}>
                    <IconComponent />
                  </div>
                  <div className="text-xl md:text-2xl font-black mb-1 bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <p className="text-[10px] md:text-xs font-bold uppercase tracking-wide" style={{ color: 'var(--color-text-secondary)' }}>
                    {stat.label}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Main Stats Grid - 2 columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6">
          {/* GitHub Contribution Graph */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2"
          >
            <div 
              className="neubrutalism-card p-3 md:p-4"
              style={{
                backgroundColor: 'var(--color-surface)',
                borderColor: 'var(--color-accent)',
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <FaGithub className="text-xl md:text-2xl text-orange-500" />
                <h3 className="text-sm md:text-base font-black uppercase tracking-wide" style={{ color: 'var(--color-text)' }}>
                  Contribution Activity
                </h3>
              </div>
              
              <div className="w-full overflow-x-auto scrollbar-thin">
                {!imageErrors.contributions ? (
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
                      onError={() => handleImageError('contributions')}
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

          {/* GitHub Stats Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div 
              className="neubrutalism-card p-3 md:p-4 h-full flex flex-col"
              style={{
                backgroundColor: 'var(--color-surface)',
                borderColor: 'var(--color-accent)',
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <FaGithub className="text-xl md:text-2xl text-orange-500" />
                <h3 className="text-sm md:text-base font-black uppercase tracking-wide" style={{ color: 'var(--color-text)' }}>
                  GitHub Stats
                </h3>
              </div>
              <div className="w-full flex-1 flex items-center justify-center">
                {!imageErrors.stats ? (
                  <img 
                    src={`https://github-readme-stats.vercel.app/api?username=${username}&show_icons=true&theme=${isDark ? 'radical' : 'default'}&hide_border=true&bg_color=00000000&title_color=${accentColor}&icon_color=${accentColor}&text_color=${textColor}&ring_color=${accentColor}&hide_title=false&card_width=400`}
                    alt="GitHub Stats"
                    className="w-full h-auto"
                    style={{ maxHeight: '180px', objectFit: 'contain' }}
                    loading="lazy"
                    onError={() => handleImageError('stats')}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <FaGithub className="text-4xl mb-3 opacity-30" style={{ color: 'var(--color-text-secondary)' }} />
                    <p className="text-sm font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>
                      Stats unavailable
                    </p>
                    <p className="text-xs opacity-70" style={{ color: 'var(--color-text-secondary)' }}>
                      Please check back later
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Top Languages Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div 
              className="neubrutalism-card p-3 md:p-4 h-full flex flex-col"
              style={{
                backgroundColor: 'var(--color-surface)',
                borderColor: 'var(--color-accent)',
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <FaCode className="text-xl md:text-2xl text-orange-500" />
                <h3 className="text-sm md:text-base font-black uppercase tracking-wide" style={{ color: 'var(--color-text)' }}>
                  Top Languages
                </h3>
              </div>
              <div className="w-full flex-1 flex items-center justify-center">
                {!imageErrors.languages ? (
                  <img 
                    src={`https://github-readme-stats.vercel.app/api/top-langs/?username=${username}&layout=compact&theme=${isDark ? 'radical' : 'default'}&hide_border=true&bg_color=00000000&title_color=${accentColor}&text_color=${textColor}&card_width=400`}
                    alt="Top Languages"
                    className="w-full h-auto"
                    style={{ maxHeight: '180px', objectFit: 'contain' }}
                    loading="lazy"
                    onError={() => handleImageError('languages')}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <FaCode className="text-4xl mb-3 opacity-30" style={{ color: 'var(--color-text-secondary)' }} />
                    <p className="text-sm font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>
                      Language stats unavailable
                    </p>
                    <p className="text-xs opacity-70" style={{ color: 'var(--color-text-secondary)' }}>
                      JavaScript, TypeScript, Python & more
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Streak and Trophies Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* GitHub Streak Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div 
              className="neubrutalism-card p-3 md:p-4 h-full flex flex-col"
              style={{
                backgroundColor: 'var(--color-surface)',
                borderColor: 'var(--color-accent)',
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <FaGitAlt className="text-xl md:text-2xl text-orange-500" />
                <h3 className="text-sm md:text-base font-black uppercase tracking-wide" style={{ color: 'var(--color-text)' }}>
                  Streak Stats
                </h3>
              </div>
              <div className="w-full flex-1 flex items-center justify-center">
                {!imageErrors.streak ? (
                  <img 
                    src={`https://github-readme-streak-stats.herokuapp.com/?user=${username}&theme=${isDark ? 'radical' : 'default'}&hide_border=true&background=00000000&ring=${accentColor}&fire=${accentColor}&currStreakLabel=${accentColor}&sideLabels=${textColor}&currStreakNum=${textColor}&dates=${textColor}&sideNums=${textColor}&card_width=400`}
                    alt="GitHub Streak Stats"
                    className="w-full h-auto"
                    style={{ maxHeight: '180px', objectFit: 'contain' }}
                    loading="lazy"
                    onError={() => handleImageError('streak')}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <FaGitAlt className="text-4xl mb-3 opacity-30" style={{ color: 'var(--color-text-secondary)' }} />
                    <p className="text-sm font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>
                      Streak stats unavailable
                    </p>
                    <p className="text-xs opacity-70" style={{ color: 'var(--color-text-secondary)' }}>
                      Consistent contributions throughout the year
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* GitHub Profile Trophy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div 
              className="neubrutalism-card p-3 md:p-4 h-full flex flex-col"
              style={{
                backgroundColor: 'var(--color-surface)',
                borderColor: 'var(--color-accent)',
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <FaStar className="text-xl md:text-2xl text-orange-500" />
                <h3 className="text-sm md:text-base font-black uppercase tracking-wide" style={{ color: 'var(--color-text)' }}>
                  Achievements
                </h3>
              </div>
              <div className="w-full flex-1 flex items-center justify-center overflow-x-auto">
                {!imageErrors.trophies ? (
                  <img 
                    src={`https://github-profile-trophy.vercel.app/?username=${username}&theme=${isDark ? 'radical' : 'flat'}&no-frame=true&no-bg=true&margin-w=4&column=2&row=2&title=MultiLanguage,Commits,PullRequest,Reviews`}
                    alt="GitHub Trophies"
                    className="w-full h-auto"
                    style={{ maxHeight: '180px', objectFit: 'contain' }}
                    loading="lazy"
                    onError={() => handleImageError('trophies')}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <FaStar className="text-4xl mb-3 opacity-30" style={{ color: 'var(--color-text-secondary)' }} />
                    <p className="text-sm font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>
                      Achievements unavailable
                    </p>
                    <p className="text-xs opacity-70" style={{ color: 'var(--color-text-secondary)' }}>
                      Multiple language proficiency & contributions
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* View Profile Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
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

