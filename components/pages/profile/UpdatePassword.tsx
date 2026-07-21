'use client';

import * as Yup from 'yup';
import { useTranslations } from 'next-intl';
import { FormBuilder, type FieldConfig } from '@/components/shared/Form';
import { SchemaChangePassword } from '@/validation/Form';
import { useChangePassword } from '@/hooks/mutations/useProfile';

type PasswordValues = Yup.InferType<typeof SchemaChangePassword>;

const initialValues: PasswordValues = { newPassword: '', confirmPassword: '' };

function UpdatePassword() {
  const tPages = useTranslations('Pages.Profile.Password');
  const { mutateAsync } = useChangePassword();

  const fields: FieldConfig[] = [
    {
      name: 'newPassword',
      label: tPages('newPassword'),
      type: 'password',
      required: true,
    },
    {
      name: 'confirmPassword',
      label: tPages('confirmPassword'),
      type: 'password',
      required: true,
    },
  ];

  return (
    <FormBuilder<PasswordValues>
      fields={fields}
      initialValues={initialValues}
      validationSchema={SchemaChangePassword}
      submitLabel="submit"
      loadingMessageKey="loading"
      onSubmit={async (values, helpers) => {
        await mutateAsync({
          newPassword: values.newPassword,
          confirmPassword: values.confirmPassword,
        });

        helpers.resetForm();
        helpers.setValues(initialValues);
      }}
    />
  );
}

export default UpdatePassword;
