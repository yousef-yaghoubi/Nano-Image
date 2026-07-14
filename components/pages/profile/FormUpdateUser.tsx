'use client';

import * as Yup from 'yup';
import { useTranslations } from 'next-intl';
import { EditProfile } from '@/app/[locale]/actions/EditProfile';
import { FormBuilder, type FieldConfig } from '@/components/shared/Form';
import { SchemaProfileEdit } from '@/validation/Form';
import { useUser } from '@clerk/nextjs';

type ProfileValues = Yup.InferType<typeof SchemaProfileEdit>;

const initialValues: ProfileValues = { firstName: '', lastName: '' };

function FormUpdateUser() {
  const tPages = useTranslations('Pages.Profile.Rename');
  const { user } = useUser();

  const fields: FieldConfig[] = [
    {
      name: 'firstName',
      label: tPages('firstName'),
      type: 'text',
      required: false,
      // placeholder: 'Jane',
    },
    {
      name: 'lastName',
      label: tPages('lastName'),
      type: 'text',
      required: false,
      // placeholder: 'Doe',
    },
  ];

  return (
    <FormBuilder<ProfileValues>
      fields={fields}
      initialValues={initialValues}
      validationSchema={SchemaProfileEdit}
      submitLabel={'submit'}
      loadingMessageKey="loading"
      onSubmit={async (values) => {
        const res = await EditProfile(values);
        user?.reload();
        return { status: res.status, message: res.message };
      }}
    />
  );
}

export default FormUpdateUser;
