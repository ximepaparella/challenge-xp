import { renderHook } from '@testing-library/react';
import { useApiClientInstance } from '@/core/hooks/useApiClientInstance';
import { ApiClient } from '@/core/api/ApiClient';

// Mock ApiClient
jest.mock('@/core/api/ApiClient');

describe('useApiClientInstance', () => {
  const originalEnv = process.env;
  const consoleError = console.error;

  beforeEach(() => {
    // Clear localStorage
    localStorage.clear();
    // Clear mocks
    jest.clearAllMocks();
    // Reset environment
    process.env = { ...originalEnv };
    // Mock console.error
    console.error = jest.fn();
  });

  afterEach(() => {
    // Restore environment
    process.env = originalEnv;
    // Restore console.error
    console.error = consoleError;
  });

  it('should create ApiClient with correct base configuration', () => {
    const { result } = renderHook(() => useApiClientInstance());

    expect(ApiClient).toHaveBeenCalledWith({
      baseUrl: 'https://api.github.com',
      tokenProvider: expect.any(Function),
      onError: expect.any(Function)
    });
    expect(result.current).toBeInstanceOf(ApiClient);
  });

  it('should memoize the ApiClient instance', () => {
    const { result, rerender } = renderHook(() => useApiClientInstance());
    const firstInstance = result.current;

    // Rerender the hook
    rerender();
    const secondInstance = result.current;

    expect(firstInstance).toBe(secondInstance);
    expect(ApiClient).toHaveBeenCalledTimes(1);
  });

  it('should get token from localStorage if available', () => {
    // Set token in localStorage
    localStorage.setItem('github_token', 'test-token');

    const { result } = renderHook(() => useApiClientInstance());
    
    // Get the tokenProvider function from the ApiClient constructor call
    const tokenProvider = (ApiClient as jest.Mock).mock.calls[0][0].tokenProvider;
    const token = tokenProvider();

    expect(token).toBe('test-token');
  });

  it('should get token from environment variable if localStorage is empty', () => {
    // Set environment variable
    process.env = { ...originalEnv, NEXT_PUBLIC_GITHUB_TOKEN: 'env-token' };

    const { result } = renderHook(() => useApiClientInstance());
    
    // Get the tokenProvider function from the ApiClient constructor call
    const tokenProvider = (ApiClient as jest.Mock).mock.calls[0][0].tokenProvider;
    const token = tokenProvider();

    expect(token).toBe('env-token');
  });

  it('should return null if no token is available', () => {
    const { result } = renderHook(() => useApiClientInstance());
    
    // Get the tokenProvider function from the ApiClient constructor call
    const tokenProvider = (ApiClient as jest.Mock).mock.calls[0][0].tokenProvider;
    const token = tokenProvider();

    expect(token).toBeNull();
  });

  it('should log errors in development environment', () => {
    // Mock development environment
    process.env = { ...originalEnv, NODE_ENV: 'development' };

    const { result } = renderHook(() => useApiClientInstance());
    
    // Get the onError function from the ApiClient constructor call
    const onError = (ApiClient as jest.Mock).mock.calls[0][0].onError;
    const error = new Error('Test error');
    const endpoint = '/test';

    // Call onError
    onError(error, endpoint);

    expect(console.error).toHaveBeenCalledWith('API Error (/test):', error);
  });

  it('should not log errors in production environment', () => {
    // Mock production environment
    process.env = { ...originalEnv, NODE_ENV: 'production' };

    const { result } = renderHook(() => useApiClientInstance());
    
    // Get the onError function from the ApiClient constructor call
    const onError = (ApiClient as jest.Mock).mock.calls[0][0].onError;
    const error = new Error('Test error');
    const endpoint = '/test';

    // Call onError
    onError(error, endpoint);

    expect(console.error).not.toHaveBeenCalled();
  });
}); 