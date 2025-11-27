import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { useDebounce } from './useDebounse';
import { ActiveFilter } from '@/types/filter';

export function useFilterState() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const isInitialMount = useRef(true);
  const isUpdatingFromURL = useRef(false);

  const [selectedTags, setSelectedTags] = useState<string[]>(() => {
    const tags = searchParams.get('tags');
    return tags ? tags.split(',').filter(Boolean) : [];
  });

  const [searchQuery, setSearchQuery] = useState(() => {
    return searchParams.get('search') || '';
  });

  const [sortQuery, setSortQuery] = useState(() => {
    return searchParams.get('sort') || 'likes desc';
  });

  // Debounce values
  const debouncedTags = useDebounce(selectedTags, 500);
  const debouncedSearch = useDebounce(searchQuery, 500);
  const debouncedSort = useDebounce(sortQuery, 500);

  // استیت‌ها رو با URL سینک کن (وقتی URL از بیرون تغییر میکنه)
  useEffect(() => {
    const urlTags = searchParams.get('tags');
    const urlSearch = searchParams.get('search');
    const urlSort = searchParams.get('sort');

    const newTags = urlTags ? urlTags.split(',').filter(Boolean) : [];
    const newSearch = urlSearch || '';
    const newSort = urlSort || 'likes desc';

    // مقایسه استیت فعلی با URL
    const currentTagsStr = [...selectedTags].sort().join(',');
    const newTagsStr = [...newTags].sort().join(',');
    
    const hasChanges = 
      currentTagsStr !== newTagsStr ||
      searchQuery !== newSearch ||
      sortQuery !== newSort;

    if (hasChanges) {
      isUpdatingFromURL.current = true;
      
      if (currentTagsStr !== newTagsStr) {
        setSelectedTags(newTags);
      }
      if (searchQuery !== newSearch) {
        setSearchQuery(newSearch);
      }
      if (sortQuery !== newSort) {
        setSortQuery(newSort);
      }
      
      // بعد از یه تاخیر کوتاه flag رو reset کن
      setTimeout(() => {
        isUpdatingFromURL.current = false;
      }, 100);
    }
  }, [searchParams]);

  // Sync URL with state (skip initial mount and URL updates)
  useEffect(() => {
    // اگر داره از URL اپدیت میشه، این effect رو اجرا نکن
    if (isUpdatingFromURL.current) {
      return;
    }

    // Skip URL update on initial mount since state is already synced
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const params = new URLSearchParams();

    // Tags
    if (debouncedTags.length > 0) {
      params.set('tags', debouncedTags.join(','));
    }

    // Search
    if (debouncedSearch.trim()) {
      params.set('search', debouncedSearch.trim());
    }

    // Sort (always include if not default)
    if (debouncedSort.trim() && debouncedSort !== 'likes desc') {
      params.set('sort', debouncedSort.trim());
    }

    const newQuery = params.toString();
    const currentQuery = searchParams.toString();

    // Only update URL if it actually changed
    if (newQuery !== currentQuery) {
      const url = newQuery ? `${pathname}?${newQuery}` : pathname;
      router.push(url, { scroll: false });
    }
  }, [debouncedTags, debouncedSearch, debouncedSort, pathname, router, searchParams]);

  // Generate active filters for display
  const activeFilters: ActiveFilter[] = useMemo(
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

  // Helper function to remove a specific filter
  const removeFilter = useCallback((filter: ActiveFilter) => {
    if (filter.type === 'tag') {
      const newTags = selectedTags.filter((tag) => tag !== filter.value);
      setSelectedTags(newTags);
      
      // Immediately update URL when removing tag
      const params = new URLSearchParams(searchParams);
      if (newTags.length > 0) {
        params.set('tags', newTags.join(','));
      } else {
        params.delete('tags');
      }
      
      const newQuery = params.toString();
      const url = newQuery ? `${pathname}?${newQuery}` : pathname;
      router.push(url, { scroll: false });
    } else if (filter.type === 'search') {
      setSearchQuery('');
      
      // Immediately update URL when removing search
      const params = new URLSearchParams(searchParams);
      params.delete('search');
      
      const newQuery = params.toString();
      const url = newQuery ? `${pathname}?${newQuery}` : pathname;
      router.push(url, { scroll: false });
    }
  }, [selectedTags, searchParams, pathname, router]);

  // Helper function to clear all filters
  const clearAllFilters = useCallback(() => {
    setSelectedTags([]);
    setSearchQuery('');
    
    // Immediately clear URL params (keep only sort if it exists)
    const params = new URLSearchParams();
    if (sortQuery && sortQuery !== 'likes desc') {
      params.set('sort', sortQuery);
    }
    
    const newQuery = params.toString();
    const url = newQuery ? `${pathname}?${newQuery}` : pathname;
    router.push(url, { scroll: false });
  }, [sortQuery, pathname, router]);

  // Helper function to toggle a tag
  const toggleTag = useCallback((tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];
    
    setSelectedTags(newTags);
    
    // Immediately update URL when toggling tag
    const params = new URLSearchParams(searchParams);
    
    if (newTags.length > 0) {
      params.set('tags', newTags.join(','));
    } else {
      params.delete('tags');
    }
    
    const newQuery = params.toString();
    const url = newQuery ? `${pathname}?${newQuery}` : pathname;
    router.push(url, { scroll: false });
  }, [selectedTags, searchParams, pathname, router]);

  return {
    selectedTags,
    setSelectedTags,
    searchQuery,
    setSearchQuery,
    sortQuery,
    setSortQuery,
    activeFilters,
    removeFilter,
    clearAllFilters,
    toggleTag,
  };
}