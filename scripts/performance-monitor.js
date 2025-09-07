const fs = require('fs');
const path = require('path');

const performanceMonitor = {
  measurePageLoad: () => {
    if (typeof window !== 'undefined') {
      window.addEventListener('load', () => {
        const navigation = performance.getEntriesByType('navigation')[0];
        const paint = performance.getEntriesByType('paint');
        
        const metrics = {
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
          firstPaint: paint.find(p => p.name === 'first-paint')?.startTime,
          firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime,
          timestamp: new Date().toISOString()
        };
        
        console.log('📊 Performance Metrics:', metrics);
        
        // Store metrics for analysis
        const metricsPath = path.join(__dirname, '../performance-metrics.json');
        let existingMetrics = [];
        
        try {
          if (fs.existsSync(metricsPath)) {
            existingMetrics = JSON.parse(fs.readFileSync(metricsPath, 'utf8'));
          }
        } catch (error) {
          console.warn('Could not read existing metrics:', error.message);
        }
        
        existingMetrics.push(metrics);
        
        // Keep only last 100 measurements
        if (existingMetrics.length > 100) {
          existingMetrics = existingMetrics.slice(-100);
        }
        
        try {
          fs.writeFileSync(metricsPath, JSON.stringify(existingMetrics, null, 2));
        } catch (error) {
          console.warn('Could not save metrics:', error.message);
        }
      });
    }
  },
  
  measureWebVitals: () => {
    if (typeof window !== 'undefined') {
      import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
        const vitals = {};
        
        getCLS((metric) => {
          vitals.CLS = metric.value;
          console.log('📈 CLS:', metric.value);
        });
        
        getFID((metric) => {
          vitals.FID = metric.value;
          console.log('📈 FID:', metric.value);
        });
        
        getFCP((metric) => {
          vitals.FCP = metric.value;
          console.log('📈 FCP:', metric.value);
        });
        
        getLCP((metric) => {
          vitals.LCP = metric.value;
          console.log('📈 LCP:', metric.value);
        });
        
        getTTFB((metric) => {
          vitals.TTFB = metric.value;
          console.log('📈 TTFB:', metric.value);
        });
        
        // Store Web Vitals
        setTimeout(() => {
          const vitalsPath = path.join(__dirname, '../web-vitals.json');
          let existingVitals = [];
          
          try {
            if (fs.existsSync(vitalsPath)) {
              existingVitals = JSON.parse(fs.readFileSync(vitalsPath, 'utf8'));
            }
          } catch (error) {
            console.warn('Could not read existing vitals:', error.message);
          }
          
          existingVitals.push({
            ...vitals,
            timestamp: new Date().toISOString()
          });
          
          // Keep only last 50 measurements
          if (existingVitals.length > 50) {
            existingVitals = existingVitals.slice(-50);
          }
          
          try {
            fs.writeFileSync(vitalsPath, JSON.stringify(existingVitals, null, 2));
          } catch (error) {
            console.warn('Could not save vitals:', error.message);
          }
        }, 5000); // Wait 5 seconds for all metrics to be collected
      }).catch(error => {
        console.warn('Web Vitals not available:', error.message);
      });
    }
  }
};

// Export for use in the application
if (typeof module !== 'undefined' && module.exports) {
  module.exports = performanceMonitor;
}

// Auto-run if this script is executed directly
if (require.main === module) {
  console.log('🚀 Performance monitoring script loaded');
  console.log('📊 Use this in your application to track performance metrics');
}
