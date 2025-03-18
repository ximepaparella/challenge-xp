import { useCallback, useMemo, useRef } from 'react';

interface PendingRequests {
  [key: string]: Promise<unknown>;
}

interface RequestTimestamps {
  [key: string]: number;
}

interface UseDeduplicationOptions {
  /** Cooldown time between duplicate requests (ms) */
  cooldownTime?: number;
}

/**
 * Hook that provides functionality to deduplicate API requests
 * and manage cooldown periods to prevent overload.
 */
export function useDeduplication({ cooldownTime = 2000 }: UseDeduplicationOptions = {}) {
  // References for tracking in-flight requests and timestamps
  const pendingRequestsRef = useRef<PendingRequests>({});
  const lastRequestTimestampsRef = useRef<RequestTimestamps>({});

  // Ensure objects don't change between renders
  const pendingRequests = useMemo(() => pendingRequestsRef.current, []);
  const lastRequestTimestamps = useMemo(() => lastRequestTimestampsRef.current, []);

  /**
   * Checks if there is a pending request for the specified key
   */
  const hasPendingRequest = useCallback((requestKey: string): boolean => {
    return !!pendingRequests[requestKey];
  }, [pendingRequests]);

  /**
   * Checks if we are in a cooldown period for the specified key
   */
  const isInCooldown = useCallback((requestKey: string): boolean => {
    const lastRequestTime = lastRequestTimestamps[requestKey] || 0;
    const now = Date.now();
    return now - lastRequestTime < cooldownTime;
  }, [cooldownTime, lastRequestTimestamps]);

  /**
   * Executes a function with deduplication to prevent simultaneous calls
   */
  const executeWithDeduplication = useCallback(async <T,>(
    requestKey: string,
    requestFn: () => Promise<T>
  ): Promise<T> => {
    // If there's already a request in progress for this key, return the existing promise
    if (requestKey in pendingRequests) {
      return pendingRequests[requestKey] as Promise<T>;
    }

    // Check if we're in a cooldown period
    if (isInCooldown(requestKey)) {
      throw new Error(`Request on cooldown for: ${requestKey}`);
    }

    // Execute the request and store the promise
    try {
      // Create a promise and store it
      const promise = requestFn();
      pendingRequests[requestKey] = promise;
      
      // Record the time of this request
      lastRequestTimestamps[requestKey] = Date.now();
      
      // Wait for the result
      const result = await promise;
      return result;
    } catch (error) {
      throw error;
    } finally {
      // Clean up the reference once completed (success or error)
      delete pendingRequests[requestKey];
    }
  }, [isInCooldown, lastRequestTimestamps, pendingRequests]);

  /**
   * Manually clears references to a specific request
   */
  const clearRequest = useCallback((requestKey: string): void => {
    delete pendingRequests[requestKey];
  }, [pendingRequests]);

  /**
   * Clears all request records
   */
  const clearAllRequests = useCallback((): void => {
    Object.keys(pendingRequests).forEach(key => {
      delete pendingRequests[key];
    });
  }, [pendingRequests]);

  return {
    executeWithDeduplication,
    hasPendingRequest,
    isInCooldown,
    clearRequest,
    clearAllRequests
  };
} 