import { describe, it, expect } from 'vitest';
import {
  favoriteQuerySchema,
  promptsQuerySchema,
  usersQuerySchema,
} from '@/validation/DTO';

describe('favoriteQuerySchema', () => {
  it('uses defaults for empty input', async () => {
    const result = await favoriteQuerySchema.validate({});
    expect(result.page).toBe(1);
    expect(result.limit).toBe(24);
    expect(result.sort).toBe('likes desc');
  });

  it('accepts valid sort values', async () => {
    const result = await favoriteQuerySchema.validate({ sort: 'date asc' });
    expect(result.sort).toBe('date asc');
  });

  it('rejects invalid sort values', async () => {
    await expect(
      favoriteQuerySchema.validate({ sort: 'invalid' })
    ).rejects.toThrow();
  });
});

describe('promptsQuerySchema', () => {
  it('uses defaults for empty input', async () => {
    const result = await promptsQuerySchema.validate({});
    expect(result.page).toBe(1);
    expect(result.limit).toBe(24);
    expect(result.sort).toBe('likes desc');
  });

  it('transforms undefined search to null', async () => {
    const result = await promptsQuerySchema.validate({ search: 'undefined' });
    expect(result.search).toBeNull();
  });

  it('accepts valid status values', async () => {
    const result = await promptsQuerySchema.validate({ status: 'True' });
    expect(result.status).toBe('True');
  });

  it('rejects invalid status values', async () => {
    const result = await promptsQuerySchema.validate({ status: 'Invalid' });
    expect(result.status).toBeNull();
  });

  it('trims search input', async () => {
    const result = await promptsQuerySchema.validate({ search: '  hello  ' });
    expect(result.search).toBe('hello');
  });
});

describe('usersQuerySchema', () => {
  it('uses defaults for empty input', async () => {
    const result = await usersQuerySchema.validate({});
    expect(result.page).toBe(1);
    expect(result.limit).toBe(24);
    expect(result.sort).toBe('firstName desc');
  });

  it('accepts valid role values', async () => {
    const result = await usersQuerySchema.validate({ role: 'ADMIN' });
    expect(result.role).toBe('ADMIN');
  });

  it('rejects invalid role values', async () => {
    const result = await usersQuerySchema.validate({ role: 'Invalid' });
    expect(result.role).toBeNull();
  });

  it('accepts valid sort for users', async () => {
    const result = await usersQuerySchema.validate({ sort: 'date asc' });
    expect(result.sort).toBe('date asc');
  });
});
