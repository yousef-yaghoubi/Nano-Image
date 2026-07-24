import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useResponsiveSlidesPerView } from '@/hooks/useResponsiveSlidesPerView';

describe('useResponsiveSlidesPerView', () => {
  it('returns slidesPerView when autoResponsive is disabled', async () => {
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    const { result } = renderHook(() =>
      useResponsiveSlidesPerView(
        { autoResponsive: false, slidesPerView: 3 },
        0,
        10
      )
    );
    await waitFor(() => expect(result.current).toBe(3));
  });

  it('calculates based on container width when autoResponsive is enabled', async () => {
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    const { result } = renderHook(() =>
      useResponsiveSlidesPerView(
        { autoResponsive: true, minSlideWidth: 200 },
        1000,
        10
      )
    );
    await waitFor(() => expect(result.current).toBe(5));
  });
});
