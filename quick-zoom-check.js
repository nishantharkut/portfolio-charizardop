/**
 * Quick Zoom Verification Script
 * Paste this into browser console to check model consistency
 */

function quickZoomCheck() {
  console.log('🔍 Quick Zoom Check...');
  
  // Wait for model to load
  setTimeout(() => {
    const canvas = document.querySelector('canvas');
    if (!canvas) {
      console.error('❌ Canvas not found');
      return;
    }

    // Check for Three.js context
    let modelFound = false;
    const scene = window.THREE_SCENE || canvas.__three_context?.scene;
    
    if (scene) {
      scene.traverse((object) => {
        if (object.type === 'Group' && object.children.length > 0) {
          console.log('✅ Model found!');
          console.log(`📏 Scale: [${object.scale.x.toFixed(2)}, ${object.scale.y.toFixed(2)}, ${object.scale.z.toFixed(2)}]`);
          console.log(`📍 Position: [${object.position.x.toFixed(2)}, ${object.position.y.toFixed(2)}, ${object.position.z.toFixed(2)}]`);
          
          // Check if scale is consistent with expected values
          const isMobile = window.innerWidth <= 768;
          const expectedScale = isMobile ? 1.8 : 2.2;
          const actualScale = object.scale.x;
          const scaleDiff = Math.abs(actualScale - expectedScale);
          
          if (scaleDiff < 0.1) {
            console.log('✅ Scale is correct!');
          } else {
            console.log(`⚠️ Scale variance detected. Expected: ${expectedScale}, Actual: ${actualScale}`);
          }
          
          modelFound = true;
        }
      });
    }
    
    if (!modelFound) {
      console.log('⏳ Model still loading... Try again in a few seconds');
    }
  }, 2000);
}

// Auto-run check
quickZoomCheck();

// Make function available globally
window.quickZoomCheck = quickZoomCheck;
console.log('💡 Run quickZoomCheck() anytime to verify model state');