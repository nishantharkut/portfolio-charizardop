/**
 * Deterministic 3D Model Zoom Test Script
 * Tests the consistency of Charizard model scaling and positioning
 */

console.log('🎯 Starting Deterministic Zoom Test...');

// Test configurations
const TEST_ITERATIONS = 5;
const REFRESH_DELAY = 2000; // ms between refreshes

let testResults = [];
let currentIteration = 0;

// Function to capture model state
function captureModelState() {
  const canvas = document.querySelector('canvas');
  if (!canvas) {
    return { error: 'Canvas not found' };
  }

  // Look for model in Three.js scene
  const scene = canvas.__three_context?.scene;
  if (!scene) {
    return { error: 'Three.js scene not found' };
  }

  let charizardGroup = null;
  scene.traverse((object) => {
    if (object.type === 'Group' && object.children.length > 0) {
      // Look for the group containing the Charizard model
      object.children.forEach(child => {
        if (child.type === 'Group' || child.type === 'Object3D') {
          charizardGroup = object;
        }
      });
    }
  });

  if (!charizardGroup) {
    return { error: 'Charizard model group not found' };
  }

  return {
    position: {
      x: parseFloat(charizardGroup.position.x.toFixed(3)),
      y: parseFloat(charizardGroup.position.y.toFixed(3)),
      z: parseFloat(charizardGroup.position.z.toFixed(3))
    },
    scale: {
      x: parseFloat(charizardGroup.scale.x.toFixed(3)),
      y: parseFloat(charizardGroup.scale.y.toFixed(3)),
      z: parseFloat(charizardGroup.scale.z.toFixed(3))
    },
    rotation: {
      x: parseFloat(charizardGroup.rotation.x.toFixed(3)),
      y: parseFloat(charizardGroup.rotation.y.toFixed(3)),
      z: parseFloat(charizardGroup.rotation.z.toFixed(3))
    },
    timestamp: Date.now()
  };
}

// Function to run a single test
function runTest() {
  currentIteration++;
  console.log(`📊 Test Iteration ${currentIteration}/${TEST_ITERATIONS}`);

  // Wait for model to load and settle
  setTimeout(() => {
    const state = captureModelState();
    testResults.push({
      iteration: currentIteration,
      ...state
    });

    console.log('Model State:', state);

    if (currentIteration < TEST_ITERATIONS) {
      // Refresh page for next test
      console.log('🔄 Refreshing page for next test...');
      setTimeout(() => {
        location.reload();
      }, 1000);
    } else {
      // Analyze results
      analyzeResults();
    }
  }, 3000); // Wait 3 seconds for model to load and animate
}

// Function to analyze test results
function analyzeResults() {
  console.log('📈 Analyzing Test Results...');
  console.table(testResults);

  const validResults = testResults.filter(r => !r.error);
  
  if (validResults.length === 0) {
    console.error('❌ No valid results captured');
    return;
  }

  // Check for consistency
  const firstResult = validResults[0];
  let isConsistent = true;
  let inconsistencies = [];

  validResults.forEach((result, index) => {
    if (index === 0) return;

    ['position', 'scale', 'rotation'].forEach(property => {
      ['x', 'y', 'z'].forEach(axis => {
        const diff = Math.abs(result[property][axis] - firstResult[property][axis]);
        if (diff > 0.01) { // Tolerance of 0.01 units
          isConsistent = false;
          inconsistencies.push({
            iteration: result.iteration,
            property,
            axis,
            expected: firstResult[property][axis],
            actual: result[property][axis],
            difference: diff
          });
        }
      });
    });
  });

  // Report results
  if (isConsistent) {
    console.log('✅ ZOOM CONSISTENCY TEST PASSED');
    console.log('All model states are consistent across page refreshes');
  } else {
    console.log('❌ ZOOM CONSISTENCY TEST FAILED');
    console.log('Inconsistencies found:');
    console.table(inconsistencies);
  }

  // Summary
  console.log('\n📋 Test Summary:');
  console.log(`Total tests: ${TEST_ITERATIONS}`);
  console.log(`Valid results: ${validResults.length}`);
  console.log(`Failed tests: ${testResults.length - validResults.length}`);
  console.log(`Consistency: ${isConsistent ? 'PASS' : 'FAIL'}`);
  
  if (validResults.length > 0) {
    console.log('\n🎯 Final Model Configuration:');
    console.log(`Scale: [${firstResult.scale.x}, ${firstResult.scale.y}, ${firstResult.scale.z}]`);
    console.log(`Position: [${firstResult.position.x}, ${firstResult.position.y}, ${firstResult.position.z}]`);
  }
}

// Check if this is a test run (look for query parameter)
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('zoomTest') === 'true') {
  // Start automated test
  runTest();
} else {
  // Manual testing functions
  window.testZoomConsistency = () => {
    window.location.href = window.location.href + '?zoomTest=true';
  };
  
  window.captureCurrentState = captureModelState;
  
  console.log('🧪 Zoom Test Functions Available:');
  console.log('- testZoomConsistency(): Start automated consistency test');
  console.log('- captureCurrentState(): Capture current model state');
}