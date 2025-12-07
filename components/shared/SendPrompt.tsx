'use client';

import { useTranslations } from 'next-intl';
import { Formik, Form, Field, ErrorMessage } from 'formik';

import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import UploadImage from './UploadImage';
import TeaxtArea from './TextArea';
import { Input } from '../ui/input';
import { SchemaSendPrompt } from '@/validation/Form';
import { AddPrompt } from '@/app/[locale]/actions/AddPrompt';
import { toast } from 'sonner';

interface FormValues {
  namePrompt: string;
  promptText: string;
  imageUrl: string;
}

export default function SendPromptForm({ clerkId }: { clerkId: string }) {
  const tForm = useTranslations('FormSendPrompt');
  const tMessages = useTranslations('Messages');
  const initialValues: FormValues = {
    namePrompt: '',
    promptText: '',
    imageUrl: '',
  };

  return (
    <div className="max-w-lg mx-auto mt-6">
      <Formik
        initialValues={initialValues}
        validationSchema={SchemaSendPrompt}
        onSubmit={async (values, { resetForm, setValues }) => {
          const finalValue = {
            title: values.namePrompt,
            prompt: values.promptText,
            image: values.imageUrl,
          };

          const newPrompt = await AddPrompt({ clerkId, prompt: finalValue });

          if (newPrompt.status) {
            toast.success(tMessages(newPrompt.message));
          } else {
            toast.error(tMessages(newPrompt.message));
          }
          setValues(initialValues)
          resetForm();
        }}
        validateOnMount={true}
      >
        {({ values, setFieldValue, isValid, isSubmitting }) => (
          <Form className="space-y-6">
            <div>
              <UploadImage name="imageUrl" />
              <ErrorMessage
                name="imageUrl"
                render={(e) => (
                  <span className="text-red-500 text-sm mt-1">{tForm(e)}</span>
                )}
              />
            </div>

            {/* Name Prompt */}
            <div>
              <Label htmlFor="namePrompt">Name</Label>
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
                  <span className="text-red-500 text-sm mt-1">{tForm(e)}</span>
                )}
              />
            </div>

            {/* Prompt Text */}
            <div>
              <TeaxtArea name="promptText" label="Prompt" />
              <ErrorMessage
                name="promptText"
                render={(e) => (
                  <span className="text-red-500 text-sm mt-1">{tForm(e)}</span>
                )}
              />
            </div>
            <Button type="submit" disabled={!isValid || isSubmitting}>
              {!isSubmitting ? <>Submit</> : <>Loding</>}
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
