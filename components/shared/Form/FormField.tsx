'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ErrorMessage, useField } from 'formik';
import { useTranslations } from 'next-intl';

interface FormFieldProps {
  name: string;
  label: string;
  type?: string;
  id?: string;
  errorTranslationKey?: string;
  [key: string]: unknown;
}

export default function FormField({
  name,
  label,
  type = 'text',
  id,
  errorTranslationKey = 'FormSendPrompt',
  ...props
}: FormFieldProps) {
  const [field, , helpers] = useField(name);
  const tForm = useTranslations(errorTranslationKey);

  return (
    <div>
      <Label htmlFor={id || name}>{label}</Label>
      <Input
        {...props}
        {...field}
        type={type}
        id={id || name}
        name={name}
        value={field.value || ''}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          helpers.setValue(e.target.value);
        }}
      />
      <ErrorMessage
        name={name}
        render={(error) => (
          <span className="text-red-500 text-sm mt-1">{tForm(error)}</span>
        )}
      />
    </div>
  );
}
