import { ActiveFilter } from '@/types/filter';
import { useDebounce } from './useDebounse';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

function arraysEqual(a: string[], b: string[]) {
  if (a.length !== b.length) return false;

  const sortedA = [...a].sort();
  const sortedB = [...b].sort();

  return sortedA.every((item, index) => item === sortedB[index]);
}

export function useFilterState() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isMounted = useRef(false);

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortQuery, setSortQuery] = useState('likes desc');

  const debouncedTags = useDebounce(selectedTags, 500);
  const debouncedSearch = useDebounce(searchQuery, 500);
  const debouncedSort = useDebounce(sortQuery, 500);

  useEffect(() => {
    const tags = searchParams.get('tags')?.split(',').filter(Boolean) ?? [];

    const search = searchParams.get('search') ?? '';
    const sort = searchParams.get('sort') ?? 'likes desc';

    setSelectedTags((prev) => (arraysEqual(prev, tags) ? prev : tags));

    setSearchQuery((prev) => (prev === search ? prev : search));

    setSortQuery((prev) => (prev === sort ? prev : sort));
  }, [searchParams]);

  /**
   * Skip first render
   */
  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }

    const params = new URLSearchParams();

    if (debouncedTags.length) {
      params.set('tags', debouncedTags.join(','));
    }

    if (debouncedSearch.trim()) {
      params.set('search', debouncedSearch.trim());
    }

    if (debouncedSort !== 'likes desc') {
      params.set('sort', debouncedSort);
    }

    const current = searchParams.toString();
    const next = params.toString();

    if (current === next) return;

    router.replace(next ? `${pathname}?${next}` : pathname, {
      scroll: false,
    });
  }, [debouncedTags, debouncedSearch, debouncedSort, pathname, router]);

  const toggleTag = useCallback((tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }, []);

  const removeFilter = useCallback((filter: ActiveFilter) => {
    if (filter.type === 'tag') {
      setSelectedTags((prev) => prev.filter((tag) => tag !== filter.value));
    }

    if (filter.type === 'search') {
      setSearchQuery('');
    }
  }, []);

  const clearAllFilters = useCallback(() => {
    setSelectedTags([]);
    setSearchQuery('');
  }, []);

  const activeFilters = useMemo<ActiveFilter[]>(
    () => [
      ...selectedTags.map((tag) => ({
        type: 'tag' as const,
        value: tag,
        displayValue: tag,
      })),
      ...(searchQuery.trim()
        ? [
            {
              type: 'search' as const,
              value: searchQuery,
              displayValue: `Search: ${searchQuery}`,
            },
          ]
        : []),
    ],
    [selectedTags, searchQuery]
  );

  return {
    selectedTags,
    setSelectedTags,

    searchQuery,
    setSearchQuery,

    sortQuery,
    setSortQuery,

    activeFilters,

    toggleTag,
    removeFilter,
    clearAllFilters,
  };
}
