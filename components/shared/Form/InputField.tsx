import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { FieldMeta, InputFieldConfig } from '@/types/form/types';
import { useField } from 'formik';
import { errorRing } from '.';

export function InputField({
  field,
  meta: { id, hasError },
}: {
  field: InputFieldConfig;
  meta: FieldMeta;
}) {
  const [formikField] = useField(field.name);
  return (
    <Input
      {...formikField}
      id={id}
      type={field.type}
      placeholder={field.placeholder}
      disabled={field.disabled}
      aria-invalid={hasError}
      aria-describedby={hasError ? `${id}-error` : undefined}
      className={cn(hasError && errorRing)}
    />
  );
}
