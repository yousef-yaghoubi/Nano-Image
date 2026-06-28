'use client';
import { Dispatch, SetStateAction, useCallback, useMemo } from 'react';
import { DrawerDialog } from '../DrawerDialog';
import ChildFilter from './ChildFilter';
import ButtonFilter from './ButtonFilter';
import SearchBox from '../Form/SearchBox';
import { useFilterState } from '@/hooks/useFilterState';
import { FilterIcon } from 'lucide-react';
import { Sort } from '../SortingData/Sort';
import { useTranslations } from 'next-intl';
import { FILTERING_OPTIONS } from '@/lib/data';

interface FilterDrawerProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  selectedTags: string[];
  setSelectedTags: Dispatch<SetStateAction<string[]>>;
  activeFiltersCount: number;
}

function FilterDrawer({
  searchQuery,
  setSearchQuery,
  selectedTags,
  setSelectedTags,
  activeFiltersCount,
  children,
}: React.PropsWithChildren<FilterDrawerProps>) {
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value),
    [setSearchQuery]
  );
  const tFilter = useTranslations('Filter.filter');

  return (
    <DrawerDialog
      title={tFilter('name')}
      desc={tFilter('description')}
      trigger={
        <button
          className="flex cursor-pointer items-center gap-2 text-lg font-medium"
          aria-label="Open filters"
        >
          <FilterIcon size={20} />
          {tFilter('name')}
          {activeFiltersCount > 0 && (
            <span className="bg-primary text-primary-foreground ml-1 rounded-full px-2 py-0.5 text-xs">
              {activeFiltersCount}
            </span>
          )}
        </button>
      }
    >
      <section className="z-10 overflow-scroll px-10 py-6">
        <SearchBox
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder={tFilter('searchPlaceholder')}
        />
        <div className="mt-6 space-y-6">
          {FILTERING_OPTIONS.map((filterGroup) => (
            <ChildFilter
              key={filterGroup.id}
              filter={filterGroup}
              tags={selectedTags}
              setTags={setSelectedTags}
            />
          ))}
        </div>
        {children}
      </section>
    </DrawerDialog>
  );
}

// ==========================
// Main FilterSort Component
// ==========================
export function FilterSort() {
  const {
    selectedTags,
    setSelectedTags,
    searchQuery,
    setSearchQuery,
    activeFilters,
    removeFilter,
    clearAllFilters,
    sortQuery,
    setSortQuery,
  } = useFilterState();

  const activeFilterCount = useMemo(
    () => activeFilters.length,
    [activeFilters.length]
  );
  const t = useTranslations('data');

  return (
    <div className="w-full space-y-5">
      <div className="flex w-full flex-wrap items-center justify-between gap-4">
        <FilterDrawer
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
          activeFiltersCount={activeFilterCount}
        />
        <Sort sortQuery={sortQuery} setSortQuery={setSortQuery} />
      </div>

      {activeFilterCount > 0 && (
        <div className="mt-3">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-primary text-lg font-bold md:text-2xl">
              {t('activeFilter')} ({activeFilterCount})
            </h2>
            <button
              onClick={clearAllFilters}
              className="cursor-pointer text-sm font-medium text-red-600 transition-colors hover:text-red-700"
              aria-label="Clear all filters"
            >
              {t('clearAll')}
            </button>
          </div>
          <div className="flex flex-wrap gap-3">
            {activeFilters.map((filter) => (
              <ButtonFilter
                key={`${filter.type}-${filter.value}`}
                option={filter.displayValue}
                tags={activeFilters.map((f) => f.displayValue)}
                setTags={() => removeFilter(filter)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
