'use client';
import { DrawerDialog } from '../DrawerDialog';
import { Button } from '@/components/ui/button';
import useDeletePrompt from '@/hooks/mutations/useDeletePrompt';
import { Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

function RemovePromptAction({ promptId }: { promptId: string }) {
  const t = useTranslations('Actions');
  const tButtons = useTranslations('Buttons');

  const [openModal, setOpenModal] = useState(false);
  const { mutate, isPending } = useDeletePrompt();

  const handleRemove = () => {
    mutate(promptId, {
      onSuccess: () => {
        setOpenModal(false);
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
      tooltipContent={t('remove.remove')}
      trigger={
        <Trash2
          size={24}
          color="red"
          className="cursor-pointer"
          onClick={() => setOpenModal(true)}
        />
      }
      title={t('remove.remove')}
      desc={t('remove.title')}
      className="flex flex-wrap gap-2"
    >
      <Button variant="destructive" onClick={handleRemove} disabled={isPending}>
        {isPending ? tButtons('loading') : t('remove.yes')}
      </Button>
      <Button variant="outline" onClick={handleNo}>
        {t('remove.no')}
      </Button>
    </DrawerDialog>
  );
}

export default RemovePromptAction;
