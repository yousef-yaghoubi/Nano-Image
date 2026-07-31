import type { HTMLInputTypeAttribute, ReactNode } from 'react';
import type { ObjectSchema } from 'yup';
import type { FormikHelpers, FormikValues } from 'formik';

// ─── Field config ─────────────────────────────────────────────────────────────

export type FieldType =
  HTMLInputTypeAttribute | 'textarea' | 'select' | 'checkbox';

interface BaseFieldConfig {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export interface InputFieldConfig extends BaseFieldConfig {
  type: Exclude<FieldType, 'textarea' | 'select' | 'checkbox'>;
}

export interface TextareaFieldConfig extends BaseFieldConfig {
  type: 'textarea';
  rows?: number;
}

export interface SelectFieldConfig extends BaseFieldConfig {
  type: 'select';
  options: { label: string; value: string }[];
}

export interface CheckboxFieldConfig extends BaseFieldConfig {
  type: 'checkbox';
  checkboxLabel?: string;
}

export type FieldConfig =
  | InputFieldConfig
  | TextareaFieldConfig
  | SelectFieldConfig
  | CheckboxFieldConfig;

// ─── Toast / submit result ────────────────────────────────────────────────────

export interface ToastConfig {
  success?: string;
  error?: string;
}

export interface SubmitResult {
  status: boolean;
  message?: string;
}

// ─── Formik bag exposed to customFields ───────────────────────────────────────

export interface FormikBag<T extends FormikValues> {
  values: T;
  isSubmitting: boolean;
  isValid: boolean;
  setFieldValue: (field: string, value: unknown) => void;
}

// ─── FormBuilder props ────────────────────────────────────────────────────────

export interface FormBuilderProps<T extends FormikValues> {
  /** Config-driven fields — rendered in order above customFields */
  fields?: FieldConfig[];
  /**
   * Render-prop for custom / one-off fields (UploadImage, Tags, etc.).
   * Rendered below config-driven fields, above the submit button.
   */
  customFields?: (bag: FormikBag<T>) => ReactNode;
  initialValues: T;
  validationSchema: ObjectSchema<Partial<T>>;
  onSubmit: (
    values: T,
    helpers: FormikHelpers<T>
  ) => Promise<SubmitResult | void>;
  submitLabel?: string;
  loadingMessageKey?: string;
  /** Pass [] to disable the "nothing changed" guard. Defaults to all field names. */
  dirtyFields?: (keyof T)[];
  requireAnyDirty?: boolean;
  resetOnSuccess?: boolean;
  className?: string;
  /** External pending state (e.g. from a mutation hook) — also disables the submit button */
  isPending?: boolean;
}

export interface FieldMeta {
  id: string;
  hasError: boolean;
  error?: string;
}
