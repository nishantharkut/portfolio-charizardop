#!/usr/bin/env node

// Verification script for JSON data migration
console.log('🔍 Verifying JSON Data Migration...\n');

const fs = require('fs');
const path = require('path');

// Check if all required JSON files exist
const dataDir = path.join(__dirname, 'src', 'data');
const requiredFiles = [
  'projects.json',
  'achievements.json',
  'skills.json',
  'experience.json',
  'navigation.json',
  'about.json',
  'index.ts'
];

console.log('📁 Checking data files...');
let filesExist = true;

requiredFiles.forEach(file => {
  const filePath = path.join(dataDir, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file} - Found`);
  } else {
    console.log(`❌ ${file} - Missing`);
    filesExist = false;
  }
});

if (!filesExist) {
  console.log('\n❌ Some required files are missing!');
  process.exit(1);
}

// Test JSON validity
console.log('\n📝 Validating JSON files...');
const jsonFiles = requiredFiles.filter(f => f.endsWith('.json'));

jsonFiles.forEach(file => {
  try {
    const filePath = path.join(dataDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    JSON.parse(content);
    console.log(`✅ ${file} - Valid JSON`);
  } catch (error) {
    console.log(`❌ ${file} - Invalid JSON: ${error.message}`);
    filesExist = false;
  }
});

// Check if TypeScript index file has proper exports
console.log('\n🔧 Checking TypeScript exports...');
try {
  const indexPath = path.join(dataDir, 'index.ts');
  const indexContent = fs.readFileSync(indexPath, 'utf8');
  
  const requiredExports = [
    'getProjects',
    'getAchievements',
    'getCertifications',
    'getAwards',
    'getSkills',
    'getExperienceData',
    'getNavigationLinks',
    'getAboutData'
  ];
  
  requiredExports.forEach(exportName => {
    if (indexContent.includes(`export const ${exportName}`)) {
      console.log(`✅ ${exportName} - Exported`);
    } else {
      console.log(`❌ ${exportName} - Missing export`);
      filesExist = false;
    }
  });
} catch (error) {
  console.log(`❌ Error reading index.ts: ${error.message}`);
  filesExist = false;
}

// Summary
console.log('\n📊 Migration Summary:');
if (filesExist) {
  console.log('✅ All checks passed! JSON data migration is complete and valid.');
  console.log('\n🎉 Your portfolio now uses JSON-based data management!');
  console.log('\n📖 To update content:');
  console.log('1. Edit the JSON files in src/data/');
  console.log('2. The frontend will automatically use the updated data');
  console.log('3. See src/data/README.md for detailed instructions');
} else {
  console.log('❌ Some issues found. Please check the errors above.');
  process.exit(1);
}
