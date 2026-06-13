'use client';

import { useField } from 'formik';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import type {
  FieldConfig,
  InputFieldConfig,
  TextareaFieldConfig,
  SelectFieldConfig,
  CheckboxFieldConfig,
  FieldMeta,
} from '@/types/form/types';
import { useTranslations } from 'next-intl';
import { TextareaField } from './TextareaField';
import { SelectField } from './SelectField';
import { CheckboxField } from './CheckboxField';
import { InputField } from './InputField';

function FieldError({ id, error }: { id: string; error: string }) {
  const tMessages = useTranslations('Forms');
  return (
    <p id={`${id}-error`} className="text-destructive text-xs" role="alert">
      {tMessages(error)}
    </p>
  );
}

export function RequiredMark() {
  return (
    <span className="text-destructive ml-1" aria-hidden>
      *
    </span>
  );
}

// ─── Router component ─────────────────────────────────────────────────────────

interface Props {
  field: FieldConfig;
}

function FormFieldRenderer({ field }: Props) {
  const [, meta] = useField(field.name);
  const hasError = meta.touched && Boolean(meta.error);
  const id = `field-${field.name}`;
  const fieldMeta: FieldMeta = { id, hasError, error: meta.error };

  return (
    <div className={cn('flex flex-col gap-1.5', field.className)}>
      {/* Label — skipped for checkbox (rendered inline inside CheckboxField) */}
      {field.type !== 'checkbox' && (
        <Label htmlFor={id} className="text-sm font-medium">
          {field.label}
          {field.required && <RequiredMark />}
        </Label>
      )}

      {/* Delegate to the narrowed sub-component */}
      {field.type === 'textarea' ? (
        <TextareaField field={field as TextareaFieldConfig} meta={fieldMeta} />
      ) : field.type === 'select' ? (
        <SelectField field={field as SelectFieldConfig} meta={fieldMeta} />
      ) : field.type === 'checkbox' ? (
        <CheckboxField field={field as CheckboxFieldConfig} meta={fieldMeta} />
      ) : (
        <InputField field={field as InputFieldConfig} meta={fieldMeta} />
      )}

      {/* Inline error */}
      {hasError && meta.error && <FieldError id={id} error={meta.error} />}
    </div>
  );
}

export default FormFieldRenderer;
