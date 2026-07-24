import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useContainerWidth } from '@/hooks/useContainerWidth';

describe('useContainerWidth', () => {
  it('returns ref and width of 0 when disabled', () => {
    const { result } = renderHook(() => useContainerWidth(false));
    expect(result.current.width).toBe(0);
    expect(result.current.containerRef.current).toBeNull();
  });

  it('returns ref when enabled', () => {
    const { result } = renderHook(() => useContainerWidth(true));
    expect(result.current.containerRef.current).toBeDefined();
    expect(typeof result.current.width).toBe('number');
  });
});
