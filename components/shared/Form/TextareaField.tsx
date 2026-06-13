import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { FieldMeta, TextareaFieldConfig } from "@/types/form/types";
import { useField } from "formik";
import { errorRing } from ".";

export function TextareaField({
  field,
  meta: { id, hasError },
}: {
  field: TextareaFieldConfig;
  meta: FieldMeta;
}) {
  const [formikField] = useField(field.name);
  return (
    <Textarea
      {...formikField}
      id={id}
      placeholder={field.placeholder}
      disabled={field.disabled}
      rows={field.rows ?? 4}
      aria-invalid={hasError}
      aria-describedby={hasError ? `${id}-error` : undefined}
      className={cn(hasError && errorRing)}
    />
  );
}