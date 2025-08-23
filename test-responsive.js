#!/usr/bin/env node

/**
 * Practical Responsive Design Testing Script
 * Tests actual responsive implementation in the portfolio
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 PRACTICAL RESPONSIVE DESIGN VERIFICATION\n');
console.log('=' * 60);

// Test 1: Verify Tailwind Configuration
function testTailwindConfig() {
  console.log('📱 Testing Tailwind Responsive Configuration...');
  
  try {
    const configPath = path.join(__dirname, 'tailwind.config.ts');
    const config = fs.readFileSync(configPath, 'utf8');
    
    const tests = {
      hasCustomXsBreakpoint: config.includes("'xs': '475px'"),
      hasStandardBreakpoints: config.includes('screens'),
      hasExtendedSpacing: config.includes("'18': '4.5rem'"),
      hasCustomAnimations: config.includes('animation'),
      hasResponsiveGrids: config.includes('gridTemplateColumns')
    };
    
    console.log('✅ Tailwind Configuration Tests:');
    Object.entries(tests).forEach(([test, passed]) => {
      console.log(`  ${passed ? '✅' : '❌'} ${test}: ${passed ? 'PASS' : 'FAIL'}`);
    });
    
    return Object.values(tests).every(Boolean);
  } catch (error) {
    console.log('❌ Error testing Tailwind config:', error.message);
    return false;
  }
}

// Test 2: Verify Viewport Configuration
function testViewportConfig() {
  console.log('\n📐 Testing Viewport Configuration...');
  
  try {
    const layoutPath = path.join(__dirname, 'src/app/layout.tsx');
    const layout = fs.readFileSync(layoutPath, 'utf8');
    
    const tests = {
      hasViewportExport: layout.includes('export const viewport'),
      hasDeviceWidth: layout.includes('device-width'),
      hasInitialScale: layout.includes('initialScale: 1'),
      hasUserScalable: layout.includes('userScalable: true'),
      hasMaximumScale: layout.includes('maximumScale')
    };
    
    console.log('✅ Viewport Configuration Tests:');
    Object.entries(tests).forEach(([test, passed]) => {
      console.log(`  ${passed ? '✅' : '❌'} ${test}: ${passed ? 'PASS' : 'FAIL'}`);
    });
    
    return Object.values(tests).every(Boolean);
  } catch (error) {
    console.log('❌ Error testing viewport config:', error.message);
    return false;
  }
}

// Test 3: Verify Responsive Navigation
function testResponsiveNavigation() {
  console.log('\n🧭 Testing Responsive Navigation...');
  
  try {
    const navPath = path.join(__dirname, 'src/app/components/layout/Navbar.tsx');
    const nav = fs.readFileSync(navPath, 'utf8');
    
    const tests = {
      hasMobileHidden: nav.includes('lg:hidden'),
      hasDesktopHidden: nav.includes('hidden lg:flex'),
      hasMobileMenu: nav.includes('isMobileMenuOpen'),
      hasResponsiveSpacing: nav.includes('px-4 sm:px-6 lg:px-8'),
      hasGlassMorphism: nav.includes('glass'),
      hasTouchTargets: nav.includes('w-10') || nav.includes('h-10'),
      hasAnimations: nav.includes('framer-motion')
    };
    
    console.log('✅ Responsive Navigation Tests:');
    Object.entries(tests).forEach(([test, passed]) => {
      console.log(`  ${passed ? '✅' : '❌'} ${test}: ${passed ? 'PASS' : 'FAIL'}`);
    });
    
    return Object.values(tests).filter(Boolean).length >= 5; // At least 5/7 should pass
  } catch (error) {
    console.log('❌ Error testing navigation:', error.message);
    return false;
  }
}

// Test 4: Verify Responsive Typography
function testResponsiveTypography() {
  console.log('\n📝 Testing Responsive Typography...');
  
  try {
    const globalsPath = path.join(__dirname, 'src/app/globals.css');
    const globals = fs.readFileSync(globalsPath, 'utf8');
    
    const tests = {
      hasClampUsage: globals.includes('clamp('),
      hasViewportUnits: globals.includes('vw') || globals.includes('vh'),
      hasResponsiveFontSizes: globals.includes('font-size'),
      hasFluidTypography: globals.match(/clamp\([^)]+\)/g)?.length > 0,
      hasMediaQueries: globals.includes('@media'),
      hasTextRendering: globals.includes('-webkit-font-smoothing')
    };
    
    console.log('✅ Responsive Typography Tests:');
    Object.entries(tests).forEach(([test, passed]) => {
      console.log(`  ${passed ? '✅' : '❌'} ${test}: ${passed ? 'PASS' : 'FAIL'}`);
    });
    
    return Object.values(tests).filter(Boolean).length >= 4; // At least 4/6 should pass
  } catch (error) {
    console.log('❌ Error testing typography:', error.message);
    return false;
  }
}

// Test 5: Verify Performance Optimizations
function testPerformanceOptimizations() {
  console.log('\n⚡ Testing Performance Optimizations...');
  
  try {
    const globalsPath = path.join(__dirname, 'src/app/globals.css');
    const globals = fs.readFileSync(globalsPath, 'utf8');
    
    const tests = {
      hasGPUAcceleration: globals.includes('transform: translateZ(0)'),
      hasWillChange: globals.includes('will-change'),
      hasBackfaceVisibility: globals.includes('backface-visibility: hidden'),
      hasContainment: globals.includes('contain:'),
      hasReducedMotion: globals.includes('prefers-reduced-motion'),
      hasTouchAction: globals.includes('touch-action'),
      hasHardwareAcceleration: globals.includes('perspective')
    };
    
    console.log('✅ Performance Optimization Tests:');
    Object.entries(tests).forEach(([test, passed]) => {
      console.log(`  ${passed ? '✅' : '❌'} ${test}: ${passed ? 'PASS' : 'FAIL'}`);
    });
    
    return Object.values(tests).filter(Boolean).length >= 5; // At least 5/7 should pass
  } catch (error) {
    console.log('❌ Error testing performance optimizations:', error.message);
    return false;
  }
}

// Test 6: Verify Responsive Images
function testResponsiveImages() {
  console.log('\n🖼️ Testing Responsive Images...');
  
  try {
    // Check multiple component files for Next.js Image usage
    const componentsDir = path.join(__dirname, 'src/app/components');
    const pagesDir = path.join(__dirname, 'src/app');
    
    function checkImageUsage(dir) {
      const files = fs.readdirSync(dir, { recursive: true }).filter(file => 
        file.endsWith('.tsx') || file.endsWith('.ts')
      );
      
      let hasNextImage = false;
      let hasResponsiveSizes = false;
      let hasOptimization = false;
      
      files.forEach(file => {
        try {
          const filePath = path.join(dir, file);
          const content = fs.readFileSync(filePath, 'utf8');
          
          if (content.includes('next/image')) hasNextImage = true;
          if (content.includes('sizes=')) hasResponsiveSizes = true;
          if (content.includes('priority') || content.includes('quality')) hasOptimization = true;
        } catch (err) {
          // Skip files that can't be read
        }
      });
      
      return { hasNextImage, hasResponsiveSizes, hasOptimization };
    }
    
    const componentResults = checkImageUsage(componentsDir);
    const pageResults = checkImageUsage(pagesDir);
    
    const tests = {
      usesNextImage: componentResults.hasNextImage || pageResults.hasNextImage,
      hasResponsiveSizes: componentResults.hasResponsiveSizes || pageResults.hasResponsiveSizes,
      hasOptimization: componentResults.hasOptimization || pageResults.hasOptimization,
      hasObjectFit: fs.readFileSync(path.join(__dirname, 'src/app/globals.css'), 'utf8').includes('object-fit')
    };
    
    console.log('✅ Responsive Images Tests:');
    Object.entries(tests).forEach(([test, passed]) => {
      console.log(`  ${passed ? '✅' : '❌'} ${test}: ${passed ? 'PASS' : 'FAIL'}`);
    });
    
    return Object.values(tests).filter(Boolean).length >= 2; // At least 2/4 should pass
  } catch (error) {
    console.log('❌ Error testing responsive images:', error.message);
    return false;
  }
}

// Test 7: Verify Cross-Platform Compatibility
function testCrossPlatformCompatibility() {
  console.log('\n🌐 Testing Cross-Platform Compatibility...');
  
  try {
    const packagePath = path.join(__dirname, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    
    const tests = {
      usesNextJS: packageJson.dependencies?.['next'] !== undefined,
      usesTailwindCSS: packageJson.devDependencies?.['tailwindcss'] !== undefined,
      usesTypeScript: fs.existsSync(path.join(__dirname, 'tsconfig.json')),
      hasModernBrowserSupport: packageJson.browserslist !== undefined || 
                               fs.readFileSync(path.join(__dirname, 'src/app/globals.css'), 'utf8').includes('webkit'),
      usesResponsiveFramework: packageJson.dependencies?.['framer-motion'] !== undefined,
      hasPostCSS: packageJson.devDependencies?.['postcss'] !== undefined
    };
    
    console.log('✅ Cross-Platform Compatibility Tests:');
    Object.entries(tests).forEach(([test, passed]) => {
      console.log(`  ${passed ? '✅' : '❌'} ${test}: ${passed ? 'PASS' : 'FAIL'}`);
    });
    
    return Object.values(tests).filter(Boolean).length >= 4; // At least 4/6 should pass
  } catch (error) {
    console.log('❌ Error testing cross-platform compatibility:', error.message);
    return false;
  }
}

// Run all tests and generate report
function runAllTests() {
  console.log('🚀 RUNNING COMPREHENSIVE RESPONSIVE TESTS\n');
  
  const testResults = {
    tailwindConfig: testTailwindConfig(),
    viewportConfig: testViewportConfig(),
    responsiveNavigation: testResponsiveNavigation(),
    responsiveTypography: testResponsiveTypography(),
    performanceOptimizations: testPerformanceOptimizations(),
    responsiveImages: testResponsiveImages(),
    crossPlatformCompatibility: testCrossPlatformCompatibility()
  };
  
  const passedTests = Object.values(testResults).filter(Boolean).length;
  const totalTests = Object.keys(testResults).length;
  const score = Math.round((passedTests / totalTests) * 100);
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 RESPONSIVE DESIGN TEST RESULTS');
  console.log('='.repeat(60));
  
  console.log(`\n🎯 OVERALL SCORE: ${score}% (${passedTests}/${totalTests} tests passed)\n`);
  
  Object.entries(testResults).forEach(([test, passed]) => {
    console.log(`${passed ? '✅' : '❌'} ${test.replace(/([A-Z])/g, ' $1').toLowerCase()}: ${passed ? 'PASS' : 'FAIL'}`);
  });
  
  console.log('\n📱 RESPONSIVENESS VERDICT:');
  if (score >= 90) {
    console.log('🎉 EXCELLENT: Your portfolio has outstanding responsive design!');
    console.log('✅ Ready for production across all devices and platforms.');
  } else if (score >= 75) {
    console.log('👍 GOOD: Your portfolio has solid responsive design.');
    console.log('✅ Minor improvements could enhance the experience.');
  } else if (score >= 60) {
    console.log('⚠️ FAIR: Your portfolio has basic responsive design.');
    console.log('🔧 Several improvements needed for optimal experience.');
  } else {
    console.log('❌ NEEDS WORK: Your portfolio requires significant responsive improvements.');
    console.log('🚨 Major work needed before production deployment.');
  }
  
  console.log('\n📋 MANUAL TESTING CHECKLIST:');
  console.log('1. 📱 Test on mobile devices (320px, 375px, 414px)');
  console.log('2. 📱 Test on tablets (768px, 1024px)');
  console.log('3. 💻 Test on desktop (1280px, 1440px, 1920px)');
  console.log('4. 🔄 Test orientation changes');
  console.log('5. 👆 Test touch interactions');
  console.log('6. ⌨️ Test keyboard navigation');
  console.log('7. 🌐 Test in different browsers');
  
  console.log('\n' + '='.repeat(60));
  console.log(`Test completed on: ${new Date().toLocaleString()}`);
  console.log('='.repeat(60));
  
  return { score, passedTests, totalTests, results: testResults };
}

// Execute the tests
runAllTests();
