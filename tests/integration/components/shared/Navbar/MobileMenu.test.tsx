import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import { Suspense } from 'react';
import { MobileMenu } from '@/components/shared/Navbar/MobileMenu';

vi.mock('@/components/shared/Navbar/MobileMenuClient', () => ({
  MobileMenuClient: ({
    locale,
    isAuthenticated,
  }: {
    locale: string;
    isAuthenticated: boolean | null;
  }) => (
    <div
      data-testid="mobile-menu-client"
      data-locale={locale}
      data-authenticated={String(isAuthenticated)}
    />
  ),
}));

describe('MobileMenu', () => {
  it('renders MobileMenuClient with locale and auth state', async () => {
    await act(async () => {
      render(
        <Suspense fallback={<div>Loading...</div>}>
          <MobileMenu />
        </Suspense>
      );
    });
    await waitFor(() => {
      const el = screen.getByTestId('mobile-menu-client');
      expect(el).toBeInTheDocument();
      expect(el).toHaveAttribute('data-locale');
      expect(el).toHaveAttribute('data-authenticated');
    });
  });
});
