import { describe, it, expect, vi, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTableState } from '@/components/shared/Table/useTableState';

describe('useTableState', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns default state', () => {
    const { result } = renderHook(() => useTableState());
    expect(result.current.page).toBe(1);
    expect(result.current.limit).toBe(5);
    expect(result.current.search).toBe('');
    expect(result.current.sortString).toBeUndefined();
  });

  it('updates page with onPageChange', () => {
    const { result } = renderHook(() => useTableState());
    act(() => result.current.onPageChange(3));
    expect(result.current.page).toBe(3);
  });

  it('resets page to 1 when limit changes', () => {
    const { result } = renderHook(() => useTableState());
    act(() => result.current.onPageChange(3));
    act(() => result.current.onLimitChange(10));
    expect(result.current.limit).toBe(10);
    expect(result.current.page).toBe(1);
  });

  it('resets page to 1 when sorting changes', () => {
    const { result } = renderHook(() => useTableState());
    act(() => result.current.onPageChange(3));
    act(() => result.current.onSortingChange([{ id: 'title', desc: false }]));
    expect(result.current.page).toBe(1);
    expect(result.current.sortString).toBe('title asc');
  });

  it('builds sortString correctly', () => {
    const { result } = renderHook(() => useTableState());
    act(() =>
      result.current.onSortingChange([{ id: 'createdAt', desc: true }])
    );
    expect(result.current.sortString).toBe('date desc');
  });

  it('debounces search input', () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useTableState());

    act(() => result.current.setSearchInput('test'));
    expect(result.current.search).toBe('');

    act(() => vi.advanceTimersByTime(400));
    expect(result.current.search).toBe('test');
  });

  it('handles filter change', () => {
    const { result } = renderHook(() => useTableState());
    act(() => result.current.onFilterChange('status', 'True'));
    expect(result.current.filterValue).toBe('True');
    act(() => result.current.onFilterChange('status', 'All'));
    expect(result.current.filterValue).toBeUndefined();
  });
});
