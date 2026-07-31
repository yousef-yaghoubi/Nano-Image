'use client';

import * as Yup from 'yup';
import { useTranslations } from 'next-intl';
import { FormBuilder } from '@/components/shared/Form';
import { SchemaEditPrompt } from '@/validation/Form';
import type { FieldConfig } from '@/components/shared/Form';
import { useEditPrompt } from '@/hooks/mutations/useEditPrompt';
import { SquarePen } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useDrawerDialog } from '@/providers/DrawerDialogProvider';

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
  const { openDialog, closeDialog } = useDrawerDialog();

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
    <Tooltip>
      <TooltipTrigger asChild>
        <SquarePen
          size={24}
          className="cursor-pointer"
          onClick={() =>
            openDialog({
              title: t('edit.edit'),
              className: 'flex flex-wrap gap-2',
              content: (
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
                    closeDialog();
                    return {
                      status: result.status,
                      message: result.message,
                    };
                  }}
                />
              ),
            })
          }
        />
      </TooltipTrigger>
      <TooltipContent>
        <p>{t('edit.edit')}</p>
      </TooltipContent>
    </Tooltip>
  );
}

export default EditPromptAction;
