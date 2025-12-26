'use client';

import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useField } from 'formik';

interface TextAreaType {
  name: string;
  label?: string;
}
export default function TeaxtArea({
  name,
  label,
  ...props
}: TextAreaType) {
  const [field] = useField(name);
  return (
    <div className="mt-2">
      <Label htmlFor={name}>
        {label} <span className="text-destructive">*</span>
      </Label>
      <Textarea
        id={name}
        {...props}
        {...field}
        placeholder="Leave a message"
        required
        value={field.value || ''}
        className="max-h-96"
        // onChange={(e) => setPromptText(e.target.value)}
      />
    </div>
  );
}
