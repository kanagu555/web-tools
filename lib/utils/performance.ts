/**
 * Performance optimization utilities for Next.js application
 */



// Dynamic import utility for code splitting
export const dynamicImport = <T>(
  importFn: () => Promise<T>
) => {
  return importFn;
};

// Image optimization utilities
export const getOptimizedImageProps = (
  src: string,
  alt: string,
  options?: {
    width?: number;
    height?: number;
    priority?: boolean;
    quality?: number;
    sizes?: string;
  }
) => {
  const defaultSizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw';
  
  return {
    src,
    alt,
    width: options?.width || 800,
    height: options?.height || 600,
    priority: options?.priority || false,
    quality: options?.quality || 85,
    sizes: options?.sizes || defaultSizes,
    placeholder: 'blur' as const,
    blurDataURL: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==',
  };
};

// Bundle analysis utilities
export const analyzeBundleSize = () => {
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    const scripts = Array.from(document.querySelectorAll('script[src]'));
    const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
    
    console.group('Bundle Analysis');
    console.log('Scripts:', scripts.length);
    console.log('Stylesheets:', styles.length);
    console.groupEnd();
  }
};

// Performance monitoring
export const measurePerformance = (name: string, fn: () => void | Promise<void>) => {
  if (typeof window !== 'undefined' && 'performance' in window) {
    const start = performance.now();
    const result = fn();
    
    if (result instanceof Promise) {
      return result.finally(() => {
        const end = performance.now();
        console.log(`${name}: ${end - start}ms`);
      });
    } else {
      const end = performance.now();
      console.log(`${name}: ${end - start}ms`);
      return result;
    }
  }
  return fn();
};

// Preload critical resources
export const preloadCriticalResources = () => {
  if (typeof window !== 'undefined') {
    const criticalResources = [
      '/fonts/inter-var.woff2',
      '/api/tools/popular',
    ];

    criticalResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource;
      
      if (resource.endsWith('.woff2')) {
        link.as = 'font';
        link.type = 'font/woff2';
        link.crossOrigin = 'anonymous';
      } else if (resource.startsWith('/api/')) {
        link.as = 'fetch';
        link.crossOrigin = 'anonymous';
      }
      
      document.head.appendChild(link);
    });
  }
};

// Lazy loading utility for components
export function createLazyComponent<P extends Record<string, unknown> = Record<string, unknown>>(
  importFn: () => Promise<{ default: React.ComponentType<P> }>,
  fallbackComponent?: React.ComponentType
): React.ComponentType<P> {
  const LazyComponent = React.lazy(importFn);
  
  const LazyWrapper: React.FC<P> = (props: P) => {
    const fallbackElement = fallbackComponent 
      ? React.createElement(fallbackComponent) 
      : React.createElement('div', {}, 'Loading...');
    
    return React.createElement(
      React.Suspense,
      { fallback: fallbackElement },
      React.createElement(LazyComponent as unknown as React.ComponentType<P>, props)
    );
  };
  
  LazyWrapper.displayName = 'LazyWrapper';
  return LazyWrapper;
}

// Cache optimization utilities
export const getCacheHeaders = (type: 'static' | 'dynamic' | 'api') => {
  const headers = new Headers();
  
  switch (type) {
    case 'static':
      headers.set('Cache-Control', 'public, max-age=31536000, immutable');
      break;
    case 'dynamic':
      headers.set('Cache-Control', 'public, max-age=3600, s-maxage=3600');
      break;
    case 'api':
      headers.set('Cache-Control', 'public, max-age=300, s-maxage=300');
      break;
  }
  
  return headers;
};

// Resource hints for better loading
export const addResourceHints = () => {
  if (typeof window !== 'undefined') {
    // DNS prefetch for external domains
    const domains = [
      'fonts.googleapis.com',
      'fonts.gstatic.com',
      'www.googletagmanager.com',
      'www.google-analytics.com',
    ];

    domains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = `//${domain}`;
      document.head.appendChild(link);
    });

    // Preconnect to critical domains
    const criticalDomains = [
      'fonts.googleapis.com',
      'fonts.gstatic.com',
    ];

    criticalDomains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = `https://${domain}`;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });
  }
};

// Web Vitals monitoring
export interface WebVitalsMetric {
  id: string;
  name: string;
  value: number;
  label?: 'web-vital' | 'custom';
  delta?: number;
  timestamp?: number;
}

export const reportWebVitals = (metric: WebVitalsMetric) => {
  if (process.env.NODE_ENV === 'production') {
    // Send to analytics service
    console.log(metric);
    
    // You can send to your analytics service here
    // Example: analytics.track('Web Vital', metric);
  }
};

// Import React for lazy loading utility
import React from 'react';