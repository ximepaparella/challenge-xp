import { renderHook, act } from '@testing-library/react';
import { useUserList } from '../../features/users/hooks/useUserList';
import { useGithubService } from '../../features/users/hooks/useGithubService';
import { GithubService } from '../../features/users/services/GithubService';
import { User } from '../../features/users/types';
import { FavoritesProvider } from '../../features/favorites/context/FavoritesContext';
import React from 'react';

// Mock all required hooks
jest.mock('../../features/users/hooks/useGithubService');
jest.mock('../../core/hooks/useGithubCache', () => ({
  useGithubCache: () => ({
    getCachedData: jest.fn(),
    setCachedData: jest.fn(),
    clearCache: jest.fn()
  })
}));

jest.mock('../../core/hooks/useDeduplication', () => ({
  useDeduplication: () => ({
    executeWithDeduplication: jest.fn((key, fn) => fn()),
    isInCooldown: jest.fn().mockReturnValue(false)
  })
}));

jest.mock('../../core/hooks/useRetryStrategy', () => ({
  useRetryStrategy: () => ({
    handleError: jest.fn(),
    cleanup: jest.fn(),
    retryState: { error: null }
  })
}));

interface PaginationOptions {
  initialPage: number;
  itemsPerPage: number;
  getItemId: (item: User) => number;
}

interface FetchResult {
  items: User[];
}

jest.mock('../../core/hooks/usePagination', () => ({
  usePagination: ({ fetchItems, options }: { 
    fetchItems: (page: number, itemsPerPage: number) => Promise<FetchResult>;
    options: PaginationOptions;
  }) => {
    const [items, setItems] = React.useState<User[]>([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState<Error | null>(null);

    const loadMore = async () => {
      setIsLoading(true);
      try {
        const result = await fetchItems(1, options.itemsPerPage);
        setItems(result.items);
      } catch (e) {
        setError(e instanceof Error ? e : new Error(String(e)));
      } finally {
        setIsLoading(false);
      }
    };

    const reset = (newItems: User[]) => {
      setItems(newItems);
    };

    return {
      items,
      isLoading,
      error,
      loadMore,
      reset,
      hasMore: true,
      setIsLoading,
      setError
    };
  }
}));

const mockUsers = [
  { id: 1, login: 'user1', avatar_url: 'url1' },
  { id: 2, login: 'user2', avatar_url: 'url2' }
] as User[];

const mockUsersPage2 = [
  { id: 3, login: 'user3', avatar_url: 'url3' },
  { id: 4, login: 'user4', avatar_url: 'url4' }
] as User[];

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <FavoritesProvider>
    {children}
  </FavoritesProvider>
);

describe('useUserList', () => {
  let mockGithubService: GithubService;

  beforeEach(() => {
    mockGithubService = {
      searchUsers: jest.fn().mockResolvedValue({ 
        items: mockUsers, 
        total_count: 4,
        incomplete_results: false 
      }),
      getUser: jest.fn().mockResolvedValue(mockUsers[0]),
      getUserRepos: jest.fn().mockResolvedValue([]),
      getUsers: jest.fn().mockResolvedValue(mockUsers),
      getUserFollowers: jest.fn().mockResolvedValue([]),
      getUserFollowing: jest.fn().mockResolvedValue([]),
      apiClient: {} as { get: (url: string) => Promise<unknown> }
    } as unknown as GithubService;

    // Mock the hook
    (useGithubService as jest.Mock).mockReturnValue(mockGithubService);

    // Reset mocks
    jest.clearAllMocks();
  });

  it('should initialize with empty state', async () => {
    const { result } = renderHook(() => useUserList({}), { wrapper });

    expect(result.current.users).toEqual([]);
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBe(null);

    // Wait for initial load
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.users).toEqual(mockUsers);
  });

  it('should handle search queries', async () => {
    const { result } = renderHook(() => useUserList({}), { wrapper });

    // Wait for initial load
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Search for users
    await act(async () => {
      await result.current.searchUsers('test');
    });

    expect(mockGithubService.searchUsers).toHaveBeenCalledWith('test', 1, 10);
    expect(result.current.users).toEqual(mockUsers);
  });

  it('should handle empty search query', async () => {
    const { result } = renderHook(() => useUserList({}), { wrapper });

    // Wait for initial load
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Search with empty string
    await act(async () => {
      await result.current.searchUsers('');
    });

    expect(mockGithubService.searchUsers).toHaveBeenCalledWith('', 1, 10);
    expect(result.current.users).toEqual(mockUsers);
  });

  it('should filter favorites correctly', async () => {
    const { result } = renderHook(() => useUserList({ 
      favorites: mockUsers,
      showFavorites: true 
    }), { wrapper });

    // Wait for initial load
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.users).toEqual(mockUsers);
  });

  it('should handle pagination correctly', async () => {
    const { result } = renderHook(() => useUserList({}), { wrapper });

    // Wait for initial load
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Mock the second page response
    (mockGithubService.searchUsers as jest.Mock).mockResolvedValueOnce({ 
      items: mockUsersPage2, 
      total_count: 4,
      incomplete_results: false 
    });

    // Load more users
    await act(async () => {
      await result.current.loadMoreUsers();
    });

    expect(result.current.users).toEqual(mockUsersPage2);
    expect(result.current.hasMore).toBe(true);
  });
}); 