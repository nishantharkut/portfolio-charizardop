export class PerformanceManager {
  private static instance: PerformanceManager;
  private deviceTier: 'low' | 'medium' | 'high' = 'medium';
  private isLowPowerMode: boolean = false;
  private fps: number = 60;
  private frameCount: number = 0;
  private lastTime: number = 0;
  private performanceObserver?: PerformanceObserver;
  private reducedMotion: boolean = false;
  private isOnline: boolean = true;
  private connectionType: string = 'unknown';
  private memoryInfo: any = null;

  private constructor() {
    this.detectDeviceCapabilities();
    this.setupPerformanceMonitoring();
    this.detectReducedMotion();
    this.detectNetworkConditions();
    this.setupMemoryMonitoring();
  }

  static getInstance(): PerformanceManager {
    if (!PerformanceManager.instance) {
      PerformanceManager.instance = new PerformanceManager();
    }
    return PerformanceManager.instance;
  }

  private detectDeviceCapabilities() {
    // Only run on client side
    if (typeof window === 'undefined') {
      this.deviceTier = 'medium'; // Default for SSR
      return;
    }

    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') as WebGLRenderingContext || canvas.getContext('experimental-webgl') as WebGLRenderingContext;
    
    if (!gl) {
      this.deviceTier = 'low';
      return;
    }

    try {
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      const vendor = debugInfo ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : '';
      const renderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : '';
      
      // GPU-based tier detection
      if (renderer && typeof renderer === 'string') {
        const lowerRenderer = renderer.toLowerCase();
        if (lowerRenderer.includes('integrated') || lowerRenderer.includes('intel')) {
          this.deviceTier = this.deviceTier === 'high' ? 'medium' : this.deviceTier;
        }
      }
    } catch (e) {
      // Fallback if WebGL debug info is not available
    }
    
    // Enhanced device detection
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isTablet = /iPad|Android(?=.*\bMobile\b)(?=.*\bSafari\b)/i.test(navigator.userAgent);
    
    // Check memory
    const memory = (navigator as any).deviceMemory || 4;
    
    // Check CPU cores
    const cores = navigator.hardwareConcurrency || 4;
    
    // Check for low power mode indicators
    this.isLowPowerMode = memory < 4 || cores < 4 || isMobile;
    
    // Advanced tier calculation
    let score = 0;
    score += memory >= 8 ? 3 : memory >= 4 ? 2 : 1;
    score += cores >= 8 ? 3 : cores >= 4 ? 2 : 1;
    score += !isMobile ? 2 : isTablet ? 1 : 0;
    
    if (score >= 8) {
      this.deviceTier = 'high';
    } else if (score >= 5) {
      this.deviceTier = 'medium';
    } else {
      this.deviceTier = 'low';
    }
    
    canvas.remove();
  }

  private detectReducedMotion() {
    if (typeof window === 'undefined') {
      this.reducedMotion = false; // Default for SSR
      return;
    }
    
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Listen for changes
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    mediaQuery.addEventListener('change', (e) => {
      this.reducedMotion = e.matches;
    });
  }

  private detectNetworkConditions() {
    if (typeof navigator === 'undefined' || typeof window === 'undefined') return;
    
    this.isOnline = navigator.onLine;
    
    // Network Information API support
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    if (connection) {
      this.connectionType = connection.effectiveType || connection.type || 'unknown';
    }
    
    // Listen for network changes
    window.addEventListener('online', () => { this.isOnline = true; });
    window.addEventListener('offline', () => { this.isOnline = false; });
  }

  private setupMemoryMonitoring() {
    if (typeof performance === 'undefined' || typeof window === 'undefined') return;
    
    // Modern browsers memory API
    if ('memory' in performance) {
      this.memoryInfo = (performance as any).memory;
    }
  }

  private setupPerformanceMonitoring() {
    if (typeof window === 'undefined') return;
    
    if ('PerformanceObserver' in window) {
      this.performanceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'measure' && entry.duration > 16.67) {
            // Frame drop detected, reduce quality temporarily
            this.handlePerformanceDrop();
          }
          
          // Monitor long tasks
          if (entry.entryType === 'longtask' && entry.duration > 50) {
            this.handlePerformanceDrop();
          }
        }
      });
      
      try {
        this.performanceObserver.observe({ 
          entryTypes: ['measure', 'navigation', 'longtask'] 
        });
      } catch (e) {
        // Fallback for older browsers
        console.warn('Performance observer not fully supported');
      }
    }
  }

  private handlePerformanceDrop() {
    if (typeof document === 'undefined') return;
    
    document.documentElement.classList.add('performance-mode');
    setTimeout(() => {
      document.documentElement.classList.remove('performance-mode');
    }, 5000);
  }

  getOptimalSettings() {
    const memoryPressure = this.memoryInfo ? 
      (this.memoryInfo.usedJSHeapSize / this.memoryInfo.totalJSHeapSize) > 0.8 : false;
    
    const networkConstraints = this.connectionType === 'slow-2g' || this.connectionType === '2g' || !this.isOnline;
    
    return {
      deviceTier: this.deviceTier,
      isLowPowerMode: this.isLowPowerMode,
      reducedMotion: this.reducedMotion,
      memoryPressure,
      networkConstraints,
      isOnline: this.isOnline,
      connectionType: this.connectionType,
      
      // Animation settings
      maxParticles: this.deviceTier === 'low' ? 25 : this.deviceTier === 'medium' ? 75 : 150,
      animationQuality: this.deviceTier === 'low' ? 'low' : this.deviceTier === 'medium' ? 'medium' : 'high',
      enableWebGL: this.deviceTier !== 'low' && !this.reducedMotion && !memoryPressure,
      enableComplexAnimations: !this.isLowPowerMode && !this.reducedMotion && !memoryPressure,
      targetFPS: this.deviceTier === 'low' ? 30 : networkConstraints ? 45 : 60,
      
      // Visual effects
      enableBlur: this.deviceTier !== 'low' && !memoryPressure,
      enableShadows: this.deviceTier === 'high' && !memoryPressure,
      enableGradients: this.deviceTier !== 'low',
      enableTransitions: !this.reducedMotion,
      
      // Asset loading
      imageQuality: networkConstraints ? 'low' : this.deviceTier === 'low' ? 'medium' : 'high',
      lazyLoadThreshold: this.deviceTier === 'low' ? 50 : 100,
      preloadImages: this.deviceTier === 'high' && !networkConstraints,
      
      // WebGL specific
      webglMaxTextures: this.deviceTier === 'low' ? 4 : this.deviceTier === 'medium' ? 8 : 16,
      webglShadowQuality: this.deviceTier === 'low' ? 'off' : this.deviceTier === 'medium' ? 'low' : 'high',
      
      // Interaction
      touchOptimized: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent || ''),
      reducedTooltips: this.deviceTier === 'low' || memoryPressure,
    };
  }

  // Enhanced FPS monitoring with frame rate limiting
  monitorFPS(callback?: (fps: number) => void) {
    if (typeof performance === 'undefined') return 60;
    
    const now = performance.now();
    this.frameCount++;
    
    if (now >= this.lastTime + 1000) {
      this.fps = Math.round((this.frameCount * 1000) / (now - this.lastTime));
      this.frameCount = 0;
      this.lastTime = now;
      
      if (callback) callback(this.fps);
      
      // Dynamic quality adjustment
      if (this.fps < 30 && this.deviceTier !== 'low') {
        this.handlePerformanceDrop();
      } else if (this.fps > 55 && this.deviceTier === 'low') {
        // Possibly upgrade quality temporarily
        document.documentElement.classList.add('performance-boost');
        setTimeout(() => {
          document.documentElement.classList.remove('performance-boost');
        }, 10000);
      }
    }
    
    return this.fps;
  }

  // Memory monitoring
  getMemoryUsage() {
    if (!this.memoryInfo) return null;
    
    return {
      used: this.memoryInfo.usedJSHeapSize,
      total: this.memoryInfo.totalJSHeapSize,
      limit: this.memoryInfo.jsHeapSizeLimit,
      percentage: (this.memoryInfo.usedJSHeapSize / this.memoryInfo.totalJSHeapSize) * 100
    };
  }

  // Frame rate limiting for animations
  createFrameLimiter(targetFPS: number = 60) {
    const interval = 1000 / targetFPS;
    let lastTime = 0;
    
    return (callback: () => void) => {
      const now = performance.now();
      if (now - lastTime >= interval) {
        lastTime = now;
        callback();
      }
    };
  }

  shouldReduceAnimations(): boolean {
    const memoryPressure = this.memoryInfo ? 
      (this.memoryInfo.usedJSHeapSize / this.memoryInfo.totalJSHeapSize) > 0.8 : false;
    
    return this.reducedMotion || this.isLowPowerMode || this.deviceTier === 'low' || memoryPressure;
  }

  // Adaptive loading strategy
  getLoadingStrategy() {
    const settings = this.getOptimalSettings();
    
    return {
      chunkSize: settings.networkConstraints ? 'small' : settings.deviceTier === 'high' ? 'large' : 'medium',
      concurrentRequests: settings.deviceTier === 'low' ? 2 : settings.deviceTier === 'medium' ? 4 : 6,
      cacheStrategy: settings.memoryPressure ? 'aggressive' : 'normal',
      prioritizeAboveFold: settings.deviceTier === 'low' || settings.networkConstraints
    };
  }

  cleanup() {
    if (this.performanceObserver) {
      this.performanceObserver.disconnect();
    }
  }
}

export const performanceManager = PerformanceManager.getInstance();
