const fs = require('fs');
const path = require('path');

// Performance testing and validation script
const testPerformance = () => {
  console.log('🚀 Starting performance tests...');
  
  const tests = [
    {
      name: 'Bundle Size Check',
      test: () => {
        const buildDir = path.join(__dirname, '../.next');
        if (!fs.existsSync(buildDir)) {
          return { passed: false, message: 'Build directory not found. Run "npm run build" first.' };
        }
        
        const staticDir = path.join(buildDir, 'static');
        const jsDir = path.join(staticDir, 'chunks');
        
        if (!fs.existsSync(jsDir)) {
          return { passed: false, message: 'JavaScript chunks not found' };
        }
        
        const files = fs.readdirSync(jsDir);
        const jsFiles = files.filter(file => file.endsWith('.js'));
        
        let totalSize = 0;
        jsFiles.forEach(file => {
          const filePath = path.join(jsDir, file);
          const stats = fs.statSync(filePath);
          totalSize += stats.size;
        });
        
        const totalSizeKB = totalSize / 1024;
        const maxSizeKB = 2000; // 2MB limit
        
        if (totalSizeKB > maxSizeKB) {
          return { 
            passed: false, 
            message: `Bundle size too large: ${totalSizeKB.toFixed(2)} KB (max: ${maxSizeKB} KB)` 
          };
        }
        
        return { 
          passed: true, 
          message: `Bundle size OK: ${totalSizeKB.toFixed(2)} KB` 
        };
      }
    },
    
    {
      name: 'Image Optimization Check',
      test: () => {
        const publicDir = path.join(__dirname, '../public');
        const imageDirs = ['images', 'awards'];
        
        let totalImages = 0;
        let optimizedImages = 0;
        let totalSize = 0;
        
        imageDirs.forEach(dir => {
          const dirPath = path.join(publicDir, dir);
          if (!fs.existsSync(dirPath)) return;
          
          const files = fs.readdirSync(dirPath);
          const imageFiles = files.filter(file => 
            file.match(/\.(jpg|jpeg|png|webp|avif|gif)$/i)
          );
          
          imageFiles.forEach(file => {
            totalImages++;
            if (file.match(/\.(webp|avif)$/i)) {
              optimizedImages++;
            }
            
            const filePath = path.join(dirPath, file);
            const stats = fs.statSync(filePath);
            totalSize += stats.size;
          });
        });
        
        const optimizationRatio = totalImages > 0 ? (optimizedImages / totalImages) * 100 : 100;
        const avgSizeKB = totalImages > 0 ? (totalSize / totalImages) / 1024 : 0;
        
        if (optimizationRatio < 50) {
          return { 
            passed: false, 
            message: `Low image optimization: ${optimizationRatio.toFixed(1)}% optimized` 
          };
        }
        
        if (avgSizeKB > 500) {
          return { 
            passed: false, 
            message: `Large average image size: ${avgSizeKB.toFixed(2)} KB` 
          };
        }
        
        return { 
          passed: true, 
          message: `Images optimized: ${optimizationRatio.toFixed(1)}%, avg size: ${avgSizeKB.toFixed(2)} KB` 
        };
      }
    },
    
    {
      name: 'Service Worker Check',
      test: () => {
        const swPath = path.join(__dirname, '../public/sw.js');
        if (!fs.existsSync(swPath)) {
          return { passed: false, message: 'Service worker not found' };
        }
        
        const swContent = fs.readFileSync(swPath, 'utf8');
        const hasCacheStrategy = swContent.includes('cache') || swContent.includes('Cache');
        const hasFetchHandler = swContent.includes('fetch');
        
        if (!hasCacheStrategy || !hasFetchHandler) {
          return { passed: false, message: 'Service worker missing cache strategy or fetch handler' };
        }
        
        return { passed: true, message: 'Service worker properly configured' };
      }
    },
    
    {
      name: 'Next.js Config Check',
      test: () => {
        const configPath = path.join(__dirname, '../next.config.ts');
        if (!fs.existsSync(configPath)) {
          return { passed: false, message: 'Next.js config not found' };
        }
        
        const configContent = fs.readFileSync(configPath, 'utf8');
        const hasImageOptimization = configContent.includes('formats: [\'image/webp\', \'image/avif\']');
        const hasCompression = configContent.includes('compress: true');
        const hasBundleAnalyzer = configContent.includes('@next/bundle-analyzer');
        
        if (!hasImageOptimization) {
          return { passed: false, message: 'Image optimization not configured' };
        }
        
        if (!hasCompression) {
          return { passed: false, message: 'Compression not enabled' };
        }
        
        if (!hasBundleAnalyzer) {
          return { passed: false, message: 'Bundle analyzer not configured' };
        }
        
        return { passed: true, message: 'Next.js config properly optimized' };
      }
    },
    
    {
      name: 'Performance Scripts Check',
      test: () => {
        const packagePath = path.join(__dirname, '../package.json');
        if (!fs.existsSync(packagePath)) {
          return { passed: false, message: 'Package.json not found' };
        }
        
        const packageContent = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
        const scripts = packageContent.scripts || {};
        
        const requiredScripts = [
          'analyze',
          'optimize:images',
          'perf:monitor',
          'analyze:bundle'
        ];
        
        const missingScripts = requiredScripts.filter(script => !scripts[script]);
        
        if (missingScripts.length > 0) {
          return { 
            passed: false, 
            message: `Missing performance scripts: ${missingScripts.join(', ')}` 
          };
        }
        
        return { passed: true, message: 'All performance scripts present' };
      }
    }
  ];
  
  console.log('\n🧪 Running Performance Tests:');
  console.log('==============================');
  
  let passedTests = 0;
  let totalTests = tests.length;
  
  tests.forEach((test, index) => {
    try {
      const result = test.test();
      const status = result.passed ? '✅' : '❌';
      const statusText = result.passed ? 'PASS' : 'FAIL';
      
      console.log(`${index + 1}. ${test.name}: ${status} ${statusText}`);
      console.log(`   ${result.message}`);
      
      if (result.passed) {
        passedTests++;
      }
    } catch (error) {
      console.log(`${index + 1}. ${test.name}: ❌ ERROR`);
      console.log(`   ${error.message}`);
    }
    
    console.log('');
  });
  
  // Summary
  console.log('📊 Test Summary:');
  console.log('================');
  console.log(`Passed: ${passedTests}/${totalTests}`);
  console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
  
  if (passedTests === totalTests) {
    console.log('\n🎉 All performance tests passed! Your portfolio is optimized.');
  } else {
    console.log('\n⚠️ Some tests failed. Review the issues above.');
  }
  
  // Performance score
  const score = (passedTests / totalTests) * 100;
  let grade = 'F';
  if (score >= 90) grade = 'A';
  else if (score >= 80) grade = 'B';
  else if (score >= 70) grade = 'C';
  else if (score >= 60) grade = 'D';
  
  console.log(`\n🏆 Performance Grade: ${grade} (${score.toFixed(1)}%)`);
  
  return { passedTests, totalTests, score, grade };
};

// Run tests
testPerformance();
