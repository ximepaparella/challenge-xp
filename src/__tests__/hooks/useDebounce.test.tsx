import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '@/core/hooks/useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should return initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 500));
    expect(result.current).toBe('initial');
  });

  it('should update value after delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    );

    // Change the value
    rerender({ value: 'updated', delay: 500 });

    // Value should not have changed yet
    expect(result.current).toBe('initial');

    // Fast forward time
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Value should be updated
    expect(result.current).toBe('updated');
  });

  it('should not update value before delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    );

    // Change the value
    rerender({ value: 'updated', delay: 500 });

    // Fast forward time but not enough
    act(() => {
      jest.advanceTimersByTime(400);
    });

    // Value should not have changed yet
    expect(result.current).toBe('initial');
  });

  it('should reset timer when value changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    );

    // Change the value
    rerender({ value: 'updated1', delay: 500 });

    // Fast forward time but not enough
    act(() => {
      jest.advanceTimersByTime(400);
    });

    // Change value again
    rerender({ value: 'updated2', delay: 500 });

    // Fast forward time but not enough for second update
    act(() => {
      jest.advanceTimersByTime(400);
    });

    // Value should still be initial
    expect(result.current).toBe('initial');

    // Fast forward remaining time
    act(() => {
      jest.advanceTimersByTime(100);
    });

    // Value should be the second update
    expect(result.current).toBe('updated2');
  });

  it('should cleanup timeout on unmount', () => {
    const clearTimeoutSpy = jest.spyOn(window, 'clearTimeout');
    const { unmount } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    );

    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
    clearTimeoutSpy.mockRestore();
  });
}); 