import { describe, it, expect } from 'vitest';
import { queryKeys } from '@/lib/query-keys';

describe('queryKeys', () => {
  it('prompts.all returns base key', () => {
    expect(queryKeys.prompts.all).toEqual(['prompts']);
  });

  it('prompts.lists returns list key', () => {
    expect(queryKeys.prompts.lists()).toEqual(['prompts', 'list']);
  });

  it('prompts.list includes params', () => {
    const key = queryKeys.prompts.list({ page: '1', sort: 'likes desc' });
    expect(key).toEqual(['prompts', 'list', { page: '1', sort: 'likes desc' }]);
  });

  it('prompts.detail returns detail key', () => {
    expect(queryKeys.prompts.detail('id123')).toEqual([
      'prompts',
      'detail',
      'id123',
    ]);
  });

  it('favorites.all returns base key', () => {
    expect(queryKeys.favorites.all).toEqual(['favorites']);
  });

  it('favorites.ids returns ids key', () => {
    expect(queryKeys.favorites.ids()).toEqual(['favorites', 'ids']);
  });

  it('quantities.all returns base key', () => {
    expect(queryKeys.quantities.all).toEqual(['quantities']);
  });

  it('users.all returns base key', () => {
    expect(queryKeys.users.all).toEqual(['users']);
  });

  it('users.list includes params', () => {
    const key = queryKeys.users.list({ page: '2', limit: 10 });
    expect(key).toEqual(['users', 'list', { page: '2', limit: 10 }]);
  });

  it('admin.overview returns admin key', () => {
    expect(queryKeys.admin.overview).toEqual(['admin', 'overview']);
  });
});
