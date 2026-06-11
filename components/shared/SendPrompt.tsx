'use client';

import { useTranslations } from 'next-intl';
import { Formik, Form, Field, ErrorMessage } from 'formik';

import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import UploadImage from './UploadImage';
import TeaxtArea from './Form/TextArea';
import { Input } from '../ui/input';
import { SchemaSendPrompt } from '@/validation/Form';
import useAddPrompt from '@/hooks/mutations/useAddPrompt';
import { toast } from 'sonner';
import TagsShowInput from './Form/Tags';

interface FormValues {
  namePrompt: string;
  promptText: string;
  imageUrl: string;
  tags: string[];
}

export default function SendPromptForm({ clerkId }: { clerkId: string }) {
  const tForm = useTranslations('FormSendPrompt');
  const tMessages = useTranslations('Messages');
  const { mutateAsync, isPending } = useAddPrompt();
  const initialValues: FormValues = {
    namePrompt: '',
    promptText: '',
    imageUrl: '',
    tags: [],
  };

  return (
    <div className="mx-auto mt-6 max-w-lg">
      <Formik
        initialValues={initialValues}
        validationSchema={SchemaSendPrompt}
        onSubmit={async (values, { resetForm, setValues }) => {
          const finalValue = {
            title: values.namePrompt,
            prompt: values.promptText,
            image: values.imageUrl,
            tags: values.tags,
          };

          const newPrompt = await mutateAsync({ clerkId, prompt: finalValue });

          if (newPrompt.status) {
            toast.success(tMessages(newPrompt.message));
          } else {
            toast.error(tMessages(newPrompt.message));
          }
          setValues(initialValues);
          resetForm();
        }}
        validateOnMount
      >
        {({ values, setFieldValue, isValid, isSubmitting }) => (
          <Form className="space-y-6">
            <div>
              <UploadImage
                name="imageUrl"
                important
                label={tForm('Label.image')}
              />
              <ErrorMessage
                name="imageUrl"
                render={(e) => (
                  <span className="mt-1 text-sm text-red-500">{tForm(e)}</span>
                )}
              />
            </div>

            {/* Name Prompt */}
            <div>
              <Label htmlFor="namePrompt">
                {tForm('Label.name')}{' '}
                <span className="text-destructive">*</span>
              </Label>
              <Field
                as={Input}
                id="namePrompt"
                name="namePrompt"
                value={values.namePrompt}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFieldValue('namePrompt', e.target.value)
                }
              />
              <ErrorMessage
                name="namePrompt"
                render={(e) => (
                  <span className="mt-1 text-sm text-red-500">{tForm(e)}</span>
                )}
              />
            </div>

            {/* Prompt Text */}
            <div>
              <TeaxtArea name="promptText" label={tForm('Label.prompt')} />
              <ErrorMessage
                name="promptText"
                render={(e) => (
                  <span className="mt-1 text-sm text-red-500">{tForm(e)}</span>
                )}
              />
            </div>

            <TagsShowInput name="tags" label={tForm('Label.tags')} />

            <Button type="submit" disabled={!isValid || isSubmitting || isPending}>
              {!isSubmitting && !isPending ? <>Submit</> : <>Loding</>}
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
