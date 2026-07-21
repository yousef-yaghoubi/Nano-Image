import { AddImage, ChangePassword } from '@/app/[locale]/actions/EditProfile';
import { queryKeys } from '@/lib/query-keys';
import { useUser } from '@clerk/nextjs';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

export function useChangePassword() {
  const tMessages = useTranslations('Messages');

  return useMutation({
    mutationFn: ({
      newPassword,
      confirmPassword,
    }: {
      newPassword: string;
      confirmPassword: string;
    }) => ChangePassword({ newPassword, confirmPassword }),

    onSuccess: (data) => {
      if (data.status) {
        toast.success(tMessages(data.message));
      } else {
        toast.error(tMessages(data.message));
      }
    },
  });
}

export function useUpdateImage() {
  const tMessages = useTranslations('Messages');
  const { user } = useUser();
  return useMutation({
    mutationFn: ({ file }: { file: File | Blob }) => AddImage({ file }),

    onSuccess: (data) => {
      if (data.status) {
        toast.success(tMessages(data.message));
        user?.reload();
      } else {
        toast.error(tMessages(data.message));
      }
    },
  });
}
