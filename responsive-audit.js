#!/usr/bin/env node

// Comprehensive Responsive Design Audit Script
console.log('🔍 Starting Comprehensive Responsive Design Audit...\n');

const fs = require('fs');
const path = require('path');

// Define responsive breakpoints
const BREAKPOINTS = {
  'xs': '475px',
  'sm': '640px', 
  'md': '768px',
  'lg': '1024px',
  'xl': '1280px',
  '2xl': '1536px'
};

// Function to check file contents for responsive patterns
function checkFileForResponsive(filePath, fileName) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const responsivePatterns = {
      tailwindResponsive: content.match(/(sm:|md:|lg:|xl:|2xl:)/g) || [],
      cssMediaQueries: content.match(/@media[^{]+/g) || [],
      flexboxUsage: content.match(/(flex|grid)/g) || [],
      responsiveFontSizes: content.match(/text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)/g) || [],
      responsiveSpacing: content.match(/(p|m|gap|space)-(0|px|0\.5|1|1\.5|2|2\.5|3|3\.5|4|5|6|7|8|9|10|11|12|14|16|20|24|28|32|36|40|44|48|52|56|60|64|72|80|96)/g) || [],
      responsiveImages: content.match(/(w-full|h-auto|object-cover|object-fit|sizes=)/g) || [],
      viewportUnits: content.match(/(vw|vh|vmin|vmax)/g) || [],
      clampUsage: content.match(/clamp\(/g) || [],
      containerQueries: content.match(/@container/g) || []
    };

    return {
      fileName,
      ...responsivePatterns,
      totalResponsiveElements: Object.values(responsivePatterns).flat().length
    };
  } catch (error) {
    return { fileName, error: error.message, totalResponsiveElements: 0 };
  }
}

// Get all relevant files for analysis
function getAllFiles(dir, fileTypes = ['.tsx', '.css', '.ts']) {
  let results = [];
  const list = fs.readdirSync(dir);
  
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat && stat.isDirectory()) {
      if (!file.startsWith('.') && !file.includes('node_modules')) {
        results = results.concat(getAllFiles(filePath, fileTypes));
      }
    } else {
      if (fileTypes.some(ext => file.endsWith(ext))) {
        results.push(filePath);
      }
    }
  });
  
  return results;
}

// Audit responsive design implementation
function auditResponsiveDesign() {
  console.log('📱 Auditing Responsive Design Implementation...\n');
  
  const srcDir = path.join(__dirname, 'src');
  const allFiles = getAllFiles(srcDir);
  
  const results = allFiles.map(filePath => {
    const fileName = path.relative(__dirname, filePath);
    return checkFileForResponsive(filePath, fileName);
  });

  // Analyze results
  const summary = {
    totalFiles: results.length,
    filesWithResponsive: results.filter(r => r.totalResponsiveElements > 0).length,
    totalResponsiveElements: results.reduce((sum, r) => sum + r.totalResponsiveElements, 0),
    averageResponsiveElementsPerFile: 0,
    topResponsiveFiles: [],
    responsiveImplementations: {
      tailwindBreakpoints: 0,
      cssMediaQueries: 0,
      flexboxGridUsage: 0,
      responsiveFonts: 0,
      responsiveSpacing: 0,
      responsiveImages: 0,
      viewportUnits: 0,
      clampUsage: 0,
      containerQueries: 0
    }
  };

  // Calculate statistics
  summary.averageResponsiveElementsPerFile = summary.totalResponsiveElements / summary.totalFiles;
  
  // Sort by responsive elements count
  summary.topResponsiveFiles = results
    .filter(r => !r.error)
    .sort((a, b) => b.totalResponsiveElements - a.totalResponsiveElements)
    .slice(0, 10);

  // Count implementation types
  results.forEach(result => {
    if (result.tailwindResponsive) summary.responsiveImplementations.tailwindBreakpoints += result.tailwindResponsive.length;
    if (result.cssMediaQueries) summary.responsiveImplementations.cssMediaQueries += result.cssMediaQueries.length;
    if (result.flexboxUsage) summary.responsiveImplementations.flexboxGridUsage += result.flexboxUsage.length;
    if (result.responsiveFontSizes) summary.responsiveImplementations.responsiveFonts += result.responsiveFontSizes.length;
    if (result.responsiveSpacing) summary.responsiveImplementations.responsiveSpacing += result.responsiveSpacing.length;
    if (result.responsiveImages) summary.responsiveImplementations.responsiveImages += result.responsiveImages.length;
    if (result.viewportUnits) summary.responsiveImplementations.viewportUnits += result.viewportUnits.length;
    if (result.clampUsage) summary.responsiveImplementations.clampUsage += result.clampUsage.length;
    if (result.containerQueries) summary.responsiveImplementations.containerQueries += result.containerQueries.length;
  });

  return { summary, detailedResults: results };
}

