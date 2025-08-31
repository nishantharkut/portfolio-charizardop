// Performance monitoring script for portfolio
// Add this to your HTML head or run in console to monitor performance

(function() {
  'use strict';
  
  // Wait for page to load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPerformanceMonitor);
  } else {
    initPerformanceMonitor();
  }
  
  function initPerformanceMonitor() {
    // Performance marks
    const marks = performance.getEntriesByType('mark');
    const measures = performance.getEntriesByType('measure');
    
    // Navigation timing
    const navigation = performance.getEntriesByType('navigation')[0];
    const paint = performance.getEntriesByType('paint');
    
    console.group('🚀 Portfolio Performance Report');
    
    if (navigation) {
      console.log('📊 Navigation Timing:');
      console.log(`  - DNS Lookup: ${navigation.domainLookupEnd - navigation.domainLookupStart}ms`);
      console.log(`  - TCP Connect: ${navigation.connectEnd - navigation.connectStart}ms`);
      console.log(`  - First Byte: ${navigation.responseStart - navigation.requestStart}ms`);
      console.log(`  - DOM Content Loaded: ${navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart}ms`);
      console.log(`  - Load Complete: ${navigation.loadEventEnd - navigation.loadEventStart}ms`);
      console.log(`  - Total Load Time: ${navigation.loadEventEnd - navigation.fetchStart}ms`);
    }
    
    if (paint.length > 0) {
      console.log('🎨 Paint Timing:');
      paint.forEach(p => {
        console.log(`  - ${p.name}: ${Math.round(p.startTime)}ms`);
      });
    }
    
    // Resource timing
    const resources = performance.getEntriesByType('resource');
    const slowResources = resources.filter(r => r.duration > 1000);
    
    if (slowResources.length > 0) {
      console.log('🐌 Slow Resources (>1s):');
      slowResources.forEach(r => {
        console.log(`  - ${r.name}: ${Math.round(r.duration)}ms`);
      });
    }
    
    // Core Web Vitals estimation
    const fcp = paint.find(p => p.name === 'first-contentful-paint');
    const lcp = performance.getEntriesByType('largest-contentful-paint')[0];
    
    if (fcp) {
      console.log(`🎯 First Contentful Paint: ${Math.round(fcp.startTime)}ms`);
    }
    
    if (lcp) {
      console.log(`🎯 Largest Contentful Paint: ${Math.round(lcp.startTime)}ms`);
    }
    
    // Memory usage (if available)
    if (performance.memory) {
      console.log('💾 Memory Usage:');
      console.log(`  - Used: ${Math.round(performance.memory.usedJSHeapSize / 1024 / 1024)}MB`);
      console.log(`  - Total: ${Math.round(performance.memory.totalJSHeapSize / 1024 / 1024)}MB`);
      console.log(`  - Limit: ${Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024)}MB`);
    }
    
    console.groupEnd();
    
    // Store performance data for comparison
    const perfData = {
      timestamp: Date.now(),
      navigation: navigation ? {
        totalLoadTime: navigation.loadEventEnd - navigation.fetchStart,
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        firstByte: navigation.responseStart - navigation.requestStart
      } : null,
      paint: paint.map(p => ({ name: p.name, time: Math.round(p.startTime) })),
      slowResources: slowResources.map(r => ({ name: r.name, duration: Math.round(r.duration) }))
    };
    
    // Store in localStorage for comparison
    try {
      const existingData = JSON.parse(localStorage.getItem('portfolioPerformance') || '[]');
      existingData.push(perfData);
      // Keep only last 10 entries
      if (existingData.length > 10) {
        existingData.splice(0, existingData.length - 10);
      }
      localStorage.setItem('portfolioPerformance', JSON.stringify(existingData));
    } catch (e) {
      console.warn('Could not save performance data:', e);
    }
  }
})();
