import { Dispatch, SetStateAction } from 'react';
import ButtonFilter from './ButtonFilter';
import { useTranslations } from 'next-intl';

function ChildFilter({
  filter,
  tags,
  setTags,
}: {
  filter: { label: string; options: string[] };
  tags: string[];
  setTags: Dispatch<SetStateAction<string[]>>;
}) {
  const t = useTranslations('Filter.filter.header');
  return (
    <div className=" border-gray-300 text-primary pb-6">
      <div className="flex items-center gap-4 mb-4">
        <h2 className="text-2xl font-bold">{t(filter.label)}</h2>
      </div>

      <div className="flex flex-wrap gap-2">
        {filter.options.map((option) => (
          <ButtonFilter
            option={option}
            tags={tags}
            setTags={setTags}
            key={option}
          />
        ))}
      </div>
    </div>
  );
}

export default ChildFilter;
