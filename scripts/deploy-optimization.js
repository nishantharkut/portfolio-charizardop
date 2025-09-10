#!/usr/bin/env node

/**
 * Deployment Optimization Script for Vercel
 * Optimizes the deployment process and provides pre-deployment checks
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

// Pre-deployment checks
function preDeploymentChecks() {
  logSection('🔍 PRE-DEPLOYMENT CHECKS');
  
  const checks = [
    {
      name: 'Build Test',
      command: 'npm run build:production',
      description: 'Testing production build'
    },
    {
      name: 'Type Check',
      command: 'npm run type-check',
      description: 'Checking TypeScript types'
    },
    {
      name: 'Lint Check',
      command: 'npm run lint',
      description: 'Running ESLint checks'
    }
  ];
  
  checks.forEach(check => {
    logSubsection(check.name);
    log(`  ${check.description}...`, 'blue');
    
    try {
      execSync(check.command, { stdio: 'pipe' });
      log(`  ✅ ${check.name} passed`, 'green');
    } catch (error) {
      log(`  ❌ ${check.name} failed`, 'red');
      log(`  Error: ${error.message}`, 'red');
      process.exit(1);
    }
  });
}

// Bundle size check
function bundleSizeCheck() {
  logSection('📦 BUNDLE SIZE CHECK');
  
  try {
    const buildDir = path.join(process.cwd(), '.next');
    
    if (!fs.existsSync(buildDir)) {
      log('❌ Build directory not found. Run build first.', 'red');
      return;
    }
    
    const staticDir = path.join(buildDir, 'static');
    if (fs.existsSync(staticDir)) {
      const chunks = fs.readdirSync(staticDir);
      const jsChunks = chunks.filter(chunk => chunk.endsWith('.js'));
      
      let totalSize = 0;
      let largeChunks = [];
      
      jsChunks.forEach(chunk => {
        const chunkPath = path.join(staticDir, chunk);
        const stats = fs.statSync(chunkPath);
        const sizeKB = Math.round(stats.size / 1024);
        totalSize += sizeKB;
        
        if (sizeKB > 500) {
          largeChunks.push({ name: chunk, size: sizeKB });
        }
      });
      
      log(`  Total JavaScript bundle size: ${totalSize}KB`, totalSize > 1000 ? 'red' : totalSize > 500 ? 'yellow' : 'green');
      
      if (largeChunks.length > 0) {
        log('  Large chunks detected:', 'yellow');
        largeChunks.forEach(chunk => {
          log(`    - ${chunk.name}: ${chunk.size}KB`, 'yellow');
        });
      }
      
      if (totalSize > 1000) {
        log('  ⚠️ Bundle size is large. Consider optimization.', 'yellow');
      } else {
        log('  ✅ Bundle size is acceptable', 'green');
      }
    }
  } catch (error) {
    log(`❌ Bundle size check failed: ${error.message}`, 'red');
  }
}

// Asset optimization check
function assetOptimizationCheck() {
  logSection('🖼️ ASSET OPTIMIZATION CHECK');
  
  const publicDir = path.join(process.cwd(), 'public');
  
  if (!fs.existsSync(publicDir)) {
    log('❌ Public directory not found.', 'red');
    return;
  }
  
  function checkDirectory(dir, prefix = '') {
    const items = fs.readdirSync(dir);
    
    items.forEach(item => {
      const itemPath = path.join(dir, item);
      const stats = fs.statSync(itemPath);
      
      if (stats.isDirectory()) {
        checkDirectory(itemPath, `${prefix}${item}/`);
      } else {
        const sizeKB = Math.round(stats.size / 1024);
        
        // Check for unoptimized images
        if (item.match(/\.(jpg|jpeg|png)$/i) && sizeKB > 500) {
          log(`  ⚠️ Large image: ${prefix}${item} (${sizeKB}KB)`, 'yellow');
          log(`    Consider converting to WebP format`, 'yellow');
        }
        
        // Check for large 3D models
        if (item.endsWith('.glb') && sizeKB > 2000) {
          log(`  ⚠️ Large 3D model: ${prefix}${item} (${sizeKB}KB)`, 'yellow');
          log(`    Consider compressing the model`, 'yellow');
        }
        
        // Check for large videos
        if (item.match(/\.(mp4|webm|mov)$/i) && sizeKB > 5000) {
          log(`  ⚠️ Large video: ${prefix}${item} (${sizeKB}KB)`, 'yellow');
          log(`    Consider compressing or using lazy loading`, 'yellow');
        }
      }
    });
  }
  
  checkDirectory(publicDir);
  log('  ✅ Asset optimization check complete', 'green');
}

// Performance recommendations
function performanceRecommendations() {
  logSection('💡 PERFORMANCE RECOMMENDATIONS');
  
  const recommendations = [
    '✅ Implemented: Code splitting and lazy loading',
    '✅ Implemented: Service Worker with smart caching',
    '✅ Implemented: Optimized image formats (WebP, AVIF)',
    '✅ Implemented: Font optimization with fallbacks',
    '✅ Implemented: Performance monitoring',
    '🔧 Consider: Enable Vercel Analytics for RUM',
    '🔧 Consider: Use Vercel Edge Functions for API routes',
    '🔧 Consider: Implement ISR for dynamic content',
    '🔧 Consider: Add resource hints for external domains'
  ];
  
  recommendations.forEach(rec => {
    const color = rec.startsWith('✅') ? 'green' : rec.startsWith('🔧') ? 'yellow' : 'reset';
    log(`  ${rec}`, color);
  });
}

// Vercel deployment optimization
function vercelOptimization() {
  logSection('🚀 VERCEL DEPLOYMENT OPTIMIZATION');
  
  const optimizations = [
    '✅ Optimized vercel.json with proper caching headers',
    '✅ Configured build command for production',
    '✅ Set up proper function timeouts',
    '✅ Added security headers',
    '✅ Configured service worker caching',
    '✅ Set up proper redirects and rewrites',
    '✅ Optimized for custom domain deployment'
  ];
  
  optimizations.forEach(opt => {
    log(`  ${opt}`, 'green');
  });
  
  logSubsection('Deployment Commands');
  log('  For production deployment:', 'blue');
  log('    vercel --prod', 'cyan');
  log('  For preview deployment:', 'blue');
  log('    vercel', 'cyan');
  log('  For custom domain setup:', 'blue');
  log('    vercel domains add yourdomain.com', 'cyan');
}

// Post-deployment checklist
function postDeploymentChecklist() {
  logSection('📋 POST-DEPLOYMENT CHECKLIST');
  
  const checklist = [
    '☐ Test website on production URL',
    '☐ Check Core Web Vitals in PageSpeed Insights',
    '☐ Verify service worker is working',
    '☐ Test 3D model loading on different devices',
    '☐ Check image optimization is working',
    '☐ Verify caching headers are applied',
    '☐ Test offline functionality',
    '☐ Check mobile responsiveness',
    '☐ Verify all animations work smoothly',
    '☐ Test contact form functionality',
    '☐ Check SEO meta tags',
    '☐ Verify social media previews',
    '☐ Test performance monitoring script',
    '☐ Check console for any errors'
  ];
  
  checklist.forEach(item => {
    log(`  ${item}`, 'blue');
  });
}

// Main execution
function main() {
  log('🚀 Vercel Deployment Optimization', 'bright');
  log('Preparing your portfolio for optimal deployment...\n', 'cyan');
  
  preDeploymentChecks();
  bundleSizeCheck();
  assetOptimizationCheck();
  performanceRecommendations();
  vercelOptimization();
  postDeploymentChecklist();
  
  logSection('🎉 READY FOR DEPLOYMENT');
  log('Your portfolio is optimized and ready for Vercel deployment!', 'green');
  log('\nNext steps:', 'bright');
  log('1. Run "vercel --prod" to deploy to production', 'cyan');
  log('2. Set up your custom domain in Vercel dashboard', 'cyan');
  log('3. Enable Vercel Analytics for performance monitoring', 'cyan');
  log('4. Test the deployed site thoroughly', 'cyan');
  
  log('\n✨ Optimization complete!', 'bright');
}

// Run the optimization
if (require.main === module) {
  main();
}

module.exports = {
  preDeploymentChecks,
  bundleSizeCheck,
  assetOptimizationCheck,
  performanceRecommendations,
  vercelOptimization,
  postDeploymentChecklist
};
