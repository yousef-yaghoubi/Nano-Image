'use client';

import * as Yup from 'yup';
import { useTranslations } from 'next-intl';
import { ChangePassword } from '@/app/[locale]/actions/EditProfile';
import { FormBuilder, type FieldConfig } from '@/components/shared/Form';
import { SchemaChangePassword } from '@/validation/Form';

type PasswordValues = Yup.InferType<typeof SchemaChangePassword>;

const initialValues: PasswordValues = { newPassword: '', confirmPassword: '' };

function UpdatePassword() {
  const tPages = useTranslations('Pages.Profile.Password');

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
      onSubmit={async (values) => {
        const res = await ChangePassword({
          newPassword: values.newPassword,
          confirmPassword: values.confirmPassword,
        });
        return { status: res.status, message: res.message };
      }}
    />
  );
}

export default UpdatePassword;
