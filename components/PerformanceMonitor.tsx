'use client';

import { useEffect } from 'react';
import { reportWebVitals } from '@/lib/utils/performance';

interface PerformanceMonitorProps {
  enabled?: boolean;
}

export default function PerformanceMonitor({ enabled = true }: PerformanceMonitorProps) {
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    // Monitor Core Web Vitals
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        // Report Web Vitals
        reportWebVitals({
          name: entry.name,
          value: (entry as any).value || (entry as any).processingStart - entry.startTime || entry.duration,
          id: entry.entryType,
          label: 'web-vital',
          timestamp: Date.now(),
        });
      });
    });

    // Observe different performance metrics
    try {
      observer.observe({ entryTypes: ['navigation', 'paint', 'largest-contentful-paint'] });
    } catch (e) {
      // Fallback for browsers that don't support all entry types
      console.warn('Some performance metrics not supported:', e);
    }

    // Monitor resource loading
    const resourceObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.duration > 1000) { // Resources taking more than 1s
          console.warn('Slow resource detected:', {
            name: entry.name,
            duration: entry.duration,
            size: (entry as any).transferSize,
          });
        }
      });
    });

    try {
      resourceObserver.observe({ entryTypes: ['resource'] });
    } catch (e) {
      console.warn('Resource monitoring not supported:', e);
    }

    // Monitor long tasks
    const longTaskObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        console.warn('Long task detected:', {
          duration: entry.duration,
          startTime: entry.startTime,
        });
      });
    });

    try {
      longTaskObserver.observe({ entryTypes: ['longtask'] });
    } catch (e) {
      console.warn('Long task monitoring not supported:', e);
    }

    // Cleanup observers
    return () => {
      observer.disconnect();
      resourceObserver.disconnect();
      longTaskObserver.disconnect();
    };
  }, [enabled]);

  // Monitor memory usage (if available)
  useEffect(() => {
    if (!enabled || typeof window === 'undefined' || !(window as any).performance?.memory) return;

    const checkMemory = () => {
      const memory = (window as any).performance.memory;
      const memoryUsage = {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        limit: memory.jsHeapSizeLimit,
      };

      // Warn if memory usage is high
      const usagePercentage = (memoryUsage.used / memoryUsage.limit) * 100;
      if (usagePercentage > 80) {
        console.warn('High memory usage detected:', {
          percentage: usagePercentage.toFixed(2) + '%',
          used: (memoryUsage.used / 1024 / 1024).toFixed(2) + ' MB',
          limit: (memoryUsage.limit / 1024 / 1024).toFixed(2) + ' MB',
        });
      }
    };

    const interval = setInterval(checkMemory, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [enabled]);

  return null; // This component doesn't render anything
}