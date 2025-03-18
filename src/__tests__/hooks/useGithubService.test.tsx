import { renderHook } from '@testing-library/react';
import { useGithubService } from '@/features/users/hooks/useGithubService';
import { useApiClientInstance } from '@/core/hooks/useApiClientInstance';
import { GithubService } from '@/features/users/services/GithubService';

// Mock dependencies
jest.mock('@/core/hooks/useApiClientInstance');
jest.mock('@/features/users/services/GithubService');

describe('useGithubService', () => {
  const mockApiClient = {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useApiClientInstance as jest.Mock).mockReturnValue(mockApiClient);
    (GithubService as jest.MockedClass<typeof GithubService>).mockClear();
  });

  it('should create a GithubService instance with the API client', () => {
    const { result } = renderHook(() => useGithubService());

    expect(GithubService).toHaveBeenCalledWith(mockApiClient);
    expect(result.current).toBeInstanceOf(GithubService);
  });

  it('should memoize the GithubService instance', () => {
    const { result, rerender } = renderHook(() => useGithubService());
    const firstInstance = result.current;

    // Rerender the hook
    rerender();
    const secondInstance = result.current;

    // Should be the same instance
    expect(firstInstance).toBe(secondInstance);
    // Constructor should only be called once
    expect(GithubService).toHaveBeenCalledTimes(1);
  });

  it('should create new instance when API client changes', () => {
    const { result, rerender } = renderHook(() => useGithubService());
    const firstInstance = result.current;

    // Change the API client
    const newMockApiClient = { ...mockApiClient };
    (useApiClientInstance as jest.Mock).mockReturnValue(newMockApiClient);

    // Rerender the hook
    rerender();
    const secondInstance = result.current;

    // Should be different instances
    expect(firstInstance).not.toBe(secondInstance);
    // Constructor should be called twice
    expect(GithubService).toHaveBeenCalledTimes(2);
    // Second call should use new client
    expect(GithubService).toHaveBeenLastCalledWith(newMockApiClient);
  });
}); 