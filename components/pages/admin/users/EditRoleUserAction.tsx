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
import { Loading } from '@/components/ui/loading';

function EditRoleUserAction({
  userId,
  role,
}: {
  userId: string;
  role: RoleType;
}) {
  const t = useTranslations('Actions');
  const tTable = useTranslations('Table');
  const tMessages = useTranslations('Messages');
  const [openModal, setOpenModal] = useState(false);
  const { mutateAsync, isPending, data } = useEditRoleUser();

  const handleOnClick = async (newRole: { title: string; value: RoleType }) => {
    try {
      const response = await mutateAsync({
        userId,
        value: newRole.value,
      });

      if (response.status) {
        toast.success(tMessages(response.message));
      } else {
        toast.error(response && tMessages(response.message));
      }
    } catch (error) {
      toast.error(tMessages('generic'));
    } finally {
      setOpenModal(false);
    }
  };

  console.log(data);

  return (
    <DrawerDialog
      open={openModal}
      onOpenChange={setOpenModal}
      tooltipContent={t('editRoleUser.editRoleUser')}
      trigger={<CircleCheckBig size={24} className='cursor-pointer'/>}
      title={t('editRoleUser.editRoleUser')}
      desc={t('editRoleUser.title')}
      className="flex flex-wrap gap-2"
    >
      {isPending ? (
        <Loading size="md" fullScreen />
      ) : (
        roleUser.map((newRole) => (
          <Button
            onClick={() => handleOnClick(newRole)}
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