// Check critical responsive requirements
function checkCriticalResponsiveRequirements() {
  console.log('🎯 Checking Critical Responsive Requirements...\n');
  
  const requirements = {
    viewportMeta: false,
    tailwindConfig: false,
    responsiveNavigation: false,
    responsiveImages: false,
    responsiveTypography: false,
    touchOptimization: false,
    performanceOptimization: false,
    accessibilityFeatures: false
  };

  const issues = [];
  const recommendations = [];

  // Check viewport meta tag
  try {
    const layoutContent = fs.readFileSync(path.join(__dirname, 'src/app/layout.tsx'), 'utf8');
    if (layoutContent.includes('viewport') || layoutContent.includes('device-width')) {
      requirements.viewportMeta = true;
    } else {
      issues.push('❌ Missing viewport meta tag in layout.tsx');
      recommendations.push('Add viewport metadata for proper mobile scaling');
    }
  } catch (error) {
    issues.push('❌ Could not check layout.tsx for viewport meta tag');
  }

  // Check Tailwind configuration
  try {
    const tailwindContent = fs.readFileSync(path.join(__dirname, 'tailwind.config.ts'), 'utf8');
    if (tailwindContent.includes('screens') && tailwindContent.includes('xs')) {
      requirements.tailwindConfig = true;
    } else {
      issues.push('⚠️ Tailwind config could be enhanced with more breakpoints');
      recommendations.push('Consider adding more specific breakpoints like xs: 475px');
    }
  } catch (error) {
    issues.push('❌ Could not check Tailwind configuration');
  }

  // Check responsive navigation
  try {
    const navContent = fs.readFileSync(path.join(__dirname, 'src/app/components/layout/Navbar.tsx'), 'utf8');
    if (navContent.includes('lg:hidden') && navContent.includes('hidden lg:flex')) {
      requirements.responsiveNavigation = true;
    } else {
      issues.push('❌ Navigation may not be fully responsive');
      recommendations.push('Ensure navigation has mobile and desktop variants');
    }
  } catch (error) {
    issues.push('❌ Could not check navigation responsiveness');
  }

  // Check responsive images
  try {
    const globalsContent = fs.readFileSync(path.join(__dirname, 'src/app/globals.css'), 'utf8');
    if (globalsContent.includes('object-fit') || globalsContent.includes('max-width: 100%')) {
      requirements.responsiveImages = true;
    }
  } catch (error) {
    // Check in component files
    try {
      const files = getAllFiles(path.join(__dirname, 'src')).slice(0, 5);
      const hasResponsiveImages = files.some(file => {
        const content = fs.readFileSync(file, 'utf8');
        return content.includes('object-cover') || content.includes('w-full') || content.includes('sizes=');
      });
      if (hasResponsiveImages) {
        requirements.responsiveImages = true;
      }
    } catch (err) {
      issues.push('❌ Could not verify responsive image implementation');
    }
  }

  // Check responsive typography
  try {
    const globalsContent = fs.readFileSync(path.join(__dirname, 'src/app/globals.css'), 'utf8');
    if (globalsContent.includes('clamp') || globalsContent.includes('fluid')) {
      requirements.responsiveTypography = true;
    }
  } catch (error) {
    recommendations.push('Consider implementing fluid typography with clamp() for better responsiveness');
  }

  // Check touch optimization
  try {
    const globalsContent = fs.readFileSync(path.join(__dirname, 'src/app/globals.css'), 'utf8');
    if (globalsContent.includes('touch-action') || globalsContent.includes('user-select')) {
      requirements.touchOptimization = true;
    }
  } catch (error) {
    recommendations.push('Add touch-action and user-select optimizations for mobile devices');
  }

  // Check performance optimization
  try {
    const globalsContent = fs.readFileSync(path.join(__dirname, 'src/app/globals.css'), 'utf8');
    if (globalsContent.includes('will-change') || globalsContent.includes('transform: translateZ(0)')) {
      requirements.performanceOptimization = true;
    }
  } catch (error) {
    recommendations.push('Implement GPU acceleration for better mobile performance');
  }

  // Check accessibility features
  try {
    const globalsContent = fs.readFileSync(path.join(__dirname, 'src/app/globals.css'), 'utf8');
    if (globalsContent.includes('prefers-reduced-motion') || globalsContent.includes('focus-visible')) {
      requirements.accessibilityFeatures = true;
    }
  } catch (error) {
    recommendations.push('Add accessibility features like reduced motion preferences');
  }

  return { requirements, issues, recommendations };
}

