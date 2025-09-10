#!/usr/bin/env node

/**
 * Performance Analysis Script for Portfolio
 * Analyzes bundle sizes, performance metrics, and provides optimization recommendations
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  log(`\n${'='.repeat(60)}`, 'cyan');
  log(title, 'bright');
  log('='.repeat(60), 'cyan');
}

function logSubsection(title) {
  log(`\n${title}`, 'yellow');
  log('-'.repeat(title.length), 'yellow');
}

// Bundle size analysis
function analyzeBundleSize() {
  logSection('📦 BUNDLE SIZE ANALYSIS');
  
  try {
    const buildDir = path.join(process.cwd(), '.next');
    
    if (!fs.existsSync(buildDir)) {
      log('❌ Build directory not found. Run "npm run build" first.', 'red');
      return;
    }
    
    const staticDir = path.join(buildDir, 'static');
    if (fs.existsSync(staticDir)) {
      const chunks = fs.readdirSync(staticDir);
      const jsChunks = chunks.filter(chunk => chunk.endsWith('.js'));
      const cssChunks = chunks.filter(chunk => chunk.endsWith('.css'));
      
      logSubsection('JavaScript Chunks');
      let totalJSSize = 0;
      jsChunks.forEach(chunk => {
        const chunkPath = path.join(staticDir, chunk);
        const stats = fs.statSync(chunkPath);
        const sizeKB = Math.round(stats.size / 1024);
        totalJSSize += sizeKB;
        
        const color = sizeKB > 500 ? 'red' : sizeKB > 200 ? 'yellow' : 'green';
        log(`  ${chunk}: ${sizeKB}KB`, color);
      });
      
      logSubsection('CSS Chunks');
      let totalCSSSize = 0;
      cssChunks.forEach(chunk => {
        const chunkPath = path.join(staticDir, chunk);
        const stats = fs.statSync(chunkPath);
        const sizeKB = Math.round(stats.size / 1024);
        totalCSSSize += sizeKB;
        
        const color = sizeKB > 100 ? 'red' : sizeKB > 50 ? 'yellow' : 'green';
        log(`  ${chunk}: ${sizeKB}KB`, color);
      });
      
      logSubsection('Total Bundle Sizes');
      log(`  Total JavaScript: ${totalJSSize}KB`, totalJSSize > 1000 ? 'red' : totalJSSize > 500 ? 'yellow' : 'green');
      log(`  Total CSS: ${totalCSSSize}KB`, totalCSSSize > 200 ? 'red' : totalCSSSize > 100 ? 'yellow' : 'green');
      log(`  Total Assets: ${totalJSSize + totalCSSSize}KB`, (totalJSSize + totalCSSSize) > 1200 ? 'red' : (totalJSSize + totalCSSSize) > 600 ? 'yellow' : 'green');
    }
  } catch (error) {
    log(`❌ Error analyzing bundle size: ${error.message}`, 'red');
  }
}

// Asset analysis
function analyzeAssets() {
  logSection('🖼️ ASSET ANALYSIS');
  
  try {
    const publicDir = path.join(process.cwd(), 'public');
    
    if (!fs.existsSync(publicDir)) {
      log('❌ Public directory not found.', 'red');
      return;
    }
    
    function analyzeDirectory(dir, prefix = '') {
      const items = fs.readdirSync(dir);
      
      items.forEach(item => {
        const itemPath = path.join(dir, item);
        const stats = fs.statSync(itemPath);
        
        if (stats.isDirectory()) {
          analyzeDirectory(itemPath, `${prefix}${item}/`);
        } else {
          const sizeKB = Math.round(stats.size / 1024);
          const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
          
          let color = 'green';
          if (sizeKB > 1000) color = 'red';
          else if (sizeKB > 500) color = 'yellow';
          
          const sizeStr = sizeKB > 1024 ? `${sizeMB}MB` : `${sizeKB}KB`;
          log(`  ${prefix}${item}: ${sizeStr}`, color);
        }
      });
    }
    
    analyzeDirectory(publicDir);
  } catch (error) {
    log(`❌ Error analyzing assets: ${error.message}`, 'red');
  }
}

// Performance recommendations
function generateRecommendations() {
  logSection('💡 PERFORMANCE RECOMMENDATIONS');
  
  const recommendations = [
    {
      category: 'Bundle Optimization',
      items: [
        '✅ Implemented: Code splitting with webpack optimization',
        '✅ Implemented: Lazy loading for 3D models',
        '✅ Implemented: Tree shaking for GSAP and other libraries',
        '🔧 Consider: Further splitting of animation libraries',
        '🔧 Consider: Dynamic imports for non-critical components'
      ]
    },
    {
      category: 'Asset Optimization',
      items: [
        '✅ Implemented: WebP and AVIF image formats',
        '✅ Implemented: Optimized caching headers',
        '🔧 Consider: Compress 3D models further',
        '🔧 Consider: Use responsive images for all assets'
      ]
    },
    {
      category: 'Loading Performance',
      items: [
        '✅ Implemented: Intersection Observer for lazy loading',
        '✅ Implemented: Service Worker with smart caching',
        '✅ Implemented: Font optimization with fallbacks',
        '🔧 Consider: Implement resource hints for external domains'
      ]
    },
    {
      category: 'Runtime Performance',
      items: [
        '✅ Implemented: Performance monitoring script',
        '✅ Implemented: Device capability detection',
        '✅ Implemented: Adaptive quality based on device',
        '🔧 Consider: Implement virtual scrolling for long lists'
      ]
    }
  ];
  
  recommendations.forEach(rec => {
    logSubsection(rec.category);
    rec.items.forEach(item => {
      const color = item.startsWith('✅') ? 'green' : item.startsWith('🔧') ? 'yellow' : 'reset';
      log(`  ${item}`, color);
    });
  });
}

// Vercel-specific optimizations
function vercelOptimizations() {
  logSection('🚀 VERCEL OPTIMIZATIONS');
  
  const optimizations = [
    '✅ Implemented: Optimized caching headers for Vercel CDN',
    '✅ Implemented: Image optimization with Next.js Image component',
    '✅ Implemented: Static generation for all pages',
    '✅ Implemented: Service Worker for offline functionality',
    '🔧 Consider: Enable Vercel Analytics for real user monitoring',
    '🔧 Consider: Use Vercel Edge Functions for API routes',
    '🔧 Consider: Implement ISR (Incremental Static Regeneration) if needed'
  ];
  
  optimizations.forEach(opt => {
    const color = opt.startsWith('✅') ? 'green' : opt.startsWith('🔧') ? 'yellow' : 'reset';
    log(`  ${opt}`, color);
  });
}

// Performance metrics targets
function performanceTargets() {
  logSection('🎯 PERFORMANCE TARGETS');
  
  const targets = [
    { metric: 'First Contentful Paint (FCP)', target: '< 1.8s', current: 'Monitor with performance script' },
    { metric: 'Largest Contentful Paint (LCP)', target: '< 2.5s', current: 'Monitor with performance script' },
    { metric: 'Cumulative Layout Shift (CLS)', target: '< 0.1', current: 'Monitor with performance script' },
    { metric: 'First Input Delay (FID)', target: '< 100ms', current: 'Monitor with performance script' },
    { metric: 'Time to Interactive (TTI)', target: '< 3.8s', current: 'Monitor with performance script' },
    { metric: 'Total Bundle Size', target: '< 1MB', current: 'Check bundle analysis' },
    { metric: 'Initial JavaScript', target: '< 200KB', current: 'Check bundle analysis' }
  ];
  
  targets.forEach(target => {
    log(`  ${target.metric}: ${target.target}`, 'blue');
    log(`    Current: ${target.current}`, 'cyan');
  });
}

// Main execution
function main() {
  log('🚀 Portfolio Performance Analysis', 'bright');
  log('Analyzing your portfolio for performance optimizations...\n', 'cyan');
  
  analyzeBundleSize();
  analyzeAssets();
  generateRecommendations();
  vercelOptimizations();
  performanceTargets();
  
  logSection('📊 NEXT STEPS');
  log('1. Run "npm run build:analyze" to see detailed bundle analysis', 'green');
  log('2. Run "npm run performance:audit" for Lighthouse analysis', 'green');
  log('3. Check browser console for performance monitoring data', 'green');
  log('4. Monitor Core Web Vitals in production', 'green');
  log('5. Use Vercel Analytics for real user monitoring', 'green');
  
  log('\n✨ Analysis complete! Check the recommendations above.', 'bright');
}

// Run the analysis
if (require.main === module) {
  main();
}

module.exports = {
  analyzeBundleSize,
  analyzeAssets,
  generateRecommendations,
  vercelOptimizations,
  performanceTargets
};
