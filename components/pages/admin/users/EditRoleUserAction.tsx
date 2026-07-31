'use client';
import { Button } from '@/components/ui/button';
import { CircleCheckBig } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useTranslations } from 'next-intl';
import { roleUser } from '@/lib/data';
import { RoleType } from '@/models/enums';
import { useEditRoleUser } from '@/hooks/mutations/useEditRoleUser';
import { useRejectRoleRequest } from '@/hooks/mutations/useRejectRoleRequest';
import { Loading } from '@/components/ui/loading';
import { useDrawerDialog } from '@/providers/DrawerDialogProvider';

function EditRoleUserAction({
  userId,
  role,
  waitForAdmin,
}: {
  userId: string;
  role: RoleType;
  waitForAdmin?: boolean;
}) {
  const t = useTranslations('Actions');
  const tTable = useTranslations('Table');
  const { mutateAsync: editRole, isPending: isEditing } = useEditRoleUser();
  const { mutateAsync: rejectRequest, isPending: isRejecting } =
    useRejectRoleRequest();
  const { openDialog, closeDialog } = useDrawerDialog();

  const isPending = isEditing || isRejecting;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <CircleCheckBig
          size={24}
          className="cursor-pointer"
          onClick={() => {
            if (waitForAdmin) {
              openDialog({
                title: t('acceptRoleRequest.title'),
                className: 'flex flex-wrap gap-2',
                content: isPending ? (
                  <Loading size="md" fullScreen />
                ) : (
                  <>
                    <Button
                      onClick={async () => {
                        await editRole({ userId, value: 'ADMIN' });
                        closeDialog();
                      }}
                      disabled={isPending}
                      variant="default"
                    >
                      {t('acceptRoleRequest.accept')}
                    </Button>
                    <Button
                      onClick={async () => {
                        await rejectRequest(userId);
                        closeDialog();
                      }}
                      disabled={isPending}
                      variant="outline"
                    >
                      {t('acceptRoleRequest.reject')}
                    </Button>
                  </>
                ),
              });
            } else {
              openDialog({
                title: t('editRoleUser.editRoleUser'),
                desc: t('editRoleUser.title'),
                className: 'flex flex-wrap gap-2',
                content: isPending ? (
                  <Loading size="md" fullScreen />
                ) : (
                  roleUser
                    .filter((role) => role.value !== 'ADMIN')
                    .map((newRole) => (
                      <Button
                        onClick={async () => {
                          await editRole({
                            userId,
                            value: newRole.value,
                          });
                          closeDialog();
                        }}
                        disabled={isPending || newRole.value == role}
                        key={newRole.value}
                        variant={
                          newRole.value == 'MEMBER'
                            ? 'default'
                            : newRole.value == 'SUPER_ADMIN'
                              ? 'destructive'
                              : 'outline'
                        }
                      >
                        {tTable(newRole.title)}
                      </Button>
                    ))
                ),
              });
            }
          }}
        />
      </TooltipTrigger>
      <TooltipContent>
        <p>
          {waitForAdmin
            ? t('acceptRoleRequest.title')
            : t('editRoleUser.editRoleUser')}
        </p>
      </TooltipContent>
    </Tooltip>
  );
}

export default EditRoleUserAction;
