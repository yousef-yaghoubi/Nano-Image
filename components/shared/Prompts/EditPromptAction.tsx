'use client';

import { DrawerDialog } from '../DrawerDialog';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';

function EditPromptAction({ promptId }: { promptId: string }) {
  void promptId;
  const t = useTranslations('Actions');

  return (
    <DrawerDialog
      trigger={<Button variant="outline">{t('edit.edit')}</Button>}
      title={t('edit.edit')}
      className="flex flex-wrap gap-2"
    />
  );
}

export default EditPromptAction;