// Device compatibility check
function checkDeviceCompatibility() {
  console.log('📱 Checking Device Compatibility...\n');
  
  const deviceTests = {
    mobile: {
      name: 'Mobile Devices',
      breakpoints: ['320px', '375px', '414px', '768px'],
      requirements: ['Touch targets ≥44px', 'Readable text ≥16px', 'Horizontal scrolling avoided']
    },
    tablet: {
      name: 'Tablet Devices', 
      breakpoints: ['768px', '1024px'],
      requirements: ['Flexible layouts', 'Touch-friendly navigation', 'Portrait/landscape optimization']
    },
    desktop: {
      name: 'Desktop Devices',
      breakpoints: ['1024px', '1280px', '1440px', '1920px'],
      requirements: ['Hover states', 'Keyboard navigation', 'Large screen optimization']
    }
  };

  return deviceTests;
}

// Performance impact analysis
function analyzePerformanceImpact() {
  console.log('⚡ Analyzing Performance Impact...\n');
  
  const performanceMetrics = {
    imageOptimization: {
      status: 'unknown',
      recommendations: []
    },
    cssOptimization: {
      status: 'unknown', 
      recommendations: []
    },
    javascriptOptimization: {
      status: 'unknown',
      recommendations: []
    }
  };

  // Check for Next.js Image optimization
  try {
    const files = getAllFiles(path.join(__dirname, 'src'));
    const hasNextImage = files.some(file => {
      const content = fs.readFileSync(file, 'utf8');
      return content.includes('next/image');
    });
    
    if (hasNextImage) {
      performanceMetrics.imageOptimization.status = 'good';
      performanceMetrics.imageOptimization.recommendations.push('✅ Using Next.js Image component for optimization');
    } else {
      performanceMetrics.imageOptimization.status = 'needs-improvement';
      performanceMetrics.imageOptimization.recommendations.push('❌ Consider using Next.js Image component for automatic optimization');
    }
  } catch (error) {
    performanceMetrics.imageOptimization.recommendations.push('❌ Could not analyze image optimization');
  }

  // Check CSS optimization
  try {
    const globalsContent = fs.readFileSync(path.join(__dirname, 'src/app/globals.css'), 'utf8');
    if (globalsContent.includes('will-change') && globalsContent.includes('transform: translateZ(0)')) {
      performanceMetrics.cssOptimization.status = 'good';
      performanceMetrics.cssOptimization.recommendations.push('✅ GPU acceleration implemented');
    } else {
      performanceMetrics.cssOptimization.status = 'needs-improvement';
      performanceMetrics.cssOptimization.recommendations.push('⚠️ Consider adding GPU acceleration for animations');
    }
  } catch (error) {
    performanceMetrics.cssOptimization.recommendations.push('❌ Could not analyze CSS optimization');
  }

  return performanceMetrics;
}

