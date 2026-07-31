'use client';
import clsx from 'clsx';
import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Dispatch, SetStateAction } from 'react';

function ButtonFilter({
  option,
  tags,
  setTags,
}: {
  option: string;
  tags: string[];
  setTags: Dispatch<SetStateAction<string[]>>;
}) {
  const handleTagClick = async (option: string) => {
    if (option.includes('search:')) {
      setTags((prev) => prev.filter((item) => !item.startsWith('search: ')));
    }

    if (tags.includes(option)) {
      setTags((prev) => prev.filter((item) => item !== option));
    } else {
      setTags((prev) => [...prev, option]);
    }
  };

  const t = useTranslations('Filter.filter.tag');

  return (
    <button
      key={option}
      className={clsx(
        'flex cursor-pointer items-center gap-1 rounded-full border border-gray-300 px-2 py-1.5 text-xs font-medium transition md:px-4 md:py-2 md:text-sm dark:border-gray-700',
        tags.includes(option)
          ? 'bg-primary border-primary justify-around text-white'
          : 'text-primary hover:bg-primary/20 justify-center bg-white dark:bg-gray-900'
      )}
      onClick={handleTagClick.bind(null, option)}
    >
      {option.startsWith('Search:') ? (
        <span>
          {t('Search')} {option.replace('Search: ', '')}
        </span>
      ) : (
        <span>{t(option)}</span>
      )}
      <span>{tags.includes(option) && <X size={15} />}</span>
    </button>
  );
}

export default ButtonFilter;
