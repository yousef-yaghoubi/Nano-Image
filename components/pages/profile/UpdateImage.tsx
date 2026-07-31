'use client';

import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import UploadImage from '@/components/shared/UploadImage';
import { useUpdateImage } from '@/hooks/mutations/useProfile';

function UpdateImage() {
  const t = useTranslations('Messages');
  const tPages = useTranslations('Pages.Profile.Image');

  const [fileImage, setFileImage] = useState<File | null>(null);
  const { mutateAsync, isPending } = useUpdateImage();

  const handleSubmit = async () => {
    if (!fileImage) return;

    const response = await mutateAsync({ file: fileImage });
    if (response.status) {
      setFileImage(null);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <UploadImage
        label={tPages('image')}
        method="editProfile"
        onFileSelectEditProfile={setFileImage}
        value={fileImage ? undefined : null}
      />

      <Button
        disabled={!fileImage || isPending}
        className="w-fit"
        onClick={handleSubmit}
      >
        {isPending ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            {t('loading')}
          </>
        ) : (
          'submit'
        )}
      </Button>
    </div>
  );
}

export default UpdateImage;
