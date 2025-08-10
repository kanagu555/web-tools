"use client";

import { useCallback, useMemo } from 'react';
import { 
  trackEvent, 
  trackToolUsage, 
  trackFileOperation, 
  trackSearch, 
  trackPWAEvent, 
  trackThemeChange, 
  trackError 
} from '@/lib/analytics/googleAnalytics';
import { trackAnalytics } from '@/lib/supabase/client';

/**
 * Custom hook for analytics tracking
 * Provides unified interface for tracking events across different analytics services
 */
export const useAnalytics = () => {
  // Track tool usage
  const trackTool = useCallback((toolName: string, action: string = 'use') => {
    // Google Analytics
    trackToolUsage(toolName, action);
    
    // Supabase Analytics
    trackAnalytics({
      event_name: 'tool_usage',
      tool_name: toolName,
      metadata: { action },
    });
  }, []);

  // Track file operations
  const trackFile = useCallback((operation: string, fileType: string, success: boolean = true) => {
    // Google Analytics
    trackFileOperation(operation, fileType, success);
    
    // Supabase Analytics
    trackAnalytics({
      event_name: 'file_operation',
      metadata: { operation, fileType, success },
    });
  }, []);

  // Track search events
  const trackSearchEvent = useCallback((searchTerm: string, resultCount?: number) => {
    // Google Analytics
    trackSearch(searchTerm, resultCount);
    
    // Supabase Analytics
    trackAnalytics({
      event_name: 'search',
      metadata: { searchTerm, resultCount },
    });
  }, []);

  // Track PWA events
  const trackPWA = useCallback((action: 'install_prompt' | 'install_success' | 'install_dismiss') => {
    // Google Analytics
    trackPWAEvent(action);
    
    // Supabase Analytics
    trackAnalytics({
      event_name: 'pwa_event',
      metadata: { action },
    });
  }, []);

  // Track theme changes
  const trackTheme = useCallback((theme: 'light' | 'dark') => {
    // Google Analytics
    trackThemeChange(theme);
    
    // Supabase Analytics
    trackAnalytics({
      event_name: 'theme_change',
      metadata: { theme },
    });
  }, []);

  // Track errors
  const trackErrorEvent = useCallback((error: string, fatal: boolean = false) => {
    // Google Analytics
    trackError(error, fatal);
    
    // Supabase Analytics
    trackAnalytics({
      event_name: 'error',
      metadata: { error, fatal },
    });
  }, []);

  // Track custom events
  const trackCustomEvent = useCallback((
    action: string,
    category: string,
    label?: string,
    value?: number,
    metadata?: Record<string, any>
  ) => {
    // Google Analytics
    trackEvent(action, category, label, value);
    
    // Supabase Analytics
    trackAnalytics({
      event_name: 'custom_event',
      metadata: { action, category, label, value, ...metadata },
    });
  }, []);

  // Track page views (for SPA navigation)
  const trackPageView = useCallback((page: string, title?: string) => {
    // Supabase Analytics
    trackAnalytics({
      event_name: 'page_view',
      metadata: { page, title },
    });
  }, []);

  // Track user engagement
  const trackEngagement = useCallback((
    type: 'scroll' | 'click' | 'focus' | 'time_on_page',
    value?: number,
    metadata?: Record<string, any>
  ) => {
    trackAnalytics({
      event_name: 'user_engagement',
      metadata: { type, value, ...metadata },
    });
  }, []);

  return useMemo(() => ({
    trackTool,
    trackFile,
    trackSearch: trackSearchEvent,
    trackPWA,
    trackTheme,
    trackError: trackErrorEvent,
    trackCustomEvent,
    trackPageView,
    trackEngagement,
  }), [
    trackTool,
    trackFile,
    trackSearchEvent,
    trackPWA,
    trackTheme,
    trackErrorEvent,
    trackCustomEvent,
    trackPageView,
    trackEngagement,
  ]);
};