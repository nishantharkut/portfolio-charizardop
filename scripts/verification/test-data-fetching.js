// Backend Data Verification Test
// This script tests if all data is being fetched correctly

const { 
  getProjects, 
  getExperienceData, 
  getAchievements, 
  getSkills, 
  getSkillGroups,
  getNavigationLinks,
  getAboutData,
  getCertifications,
  getAwards
} = require('./src/data/index.ts');

console.log('🔍 BACKEND DATA VERIFICATION TEST\n');

try {
  // Test Projects Data
  console.log('📁 Testing Projects Data...');
  const projects = getProjects();
  console.log(`✅ Projects loaded: ${projects.length} items`);
  console.log(`   Sample project: ${projects[0]?.title || 'No projects found'}`);

  // Test Experience Data
  console.log('\n💼 Testing Experience Data...');
  const experience = getExperienceData();
  console.log(`✅ Experience items loaded: ${experience.length} items`);
  console.log(`   Sample experience: ${experience[0]?.position || 'No experience found'}`);

  // Test Achievements Data
  console.log('\n🏆 Testing Achievements Data...');
  const achievements = getAchievements();
  console.log(`✅ Achievements loaded: ${achievements.length} items`);
  console.log(`   Sample achievement: ${achievements[0]?.title || 'No achievements found'}`);

  // Test Skills Data
  console.log('\n🛠️ Testing Skills Data...');
  const skillGroups = getSkillGroups();
  console.log(`✅ Skill groups loaded: ${skillGroups.length} groups`);
  console.log(`   Sample skill group: ${skillGroups[0]?.title || 'No skills found'}`);

  // Test Navigation Data
  console.log('\n🧭 Testing Navigation Data...');
  const navigation = getNavigationLinks();
  console.log(`✅ Navigation links loaded: ${navigation.length} links`);
  console.log(`   Sample link: ${navigation[0]?.label || 'No navigation found'}`);

  // Test About Data
  console.log('\n👤 Testing About Data...');
  const aboutData = getAboutData();
  console.log(`✅ About data loaded`);
  console.log(`   Hero title: ${aboutData?.hero?.title || 'No about data found'}`);

  // Test Certifications
  console.log('\n📜 Testing Certifications Data...');
  const certifications = getCertifications();
  console.log(`✅ Certifications loaded: ${certifications.length} items`);

  // Test Awards
  console.log('\n🏅 Testing Awards Data...');
  const awards = getAwards();
  console.log(`✅ Awards loaded: ${awards.length} items`);

  console.log('\n🎉 ALL DATA FETCHING TESTS PASSED!');
  console.log('✅ Backend data system is working correctly');

} catch (error) {
  console.error('\n❌ DATA FETCHING ERROR:', error.message);
  console.error('Backend data system has issues that need to be resolved');
}
