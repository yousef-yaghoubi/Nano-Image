import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { CheckboxFieldConfig, FieldMeta } from "@/types/form/types";
import { useField } from "formik";
import { RequiredMark } from "./FormFieldRenderer";

export function CheckboxField({
  field,
  meta: { id, hasError },
}: {
  field: CheckboxFieldConfig;
  meta: FieldMeta;
}) {
  const [formikField, , helpers] = useField(field.name);
  return (
    <div className="flex items-center gap-2">
      <Checkbox
        id={id}
        checked={formikField.value as boolean}
        onCheckedChange={(checked) => helpers.setValue(checked)}
        disabled={field.disabled}
        aria-describedby={hasError ? `${id}-error` : undefined}
      />
      <Label htmlFor={id} className="cursor-pointer text-sm font-normal">
        {field.checkboxLabel ?? field.label}
        {field.required && <RequiredMark />}
      </Label>
    </div>
  );
}