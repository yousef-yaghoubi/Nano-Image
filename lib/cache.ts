import {
  cacheLife,
  cacheTag,
  revalidatePath,
  updateTag,
} from 'next/cache';

// Re-export cache primitives for use inside `"use cache"` functions
export { cacheLife, cacheTag, revalidatePath };


export const CacheTags = {
  prompts: 'prompts',
  users: 'users',
  favorites: 'favorites',
  quantities: 'quantities',
} as const;

export type CacheTag = (typeof CacheTags)[keyof typeof CacheTags];

/**
 * Cache-life presets. These map to the built-in Next.js profiles.
 * Use them inside a `"use cache"` function via `cacheLife(...)`.
 *
 *  - `CacheLife.FAST`   → 'seconds' : stale 30s,  revalidate 1s,  expire 1m
 *  - `CacheLife.NORMAL` → 'minutes' : stale 5m,   revalidate 1m,  expire 1h
 *  - `CacheLife.SLOW`   → 'hours'   : stale 5m,   revalidate 1h,  expire 1d
 *  - `CacheLife.STATIC` → 'max'     : stale 5m,   revalidate 30d, expire never
 */
export const CacheLife = {
  FAST: 'seconds',
  NORMAL: 'minutes',
  SLOW: 'hours',
  STATIC: 'max',
} as const;

export type CacheLifeProfile =
  | (typeof CacheLife)[keyof typeof CacheLife]
  | 'default'
  | 'days'
  | 'weeks';


export function bustCache(...tags: CacheTag[]) {
  tags.forEach((tag) => {
    updateTag(tag);
  });
}
