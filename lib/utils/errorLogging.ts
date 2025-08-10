// Error logging and reporting utilities

export interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  sessionId?: string;
  additionalData?: Record<string, any>;
}

export interface ErrorReport {
  message: string;
  stack?: string;
  digest?: string;
  context: ErrorContext;
  timestamp: string;
  userAgent: string;
  url: string;
  level: 'error' | 'warning' | 'info';
  fingerprint?: string;
}

class ErrorLogger {
  private static instance: ErrorLogger;
  private isProduction = process.env.NODE_ENV === 'production';
  private isDevelopment = process.env.NODE_ENV === 'development';

  static getInstance(): ErrorLogger {
    if (!ErrorLogger.instance) {
      ErrorLogger.instance = new ErrorLogger();
    }
    return ErrorLogger.instance;
  }

  /**
   * Log an error with context information
   */
  logError(
    error: Error | string,
    context: ErrorContext = {},
    level: 'error' | 'warning' | 'info' = 'error'
  ): void {
    const errorReport = this.createErrorReport(error, context, level);
    
    // Always log to console in development
    if (this.isDevelopment) {
      console.error('Error Report:', errorReport);
    }

    // In production, send to error tracking service
    if (this.isProduction) {
      this.sendToErrorService(errorReport);
    }

    // Store locally for debugging
    this.storeLocalError(errorReport);
  }

  /**
   * Log a client-side error boundary error
   */
  logBoundaryError(
    error: Error,
    errorInfo: React.ErrorInfo,
    componentStack?: string
  ): void {
    this.logError(error, {
      component: 'ErrorBoundary',
      additionalData: {
        componentStack: errorInfo.componentStack || componentStack,
        errorBoundary: true,
      },
    });
  }

  /**
   * Log a Next.js page error
   */
  logPageError(
    error: Error & { digest?: string },
    page: string,
    params?: Record<string, any>
  ): void {
    this.logError(error, {
      component: 'NextJSPage',
      action: 'page_render',
      additionalData: {
        page,
        params,
        digest: error.digest,
      },
    });
  }

  /**
   * Log a tool-specific error
   */
  logToolError(
    error: Error,
    toolName: string,
    action: string,
    additionalData?: Record<string, any>
  ): void {
    this.logError(error, {
      component: 'Tool',
      action,
      additionalData: {
        toolName,
        ...additionalData,
      },
    });
  }

  /**
   * Log a network/API error
   */
  logNetworkError(
    error: Error,
    url: string,
    method: string = 'GET',
    statusCode?: number
  ): void {
    this.logError(error, {
      component: 'NetworkRequest',
      action: 'api_call',
      additionalData: {
        url,
        method,
        statusCode,
      },
    });
  }

  /**
   * Create a standardized error report
   */
  private createErrorReport(
    error: Error | string,
    context: ErrorContext,
    level: 'error' | 'warning' | 'info'
  ): ErrorReport {
    const errorObj = typeof error === 'string' ? new Error(error) : error;
    
    return {
      message: errorObj.message,
      stack: errorObj.stack,
      digest: (errorObj as any).digest,
      context,
      timestamp: new Date().toISOString(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
      url: typeof window !== 'undefined' ? window.location.href : 'server',
      level,
      fingerprint: this.generateFingerprint(errorObj, context),
    };
  }

  /**
   * Generate a unique fingerprint for error deduplication
   */
  private generateFingerprint(error: Error, context: ErrorContext): string {
    const key = `${error.message}-${context.component}-${context.action}`;
    return btoa(key).replace(/[^a-zA-Z0-9]/g, '').substring(0, 16);
  }

  /**
   * Send error to external error tracking service
   */
  private sendToErrorService(errorReport: ErrorReport): void {
    try {
      // Example implementations for different services:
      
      // Google Analytics 4 Error Event
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'exception', {
          description: errorReport.message,
          fatal: errorReport.level === 'error',
          custom_map: {
            component: errorReport.context.component,
            action: errorReport.context.action,
          },
        });
      }

      // Sentry (uncomment and configure if using Sentry)
      // if (typeof window !== 'undefined' && (window as any).Sentry) {
      //   (window as any).Sentry.captureException(new Error(errorReport.message), {
      //     tags: {
      //       component: errorReport.context.component,
      //       action: errorReport.context.action,
      //     },
      //     extra: errorReport.context.additionalData,
      //     fingerprint: [errorReport.fingerprint],
      //   });
      // }

      // Custom API endpoint (implement your own error collection)
      // fetch('/api/errors', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(errorReport),
      // }).catch(console.error);

    } catch (reportingError) {
      console.error('Failed to send error report:', reportingError);
    }
  }

  /**
   * Store error locally for debugging
   */
  private storeLocalError(errorReport: ErrorReport): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const key = 'kodekit_errors';
        const stored = localStorage.getItem(key);
        const errors = stored ? JSON.parse(stored) : [];
        
        // Keep only last 50 errors
        errors.push(errorReport);
        if (errors.length > 50) {
          errors.shift();
        }
        
        localStorage.setItem(key, JSON.stringify(errors));
      }
    } catch (storageError) {
      console.error('Failed to store error locally:', storageError);
    }
  }

  /**
   * Get stored errors for debugging
   */
  getStoredErrors(): ErrorReport[] {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const stored = localStorage.getItem('kodekit_errors');
        return stored ? JSON.parse(stored) : [];
      }
    } catch (error) {
      console.error('Failed to retrieve stored errors:', error);
    }
    return [];
  }

  /**
   * Clear stored errors
   */
  clearStoredErrors(): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem('kodekit_errors');
      }
    } catch (error) {
      console.error('Failed to clear stored errors:', error);
    }
  }
}

// Export singleton instance
export const errorLogger = ErrorLogger.getInstance();

// Convenience functions
export const logError = (error: Error | string, context?: ErrorContext) => 
  errorLogger.logError(error, context);

export const logBoundaryError = (error: Error, errorInfo: React.ErrorInfo) => 
  errorLogger.logBoundaryError(error, errorInfo);

export const logPageError = (error: Error & { digest?: string }, page: string, params?: Record<string, any>) => 
  errorLogger.logPageError(error, page, params);

export const logToolError = (error: Error, toolName: string, action: string, additionalData?: Record<string, any>) => 
  errorLogger.logToolError(error, toolName, action, additionalData);

export const logNetworkError = (error: Error, url: string, method?: string, statusCode?: number) => 
  errorLogger.logNetworkError(error, url, method, statusCode);