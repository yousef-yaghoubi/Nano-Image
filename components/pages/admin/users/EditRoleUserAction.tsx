'use client';
import { Button } from '@/components/ui/button';
import { CircleCheckBig } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { roleUser } from '@/lib/data';
import { toast } from 'sonner';
import { DrawerDialog } from '@/components/shared/DrawerDialog';
import { RoleType } from '@/models/enums';
import { useEditRoleUser } from '@/hooks/mutations/useEditRoleUser';
import { useRejectRoleRequest } from '@/hooks/mutations/useRejectRoleRequest';
import { Loading } from '@/components/ui/loading';

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
  const tMessages = useTranslations('Messages');
  const [openModal, setOpenModal] = useState(false);
  const { mutateAsync: editRole, isPending: isEditing } = useEditRoleUser();
  const { mutateAsync: rejectRequest, isPending: isRejecting } =
    useRejectRoleRequest();

  const isPending = isEditing || isRejecting;

  const handleEditRole = async (newRole: {
    title: string;
    value: RoleType;
  }) => {
    try {
      const response = await editRole({ userId, value: newRole.value });

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

  const handleAccept = async () => {
    try {
      const response = await editRole({ userId, value: 'ADMIN' });

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

  const handleReject = async () => {
    try {
      const response = await rejectRequest(userId);

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

  if (waitForAdmin) {
    return (
      <DrawerDialog
        open={openModal}
        onOpenChange={setOpenModal}
        tooltipContent={t('acceptRoleRequest.title')}
        trigger={<CircleCheckBig size={24} className="cursor-pointer" />}
        title={t('acceptRoleRequest.title')}
        className="flex flex-wrap gap-2"
      >
        {isPending ? (
          <Loading size="md" fullScreen />
        ) : (
          <>
            <Button
              onClick={handleAccept}
              disabled={isPending}
              variant="default"
            >
              {t('acceptRoleRequest.accept')}
            </Button>
            <Button
              onClick={handleReject}
              disabled={isPending}
              variant="outline"
            >
              {t('acceptRoleRequest.reject')}
            </Button>
          </>
        )}
      </DrawerDialog>
    );
  }

  return (
    <DrawerDialog
      open={openModal}
      onOpenChange={setOpenModal}
      tooltipContent={t('editRoleUser.editRoleUser')}
      trigger={<CircleCheckBig size={24} className="cursor-pointer" />}
      title={t('editRoleUser.editRoleUser')}
      desc={t('editRoleUser.title')}
      className="flex flex-wrap gap-2"
    >
      {isPending ? (
        <Loading size="md" fullScreen />
      ) : (
        roleUser
          .filter((role) => role.value !== 'ADMIN')
          .map((newRole) => (
            <Button
              onClick={() => handleEditRole(newRole)}
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
      )}
    </DrawerDialog>
  );
}

export default EditRoleUserAction;
