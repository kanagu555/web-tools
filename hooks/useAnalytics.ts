"use client";

import { useCallback, useMemo } from "react";
import {
  trackEvent,
  trackToolUsage,
  trackFileOperation,
  trackSearch,
  trackPWAEvent,
  trackThemeChange,
  trackError,
} from "@/lib/analytics/googleAnalytics";

/**
 * Custom hook for analytics tracking
 * Provides unified interface for tracking events using Google Analytics and Firebase
 */
export const useAnalytics = () => {
  // Track tool usage
  const trackTool = useCallback((toolName: string, action: string = "use") => {
    // Google Analytics
    trackToolUsage(toolName, action);

    // Optional: Add Firebase Analytics here if needed
    // trackFirebaseEvent('tool_usage', { tool_name: toolName, action });
  }, []);

  // Track file operations
  const trackFile = useCallback(
    (operation: string, fileType: string, success: boolean = true) => {
      // Google Analytics
      trackFileOperation(operation, fileType, success);

      // Optional: Add Firebase Analytics here if needed
      // trackFirebaseEvent('file_operation', { operation, fileType, success });
    },
    []
  );

  // Track search events
  const trackSearchEvent = useCallback(
    (searchTerm: string, resultCount?: number) => {
      // Google Analytics
      trackSearch(searchTerm, resultCount);

      // Optional: Add Firebase Analytics here if needed
      // trackFirebaseEvent('search', { searchTerm, resultCount });
    },
    []
  );

  // Track PWA events
  const trackPWA = useCallback(
    (action: "install_prompt" | "install_success" | "install_dismiss") => {
      // Google Analytics
      trackPWAEvent(action);

      // Optional: Add Firebase Analytics here if needed
      // trackFirebaseEvent('pwa_event', { action });
    },
    []
  );

  // Track theme changes
  const trackTheme = useCallback((theme: "light" | "dark") => {
    // Google Analytics
    trackThemeChange(theme);

    // Optional: Add Firebase Analytics here if needed
    // trackFirebaseEvent('theme_change', { theme });
  }, []);

  // Track errors
  const trackErrorEvent = useCallback(
    (error: string, fatal: boolean = false) => {
      // Google Analytics
      trackError(error, fatal);

      // Optional: Add Firebase Analytics here if needed
      // trackFirebaseEvent('error', { error, fatal });
    },
    []
  );

  // Track custom events
  const trackCustomEvent = useCallback(
    (action: string, category: string, label?: string, value?: number) => {
      // Google Analytics
      trackEvent(action, category, label, value);

      // trackFirebaseEvent('custom_event', { action, category, label, value, ...metadata });
    },
    []
  );

  // Track page views (for SPA navigation)
  const trackPageView = useCallback((page: string, title?: string) => {
    // Google Analytics handles page views automatically
    // Optional: Add Firebase Analytics here if needed
    // trackFirebaseEvent('page_view', { page, title });

    // For now, just log for debugging
    console.debug("Page view tracked:", { page, title });
  }, []);

  // Track user engagement
  const trackEngagement = useCallback(
    (
      type: "scroll" | "click" | "focus" | "time_on_page",
      value?: number
      // Removing unused parameter but keeping comment for future implementation
      // metadata?: Record<string, any>
    ) => {
      // Google Analytics for engagement tracking
      trackEvent("engagement", type, undefined, value);

      // Optional: Add Firebase Analytics here if needed
      // trackFirebaseEvent('user_engagement', { type, value, ...metadata });
    },
    []
  );

  return useMemo(
    () => ({
      trackTool,
      trackFile,
      trackSearch: trackSearchEvent,
      trackPWA,
      trackTheme,
      trackError: trackErrorEvent,
      trackCustomEvent,
      trackPageView,
      trackEngagement,
    }),
    [
      trackTool,
      trackFile,
      trackSearchEvent,
      trackPWA,
      trackTheme,
      trackErrorEvent,
      trackCustomEvent,
      trackPageView,
      trackEngagement,
    ]
  );
};
