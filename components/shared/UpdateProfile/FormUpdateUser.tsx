'use client';
import { Form, Formik } from 'formik';
import { SchemaProfileEdit } from '@/validation/Form';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { EditProfile } from '@/app/[locale]/actions/EditProfile';
import { Button } from '@/components/ui/button';
import FormField from '@/components/shared/FormField';
import { Loader2 } from 'lucide-react';

function FormUpdateUser() {
  const tPages = useTranslations('Pages.Profile.Rename');
  const tMessages = useTranslations('Messages');
  const initialValues = { firstName: '', lastName: '' };
  return (
    <div>
      <Formik
        initialValues={initialValues}
        validationSchema={SchemaProfileEdit}
        onSubmit={async (values, { resetForm, setValues }) => {
          const finalValue = {
            firstName: values.firstName,
            lastName: values.lastName,
          };

          const profile = await EditProfile(finalValue);

          if (profile.status) {
            toast.success(profile.message);
          } else {
            toast.error(profile.message);
          }
          setValues(initialValues);
          resetForm();
        }}
        validateOnMount
        validateOnChange
      >
        {({ values, isSubmitting, isValid }) => (
          <Form className="flex flex-col gap-5">
            <FormField
              name="firstName"
              label={tPages('firstName')}
              type="text"
              id="firstName"
            />
            <FormField
              name="lastName"
              label={tPages('lastName')}
              type="text"
              id="lastName"
            />

            <Button
              type="submit"
              disabled={
                !isValid ||
                isSubmitting ||
                (['firstName', 'lastName'] as const).every(
                  (field) => values[field] === initialValues[field]
                )
              }
              className="w-fit"
            >
              {isSubmitting ? <><Loader2/> {tMessages('loading')}</> : 'Submit'}
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default FormUpdateUser;
