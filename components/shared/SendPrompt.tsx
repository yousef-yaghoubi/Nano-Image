'use client';

import { useTranslations } from 'next-intl';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as yup from 'yup';

import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import UploadImage from './UploadImage';
import TeaxtArea from './TextArea';
import { Input } from '../ui/input';

interface FormValues {
  namePrompt: string;
  promptText: string;
  imageUrl: string | null;
}

export default function SendPromptForm() {
  const t = useTranslations('FormSendPrompt');

  const validationSchema = yup.object().shape({
    namePrompt: yup
      .string()
      .min(3, t('minLengthName'))
      .max(40, t('maxLengthName'))
      .required(t('isRequired')),
    promptText: yup
      .string()
      .min(10, t('minLengthDesc'))
      .required(t('isRequired')),
    imageUrl: yup.string().url().nullable().required(t('isRequired')),
  });

  const initialValues: FormValues = {
    namePrompt: '',
    promptText: '',
    imageUrl: null,
  };

  return (
    <div className="max-w-lg mx-auto mt-6">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          console.log('Submitted values:', values);
        }}
        validateOnMount={true}
      >
        {({ values, setFieldValue, isValid, isSubmitting }) => (
          <Form className="space-y-6">
            {/* Upload Image */}
            <div>
              <UploadImage name="imageUrl" />
              <ErrorMessage
                name="imageUrl"
                component="div"
                className="text-red-500 text-sm mt-1"
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
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Prompt Text */}
            <div>
              <TeaxtArea name="promptText" label="Prompt" />
              <ErrorMessage
                name="promptText"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            <Button type="submit" disabled={!isValid || isSubmitting}>
              Submit
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
