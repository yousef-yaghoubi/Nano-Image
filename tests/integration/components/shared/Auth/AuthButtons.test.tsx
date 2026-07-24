import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import AuthButtons from '@/components/shared/Auth/AuthButtons';

vi.mock('@/components/shared/Navbar/ProfileIcon', () => ({
  ProfileIcon: () => <div data-testid="profile-icon" />,
}));

describe('AuthButtons', () => {
  it('shows skeleton when isAuthenticated is undefined', () => {
    const { container } = render(<AuthButtons isAuthenticated={undefined} />);
    const skeleton = container.querySelector('[class*="h-10"]');
    expect(skeleton).toBeInTheDocument();
  });

  it('does not show auth buttons when authenticated', () => {
    render(<AuthButtons isAuthenticated={true} />);
    expect(screen.queryByText('signin')).not.toBeInTheDocument();
    expect(screen.queryByText('signup')).not.toBeInTheDocument();
  });

  it('shows sign in and sign up buttons when not authenticated', () => {
    render(<AuthButtons isAuthenticated={false} />);
    expect(screen.getByText('signup')).toBeInTheDocument();
    expect(screen.getByText('signin')).toBeInTheDocument();
  });

  it('applies mobile layout when mobile prop is true', () => {
    const { container } = render(
      <AuthButtons isAuthenticated={false} mobile />
    );
    const firstChild = container.firstChild as HTMLElement;
    expect(firstChild.className).toContain('flex-col');
  });
});
