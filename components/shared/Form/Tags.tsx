'use client';

import { Label } from '@/components/ui/label';
import {
  Tags,
  TagsContent,
  TagsEmpty,
  TagsGroup,
  TagsInput,
  TagsItem,
  TagsList,
  TagsTrigger,
  TagsValue,
} from '@/components/ui/tags';
import { FILTERING_OPTIONS } from '@/lib/data';
import { useField } from 'formik';
import { CheckIcon } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

const TagsShowInput = ({ name, label }: { name: string; label: string }) => {
  const [field, , helpers] = useField<string[]>(name);
  const t = useTranslations('Filter.filter.tag');
  const locale = useLocale();

  const handleRemove = (value: string) => {
    helpers.setValue(field.value.filter((v) => v !== value));
  };

  const handleSelect = (value: string) => {
    if (field.value.includes(value)) {
      handleRemove(value);
    } else {
      helpers.setValue([...field.value, value]);
    }
  };

  const tags = FILTERING_OPTIONS.flatMap((filter) => filter.options);

  return (
    <Tags>
      <Label htmlFor={name}>{label}</Label>
      <TagsTrigger id={name}>
        {field.value.map((tag) => (
          <TagsValue key={tag} onRemove={() => handleRemove(tag)}>
            {t(tag)}
          </TagsValue>
        ))}
      </TagsTrigger>

      <TagsContent dir={locale === 'en' ? 'ltr' : 'rtl'}>
        <TagsInput placeholder={'Search tag...'} />

        <TagsList>
          {tags.length === 0 && <TagsEmpty />}
          <TagsGroup>
            {tags.map((tag) => {
              const isSelected = field.value.includes(tag);
              return (
                <TagsItem
                  key={tag}
                  onSelect={() => handleSelect(tag)}
                  value={tag}
                  keywords={[t(tag)]}
                >
                  <div className="flex w-full items-center justify-between">
                    {t(tag)}
                    {isSelected && (
                      <CheckIcon className="text-primary ml-2" size={14} />
                    )}
                  </div>
                </TagsItem>
              );
            })}
          </TagsGroup>
        </TagsList>
      </TagsContent>
    </Tags>
  );
};

export default TagsShowInput;
