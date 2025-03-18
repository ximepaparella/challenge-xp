import { renderHook, act } from '@testing-library/react';
import { useGlobalState } from '@/core/hooks/useGlobalState';

describe('useGlobalState', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    // Reset modules to clear global state
    jest.resetModules();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should have initial state with no errors', () => {
    const { result } = renderHook(() => useGlobalState());
    const state = result.current.getNetworkErrorState();

    expect(state.isErrorActive).toBe(false);
    expect(state.isInCooldown).toBe(false);
    expect(state.lastErrorTime).toBe(0);
    expect(state.cooldownUntil).toBe(0);
  });

  it('should set network error with default cooldown', () => {
    const { result } = renderHook(() => useGlobalState());
    const now = Date.now();

    act(() => {
      result.current.setNetworkError();
    });

    const state = result.current.getNetworkErrorState();
    expect(state.isErrorActive).toBe(true);
    expect(state.isInCooldown).toBe(true);
    expect(state.lastErrorTime).toBeGreaterThanOrEqual(now);
    expect(state.cooldownUntil).toBeGreaterThanOrEqual(now + 5000);
  });

  it('should set network error with custom cooldown', () => {
    const { result } = renderHook(() => useGlobalState());
    const now = Date.now();
    const customCooldown = 10000;

    act(() => {
      result.current.setNetworkError(customCooldown);
    });

    const state = result.current.getNetworkErrorState();
    expect(state.isErrorActive).toBe(true);
    expect(state.isInCooldown).toBe(true);
    expect(state.lastErrorTime).toBeGreaterThanOrEqual(now);
    expect(state.cooldownUntil).toBeGreaterThanOrEqual(now + customCooldown);
  });

  it('should clear error state after cooldown period', () => {
    const { result } = renderHook(() => useGlobalState());
    const cooldownMs = 5000;

    act(() => {
      result.current.setNetworkError(cooldownMs);
    });

    // Verify error is active
    expect(result.current.getNetworkErrorState().isErrorActive).toBe(true);

    // Fast forward just before cooldown ends
    act(() => {
      jest.advanceTimersByTime(cooldownMs - 1);
    });

    // Error should still be active
    expect(result.current.getNetworkErrorState().isErrorActive).toBe(true);

    // Fast forward to end of cooldown
    act(() => {
      jest.advanceTimersByTime(1);
    });

    // Error should be cleared
    expect(result.current.getNetworkErrorState().isErrorActive).toBe(false);
  });

  it('should manually clear network error', () => {
    const { result } = renderHook(() => useGlobalState());

    act(() => {
      result.current.setNetworkError();
    });

    // Verify error is active
    expect(result.current.getNetworkErrorState().isErrorActive).toBe(true);

    act(() => {
      result.current.clearNetworkError();
    });

    const state = result.current.getNetworkErrorState();
    expect(state.isErrorActive).toBe(false);
    expect(state.isInCooldown).toBe(false);
    expect(state.cooldownUntil).toBe(0);
  });

  it('should share state between multiple hook instances', () => {
    const { result: instance1 } = renderHook(() => useGlobalState());
    const { result: instance2 } = renderHook(() => useGlobalState());

    act(() => {
      instance1.current.setNetworkError();
    });

    // Both instances should reflect the error state
    expect(instance1.current.getNetworkErrorState().isErrorActive).toBe(true);
    expect(instance2.current.getNetworkErrorState().isErrorActive).toBe(true);

    act(() => {
      instance2.current.clearNetworkError();
    });

    // Both instances should reflect the cleared state
    expect(instance1.current.getNetworkErrorState().isErrorActive).toBe(false);
    expect(instance2.current.getNetworkErrorState().isErrorActive).toBe(false);
  });

  it('should maintain cooldown when error is set multiple times', () => {
    const { result } = renderHook(() => useGlobalState());
    const cooldownMs = 5000;

    act(() => {
      result.current.setNetworkError(cooldownMs);
    });

    const firstCooldownUntil = result.current.getNetworkErrorState().cooldownUntil;

    // Fast forward half the cooldown
    act(() => {
      jest.advanceTimersByTime(cooldownMs / 2);
    });

    // Set another error
    act(() => {
      result.current.setNetworkError(cooldownMs);
    });

    const secondCooldownUntil = result.current.getNetworkErrorState().cooldownUntil;

    // The second cooldown should be later than the first
    expect(secondCooldownUntil).toBeGreaterThan(firstCooldownUntil);
  });
}); 