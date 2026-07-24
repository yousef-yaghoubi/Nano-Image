import { describe, it, expect } from 'vitest';
import { CacheTags, CacheLife } from '@/lib/cache';

describe('CacheTags', () => {
  it('has expected tag values', () => {
    expect(CacheTags.prompts).toBe('prompts');
    expect(CacheTags.users).toBe('users');
    expect(CacheTags.favorites).toBe('favorites');
    expect(CacheTags.quantities).toBe('quantities');
    expect(CacheTags.admin).toBe('admin');
  });
});

describe('CacheLife', () => {
  it('has expected preset values', () => {
    expect(CacheLife.FAST).toBe('seconds');
    expect(CacheLife.NORMAL).toBe('minutes');
    expect(CacheLife.SLOW).toBe('hours');
    expect(CacheLife.STATIC).toBe('max');
  });
});
