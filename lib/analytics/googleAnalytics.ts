/**
 * Google Analytics configuration and utilities for Next.js App Router
 */

// Declare gtag function for TypeScript
declare global {
  interface Window {
    // gtag supports several call signatures (config, event, set, js)
    (command: 'js', time: Date): void;
    (command: 'config' | 'set', targetId: string, config?: Record<string, any>): void;
    (command: 'event', action: string, params?: Record<string, any>): void;
    gtag: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId: string | Date,
      config?: Record<string, any>
    ) => void;
  }
}

// Google Analytics measurement ID from environment variables
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

// Check if Google Analytics is enabled
export const isGAEnabled = !!GA_MEASUREMENT_ID;

/**
 * Initialize Google Analytics
 */
export const initGA = () => {
  if (!isGAEnabled) {
    console.warn('Google Analytics measurement ID not found');
    return;
  }

  // Configure Google Analytics
  window.gtag('config', GA_MEASUREMENT_ID!, {
    page_title: document.title,
    page_location: window.location.href,
  });
};

/**
 * Track page views
 */
export const trackPageView = (url: string, title?: string) => {
  if (!isGAEnabled || typeof window.gtag !== 'function') {
    return;
  }

  window.gtag('config', GA_MEASUREMENT_ID!, {
    page_title: title || document.title,
    page_location: url,
  });
};

/**
 * Track custom events
 */
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number
) => {
  if (!isGAEnabled || typeof window.gtag !== 'function') {
    return;
  }

  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

/**
 * Track tool usage
 */
export const trackToolUsage = (toolName: string, action: string = 'use') => {
  trackEvent(action, 'Tool Usage', toolName);
};

/**
 * Track file operations
 */
export const trackFileOperation = (
  operation: string,
  fileType: string,
  success: boolean = true
) => {
  trackEvent(operation, 'File Operation', `${fileType}_${success ? 'success' : 'error'}`);
};

/**
 * Track search events
 */
export const trackSearch = (searchTerm: string, resultCount?: number) => {
  trackEvent('search', 'Site Search', searchTerm, resultCount);
};

/**
 * Track PWA events
 */
export const trackPWAEvent = (action: 'install_prompt' | 'install_success' | 'install_dismiss') => {
  trackEvent(action, 'PWA', action);
};

/**
 * Track theme changes
 */
export const trackThemeChange = (theme: 'light' | 'dark') => {
  trackEvent('theme_change', 'User Preference', theme);
};

/**
 * Track error events
 */
export const trackError = (error: string, fatal: boolean = false) => {
  trackEvent('exception', 'Error', error, fatal ? 1 : 0);
};