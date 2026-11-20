'use client';

import { useTranslations } from 'next-intl';
import { ErrorMessage } from 'formik';
import { FormBuilder } from '@/components/shared/Form';
import { SchemaSendPrompt } from '@/validation/Form';
import UploadImage from '@/components/shared/UploadImage';
import TagsShowInput from '@/components/shared/Form/Tags';
import { useAddPrompt } from '@/hooks/mutations/useAddPrompt';

interface FormValues {
  namePrompt: string;
  promptText: string;
  imageUrl: string;
  tags: string[];
}

const initialValues: FormValues = {
  namePrompt: '',
  promptText: '',
  imageUrl: '',
  tags: [],
};

export default function SendPromptForm() {
  const tForm = useTranslations('Forms');
  const { mutateAsync, isPending } = useAddPrompt();

  return (
    <div className="mx-auto mt-6 max-w-lg">
      <FormBuilder<FormValues>
        initialValues={initialValues}
        validationSchema={SchemaSendPrompt}
        submitLabel="submit"
        loadingMessageKey="loading"
        isPending={isPending}
        dirtyFields={['namePrompt', 'promptText']}
        className="space-y-6"
        onSubmit={async (values, { resetForm, setValues }) => {
          const newPrompt = await mutateAsync({
            prompt: {
              title: values.namePrompt,
              prompt: values.promptText,
              image: values.imageUrl,
              tags: values.tags,
            },
          });

          if (newPrompt.success) {
            setValues(initialValues);
            resetForm();
          }
        }}
        fields={[
          {
            name: 'namePrompt',
            label: tForm('Label.name'),
            type: 'text',
            required: true,
          },
          {
            name: 'promptText',
            label: tForm('Label.prompt'),
            type: 'textarea',
            required: true,
          },
        ]}
        customFields={() => (
          <>
            {/* Image upload */}
            <div>
              <UploadImage
                name="imageUrl"
                important
                label={tForm('Label.image')}
              />
              <ErrorMessage
                name="imageUrl"
                render={(e) => (
                  <span className="text-destructive mt-1 text-sm">
                    {tForm(e)}
                  </span>
                )}
              />
            </div>

            {/* Tags */}
            <TagsShowInput name="tags" label={tForm('Label.tags')} />
          </>
        )}
      />
    </div>
  );
}
