import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getBaseUrl } from '@/lib/baseUrl';

describe('getBaseUrl', () => {
  beforeEach(() => {
    vi.stubEnv('NEXT_PUBLIC_BASE_URL', 'http://localhost:3000');
  });

  it('returns NEXT_PUBLIC_BASE_URL env var', () => {
    expect(getBaseUrl()).toBe('http://localhost:3000');
  });

  it('returns undefined when env var is not set', () => {
    vi.stubEnv('NEXT_PUBLIC_BASE_URL', '');
    expect(getBaseUrl()).toBe('');
  });
});
