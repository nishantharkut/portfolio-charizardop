const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const optimizeImages = async () => {
  const imageDir = path.join(__dirname, '../public/images');
  const awardsDir = path.join(__dirname, '../public/awards');
  
  console.log('🖼️  Starting image optimization...');
  
  // Function to optimize images in a directory
  const optimizeDirectory = async (dir) => {
    if (!fs.existsSync(dir)) {
      console.log(`⚠️  Directory ${dir} does not exist, skipping...`);
      return;
    }
    
    const files = fs.readdirSync(dir);
    let optimizedCount = 0;
    
    for (const file of files) {
      if (file.match(/\.(jpg|jpeg|png)$/i)) {
        const inputPath = path.join(dir, file);
        const outputPath = path.join(dir, file.replace(/\.(jpg|jpeg|png)$/i, '.webp'));
        
        try {
          await sharp(inputPath)
            .webp({ quality: 85, effort: 6 })
            .toFile(outputPath);
          
          console.log(`✅ Optimized ${file} to WebP`);
          optimizedCount++;
        } catch (error) {
          console.error(`❌ Failed to optimize ${file}:`, error.message);
        }
      }
    }
    
    return optimizedCount;
  };
  
  try {
    const imagesCount = await optimizeDirectory(imageDir);
    const awardsCount = await optimizeDirectory(awardsDir);
    
    console.log(`🎉 Image optimization complete!`);
    console.log(`📊 Optimized ${imagesCount + awardsCount} images to WebP format`);
    console.log(`💡 Tip: Update your image references to use .webp extensions for better performance`);
  } catch (error) {
    console.error('❌ Image optimization failed:', error);
  }
};

// Run optimization
optimizeImages();
