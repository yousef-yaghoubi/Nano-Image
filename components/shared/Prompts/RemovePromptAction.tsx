'use client';
import { DrawerDialog } from '../DrawerDialog';
import { Button } from '@/components/ui/button';
import useDeletePrompt from '@/hooks/mutations/useDeletePrompt';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';

function RemovePromptAction({ promptId }: { promptId: string }) {
  const t = useTranslations('Actions');
  const [openModal, setOpenModal] = useState(false);
  const { mutate, isPending } = useDeletePrompt();

  const handleRemove = () => {
    mutate(promptId, {
      onSuccess: (data) => {
        setOpenModal(false);
        toast.success(data.message);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  const handleNo = () => {
    setOpenModal(false);
  };

  return (
    <DrawerDialog
      open={openModal}
      onOpenChange={setOpenModal}
      trigger={<Button variant={'destructive'}>{t('remove.remove')}</Button>}
      title={t('remove.remove')}
      desc={t('remove.title')}
      className="flex flex-wrap gap-2"
    >
      <Button variant="destructive" onClick={handleRemove} disabled={isPending}>
        {t('remove.yes')}
      </Button>
      <Button variant="outline" onClick={handleNo}>
        {t('remove.no')}
      </Button>
    </DrawerDialog>
  );
}

export default RemovePromptAction;
