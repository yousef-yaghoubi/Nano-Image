'use client';

import { useTranslations } from 'next-intl';
import { ErrorMessage } from 'formik';
import { FormBuilder } from '@/components/shared/Form';
import { SchemaSendPrompt } from '@/validation/Form';
import useAddPrompt from '@/hooks/mutations/useAddPrompt';
import UploadImage from '@/components/shared/UploadImage';
import TagsShowInput from '@/components/shared/Form/Tags';

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

export default function SendPromptForm({ clerkId }: { clerkId: string }) {
  const tForm = useTranslations('Forms');
  const tMessages = useTranslations('Messages');
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
            clerkId,
            prompt: {
              title: values.namePrompt,
              prompt: values.promptText,
              image: values.imageUrl,
              tags: values.tags,
            },
          });

          if (newPrompt.status) {
            setValues(initialValues);
            resetForm();
          }

          return {
            status: newPrompt.status,
            message: tMessages(newPrompt.message),
          };
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
        customFields={({}) => (
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

            {/* Prompt name — uses config-driven field below, but kept here
                if you need custom onChange behaviour */}

            {/* Prompt text */}
            {/* <div>
              <TextArea name="promptText" label={tForm('Label.prompt')} />
              <ErrorMessage
                name="promptText"
                render={(e) => (
                  <span className="mt-1 text-sm text-destructive">
                    {tForm(e)}
                  </span>
                )}
              />
            </div> */}

            {/* Tags */}
            <TagsShowInput name="tags" label={tForm('Label.tags')} />
          </>
        )}
        // Config-driven fields rendered above customFields
      />
    </div>
  );
}
