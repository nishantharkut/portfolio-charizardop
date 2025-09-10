// Lightweight performance monitoring script for portfolio
// Monitors Core Web Vitals and provides performance insights

(function() {
  'use strict';
  
  // Only run on client side
  if (typeof window === 'undefined') return;
  
  // Performance data storage
  const performanceData = {
    fcp: null,
    lcp: null,
    cls: 0,
    fid: null,
    ttfb: null,
    loadTime: null,
    domContentLoaded: null,
    firstByte: null
  };
  
  // Performance marks for custom measurements
  const performanceMarks = {};
  
  // Mark performance milestones
  function markPerformance(milestone) {
    if (typeof performance !== 'undefined' && performance.mark) {
      performance.mark(milestone);
      performanceMarks[milestone] = performance.now();
    }
  }
  
  // Measure performance between two marks
  function measurePerformance(name, startMark, endMark) {
    if (typeof performance !== 'undefined' && performance.measure) {
      try {
        performance.measure(name, startMark, endMark);
        const measure = performance.getEntriesByName(name)[0];
        return measure ? measure.duration : null;
      } catch (error) {
        console.warn('Performance measure failed:', error);
        return null;
      }
    }
    return null;
  }
  
  // Monitor First Contentful Paint
  function measureFCP() {
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          performanceData.fcp = entry.startTime;
          markPerformance('fcp');
          console.log('🎨 First Contentful Paint:', Math.round(entry.startTime) + 'ms');
        }
      }
    }).observe({ entryTypes: ['paint'] });
  }
  
  // Monitor Largest Contentful Paint
  function measureLCP() {
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      if (lastEntry) {
        performanceData.lcp = lastEntry.startTime;
        markPerformance('lcp');
        console.log('📊 Largest Contentful Paint:', Math.round(lastEntry.startTime) + 'ms');
      }
    }).observe({ entryTypes: ['largest-contentful-paint'] });
  }
  
  // Monitor Cumulative Layout Shift
  function measureCLS() {
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          performanceData.cls += entry.value;
        }
      }
      console.log('📐 Cumulative Layout Shift:', performanceData.cls.toFixed(3));
    }).observe({ entryTypes: ['layout-shift'] });
  }
  
  // Monitor First Input Delay
  function measureFID() {
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        performanceData.fid = entry.processingStart - entry.startTime;
        markPerformance('fid');
        console.log('⚡ First Input Delay:', Math.round(performanceData.fid) + 'ms');
      }
    }).observe({ entryTypes: ['first-input'] });
  }
  
  // Monitor Time to First Byte
  function measureTTFB() {
    const navigation = performance.getEntriesByType('navigation')[0];
    if (navigation) {
      performanceData.ttfb = navigation.responseStart - navigation.fetchStart;
      performanceData.firstByte = navigation.responseStart - navigation.requestStart;
      markPerformance('ttfb');
      console.log('🌐 Time to First Byte:', Math.round(performanceData.ttfb) + 'ms');
    }
  }
  
  // Monitor page load times
  function measureLoadTimes() {
    const navigation = performance.getEntriesByType('navigation')[0];
    if (navigation) {
      performanceData.loadTime = navigation.loadEventEnd - navigation.fetchStart;
      performanceData.domContentLoaded = navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart;
      
      console.log('⏱️ Page Load Time:', Math.round(performanceData.loadTime) + 'ms');
      console.log('📄 DOM Content Loaded:', Math.round(performanceData.domContentLoaded) + 'ms');
    }
  }
  
  // Monitor resource loading performance
  function measureResourcePerformance() {
    const resources = performance.getEntriesByType('resource');
    const slowResources = resources.filter(r => r.duration > 1000);
    
    if (slowResources.length > 0) {
      console.log('🐌 Slow Resources (>1s):');
      slowResources.forEach(r => {
        console.log(`  - ${r.name}: ${Math.round(r.duration)}ms`);
      });
    }
    
    // Monitor largest resources
    const largestResources = resources
      .sort((a, b) => b.transferSize - a.transferSize)
      .slice(0, 5);
    
    if (largestResources.length > 0) {
      console.log('📦 Largest Resources:');
      largestResources.forEach(r => {
        const sizeKB = Math.round((r.transferSize || 0) / 1024);
        console.log(`  - ${r.name}: ${sizeKB}KB`);
      });
    }
  }
  
  // Monitor memory usage (if available)
  function measureMemoryUsage() {
    if (performance.memory) {
      const memory = performance.memory;
      const usedMB = Math.round(memory.usedJSHeapSize / 1024 / 1024);
      const totalMB = Math.round(memory.totalJSHeapSize / 1024 / 1024);
      const limitMB = Math.round(memory.jsHeapSizeLimit / 1024 / 1024);
      
      console.log('💾 Memory Usage:');
      console.log(`  - Used: ${usedMB}MB`);
      console.log(`  - Total: ${totalMB}MB`);
      console.log(`  - Limit: ${limitMB}MB`);
      
      // Warn if memory usage is high
      if (usedMB / limitMB > 0.8) {
        console.warn('⚠️ High memory usage detected');
      }
    }
  }
  
  // Generate performance report
  function generatePerformanceReport() {
    const report = {
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      connection: navigator.connection ? {
        effectiveType: navigator.connection.effectiveType,
        downlink: navigator.connection.downlink,
        rtt: navigator.connection.rtt
      } : null,
      performance: performanceData,
      marks: performanceMarks
    };
    
    // Store in localStorage for analysis
    try {
      const existingReports = JSON.parse(localStorage.getItem('portfolioPerformanceReports') || '[]');
      existingReports.push(report);
      
      // Keep only last 10 reports
      if (existingReports.length > 10) {
        existingReports.splice(0, existingReports.length - 10);
      }
      
      localStorage.setItem('portfolioPerformanceReports', JSON.stringify(existingReports));
    } catch (error) {
      console.warn('Could not save performance report:', error);
    }
    
    return report;
  }
  
  // Performance scoring
  function scorePerformance() {
    const scores = {
      fcp: performanceData.fcp < 1800 ? 'good' : performanceData.fcp < 3000 ? 'needs-improvement' : 'poor',
      lcp: performanceData.lcp < 2500 ? 'good' : performanceData.lcp < 4000 ? 'needs-improvement' : 'poor',
      cls: performanceData.cls < 0.1 ? 'good' : performanceData.cls < 0.25 ? 'needs-improvement' : 'poor',
      fid: performanceData.fid < 100 ? 'good' : performanceData.fid < 300 ? 'needs-improvement' : 'poor'
    };
    
    console.log('📊 Performance Scores:');
    console.log(`  - FCP: ${scores.fcp} (${Math.round(performanceData.fcp || 0)}ms)`);
    console.log(`  - LCP: ${scores.lcp} (${Math.round(performanceData.lcp || 0)}ms)`);
    console.log(`  - CLS: ${scores.cls} (${performanceData.cls.toFixed(3)})`);
    console.log(`  - FID: ${scores.fid} (${Math.round(performanceData.fid || 0)}ms)`);
    
    return scores;
  }
  
  // Main initialization
  function initPerformanceMonitoring() {
    console.group('🚀 Portfolio Performance Monitor');
    
    // Mark page start
    markPerformance('page-start');
    
    // Start monitoring
    measureFCP();
    measureLCP();
    measureCLS();
    measureFID();
    
    // Measure immediate metrics
    measureTTFB();
    measureLoadTimes();
    
    // Measure after page load
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        markPerformance('dom-content-loaded');
        measureLoadTimes();
      });
    } else {
      markPerformance('dom-content-loaded');
      measureLoadTimes();
    }
    
    // Measure after full page load
    window.addEventListener('load', () => {
      markPerformance('page-loaded');
      
      // Delay resource measurement to ensure all resources are loaded
      setTimeout(() => {
        measureResourcePerformance();
        measureMemoryUsage();
        
        const scores = scorePerformance();
        const report = generatePerformanceReport();
        
        console.log('📈 Performance Report Generated');
        console.groupEnd();
        
        // Dispatch custom event for other scripts to listen
        window.dispatchEvent(new CustomEvent('performanceReport', { detail: report }));
      }, 1000);
    });
  }
  
  // Start monitoring when page loads
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPerformanceMonitoring);
  } else {
    initPerformanceMonitoring();
  }
  
  // Export for external access
  window.portfolioPerformance = {
    getData: () => performanceData,
    getMarks: () => performanceMarks,
    generateReport: generatePerformanceReport,
    scorePerformance: scorePerformance
  };
  
})();
