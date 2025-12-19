'use client';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { SchemaProfileEdit } from '@/validation/Form';
import { Button } from '../ui/button';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { EditProfile } from '@/app/[locale]/actions/EditProfile';

function FormUpdateUser() {
  const tForm = useTranslations('FormSendPrompt');
  const initialValues = { firstName: '', lastName: '', email: '' };
  return (
    <div className="w-3/6 mx-auto">
      <Formik
        initialValues={initialValues}
        validationSchema={SchemaProfileEdit}
        onSubmit={async (values, { resetForm, setValues }) => {
          const finalValue = {
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
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
        {({ values, setFieldValue, isSubmitting, isValid }) => (
          <Form className="flex flex-col gap-5">
            <div>
              <Label htmlFor="firstName">firstName</Label>
              <Field
                as={Input}
                type="text"
                id="firstName"
                name="firstName"
                value={values.firstName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFieldValue('firstName', e.target.value)
                }
              />
              <ErrorMessage
                name="firstName"
                render={(e) => (
                  <span className="text-red-500 text-sm mt-1">{tForm(e)}</span>
                )}
              />
            </div>
            <div>
              <Label htmlFor="lastName">lastName</Label>
              <Field
                as={Input}
                type="text"
                id="lastName"
                name="lastName"
                value={values.lastName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFieldValue('lastName', e.target.value)
                }
              />
              <ErrorMessage
                name="lastName"
                render={(e) => (
                  <span className="text-red-500 text-sm mt-1">{tForm(e)}</span>
                )}
              />
            </div>
            <div>
              <Label htmlFor="email">email</Label>
              <Field
                as={Input}
                type="text"
                id="email"
                name="email"
                value={values.email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFieldValue('email', e.target.value)
                }
              />
              <ErrorMessage
                name="email"
                render={(e) => (
                  <span className="text-red-500 text-sm mt-1">{tForm(e)}</span>
                )}
              />
            </div>

            <Button
              type="submit"
              disabled={
                !isValid ||
                isSubmitting ||
                (['firstName', 'lastName', 'email'] as const).every(
                  (field) => values[field] === initialValues[field]
                )
              }
            >
              {isSubmitting ? 'Loading' : 'Submit'}
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default FormUpdateUser;
