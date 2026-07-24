import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { renderHook, act } from '@testing-library/react';
import { SidebarProvider, useSidebar } from '@/context/SidebarContext';

describe('SidebarProvider', () => {
  it('throws when useSidebar is used outside provider', () => {
    expect(() => renderHook(() => useSidebar())).toThrow(
      'useSidebar must be used within a SidebarProvider'
    );
  });

  it('provides initial context values', () => {
    const { result } = renderHook(() => useSidebar(), {
      wrapper: SidebarProvider,
    });
    expect(result.current.isExpanded).toBe(true);
    expect(result.current.isMobileOpen).toBe(false);
    expect(result.current.isMobile).toBe(false);
    expect(result.current.isHovered).toBe(false);
    expect(result.current.activeItem).toBeNull();
    expect(result.current.openSubmenu).toBeNull();
  });

  it('toggles sidebar', () => {
    const { result } = renderHook(() => useSidebar(), {
      wrapper: SidebarProvider,
    });
    act(() => result.current.toggleSidebar());
    expect(result.current.isExpanded).toBe(false);
    act(() => result.current.toggleSidebar());
    expect(result.current.isExpanded).toBe(true);
  });

  it('toggles mobile sidebar', () => {
    const { result } = renderHook(() => useSidebar(), {
      wrapper: SidebarProvider,
    });
    act(() => result.current.toggleMobileSidebar());
    expect(result.current.isMobileOpen).toBe(true);
  });

  it('toggles submenu', () => {
    const { result } = renderHook(() => useSidebar(), {
      wrapper: SidebarProvider,
    });
    act(() => result.current.toggleSubmenu('settings'));
    expect(result.current.openSubmenu).toBe('settings');
    act(() => result.current.toggleSubmenu('settings'));
    expect(result.current.openSubmenu).toBeNull();
  });

  it('wraps children', () => {
    render(
      <SidebarProvider>
        <div data-testid="child">Content</div>
      </SidebarProvider>
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });
});
