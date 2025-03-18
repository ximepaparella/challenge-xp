import { renderHook, act } from '@testing-library/react';
import { useDeduplication } from '@/core/hooks/useDeduplication';

describe('useDeduplication', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should have initial state with no pending requests', () => {
    const { result } = renderHook(() => useDeduplication());
    
    expect(result.current.hasPendingRequest('test')).toBe(false);
    expect(result.current.isInCooldown('test')).toBe(false);
  });

  it('should deduplicate concurrent requests', async () => {
    const { result } = renderHook(() => useDeduplication());
    const mockFn = jest.fn().mockResolvedValue('result');
    const requestKey = 'test';

    // Start first request
    const promise1 = result.current.executeWithDeduplication(requestKey, mockFn);
    
    // Request should be pending after first call
    expect(result.current.hasPendingRequest(requestKey)).toBe(true);

    // Start second request
    const promise2 = result.current.executeWithDeduplication(requestKey, mockFn);

    // Both promises should resolve to the same value
    const [result1, result2] = await Promise.all([promise1, promise2]);
    expect(result1).toBe(result2);

    // Function should only be called once
    expect(mockFn).toHaveBeenCalledTimes(1);

    // Request should no longer be pending after completion
    expect(result.current.hasPendingRequest(requestKey)).toBe(false);
  });

  it('should enforce cooldown period', async () => {
    const cooldownTime = 5000;
    const { result } = renderHook(() => useDeduplication({ cooldownTime }));
    const mockFn = jest.fn().mockResolvedValue('result');
    const requestKey = 'test';

    // First request should succeed
    await result.current.executeWithDeduplication(requestKey, mockFn);

    // Second request during cooldown should fail
    await expect(
      result.current.executeWithDeduplication(requestKey, mockFn)
    ).rejects.toThrow('Request on cooldown');

    // Advance time past cooldown
    act(() => {
      jest.advanceTimersByTime(cooldownTime);
    });

    // Request after cooldown should succeed
    await result.current.executeWithDeduplication(requestKey, mockFn);

    expect(mockFn).toHaveBeenCalledTimes(2);
  });

  it('should handle request errors', async () => {
    const { result } = renderHook(() => useDeduplication());
    const error = new Error('Test error');
    const mockFn = jest.fn().mockRejectedValue(error);
    const requestKey = 'test';

    // Request should fail
    await act(async () => {
      try {
        await result.current.executeWithDeduplication(requestKey, mockFn);
      } catch (e) {
        expect(e).toBe(error);
      }
    });

    // Request should not be pending after error
    expect(result.current.hasPendingRequest(requestKey)).toBe(false);

    // Should still be in cooldown
    expect(result.current.isInCooldown(requestKey)).toBe(true);

    // Verify that subsequent requests during cooldown fail
    await expect(
      result.current.executeWithDeduplication(requestKey, mockFn)
    ).rejects.toThrow('Request on cooldown');
  });

  it('should clear specific request', async () => {
    const { result } = renderHook(() => useDeduplication());
    const mockFn = jest.fn().mockResolvedValue('result');
    const requestKey = 'test';

    // Start a request
    const promise = result.current.executeWithDeduplication(requestKey, mockFn);

    // Request should be pending
    expect(result.current.hasPendingRequest(requestKey)).toBe(true);

    // Clear the request
    result.current.clearRequest(requestKey);

    // Request should no longer be pending
    expect(result.current.hasPendingRequest(requestKey)).toBe(false);

    // Wait for the original promise to complete
    await promise;
  });

  it('should clear all requests', async () => {
    const { result } = renderHook(() => useDeduplication());
    const mockFn = jest.fn().mockResolvedValue('result');

    // Start multiple requests
    const promise1 = result.current.executeWithDeduplication('test1', mockFn);
    const promise2 = result.current.executeWithDeduplication('test2', mockFn);

    // Requests should be pending
    expect(result.current.hasPendingRequest('test1')).toBe(true);
    expect(result.current.hasPendingRequest('test2')).toBe(true);

    // Clear all requests
    result.current.clearAllRequests();

    // No requests should be pending
    expect(result.current.hasPendingRequest('test1')).toBe(false);
    expect(result.current.hasPendingRequest('test2')).toBe(false);

    // Wait for the original promises to complete
    await Promise.all([promise1, promise2]);
  });

  it('should maintain separate cooldowns for different keys', async () => {
    const cooldownTime = 5000;
    const { result } = renderHook(() => useDeduplication({ cooldownTime }));
    const mockFn = jest.fn().mockResolvedValue('result');

    // First request for key1
    await result.current.executeWithDeduplication('key1', mockFn);
    expect(result.current.isInCooldown('key1')).toBe(true);
    expect(result.current.isInCooldown('key2')).toBe(false);

    // Request for key2 should succeed while key1 is in cooldown
    await result.current.executeWithDeduplication('key2', mockFn);
    expect(result.current.isInCooldown('key1')).toBe(true);
    expect(result.current.isInCooldown('key2')).toBe(true);

    // Advance time past cooldown
    act(() => {
      jest.advanceTimersByTime(cooldownTime);
    });

    // Neither key should be in cooldown
    expect(result.current.isInCooldown('key1')).toBe(false);
    expect(result.current.isInCooldown('key2')).toBe(false);
  });
}); 