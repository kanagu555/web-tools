/**
 * Caching utilities and strategies for Next.js application
 */

// Cache configuration constants
export const CACHE_DURATIONS = {
  STATIC_ASSETS: 31536000, // 1 year
  API_RESPONSES: 300,      // 5 minutes
  PAGES: 3600,            // 1 hour
  FONTS: 31536000,        // 1 year
  IMAGES: 2592000,        // 30 days
} as const;

// Cache headers utility
export function getCacheHeaders(type: keyof typeof CACHE_DURATIONS, options?: {
  staleWhileRevalidate?: number;
  mustRevalidate?: boolean;
}) {
  const maxAge = CACHE_DURATIONS[type];
  const swr = options?.staleWhileRevalidate || maxAge;
  const mustRevalidate = options?.mustRevalidate ? ', must-revalidate' : '';
  
  return {
    'Cache-Control': `public, max-age=${maxAge}, s-maxage=${swr}${mustRevalidate}`,
    'Vary': 'Accept-Encoding',
  };
}

// Browser cache utility
export class BrowserCache {
  private static instance: BrowserCache;
  private cache: Map<string, { data: any; timestamp: number; ttl: number }>;

  private constructor() {
    this.cache = new Map();
  }

  static getInstance(): BrowserCache {
    if (!BrowserCache.instance) {
      BrowserCache.instance = new BrowserCache();
    }
    return BrowserCache.instance;
  }

  set(key: string, data: any, ttlSeconds: number = 300): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlSeconds * 1000,
    });
  }

  get(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;

    const now = Date.now();
    if (now - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

// Local storage cache with expiration
export class LocalStorageCache {
  private prefix: string;

  constructor(prefix: string = 'kodekit_') {
    this.prefix = prefix;
  }

  set(key: string, data: any, ttlSeconds: number = 3600): void {
    if (typeof window === 'undefined') return;

    try {
      const item = {
        data,
        timestamp: Date.now(),
        ttl: ttlSeconds * 1000,
      };
      localStorage.setItem(this.prefix + key, JSON.stringify(item));
    } catch (error) {
      console.warn('Failed to set localStorage item:', error);
    }
  }

  get(key: string): any | null {
    if (typeof window === 'undefined') return null;

    try {
      const itemStr = localStorage.getItem(this.prefix + key);
      if (!itemStr) return null;

      const item = JSON.parse(itemStr);
      const now = Date.now();

      if (now - item.timestamp > item.ttl) {
        this.delete(key);
        return null;
      }

      return item.data;
    } catch (error) {
      console.warn('Failed to get localStorage item:', error);
      return null;
    }
  }

  delete(key: string): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.prefix + key);
  }

  clear(): void {
    if (typeof window === 'undefined') return;
    
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(this.prefix)) {
        localStorage.removeItem(key);
      }
    });
  }
}

// Service Worker cache management
export class ServiceWorkerCache {
  static async cacheResources(cacheName: string, resources: string[]): Promise<void> {
    if ('serviceWorker' in navigator && 'caches' in window) {
      try {
        const cache = await caches.open(cacheName);
        await cache.addAll(resources);
        console.log(`Cached ${resources.length} resources in ${cacheName}`);
      } catch (error) {
        console.warn('Failed to cache resources:', error);
      }
    }
  }

  static async getCachedResponse(request: string | Request): Promise<Response | undefined> {
    if ('caches' in window) {
      try {
        return await caches.match(request);
      } catch (error) {
        console.warn('Failed to get cached response:', error);
      }
    }
    return undefined;
  }

  static async clearCache(cacheName?: string): Promise<void> {
    if ('caches' in window) {
      try {
        if (cacheName) {
          await caches.delete(cacheName);
        } else {
          const cacheNames = await caches.keys();
          await Promise.all(cacheNames.map(name => caches.delete(name)));
        }
      } catch (error) {
        console.warn('Failed to clear cache:', error);
      }
    }
  }
}

// API response caching
export async function cachedFetch(
  url: string,
  options?: RequestInit,
  cacheOptions?: {
    ttl?: number;
    key?: string;
    useLocalStorage?: boolean;
  }
): Promise<any> {
  const cacheKey = cacheOptions?.key || url;
  const ttl = cacheOptions?.ttl || 300; // 5 minutes default
  const useLocalStorage = cacheOptions?.useLocalStorage || false;

  // Try to get from cache first
  const cache = useLocalStorage 
    ? new LocalStorageCache('api_')
    : BrowserCache.getInstance();
  
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  // Fetch from network
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Cache the response
    cache.set(cacheKey, data, ttl);
    
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}

// Preload critical resources
export function preloadCriticalResources(): void {
  if (typeof window === 'undefined') return;

  const criticalResources = [
    '/fonts/inter-var.woff2',
    '/manifest.json',
  ];

  criticalResources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = resource;
    
    if (resource.endsWith('.woff2')) {
      link.as = 'font';
      link.type = 'font/woff2';
      link.crossOrigin = 'anonymous';
    } else if (resource.endsWith('.json')) {
      link.as = 'fetch';
      link.crossOrigin = 'anonymous';
    }
    
    document.head.appendChild(link);
  });
}

// Resource hints for better performance
export function addResourceHints(): void {
  if (typeof window === 'undefined') return;

  // DNS prefetch for external domains
  const domains = [
    'fonts.googleapis.com',
    'fonts.gstatic.com',
    'www.googletagmanager.com',
    'www.google-analytics.com',
    'pagead2.googlesyndication.com',
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