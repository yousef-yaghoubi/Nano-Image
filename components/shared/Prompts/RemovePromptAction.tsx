'use client';
import { Button } from '@/components/ui/button';
import useDeletePrompt from '@/hooks/mutations/useDeletePrompt';
import { Trash2 } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useTranslations } from 'next-intl';
import { useDrawerDialog } from '@/providers/DrawerDialogProvider';

function RemovePromptAction({ promptId }: { promptId: string }) {
  const t = useTranslations('Actions');
  const tButtons = useTranslations('Buttons');

  const { mutate, isPending } = useDeletePrompt();

  const { openDialog, closeDialog } = useDrawerDialog();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Trash2
          size={24}
          color="red"
          className="cursor-pointer"
          onClick={() =>
            openDialog({
              title: t('remove.remove'),
              desc: t('remove.title'),
              className: 'flex flex-wrap gap-2',
              content: (
                <>
                  <Button
                    variant="destructive"
                    onClick={() =>
                      mutate(promptId, {
                        onSuccess: closeDialog,
                      })
                    }
                    disabled={isPending}
                  >
                    {isPending ? tButtons('loading') : t('remove.yes')}
                  </Button>
                  <Button variant="outline" onClick={closeDialog}>
                    {t('remove.no')}
                  </Button>
                </>
              ),
            })
          }
        />
      </TooltipTrigger>
      <TooltipContent>
        <p>{t('remove.remove')}</p>
      </TooltipContent>
    </Tooltip>
  );
}

export default RemovePromptAction;
