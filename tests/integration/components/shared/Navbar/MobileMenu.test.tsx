import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MobileMenu } from '@/components/shared/Navbar/MobileMenu';

vi.mock('@/components/shared/Navbar/ProfileIcon', () => ({
  ProfileIcon: () => <div data-testid="profile-icon" />,
}));

vi.mock('@/components/shared/Auth/AuthButtons', () => ({
  default: ({ isAuthenticated }: { isAuthenticated?: boolean }) =>
    isAuthenticated ? (
      <div data-testid="auth-authenticated" />
    ) : (
      <div data-testid="auth-unauthenticated">
        <span>signin</span>
        <span>signup</span>
      </div>
    ),
}));

describe('MobileMenu', () => {
  it('renders menu trigger icon', () => {
    render(<MobileMenu isAuthenticated={false} />);
    expect(screen.getByTestId('sheet')).toBeInTheDocument();
  });

  it('renders auth buttons when isAuthenticated is false', () => {
    render(<MobileMenu isAuthenticated={false} />);
    expect(screen.getByText('signin')).toBeInTheDocument();
    expect(screen.getByText('signup')).toBeInTheDocument();
  });

  it('renders sheet when isAuthenticated is true', () => {
    render(<MobileMenu isAuthenticated={true} />);
    expect(screen.getByTestId('sheet')).toBeInTheDocument();
  });
});
