import type { NextConfig } from "next";

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  // Performance optimizations
  compress: true,
  poweredByHeader: false,

  // So Google (and other crawlers) get a favicon when they request /favicon.ico
  async redirects() {
    return [
      {
        source: '/favicon.ico',
        destination: '/nishantharkut-logo.png',
        permanent: true,
      },
    ];
  },
  
  // Enhanced image optimization for Vercel
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year for Vercel CDN
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    unoptimized: false,
    remotePatterns: [],
    domains: [],
  },
  
  // Enhanced webpack optimizations for better bundle splitting
  webpack: (config, { dev, isServer }) => {
    // Production optimizations
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          maxInitialRequests: 20, // Reduced for faster initial load
          maxAsyncRequests: 20,   // Reduced for better performance
          cacheGroups: {
            // Critical React chunks - highest priority
            react: {
              test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
              name: 'react',
              chunks: 'all',
              priority: 40,
            },
            // Next.js framework
            next: {
              test: /[\\/]node_modules[\\/]next[\\/]/,
              name: 'next',
              chunks: 'all',
              priority: 35,
            },
            // Heavy 3D libraries - load only when needed
            threejs: {
              test: /[\\/]node_modules[\\/](three|@react-three)[\\/]/,
              name: 'threejs',
              chunks: 'async', // Only load when needed
              priority: 30,
            },
            // Animation libraries - defer loading
            animations: {
              test: /[\\/]node_modules[\\/](gsap|framer-motion)[\\/]/,
              name: 'animations',
              chunks: 'async', // Defer to async loading
              priority: 25,
            },
            // Post-processing effects - lowest priority
            effects: {
              test: /[\\/]node_modules[\\/](postprocessing|@react-three\/postprocessing)[\\/]/,
              name: 'effects',
              chunks: 'async',
              priority: 20,
            },
            // Other vendor libraries
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
              priority: 10,
            },
            // Common chunks
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              priority: 5,
              reuseExistingChunk: true,
            },
          },
        },
      };
    }
    
    // Tree-shake unused GSAP plugins more aggressively
    config.resolve.alias = {
      ...config.resolve.alias,
      'gsap/all': 'gsap/index',
      // Only import specific GSAP modules
      'gsap/dist/gsap': 'gsap',
    };
    
    return config;
  },
  
  // Enhanced experimental features for performance
  experimental: {
    optimizePackageImports: [
      'gsap', 
      'framer-motion', 
      'three', 
      '@react-three/fiber', 
      '@react-three/drei',
      '@react-three/postprocessing',
      'lodash'
    ],
    scrollRestoration: true,
  },
  
  // Development configuration
  ...(process.env.NODE_ENV === 'development' && {
    allowedDevOrigins: ['192.168.1.239', 'localhost'],
  }),
  
  // Turbopack configuration (moved from experimental)
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  
  // Enhanced headers for better caching on Vercel
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
      {
        source: '/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/models/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/image(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default withBundleAnalyzer(nextConfig);
