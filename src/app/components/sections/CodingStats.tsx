"use client";

import { motion } from "framer-motion";
import { FaGithub } from "react-icons/fa";
import { SiLeetcode } from "react-icons/si";
import GitHubStats from "./GitHubStats";
import { useState } from "react";

interface CodingStatsProps {
  showTitle?: boolean;
}

const CodingStats: React.FC<CodingStatsProps> = ({ showTitle = true }) => {
  const [activeTab, setActiveTab] = useState<'github' | 'leetcode'>('github');

  return (
    <section id="coding-stats" className="relative z-10 py-12 sm:py-16 md:py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {showTitle && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 md:mb-12"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
              Coding <span className="text-orange-500">Statistics</span>
            </h2>
            <p className="text-sm sm:text-base max-w-2xl mx-auto px-4" style={{ color: 'var(--color-text-secondary)' }}>
              My contributions across platforms and problem-solving journey
            </p>
          </motion.div>
        )}

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex justify-center gap-3 md:gap-4 mb-8"
        >
          <button
            onClick={() => setActiveTab('github')}
            className={`neubrutalism-button px-4 md:px-6 py-2 md:py-3 font-black uppercase tracking-wide text-xs md:text-sm inline-flex items-center gap-2 transition-all duration-300 ${
              activeTab === 'github' ? 'translate-x-[2px] translate-y-[2px]' : ''
            }`}
            style={{
              backgroundColor: activeTab === 'github' ? 'var(--color-accent)' : 'var(--color-surface)',
              borderColor: 'var(--color-accent)',
              color: activeTab === 'github' ? 'var(--color-button-text)' : 'var(--color-text)',
              boxShadow: activeTab === 'github' ? 'none' : '3px 3px 0px 0px var(--shadow-neubrutalism)'
            }}
          >
            <FaGithub className="text-base md:text-lg" />
            GitHub
          </button>
          
          <button
            onClick={() => setActiveTab('leetcode')}
            className={`neubrutalism-button px-4 md:px-6 py-2 md:py-3 font-black uppercase tracking-wide text-xs md:text-sm inline-flex items-center gap-2 transition-all duration-300 ${
              activeTab === 'leetcode' ? 'translate-x-[2px] translate-y-[2px]' : ''
            }`}
            style={{
              backgroundColor: activeTab === 'leetcode' ? 'var(--color-accent)' : 'var(--color-surface)',
              borderColor: 'var(--color-accent)',
              color: activeTab === 'leetcode' ? 'var(--color-button-text)' : 'var(--color-text)',
              boxShadow: activeTab === 'leetcode' ? 'none' : '3px 3px 0px 0px var(--shadow-neubrutalism)'
            }}
          >
            <SiLeetcode className="text-base md:text-lg" />
            LeetCode
          </button>
        </motion.div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: activeTab === 'github' ? -20 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: activeTab === 'github' ? 20 : -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'github' && (
            <GitHubStats username="nishantharkut" showTitle={false} compact={false} />
          )}
          
          {activeTab === 'leetcode' && (
            <div className="text-center py-20">
              <div 
                className="neubrutalism-card p-8 md:p-12 inline-block"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  borderColor: 'var(--color-accent)',
                }}
              >
                <SiLeetcode className="text-5xl md:text-6xl text-orange-500 mb-4 mx-auto" />
                <h3 className="text-xl md:text-2xl font-black uppercase tracking-wide mb-3" style={{ color: 'var(--color-text)' }}>
                  LeetCode Stats
                </h3>
                <p className="text-sm md:text-base max-w-md" style={{ color: 'var(--color-text-secondary)' }}>
                  Coming Soon! LeetCode statistics and problem-solving metrics will be displayed here.
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default CodingStats;

