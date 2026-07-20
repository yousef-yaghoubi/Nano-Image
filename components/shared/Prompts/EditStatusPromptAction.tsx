'use client';
import { DrawerDialog } from '../DrawerDialog';
import { Button } from '@/components/ui/button';
import { CircleCheckBig } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { statusPrompt } from '@/lib/data';
import { StatusPrompt } from '@/types/data';
import { toast } from 'sonner';
import { useEditStatusPrompt } from '@/hooks/mutations/useEditPrompt';
import { Loading } from '@/components/ui/loading';

function EditStatusPromptAction({
  promptId,
  status,
}: {
  promptId: string;
  status: any;
}) {
  const t = useTranslations('Actions');
  const tTable = useTranslations('Table');
  const tMessages = useTranslations('Messages');
  const [openModal, setOpenModal] = useState(false);
  const { mutateAsync, isPending } = useEditStatusPrompt();

  const handleOnClick = async (newStatus: StatusPrompt) => {
    try {
      const response = await mutateAsync({
        id: promptId,
        value: newStatus.value,
      });

      if (response.status) {
        toast.success(tMessages(response.message));
      } else {
        toast.error(response && tMessages(response.message));
      }
    } catch {
      toast.error(tMessages('generic'));
    } finally {
      setOpenModal(false);
    }
  };

  return (
    <DrawerDialog
      open={openModal}
      onOpenChange={setOpenModal}
      tooltipContent={t('editStatus.editStatus')}
      trigger={<CircleCheckBig size={24} className="cursor-pointer" />}
      title={t('editStatus.editStatus')}
      desc={t('editStatus.title')}
      className="flex flex-wrap gap-2"
    >
      {isPending ? (
        <Loading size="md" fullScreen />
      ) : (
        statusPrompt.map((newStatus) => (
          <Button
            onClick={() => handleOnClick(newStatus)}
            disabled={isPending || newStatus.value == status}
            key={newStatus.value}
            variant={
              newStatus.value == 'True'
                ? 'default'
                : newStatus.value == 'False'
                  ? 'destructive'
                  : 'outline'
            }
          >
            {tTable(newStatus.title)}
          </Button>
        ))
      )}
    </DrawerDialog>
  );
}

export default EditStatusPromptAction;
