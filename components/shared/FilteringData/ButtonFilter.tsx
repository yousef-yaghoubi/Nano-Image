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
        'px-2 py-1.5 md:px-4 md:py-2 border border-gray-300 rounded-full flex items-center gap-1 justify-around text-xs md:text-sm font-medium transition cursor-pointer',
        tags.includes(option)
          ? 'bg-primary text-white border-primary'
          : 'bg-white text-primary hover:bg-primary/20'
      )}
      onClick={handleTagClick.bind(null, option)}
    >
      <span>{t(option)}</span>
      <span>{tags.includes(option) && <X size={15} />}</span>
    </button>
  );
}

export default ButtonFilter;
