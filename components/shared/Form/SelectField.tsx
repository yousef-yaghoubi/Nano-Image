import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { FieldMeta, SelectFieldConfig } from "@/types/form/types";
import { useField } from "formik";
import { errorRing } from ".";

export function SelectField({
  field,
  meta: { id, hasError },
}: {
  field: SelectFieldConfig;
  meta: FieldMeta;
}) {
  const [formikField, , helpers] = useField(field.name);
  return (
    <Select
      value={formikField.value as string}
      onValueChange={(val) => helpers.setValue(val)}
      disabled={field.disabled}
    >
      <SelectTrigger
        id={id}
        aria-invalid={hasError}
        aria-describedby={hasError ? `${id}-error` : undefined}
        className={cn(hasError && errorRing)}
      >
        <SelectValue
          placeholder={field.placeholder ?? `Select ${field.label}`}
        />
      </SelectTrigger>
      <SelectContent>
        {field.options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}