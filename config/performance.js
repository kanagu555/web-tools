/**
 * Performance monitoring and optimization configuration
 */

const performanceConfig = {
  // Core Web Vitals thresholds
  coreWebVitals: {
    LCP: 2500, // Largest Contentful Paint (ms)
    FID: 100,  // First Input Delay (ms)
    CLS: 0.1,  // Cumulative Layout Shift
    FCP: 1800, // First Contentful Paint (ms)
    TTFB: 600, // Time to First Byte (ms)
  },

  // Bundle size limits
  bundleSize: {
    maxInitialJS: 244 * 1024, // 244KB
    maxInitialCSS: 50 * 1024,  // 50KB
    maxAsyncChunk: 244 * 1024, // 244KB
  },

  // Image optimization settings
  images: {
    formats: ['image/webp', 'image/avif'],
    quality: 85,
    sizes: [16, 32, 48, 64, 96, 128, 256, 384],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    minimumCacheTTL: 60,
  },

  // Caching strategies
  caching: {
    staticAssets: 31536000, // 1 year
    apiResponses: 300,      // 5 minutes
    pages: 3600,           // 1 hour
    fonts: 31536000,       // 1 year
  },

  // Performance monitoring
  monitoring: {
    enableRUM: process.env.NODE_ENV === 'production',
    sampleRate: 0.1, // 10% of users
    reportingEndpoint: '/api/performance',
  },

  // Preload strategies
  preload: {
    criticalResources: [
      '/fonts/inter-var.woff2',
      '/api/tools/popular',
    ],
    prefetchRoutes: [
      '/tools',
      '/category/pdf',
      '/category/calculator',
    ],
  },
};

module.exports = performanceConfig;