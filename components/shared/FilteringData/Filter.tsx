'use client';

import { useCallback } from 'react';
import ChildFilter from './ChildFilter';
import ButtonFilter from './ButtonFilter';
import SearchBox from '../SearchBox';
import { ActiveFilter, FilterOption } from '@/types/filter';
import { useFilterState } from '@/hooks/useFilterState';
import { DrawerDialog } from '../DrawerDialog';

const FILTERING_OPTIONS: FilterOption[] = [
  {
    id: 1,
    label: 'Artistic Styles',
    options: [
      'Realistic',
      'Cinematic',
      'Anime',
      'Architecture',
      'Cartoon',
      '3D Render',
      'Vector',
      'Watercolor',
      'Sketch / Line Art',
      'Oil Painting',
      'Abstract',
      'Surreal',
      'Fashion',
      'Photography',
      'Portrait',
    ],
  },
  {
    id: 2,
    label: 'Corporate & professional',
    options: [
      'Corporate',
      'Business',
      'Minimalist',
      'Modern',
      'Product / Poster',
      'Logo',
      'Infographic',
      'Concept art',
    ],
  },
  {
    id: 3,
    label: 'Genre & themes',
    options: ['Fantasy', 'Sci-Fi', 'Cyberpunk', 'Retro / Vintage', 'Grunge'],
  },
  {
    id: 4,
    label: 'Mood & tone',
    options: ['Vibrant / Colorful', 'Dark / Moody', 'Elegant'],
  },
  {
    id: 5,
    label: 'Optional add-ons',
    options: ['Glitch', 'Neon', 'Flat Design'],
  },
];

function Filter() {
  // const [isModalOpen, setIsModalOpen] = useState(false);

  const { selectedTags, setSelectedTags, searchQuery, setSearchQuery, activeFilters } =
    useFilterState();

  // Handle filter removal
  const handleRemoveFilter = useCallback(
    (filter: ActiveFilter) => {
      if (filter.type === 'search') {
        setSearchQuery('');
      } else {
        setSelectedTags((prev) => prev.filter((tag) => tag !== filter.value));
      }
    },
    [setSearchQuery, setSelectedTags],
  );

  // Handle clear all filters
  const handleClearAll = useCallback(() => {
    setSelectedTags([]);
    setSearchQuery('');
  }, [setSelectedTags, setSearchQuery]);

  return (
    <>
      {/* Open Filter Button */}
      {/* <button
        className="mb-5 rounded-full bg-primary/10 px-4 py-2 text-primary hover:bg-primary/20 transition-colors duration-200"
        onClick={() => setIsModalOpen(true)}
        aria-label="Open filters"
      >
        Open Filters
      </button> */}

      {/* Filter Modal */}
      <DrawerDialog>
        <section className="px-10 py-6 z-10">
          {/* Search Box */}
          <SearchBox
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
          />

          {/* Filter Groups */}
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
        </section>
      </DrawerDialog>

      {/* Active Filters Display */}
      {activeFilters.length > 0 && (
        <div className="mt-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-2xl font-bold text-primary">
              Active Filters ({activeFilters.length})
            </h2>
            <button
              onClick={handleClearAll}
              className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors cursor-pointer"
            >
              Clear All
            </button>
          </div>

          <div className="flex gap-3 flex-wrap">
            {activeFilters.map((filter) => (
              <ButtonFilter
                key={`${filter.type}-${filter.value}`}
                option={filter.displayValue}
                tags={activeFilters.map((f) => f.displayValue)}
                setTags={() => handleRemoveFilter(filter)}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default Filter;
