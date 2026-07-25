import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import { Suspense } from 'react';
import AuthButtons from '@/components/shared/Auth/AuthButtons';

vi.mock('@/components/shared/Navbar/ProfileIcon', () => ({
  ProfileIcon: () => <div data-testid="profile-icon" />,
}));

const clerkAuthState = { isAuthenticated: false as boolean | undefined, userId: null as string | null };
vi.mock('@clerk/nextjs/server', () => ({
  auth: () => Promise.resolve(clerkAuthState),
}));

describe('AuthButtons', () => {
  beforeEach(() => {
    clerkAuthState.isAuthenticated = false;
  });

  it('shows sign in and sign up buttons when not authenticated', async () => {
    clerkAuthState.isAuthenticated = false;
    await act(async () => {
      render(
        <Suspense fallback={<div>Loading...</div>}>
          <AuthButtons />
        </Suspense>
      );
    });
    await waitFor(() => {
      expect(screen.getByText('signup')).toBeInTheDocument();
    });
    expect(screen.getByText('signin')).toBeInTheDocument();
  });
});
