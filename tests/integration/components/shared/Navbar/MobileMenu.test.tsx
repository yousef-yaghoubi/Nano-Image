import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import { Suspense } from 'react';
import { MobileMenu } from '@/components/shared/Navbar/MobileMenu';

vi.mock('@/components/shared/Navbar/ProfileIcon', () => ({
  ProfileIcon: () => <div data-testid="profile-icon" />,
}));

vi.mock('@/components/shared/Auth/AuthButtons', () => ({
  default: ({ mobile }: { mobile?: boolean }) => (
    <div data-testid="auth-buttons" data-mobile={mobile}>
      <span>signin</span>
      <span>signup</span>
    </div>
  ),
}));

describe('MobileMenu', () => {
  it('renders auth buttons and sheet', async () => {
    await act(async () => {
      render(
        <Suspense fallback={<div>Loading...</div>}>
          <MobileMenu />
        </Suspense>
      );
    });
    await waitFor(() => {
      expect(screen.getByTestId('auth-buttons')).toBeInTheDocument();
    });
    expect(screen.getByTestId('sheet')).toBeInTheDocument();
  });
});
