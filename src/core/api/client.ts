// Core API client with interceptors and centralized error handling
import { useState, useEffect } from 'react';

const BASE_URL = 'https://api.github.com';
const DEFAULT_HEADERS: Record<string, string> = {
  'Content-Type': 'application/json',
};

// Request deduplication cache
interface PendingRequest {
  promise: Promise<any>;
  controller: AbortController;
  timestamp: number;
  subscribers: number;
}

// In-memory request cache to prevent duplicate in-flight requests
const pendingRequests: Record<string, PendingRequest> = {};

// Cache for completed requests
interface CacheEntry {
  data: any;
  timestamp: number;
  staleTime: number;
}

// LRU cache for completed requests
const responseCache: Map<string, CacheEntry> = new Map();
const MAX_CACHE_SIZE = 100;

/**
 * Create a cache key from request details
 */
const createCacheKey = (endpoint: string | undefined, params?: Record<string, any>): string => {
  // Handle undefined endpoint
  const safeEndpoint = endpoint || '';
  
  if (!params) return safeEndpoint;
  
  // Convert params to a stable string representation
  const sortedParams = Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null)
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    .map(([key, value]) => `${key}=${String(value)}`)
    .join('&');
  
  return sortedParams ? `${safeEndpoint}?${sortedParams}` : safeEndpoint;
};

/**
 * Add an entry to the response cache with LRU eviction
 */
const addToCache = (key: string, data: any, staleTime = 60000) => {
  // Evict oldest entry if cache is full
  if (responseCache.size >= MAX_CACHE_SIZE) {
    const oldestKeyIterator = responseCache.keys().next();
    if (!oldestKeyIterator.done && oldestKeyIterator.value) {
      responseCache.delete(oldestKeyIterator.value);
    }
  }
  
  responseCache.set(key, {
    data,
    timestamp: Date.now(),
    staleTime,
  });
};

/**
 * Get cached response if still fresh
 */
const getCachedResponse = (key: string): any | null => {
  const entry = responseCache.get(key);
  if (!entry) return null;
  
  const isFresh = Date.now() - entry.timestamp < entry.staleTime;
  if (isFresh) {
    return entry.data;
  }
  
  // Return stale data but mark as stale
  return { data: entry.data, isStale: true };
};

/**
 * Fetch with deduplication, caching, and error handling
 */
export const apiFetch = async <T>(
  endpoint: string | undefined,
  options: {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    params?: Record<string, any>;
    body?: any;
    headers?: Record<string, string>;
    cache?: boolean;
    staleTime?: number;
    retries?: number;
    deduplicate?: boolean;
    signal?: AbortSignal;
  } = {}
): Promise<T> => {
  // Ensure endpoint is defined
  if (!endpoint) {
    throw new Error('Endpoint is required for API requests');
  }
  
  const {
    method = 'GET',
    params,
    body,
    headers = {},
    cache = true,
    staleTime = 60000, // 1 minute default
    retries = 3,
    deduplicate = true,
    signal,
  } = options;
  
  const cacheKey = createCacheKey(endpoint, params);
  
  // Ensure the endpoint starts with a slash if it doesn't already
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  // Build URL with proper query string, ensuring params values are properly converted to strings
  let queryString = '';
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    queryString = searchParams.toString();
    if (queryString) {
      queryString = `?${queryString}`;
    }
  }
  
  const url = `${BASE_URL}${normalizedEndpoint}${queryString}`;

  // Check cache first for GET requests
  if (method === 'GET' && cache) {
    const cachedResponse = getCachedResponse(cacheKey);
    if (cachedResponse && !cachedResponse.isStale) {
      return cachedResponse;
    }
    
    // We'll still use stale data but continue the request in background
  }
  
  // Deduplicate in-flight requests
  if (method === 'GET' && deduplicate && pendingRequests[cacheKey]) {
    const pending = pendingRequests[cacheKey];
    pending.subscribers++;
    
    try {
      const response = await pending.promise;
      return response;
    } finally {
      pending.subscribers--;
      if (pending.subscribers <= 0) {
        delete pendingRequests[cacheKey];
      }
    }
  }
  
  // Setup request with exponential backoff
  let attempt = 0;
  let lastError: Error | null = null;
  
  // Create abort controller for this request
  const controller = new AbortController();
  const requestSignal = signal || controller.signal;
  
  // Setup the fetch promise
  const fetchPromise = (async () => {
    while (attempt < retries) {
      try {
        const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN;
        const allHeaders: Record<string, string> = {
          ...DEFAULT_HEADERS,
          ...headers,
        };
        
        if (token) {
          allHeaders['Authorization'] = `token ${token}`;
        }
        
        const requestOptions: RequestInit = {
          method,
          headers: allHeaders,
          signal: requestSignal,
        };
        
        if (body && method !== 'GET') {
          requestOptions.body = JSON.stringify(body);
        }
        
        const response = await fetch(url, requestOptions);
        
        // Handle rate limiting
        if (response.status === 429) {
          const retryAfter = parseInt(response.headers.get('Retry-After') || '10', 10);
          lastError = new Error(`Rate limited. Retry after ${retryAfter} seconds.`);
          
          // Wait exponentially longer on each retry
          const waitTime = retryAfter * 1000 * Math.pow(1.5, attempt);
          await new Promise(resolve => setTimeout(resolve, waitTime));
          attempt++;
          continue;
        }
        
        // Handle other errors
        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}: ${await response.text()}`);
        }
        
        // Parse and cache successful response
        const data = await response.json();
        
        if (method === 'GET' && cache) {
          addToCache(cacheKey, data, staleTime);
        }
        
        return data as T;
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          throw new Error('Request was aborted');
        }
        
        lastError = error instanceof Error ? error : new Error(String(error));
        
        // Only retry for network errors or 5xx errors
        if (attempt >= retries - 1) {
          throw lastError;
        }
        
        // Exponential backoff
        const backoffTime = Math.min(1000 * Math.pow(2, attempt), 30000); // Max 30s
        await new Promise(resolve => setTimeout(resolve, backoffTime));
        attempt++;
      }
    }
    
    throw lastError || new Error('Request failed after retries');
  })();
  
  // Register as pending request for deduplication
  if (method === 'GET' && deduplicate) {
    pendingRequests[cacheKey] = {
      promise: fetchPromise,
      controller,
      timestamp: Date.now(),
      subscribers: 1,
    };
  }
  
  return fetchPromise;
};

/**
 * Clean up stale pending requests
 */
setInterval(() => {
  const now = Date.now();
  Object.entries(pendingRequests).forEach(([key, request]) => {
    if (now - request.timestamp > 30000) { // 30s timeout
      request.controller.abort();
      delete pendingRequests[key];
    }
  });
}, 15000); // Check every 15s 