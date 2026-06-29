'use client';

import * as Yup from 'yup';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { DrawerDialog } from '../DrawerDialog';
import { FormBuilder } from '@/components/shared/Form';
import { SchemaEditPrompt } from '@/validation/Form';
import type { FieldConfig } from '@/components/shared/Form';
import { useEditPrompt } from '@/hooks/mutations/useEditPrompt';
import { SquarePen } from 'lucide-react';

type PromptValues = Yup.InferType<typeof SchemaEditPrompt>;

function EditPromptAction({
  promptId,
  prompt,
  title,
}: {
  promptId: string;
  prompt: string;
  title: string;
}) {
  const t = useTranslations('Actions');
  const tForm = useTranslations('Forms');
  const { mutateAsync, isPending } = useEditPrompt();
  const [openModal, setOpenModal] = useState(false);

  const fields: FieldConfig[] = [
    {
      name: 'namePrompt',
      label: tForm('Label.name'),
      type: 'text',
    },
    {
      name: 'promptText',
      label: tForm('Label.prompt'),
      type: 'textarea',
      rows: 5,
    },
  ];

  return (
    <DrawerDialog
      tooltipContent={t('edit.edit')}
      trigger={
        <SquarePen
          size={24}
          className="cursor-pointer"
          onClick={() => setOpenModal(true)}
        />
      }
      title={t('edit.edit')}
      className="flex flex-wrap gap-2"
      open={openModal}
      onOpenChange={setOpenModal}
    >
      <FormBuilder<PromptValues>
        fields={fields}
        initialValues={{ promptText: prompt, namePrompt: title }}
        validationSchema={SchemaEditPrompt}
        submitLabel="submit"
        loadingMessageKey="loading"
        isPending={isPending}
        requireAnyDirty
        onSubmit={async (values) => {
          const result = await mutateAsync({
            title: values.namePrompt,
            prompt: values.promptText,
            id: promptId,
          });

          setOpenModal(false);
          return {
            status: result.status,
            message: result.message,
          };
        }}
      />
    </DrawerDialog>
  );
}

export default EditPromptAction;
