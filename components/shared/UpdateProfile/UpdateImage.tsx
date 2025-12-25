'use client';

import { AddImage } from '@/app/[locale]/actions/EditProfile';
import UploadImage from '../UploadImage';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

function UpdateImage() {
  const t = useTranslations('Messages');
  const tPages = useTranslations('Pages.Profile.Image');

  const [fileImage, setFileImage] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);

  const handleSubmit = async () => {
    if (!fileImage) return;
    setUploading(true);
    try {
      // Replace this with your upload API
      const response = await AddImage({ file: fileImage });
      if (response.status) {
        toast.success(response.message);
        setFileImage(null);
      } else {
        toast.error(response && response.message);
      }
    } catch (error) {
      toast.error('Upload failed');
      console.error('Upload failed', error);
    } finally {
      setUploading(false);
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
        disabled={!fileImage || uploading}
        className="w-fit"
        onClick={handleSubmit}
      >
        {uploading ? (
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
