import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebounce } from "./useDebounse";
import { ActiveFilter } from "@/types/filter";

export function useFilterState() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Initialize state from URL
  const [selectedTags, setSelectedTags] = useState<string[]>(() => {
    const tags = searchParams.get('tags');
    return tags ? tags.split(',').filter(Boolean) : [];
  });

  const [searchQuery, setSearchQuery] = useState<string>(() => {
    return searchParams.get('search') || '';
  });

  // Debounced values
  const debouncedTags = useDebounce(selectedTags, 500);
  const debouncedSearch = useDebounce(searchQuery, 500);

  // Sync URL with state
  useEffect(() => {
    const params = new URLSearchParams();

    if (debouncedTags.length > 0) {
      params.set('tags', debouncedTags.join(','));
    }

    if (debouncedSearch.trim()) {
      params.set('search', debouncedSearch.trim());
    }

    const queryString = params.toString();
    router.push(`?${queryString}`, { scroll: false });
  }, [debouncedTags, debouncedSearch, router]);

  // Generate active filters for display
  const activeFilters: ActiveFilter[] = [
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
  ];

  return {
    selectedTags,
    setSelectedTags,
    searchQuery,
    setSearchQuery,
    activeFilters,
  };
}