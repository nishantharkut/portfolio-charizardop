const fs = require('fs');
const path = require('path');

// Bundle analysis script
const analyzeBundle = () => {
  console.log('📦 Starting bundle analysis...');
  
  const buildDir = path.join(__dirname, '../.next');
  const staticDir = path.join(buildDir, 'static');
  
  if (!fs.existsSync(buildDir)) {
    console.log('❌ Build directory not found. Run "npm run build" first.');
    return;
  }
  
  // Analyze JavaScript bundles
  const analyzeJSBundles = () => {
    const jsDir = path.join(staticDir, 'chunks');
    if (!fs.existsSync(jsDir)) {
      console.log('⚠️ JavaScript chunks directory not found');
      return;
    }
    
    const files = fs.readdirSync(jsDir);
    const jsFiles = files.filter(file => file.endsWith('.js'));
    
    console.log('\n📊 JavaScript Bundle Analysis:');
    console.log('================================');
    
    let totalSize = 0;
    const bundleSizes = [];
    
    jsFiles.forEach(file => {
      const filePath = path.join(jsDir, file);
      const stats = fs.statSync(filePath);
      const sizeKB = (stats.size / 1024).toFixed(2);
      totalSize += stats.size;
      
      bundleSizes.push({
        name: file,
        size: stats.size,
        sizeKB: parseFloat(sizeKB)
      });
      
      console.log(`📄 ${file}: ${sizeKB} KB`);
    });
    
    console.log(`\n📈 Total JavaScript Size: ${(totalSize / 1024).toFixed(2)} KB`);
    
    // Sort by size
    bundleSizes.sort((a, b) => b.size - a.size);
    
    console.log('\n🔍 Largest Bundles:');
    bundleSizes.slice(0, 5).forEach((bundle, index) => {
      console.log(`${index + 1}. ${bundle.name}: ${bundle.sizeKB} KB`);
    });
    
    return bundleSizes;
  };
  
  // Analyze CSS bundles
  const analyzeCSSBundles = () => {
    const cssDir = path.join(staticDir, 'css');
    if (!fs.existsSync(cssDir)) {
      console.log('⚠️ CSS directory not found');
      return;
    }
    
    const files = fs.readdirSync(cssDir);
    const cssFiles = files.filter(file => file.endsWith('.css'));
    
    console.log('\n🎨 CSS Bundle Analysis:');
    console.log('========================');
    
    let totalCSSSize = 0;
    
    cssFiles.forEach(file => {
      const filePath = path.join(cssDir, file);
      const stats = fs.statSync(filePath);
      const sizeKB = (stats.size / 1024).toFixed(2);
      totalCSSSize += stats.size;
      
      console.log(`📄 ${file}: ${sizeKB} KB`);
    });
    
    console.log(`\n📈 Total CSS Size: ${(totalCSSSize / 1024).toFixed(2)} KB`);
    
    return totalCSSSize;
  };
  
  // Analyze images
  const analyzeImages = () => {
    const publicDir = path.join(__dirname, '../public');
    const imageDirs = ['images', 'awards'];
    
    console.log('\n🖼️ Image Analysis:');
    console.log('==================');
    
    let totalImageSize = 0;
    let imageCount = 0;
    
    imageDirs.forEach(dir => {
      const dirPath = path.join(publicDir, dir);
      if (!fs.existsSync(dirPath)) {
        console.log(`⚠️ ${dir} directory not found`);
        return;
      }
      
      const files = fs.readdirSync(dirPath);
      const imageFiles = files.filter(file => 
        file.match(/\.(jpg|jpeg|png|webp|avif|gif)$/i)
      );
      
      imageFiles.forEach(file => {
        const filePath = path.join(dirPath, file);
        const stats = fs.statSync(filePath);
        const sizeKB = (stats.size / 1024).toFixed(2);
        totalImageSize += stats.size;
        imageCount++;
        
        console.log(`📄 ${dir}/${file}: ${sizeKB} KB`);
      });
    });
    
    console.log(`\n📈 Total Images: ${imageCount} files, ${(totalImageSize / 1024).toFixed(2)} KB`);
    
    return { totalImageSize, imageCount };
  };
  
  // Generate recommendations
  const generateRecommendations = (jsBundles, cssSize, imageData) => {
    console.log('\n💡 Performance Recommendations:');
    console.log('================================');
    
    // JavaScript recommendations
    if (jsBundles && jsBundles.length > 0) {
      const largestBundle = jsBundles[0];
      if (largestBundle.sizeKB > 500) {
        console.log(`⚠️ Largest bundle (${largestBundle.name}) is ${largestBundle.sizeKB} KB. Consider code splitting.`);
      }
      
      const totalJSSize = jsBundles.reduce((sum, bundle) => sum + bundle.size, 0) / 1024;
      if (totalJSSize > 1000) {
        console.log(`⚠️ Total JavaScript size is ${totalJSSize.toFixed(2)} KB. Consider lazy loading.`);
      }
    }
    
    // CSS recommendations
    if (cssSize > 100) {
      console.log(`⚠️ CSS size is ${(cssSize / 1024).toFixed(2)} KB. Consider purging unused styles.`);
    }
    
    // Image recommendations
    if (imageData && imageData.totalImageSize > 0) {
      const avgImageSize = imageData.totalImageSize / imageData.imageCount / 1024;
      if (avgImageSize > 200) {
        console.log(`⚠️ Average image size is ${avgImageSize.toFixed(2)} KB. Consider WebP/AVIF conversion.`);
      }
    }
    
    console.log('\n✅ General recommendations:');
    console.log('• Use dynamic imports for non-critical components');
    console.log('• Implement proper image optimization');
    console.log('• Enable gzip/brotli compression');
    console.log('• Use CDN for static assets');
    console.log('• Implement service worker caching');
  };
  
  try {
    const jsBundles = analyzeJSBundles();
    const cssSize = analyzeCSSBundles();
    const imageData = analyzeImages();
    
    generateRecommendations(jsBundles, cssSize, imageData);
    
    console.log('\n🎉 Bundle analysis complete!');
  } catch (error) {
    console.error('❌ Bundle analysis failed:', error);
  }
};

// Run analysis
analyzeBundle();
