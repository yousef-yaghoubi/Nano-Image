import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { useDebounce } from './useDebounse';
import { ActiveFilter } from '@/types/filter';
// import { useTopLoader } from 'nextjs-toploader';

export function useFilterState() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedTags, setSelectedTags] = useState<string[]>(() => {
    const tags = searchParams.get('tags');
    return tags ? tags.split(',').filter(Boolean) : [];
  });

  const [searchQuery, setSearchQuery] = useState(() => {
    return searchParams.get('search') || '';
  });

  const [sortQuery, setSortQuery] = useState(() => {
    return searchParams.get('sort') || '';
  });

  // Debounce values
  const debouncedTags = useDebounce(selectedTags, 500);
  const debouncedSearch = useDebounce(searchQuery, 500);
  const debouncedSort = useDebounce(sortQuery, 500);

  const pathName = usePathname();
  // Sync URL with state
  useEffect(() => {
    // Skip URL update on initial mount to prevent unnecessary navigation

    // const params = new URLSearchParams();
    const params = new URLSearchParams(searchParams);

    // Tags
    if (debouncedTags.length > 0) {
      params.set('tags', debouncedTags.join(','));
    } else {
      params.delete('tags');
    }

    // Search
    if (debouncedSearch.trim()) {
      params.set('search', debouncedSearch.trim());
    } else {
      params.delete('search');
    }

    // Sort
    if (debouncedSort.trim()) {
      params.set('sort', debouncedSort.trim());
    } else {
      params.delete('sort');
    }

    // const newQuery = params.toString();
    // const currentQuery = searchParams.toString();

    // Only update URL if it actually changed
    const url = params ? `?${params}` : pathName;
    router.push(url, { scroll: false });
  }, [debouncedTags, debouncedSearch, debouncedSort]);
  // REMOVED: router, searchParams, loader from dependencies

  // Generate active filters for display
  const activeFilters: ActiveFilter[] = useMemo(
    () => [
      ...debouncedTags.map((tag) => ({
        type: 'tag' as const,
        value: tag,
        displayValue: tag,
      })),
      ...(debouncedSearch.trim()
        ? [
            {
              type: 'search' as const,
              value: debouncedSearch,
              displayValue: `Search: ${debouncedSearch}`,
            },
          ]
        : []),
    ],
    [debouncedTags, debouncedSearch]
  );

  // Helper function to remove a specific filter
  const removeFilter = useCallback((filter: ActiveFilter) => {
    if (filter.type === 'tag') {
      setSelectedTags((prev) => prev.filter((tag) => tag !== filter.value));
    } else if (filter.type === 'search') {
      setSearchQuery('');
    }
  }, []);

  // Helper function to clear all filters
  const clearAllFilters = useCallback(() => {
    setSelectedTags([]);
    setSearchQuery('');
    // Optionally reset sort as well
    // setSortQuery('');
  }, []);

  // Helper function to toggle a tag
  const toggleTag = useCallback((tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }, []);

  return {
    selectedTags,
    setSelectedTags,
    searchQuery,
    setSearchQuery,
    sortQuery,
    setSortQuery,
    activeFilters,
    // Helper functions
    removeFilter,
    clearAllFilters,
    toggleTag,
  };
}
