import { describe, it, expect, vi } from 'vitest';

import '../helpers/msw-setup';

vi.mock('@clerk/nextjs', () => ({
  useUser: () => ({
    user: { id: 'test_user_1', firstName: 'Test', lastName: 'User' },
  }),
  useAuth: () => ({ userId: 'test_user_1', isSignedIn: true, isLoaded: true }),
  SignInButton: ({ children }: { children: React.ReactNode }) => <button type="button">{children}</button>,
  SignUpButton: ({ children }: { children: React.ReactNode }) => <button type="button">{children}</button>,
  UserButton: () => <div data-testid="user-button" />,
  ClerkProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('MSW Integration', () => {
  it('fetches prompts from API', async () => {
    const res = await fetch('http://localhost:3000/api/prompts?page=1&limit=10');
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.length).toBeGreaterThan(0);
    expect(json.data[0].title).toBeDefined();
  });

  it('fetches users from API', async () => {
    const res = await fetch('http://localhost:3000/api/users?page=1&limit=10');
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.length).toBeGreaterThan(0);
    expect(json.data[0].firstName).toBeDefined();
  });

  it('fetches favorites from API', async () => {
    const res = await fetch('http://localhost:3000/api/favorites?page=1&limit=10');
    const json = await res.json();
    expect(json.success).toBe(true);
  });

  it('fetches favorites IDs from API', async () => {
    const res = await fetch('http://localhost:3000/api/favorites/ids');
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(Array.isArray(json.data)).toBe(true);
  });

  it('fetches admin overview from API', async () => {
    const res = await fetch('http://localhost:3000/api/admin/overview');
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.totalPrompts).toBe(150);
  });

  it('fetches prompts quantity from API', async () => {
    const res = await fetch('http://localhost:3000/api/prompts/quantity');
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.totalPrompts).toBe(150);
  });

  it('filters prompts by status', async () => {
    const res = await fetch(
      'http://localhost:3000/api/prompts?status=True&page=1&limit=10'
    );
    const json = await res.json();
    expect(json.success).toBe(true);
    for (const p of json.data) {
      expect(p.status).toBe('True');
    }
  });

  it('searches prompts by query', async () => {
    const res = await fetch(
      'http://localhost:3000/api/prompts?search=cyberpunk&page=1&limit=10'
    );
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.length).toBeGreaterThan(0);
  });
});
