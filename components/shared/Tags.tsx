'use client';

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
import { Label } from '../ui/label';
import { useTranslations } from 'next-intl';

const TagsShowInput = ({ name, label }: { name: string; label: string }) => {
  const [field, , helpers] = useField<string[]>(name);
  const t = useTranslations('Filter.filter.tag')
  const handleRemove = (value: string) => {
    helpers.setValue(field.value.filter((v) => v !== value));
  };

  const handleSelect = (value: string) => {
    if (field.value.includes(value)) {
      handleRemove(value);
      return;
    }

    helpers.setValue([...field.value, value]);
  };

  const tags = FILTERING_OPTIONS.flatMap((filter) => filter.options);

  return (
    <Tags>
      <Label htmlFor={name}>
        {label}
      </Label>
      <TagsTrigger id={name}>
        {field.value.map((tag) => (
          <TagsValue key={tag} onRemove={() => handleRemove(tag)}>
            {t(tag)}
          </TagsValue>
        ))}
      </TagsTrigger>

      <TagsContent dir="ltr">
        <TagsInput placeholder="Search tag..." />

        <TagsList>
          <TagsEmpty />
          <TagsGroup>
            {tags.map((tag) => (
              <TagsItem key={tag} onSelect={handleSelect} value={tag}>
                {t(tag)}
                {field.value.includes(tag) && (
                  <CheckIcon className="text-muted-foreground" size={14} />
                )}
              </TagsItem>
            ))}
          </TagsGroup>
        </TagsList>
      </TagsContent>
    </Tags>
  );
};

export default TagsShowInput;
