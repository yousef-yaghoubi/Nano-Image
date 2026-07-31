'use client';
import { Button } from '@/components/ui/button';
import { CircleCheckBig } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useTranslations } from 'next-intl';
import { statusPrompt } from '@/lib/data';
import { useEditStatusPrompt } from '@/hooks/mutations/useEditPrompt';
import { Loading } from '@/components/ui/loading';
import { useDrawerDialog } from '@/providers/DrawerDialogProvider';

function EditStatusPromptAction({
  promptId,
  status,
}: {
  promptId: string;
  status: any;
}) {
  const t = useTranslations('Actions');
  const tTable = useTranslations('Table');
  const { mutateAsync, isPending } = useEditStatusPrompt();
  const { openDialog, closeDialog } = useDrawerDialog();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <CircleCheckBig
          size={24}
          className="cursor-pointer"
          onClick={() =>
            openDialog({
              title: t('editStatus.editStatus'),
              desc: t('editStatus.title'),
              className: 'flex flex-wrap gap-2',
              content: isPending ? (
                <Loading size="md" fullScreen />
              ) : (
                statusPrompt.map((newStatus) => (
                  <Button
                    onClick={async () => {
                      await mutateAsync({
                        id: promptId,
                        value: newStatus.value,
                      });
                      closeDialog();
                    }}
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
              ),
            })
          }
        />
      </TooltipTrigger>
      <TooltipContent>
        <p>{t('editStatus.editStatus')}</p>
      </TooltipContent>
    </Tooltip>
  );
}

export default EditStatusPromptAction;
