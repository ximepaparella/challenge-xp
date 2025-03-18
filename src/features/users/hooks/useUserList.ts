import { useCallback, useEffect, useRef, useState } from 'react';
import { User, GithubSearchResult } from '../types';
import { useGithubService } from './useGithubService';
import { useGithubCache, useDeduplication, useRetryStrategy, usePagination } from '@/core/hooks';

interface UseUserListProps {
  favorites?: User[];
  showFavorites?: boolean;
}

interface UseUserListReturn {
  users: User[];
  loading: boolean;
  searchUsers: (query: string) => Promise<void>;
  loadMoreUsers: () => Promise<void>;
  hasMore: boolean;
  error: Error | null;
}

/**
 * Hook for managing GitHub users list
 */
export function useUserList({
  favorites = [],
  showFavorites = false
}: UseUserListProps = {}): UseUserListReturn {
  // State to control search query
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // References to track component state
  const isMountedRef = useRef(true);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  // Flag to control if initial load has been performed
  const isFirstMountRef = useRef(true);
  
  // Refactored hooks
  const githubService = useGithubService();
  const cache = useGithubCache();
  const deduplication = useDeduplication();
  const retryStrategy = useRetryStrategy({
    maxRetryAttempts: 2,
    onRetry: (attempt, error, backoffTime) => {
      // Removed console.log
    }
  });
  
  // Function to search users based on GitHub service
  const fetchUsers = useCallback(async (
    query: string, 
    page: number,
    itemsPerPage: number
  ): Promise<GithubSearchResult> => {
    // Removed console.log
    
    // Create a unique key for this request (without timestamp to be able to reuse cache)
    const cacheKey = `users_${query}_${page}_${itemsPerPage}`;
    // Removed console.log
    
    // Check cache first (for all pages)
    const cachedData = cache.getCachedData<GithubSearchResult>(cacheKey);
    if (cachedData) {
      // Removed console.log
      return cachedData;
    }
    
    try {
      // Removed console.log
      // Try to get data with deduplication
      const result = await deduplication.executeWithDeduplication<GithubSearchResult>(
        cacheKey,
        async () => {
          // Removed console.log
          // If showing favorites, filter them instead of calling API
          if (showFavorites) {
            // Removed console.log
            const queryLower = query.toLowerCase().trim();
            
            const filteredFavorites = favorites.filter(user => {
              if (!queryLower) return true; // If no query, show all favorites
              
              // Search in multiple user fields
              return (
                user.login.toLowerCase().includes(queryLower) || 
                (user.name && user.name.toLowerCase().includes(queryLower)) ||
                (user.bio && user.bio.toLowerCase().includes(queryLower)) ||
                (user.location && user.location.toLowerCase().includes(queryLower)) ||
                (user.company && user.company.toLowerCase().includes(queryLower))
              );
            });
            
            // Removed console.log
            return {
              total_count: filteredFavorites.length,
              incomplete_results: false,
              items: filteredFavorites
            };
          }
          
          // Standard case: search users through service
          // Removed console.log
          return await githubService.searchUsers(query, page, itemsPerPage);
        }
      );
      
      // Save result in cache
      // Removed console.log
      cache.setCachedData(cacheKey, result);
      
      return result;
    } catch (error) {
      // Removed console.error
      // If in cooldown, return empty result
      if (deduplication.isInCooldown(cacheKey)) {
        // Removed console.log
        return { 
          items: [], 
          total_count: 0, 
          incomplete_results: true 
        };
      }
      
      // Propagate error for pagination hook to handle
      throw error;
    }
  }, [cache, deduplication, favorites, githubService, showFavorites]);
  
  // Initialize pagination hook with our search function
  const pagination = usePagination<User>({
    fetchItems: async (page, itemsPerPage) => {
      try {
        const result = await fetchUsers(searchQuery, page, itemsPerPage);
        return {
          items: result.items,
          total: result.total_count
        };
      } catch (error) {
        // Handle error with our retry strategy
        retryStrategy.handleError(error instanceof Error ? error : new Error(String(error)));
        throw error;
      }
    },
    options: {
      initialPage: 1,
      itemsPerPage: 10,
      getItemId: (user: User) => user.id
    }
  });
  
  // Function to search users (exposed to component)
  const searchUsers = useCallback(async (query: string) => {
    // Removed console.log
    
    // Clear any previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Update search query
    setSearchQuery(query);
    
    // Indicate that we're loading
    pagination.setIsLoading(true);
    
    try {
      // If showing favorites and empty query, show all favorites
      if (showFavorites && query.trim() === '') {
        // Removed console.log
        pagination.reset(favorites, favorites.length);
        return;
      }
      
      // Start search from page 1
      const result = await fetchUsers(query, 1, 10);
      
      // Update pagination with results
      pagination.reset(result.items, result.total_count);
    } catch (error) {
      // Errors are already handled by fetchUsers and pagination
      pagination.setError(error instanceof Error ? error : new Error(String(error)));
    } finally {
      pagination.setIsLoading(false);
    }
  }, [favorites, fetchUsers, pagination, showFavorites]);
  
  // Handle initial load
  useEffect(() => {
    isMountedRef.current = true;
    const currentSearchTimeout = searchTimeoutRef.current;

    // Only do initial load on first mount and if not showing favorites
    if (isFirstMountRef.current) {
      isFirstMountRef.current = false;
      
      if (!showFavorites) {
        // Removed console.log
        searchUsers('');
      } else {
        // If we're on favorites page, use passed favorites without making a request
        // Removed console.log
        pagination.reset(favorites, favorites.length);
      }
    }

    return () => {
      // Removed console.log
      isMountedRef.current = false;
      if (currentSearchTimeout) {
        clearTimeout(currentSearchTimeout);
      }
    };
  }, [favorites, pagination, searchUsers, showFavorites]);
  
  // Return necessary values
  return {
    users: pagination.items,
    loading: pagination.isLoading,
    hasMore: pagination.hasMore,
    loadMoreUsers: pagination.loadMore,
    searchUsers,
    error: pagination.error || retryStrategy.retryState.error
  };
} 