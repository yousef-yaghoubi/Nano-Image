'use client';

import { Form, Formik, type FormikValues } from 'formik';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MotionDiv } from '@/components/shared/MotionWarpper';
import FormFieldRenderer from './FormFieldRenderer';
import type { FormBuilderProps } from '@/types/form/types';

function FormBuilder<T extends FormikValues>({
  fields = [],
  customFields,
  initialValues,
  validationSchema,
  onSubmit,
  submitLabel = 'Submit',
  loadingMessageKey,
  dirtyFields,
  requireAnyDirty = false,
  resetOnSuccess = true,
  className = 'flex flex-col gap-5',
  motionProps,
  isPending = false,
}: FormBuilderProps<T>) {
  const tMessages = useTranslations('Messages');

  const watchedFields =
    dirtyFields ?? (fields.map((f) => f.name) as (keyof T)[]);

  const loadingLabel = loadingMessageKey
    ? tMessages(loadingMessageKey as Parameters<typeof tMessages>[0])
    : 'Loading...';

  return (
    <MotionDiv
      initial={motionProps?.initial ?? { opacity: 0, x: -20 }}
      animate={motionProps?.animate ?? { opacity: 1, x: 0 }}
      transition={motionProps?.transition ?? { duration: 0.4 }}
      className='w-full'
    >
      <Formik<T>
        initialValues={initialValues}
        validationSchema={validationSchema}
        validateOnMount
        validateOnChange
        onSubmit={async (values, helpers) => {
          const result = await onSubmit(values, helpers);

          if (result) {
            if (result.status) {
              if (result.message) toast.success(result.message);
              if (resetOnSuccess) {
                helpers.resetForm();
                helpers.setValues(initialValues);
              }
            } else {
              if (result.message) toast.error(result.message);
            }
          }

          helpers.setSubmitting(false);
        }}
      >
        {({ values, isSubmitting, isValid, setFieldValue }) => {
          /**
           * requireAnyDirty = false (default):
           *   همه فیلدهای watched باید تغییر کرده باشن
           *   block اگه هر کدوم هنوز برابر initialValue باشه → .some()
           *
           * requireAnyDirty = true:
           *   حداقل یک فیلد کافیه
           *   block فقط اگه همه هنوز برابر initialValue باشن → .every()
           */
          const nothingChanged =
            watchedFields.length > 0 &&
            (requireAnyDirty
              ? watchedFields.every((f) => values[f] === initialValues[f])
              : watchedFields.some((f) => values[f] === initialValues[f]));

          const isLoading = isSubmitting || isPending;

          return (
            <Form className={className} noValidate>
              {fields.map((field) => (
                <FormFieldRenderer key={field.name} field={field} />
              ))}

              {customFields?.({ values, isSubmitting, isValid, setFieldValue })}

              <Button
                type="submit"
                disabled={!isValid || isLoading || nothingChanged}
                className="w-fit"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {loadingLabel}
                  </>
                ) : (
                  submitLabel
                )}
              </Button>
            </Form>
          );
        }}
      </Formik>
    </MotionDiv>
  );
}

export default FormBuilder;
