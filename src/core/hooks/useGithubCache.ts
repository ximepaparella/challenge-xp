import { useCallback, useMemo, useEffect } from 'react';

// Cache configuration
const DEFAULT_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes default
const MAX_CACHE_ITEMS = 50; // Maximum number of items in cache
const CACHE_CLEANUP_INTERVAL = 30000; // 30 seconds between cleanups

interface CacheItem<T> {
  data: T;
  timestamp: number;
  key: string;
}

interface CacheState {
  [key: string]: CacheItem<unknown>;
}

/**
 * Hook that provides functions to manage the cache for GitHub data.
 * Allows storing and retrieving data with an expiration time.
 */
export function useGithubCache(expirationTime = DEFAULT_CACHE_DURATION) {
  // We use useMemo to ensure the cache object is the same between renders
  const cache = useMemo<CacheState>(() => ({}), []);
  
  // Clean old cache entries
  const cleanCache = useCallback(() => {
    const now = Date.now();
    const keys = Object.keys(cache);
    
    if (keys.length === 0) return; // Do nothing if cache is empty
    
    // Remove expired entries
    let expiredCount = 0;
    keys.forEach(key => {
      const item = cache[key];
      if (now - item.timestamp > expirationTime) {
        delete cache[key];
        expiredCount++;
      }
    });
    
    // Only if there are too many entries after removing expired ones
    if (expiredCount === 0 && keys.length > MAX_CACHE_ITEMS) {
      const sortedEntries = keys
        .map(key => cache[key])
        .sort((a, b) => a.timestamp - b.timestamp);
      
      const toRemove = sortedEntries.slice(0, sortedEntries.length - MAX_CACHE_ITEMS);
      toRemove.forEach(item => {
        delete cache[item.key];
      });
    }
  }, [cache, expirationTime]);
  
  // Clean the cache periodically, but less frequently
  useEffect(() => {
    // We use a fixed longer interval, independent of expiration time
    const interval = setInterval(cleanCache, CACHE_CLEANUP_INTERVAL);
    return () => clearInterval(interval);
  }, [cleanCache]);

  /**
   * Gets data from cache if it exists and hasn't expired
   * @param key - The cache key to retrieve
   * @returns The cached data or null if not found or expired
   */
  const getCachedData = useCallback(<T>(key: string): T | null => {
    const cachedItem = cache[key];
    if (!cachedItem) return null;
    
    const now = Date.now();
    const isExpired = now - cachedItem.timestamp > expirationTime;
    
    if (isExpired) {
      delete cache[key];
      return null;
    }
    
    return cachedItem.data as T;
  }, [cache, expirationTime]);

  /**
   * Stores data in the cache with the current timestamp
   * @param key - The cache key
   * @param data - The data to cache
   */
  const setCachedData = useCallback(<T>(key: string, data: T): void => {
    cache[key] = {
      data,
      timestamp: Date.now(),
      key
    };
    
    // Clean cache if we have too many entries
    if (Object.keys(cache).length > MAX_CACHE_ITEMS * 1.5) {
      cleanCache();
    }
  }, [cache, cleanCache]);

  /**
   * Removes a specific item from the cache
   * @param key - The cache key to remove
   */
  const removeCachedData = useCallback((key: string): void => {
    delete cache[key];
  }, [cache]);

  /**
   * Clears the entire cache
   */
  const clearCache = useCallback((): void => {
    Object.keys(cache).forEach(key => {
      delete cache[key];
    });
  }, [cache]);

  return {
    getCachedData,
    setCachedData,
    removeCachedData,
    clearCache
  };
} 