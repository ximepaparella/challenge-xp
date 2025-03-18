import { useCallback, useRef, useState, useEffect } from 'react';

interface RetryOptions {
  /** Maximum number of retry attempts */
  maxRetryAttempts?: number;
  /** Base interval for exponential backoff (ms) */
  baseRetryInterval?: number;
  /** Maximum interval for backoff (ms) */
  maxRetryInterval?: number;
  /** Callback that executes when a retry is initiated */
  onRetry?: (attempt: number, error: Error, backoffTime: number) => void;
}

interface RetryState {
  /** Count of consecutive network errors */
  errorCount: number;
  /** Timestamp of the last error */
  lastErrorTimestamp: number;
  /** Current error (if any) */
  error: Error | null;
  /** Whether we are in a cooldown period */
  isInCooldown: boolean;
}

/**
 * Hook that provides a retry strategy with exponential backoff
 * for API requests that fail.
 */
export function useRetryStrategy({
  maxRetryAttempts = 3,
  baseRetryInterval = 1000,
  maxRetryInterval = 30000,
  onRetry
}: RetryOptions = {}) {
  // State to manage retry status
  const [retryState, setRetryState] = useState<RetryState>({
    errorCount: 0,
    lastErrorTimestamp: 0,
    error: null,
    isInCooldown: false
  });
  
  // References to handle timeouts
  const retryTimeoutsRef = useRef<NodeJS.Timeout[]>([]);
  
  /**
   * Clears all pending timeouts
   */
  const cleanup = useCallback((): void => {
    retryTimeoutsRef.current.forEach(timeoutId => clearTimeout(timeoutId));
    retryTimeoutsRef.current = [];
  }, []);
  
  /**
   * Calculates the backoff time based on the number of attempts
   */
  const calculateBackoffTime = useCallback((errorCount: number): number => {
    // Exponential backoff with jitter to prevent thundering herd
    const expBackoff = baseRetryInterval * Math.pow(2, Math.min(errorCount - 1, 10));
    const jitter = Math.random() * 0.3 * expBackoff; // 30% jitter
    return Math.min(expBackoff + jitter, maxRetryInterval);
  }, [baseRetryInterval, maxRetryInterval]);
  
  /**
   * Handles an error and potentially schedules a retry
   */
  const handleError = useCallback((error: Error, skipRetry = false): void => {
    cleanup(); // Clean up previous timeouts
    
    setRetryState(prev => {
      const newErrorCount = prev.errorCount + 1;
      const now = Date.now();
      
      // Don't retry if explicitly requested or if we've exceeded attempts
      if (!skipRetry && newErrorCount <= maxRetryAttempts) {
        // Calculate backoff time
        const backoffTime = calculateBackoffTime(newErrorCount);
        
        // Notify of retry if there's a callback
        if (onRetry) {
          onRetry(newErrorCount, error, backoffTime);
        }
        
        // Schedule the end of the cooldown period
        const timeoutId = setTimeout(() => {
          setRetryState(prev => ({
            ...prev,
            isInCooldown: false
          }));
        }, backoffTime);
        
        // Save timeout for cleanup
        retryTimeoutsRef.current = [timeoutId];
      }
      
      return {
        errorCount: newErrorCount,
        lastErrorTimestamp: now,
        error,
        isInCooldown: true
      };
    });
  }, [cleanup, calculateBackoffTime, maxRetryAttempts, onRetry]);
  
  /**
   * Resets the retry state
   */
  const resetRetryState = useCallback((): void => {
    cleanup();
    setRetryState({
      errorCount: 0,
      lastErrorTimestamp: 0,
      error: null,
      isInCooldown: false
    });
  }, [cleanup]);
  
  /**
   * Executes a function with automatic retries
   */
  const executeWithRetry = useCallback(async <T,>(
    fn: () => Promise<T>,
    attempt = 0
  ): Promise<T> => {
    try {
      const result = await fn();
      // Success, reset error state
      resetRetryState();
      return result;
    } catch (error) {
      // Handle the error
      const actualError = error instanceof Error ? error : new Error(String(error));
      
      // If we still have attempts available, retry
      if (attempt < maxRetryAttempts) {
        const backoffTime = calculateBackoffTime(attempt + 1);
        
        if (onRetry) {
          onRetry(attempt + 1, actualError, backoffTime);
        }
        
        // Wait before retrying
        await new Promise(resolve => {
          const timeoutId = setTimeout(resolve, backoffTime);
          retryTimeoutsRef.current.push(timeoutId);
        });
        
        // Retry
        return executeWithRetry(fn, attempt + 1);
      }
      
      // No more retries, update state and propagate the error
      handleError(actualError, true);
      throw actualError;
    }
  }, [calculateBackoffTime, handleError, maxRetryAttempts, onRetry, resetRetryState]);
  
  // Clean up timeouts when unmounting
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  // Return state and functions
  return {
    retryState,
    handleError,
    resetRetryState,
    executeWithRetry
  };
} 