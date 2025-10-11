import { useCallback, useRef } from 'react';

interface UseApiOptimizationOptions {
  debounceMs?: number;
  maxConcurrentRequests?: number;
}

interface RequestQueue {
  [key: string]: {
    promise: Promise<unknown>;
    timestamp: number;
  };
}

// Global request queue to prevent duplicate requests
const requestQueue: RequestQueue = {};
const activeRequests = new Set<string>();

export const useApiOptimization = (options: UseApiOptimizationOptions = {}) => {
  const { debounceMs = 300, maxConcurrentRequests = 5 } = options;
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced function to prevent rapid API calls
  const debouncedCall = useCallback(
    <T>(fn: () => Promise<T>): Promise<T> => {
      return new Promise<T>((resolve, reject) => {
        if (debounceTimeoutRef.current) {
          clearTimeout(debounceTimeoutRef.current);
        }

        debounceTimeoutRef.current = setTimeout(async () => {
          try {
            const result = await fn();
            resolve(result);
          } catch (error) {
            reject(error);
          }
        }, debounceMs);
      });
    },
    [debounceMs]
  );

  // Request deduplication - prevents duplicate requests
  const deduplicatedCall = useCallback(
    <T>(fn: () => Promise<T>, key: string): Promise<T> => {
      // Check if request is already in progress
      if (requestQueue[key]) {
        const timeDiff = Date.now() - requestQueue[key].timestamp;
        // If request is less than 5 seconds old, return existing promise
        if (timeDiff < 5000) {
          return requestQueue[key].promise as Promise<T>;
        }
      }

      // Check concurrent request limit
      if (activeRequests.size >= maxConcurrentRequests) {
        return Promise.reject(new Error('Too many concurrent requests'));
      }

      const promise = fn().finally(() => {
        activeRequests.delete(key);
        delete requestQueue[key];
      }) as Promise<T>;

      requestQueue[key] = {
        promise: promise as Promise<unknown>,
        timestamp: Date.now(),
      };
      activeRequests.add(key);

      return promise;
    },
    [maxConcurrentRequests]
  );

  // Combined optimized call
  const optimizedCall = useCallback(
    <T>(fn: () => Promise<T>, key: string, useDebounce = true): Promise<T> => {
      const callFn = useDebounce ? debouncedCall : deduplicatedCall;
      return callFn(fn, key);
    },
    [debouncedCall, deduplicatedCall]
  );

  // Clear all pending requests
  const clearPendingRequests = useCallback(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    Object.keys(requestQueue).forEach(key => {
      delete requestQueue[key];
    });
    activeRequests.clear();
  }, []);

  return {
    optimizedCall,
    clearPendingRequests,
    activeRequestsCount: activeRequests.size,
  };
};
