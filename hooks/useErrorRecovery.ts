'use client';

import { useCallback, useEffect, useState } from 'react';
import { logError } from '@/lib/utils/errorLogging';

interface ErrorRecoveryOptions {
  maxRetries?: number;
  retryDelay?: number;
  onError?: (error: Error, attempt: number) => void;
  onSuccess?: () => void;
  onMaxRetriesReached?: () => void;
}

interface ErrorRecoveryState {
  isRetrying: boolean;
  retryCount: number;
  lastError: Error | null;
  hasReachedMaxRetries: boolean;
}

/**
 * Hook for handling error recovery with automatic retry logic
 */
export function useErrorRecovery(options: ErrorRecoveryOptions = {}) {
  const {
    maxRetries = 3,
    retryDelay = 1000,
    onError,
    onSuccess,
    onMaxRetriesReached,
  } = options;

  const [state, setState] = useState<ErrorRecoveryState>({
    isRetrying: false,
    retryCount: 0,
    lastError: null,
    hasReachedMaxRetries: false,
  });

  /**
   * Execute a function with automatic retry logic
   */
  const executeWithRetry = useCallback(
    async <T>(
      fn: () => Promise<T>,
      context?: { component?: string; action?: string }
    ): Promise<T> => {
      let attempt = 0;
      
      while (attempt <= maxRetries) {
        try {
          setState(prev => ({ 
            ...prev, 
            isRetrying: attempt > 0,
            retryCount: attempt,
          }));

          const result = await fn();
          
          // Success - reset state
          setState({
            isRetrying: false,
            retryCount: 0,
            lastError: null,
            hasReachedMaxRetries: false,
          });
          
          onSuccess?.();
          return result;
          
        } catch (error) {
          const errorObj = error instanceof Error ? error : new Error(String(error));
          
          setState(prev => ({ 
            ...prev, 
            lastError: errorObj,
            retryCount: attempt,
          }));

          // Log the error
          logError(errorObj, {
            ...context,
            additionalData: {
              attempt: attempt + 1,
              maxRetries,
              willRetry: attempt < maxRetries,
            },
          });

          onError?.(errorObj, attempt + 1);

          if (attempt >= maxRetries) {
            setState(prev => ({ 
              ...prev, 
              isRetrying: false,
              hasReachedMaxRetries: true,
            }));
            onMaxRetriesReached?.();
            throw errorObj;
          }

          // Wait before retrying
          if (retryDelay > 0) {
            await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)));
          }
          
          attempt++;
        }
      }

      throw new Error('Unexpected end of retry loop');
    },
    [maxRetries, retryDelay, onError, onSuccess, onMaxRetriesReached]
  );

  /**
   * Reset the error recovery state
   */
  const reset = useCallback(() => {
    setState({
      isRetrying: false,
      retryCount: 0,
      lastError: null,
      hasReachedMaxRetries: false,
    });
  }, []);

  /**
   * Manual retry function
   */
  const retry = useCallback(
    async <T>(fn: () => Promise<T>, context?: { component?: string; action?: string }) => {
      reset();
      return executeWithRetry(fn, context);
    },
    [executeWithRetry, reset]
  );

  return {
    ...state,
    executeWithRetry,
    retry,
    reset,
  };
}

/**
 * Hook for handling component-level error boundaries
 */
export function useErrorBoundary() {
  const [error, setError] = useState<Error | null>(null);

  const captureError = useCallback((error: Error, context?: { component?: string }) => {
    logError(error, context);
    setError(error);
  }, []);

  const resetError = useCallback(() => {
    setError(null);
  }, []);

  // Throw error to trigger error boundary
  if (error) {
    throw error;
  }

  return {
    captureError,
    resetError,
  };
}

/**
 * Hook for handling async operations with error recovery
 */
export function useAsyncWithErrorRecovery<T>(
  asyncFn: () => Promise<T>,
  dependencies: React.DependencyList = [],
  options: ErrorRecoveryOptions & { 
    immediate?: boolean;
    context?: { component?: string; action?: string };
  } = {}
) {
  const { immediate = true, context, ...recoveryOptions } = options;
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const recovery = useErrorRecovery({
    ...recoveryOptions,
    onError: (err, attempt) => {
      setError(err);
      recoveryOptions.onError?.(err, attempt);
    },
    onSuccess: () => {
      setError(null);
      recoveryOptions.onSuccess?.();
    },
  });

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await recovery.executeWithRetry(asyncFn, context);
      setData(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [asyncFn, recovery, context]);

  useEffect(() => {
    if (immediate) {
      execute().catch(() => {
        // Error is already handled in the execute function
      });
    }
  }, dependencies);

  return {
    data,
    loading,
    error,
    execute,
    reset: () => {
      setData(null);
      setError(null);
      recovery.reset();
    },
    // Recovery methods
    isRetrying: recovery.isRetrying,
    retryCount: recovery.retryCount,
    lastError: recovery.lastError,
    hasReachedMaxRetries: recovery.hasReachedMaxRetries,
    retry: recovery.retry,
    executeWithRetry: recovery.executeWithRetry,
  };
}

/**
 * Hook for handling network requests with error recovery
 */
export function useNetworkWithErrorRecovery(
  url: string,
  options: RequestInit = {},
  recoveryOptions: ErrorRecoveryOptions & { context?: { component?: string; action?: string } } = {}
) {
  return useAsyncWithErrorRecovery(
    async () => {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return response.json();
    },
    [url, JSON.stringify(options)],
    {
      ...recoveryOptions,
      context: {
        component: 'NetworkRequest',
        action: 'fetch',
        ...recoveryOptions.context,
      },
    }
  );
}