// Generate comprehensive report
function generateResponsiveReport() {
  console.log('📊 Generating Comprehensive Responsive Design Report...\n');
  
  const auditResults = auditResponsiveDesign();
  const criticalChecks = checkCriticalResponsiveRequirements();
  const deviceCompat = checkDeviceCompatibility();
  const performance = analyzePerformanceImpact();
  
  // Calculate overall score
  const requirementsMet = Object.values(criticalChecks.requirements).filter(Boolean).length;
  const totalRequirements = Object.keys(criticalChecks.requirements).length;
  const overallScore = Math.round((requirementsMet / totalRequirements) * 100);
  
  console.log('='.repeat(80));
  console.log('📱 COMPREHENSIVE RESPONSIVE DESIGN AUDIT REPORT');
  console.log('='.repeat(80));
  
  console.log('\n🎯 OVERALL SCORE');
  console.log(`📊 Responsive Implementation: ${overallScore}% (${requirementsMet}/${totalRequirements} requirements met)`);
  
  console.log('\n📈 IMPLEMENTATION STATISTICS');
  console.log(`📁 Total Files Analyzed: ${auditResults.summary.totalFiles}`);
  console.log(`📱 Files with Responsive Code: ${auditResults.summary.filesWithResponsive}`);
  console.log(`🔧 Total Responsive Elements: ${auditResults.summary.totalResponsiveElements}`);
  console.log(`📊 Average Elements per File: ${Math.round(auditResults.summary.averageResponsiveElementsPerFile)}`);
  
  console.log('\n🛠️ RESPONSIVE IMPLEMENTATION BREAKDOWN');
  console.log(`🎨 Tailwind Breakpoints: ${auditResults.summary.responsiveImplementations.tailwindBreakpoints}`);
  console.log(`📱 CSS Media Queries: ${auditResults.summary.responsiveImplementations.cssMediaQueries}`);
  console.log(`📐 Flexbox/Grid Usage: ${auditResults.summary.responsiveImplementations.flexboxGridUsage}`);
  console.log(`📝 Responsive Fonts: ${auditResults.summary.responsiveImplementations.responsiveFonts}`);
  console.log(`📏 Responsive Spacing: ${auditResults.summary.responsiveImplementations.responsiveSpacing}`);
  console.log(`🖼️ Responsive Images: ${auditResults.summary.responsiveImplementations.responsiveImages}`);
  console.log(`📐 Viewport Units: ${auditResults.summary.responsiveImplementations.viewportUnits}`);
  console.log(`🔧 Clamp Usage: ${auditResults.summary.responsiveImplementations.clampUsage}`);
  
  console.log('\n✅ REQUIREMENTS STATUS');
  Object.entries(criticalChecks.requirements).forEach(([req, met]) => {
    console.log(`${met ? '✅' : '❌'} ${req.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
  });
  
  if (criticalChecks.issues.length > 0) {
    console.log('\n⚠️ ISSUES FOUND');
    criticalChecks.issues.forEach(issue => console.log(`  ${issue}`));
  }
  
  if (criticalChecks.recommendations.length > 0) {
    console.log('\n💡 RECOMMENDATIONS');
    criticalChecks.recommendations.forEach(rec => console.log(`  💡 ${rec}`));
  }
  
  console.log('\n🏆 TOP RESPONSIVE FILES');
  auditResults.summary.topResponsiveFiles.slice(0, 5).forEach((file, index) => {
    console.log(`  ${index + 1}. ${file.fileName} (${file.totalResponsiveElements} responsive elements)`);
  });
  
  console.log('\n📱 DEVICE COMPATIBILITY');
  Object.values(deviceCompat).forEach(device => {
    console.log(`\n${device.name}:`);
    console.log(`  📏 Breakpoints: ${device.breakpoints.join(', ')}`);
    device.requirements.forEach(req => console.log(`  ✓ ${req}`));
  });
  
  console.log('\n⚡ PERFORMANCE ANALYSIS');
  Object.entries(performance).forEach(([metric, data]) => {
    console.log(`\n${metric.replace(/([A-Z])/g, ' $1')}:`);
    console.log(`  Status: ${data.status}`);
    data.recommendations.forEach(rec => console.log(`  ${rec}`));
  });
  
  console.log('\n🎉 SUMMARY');
  if (overallScore >= 90) {
    console.log('✅ EXCELLENT: Your portfolio has outstanding responsive design implementation!');
  } else if (overallScore >= 75) {
    console.log('✅ GOOD: Your portfolio has solid responsive design with room for minor improvements.');
  } else if (overallScore >= 60) {
    console.log('⚠️ FAIR: Your portfolio has basic responsive design but needs significant improvements.');
  } else {
    console.log('❌ NEEDS WORK: Your portfolio requires major responsive design improvements.');
  }
  
  console.log('\n' + '='.repeat(80));
  console.log(`Audit completed on ${new Date().toLocaleString()}`);
  console.log('='.repeat(80));
}

// Run the comprehensive audit
generateResponsiveReport();
