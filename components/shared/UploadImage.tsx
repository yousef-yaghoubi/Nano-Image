'use client';

import { ImageIcon, UploadIcon, XIcon } from 'lucide-react';
import { useFileUpload } from '@/hooks/use-file-upload';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { useField } from 'formik';
import { Label } from '../ui/label';

interface UploadImageProps {
  name: string;
  label: string;
}

export default function UploadImage({ name, label }: UploadImageProps) {
  const [field, , helpers] = useField<string | null>(name);
  const { setValue, setTouched } = helpers;

  const imageUrl = field.value; // Correct

  const maxSizeMB = 5;
  const maxSize = maxSizeMB * 1024 * 1024;
  const [uploading, setUploading] = useState(false);

  const [
    { files, isDragging },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      getInputProps,
    },
  ] = useFileUpload({
    accept: 'image/svg+xml,image/png,image/jpeg,image/jpg,image/gif',
    maxSize,
    maxFiles: 1,
  });

  const previewUrl = files[0]?.preview || imageUrl;

  const handleUploadToCloudinary = async () => {
    const fileItem = files[0]?.file as File;

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', fileItem);

      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      setValue(data.url);
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    if (files[0] && !imageUrl) handleUploadToCloudinary();
  }, [files[0]]);

  useEffect(() => {
    if (imageUrl) {
      setTouched(true);
    } else {
      removeFile(files[0]?.id);
      setValue(null);
    }
  }, [imageUrl]);

  return (
    <div className="flex flex-col gap-2">
      <div className="relative">
        {/* Drop zone */}
        <Label htmlFor={name}>
          {label} <span className="text-destructive">*</span>
        </Label>
        <div
          className="relative flex min-h-52 flex-col items-center justify-center overflow-hidden rounded-xl border border-input border-dashed p-4 transition-colors data-[dragging=true]:bg-accent/50"
          data-dragging={isDragging || undefined}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <input {...getInputProps()} className="sr-only" />

          {previewUrl ? (
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <img
                src={previewUrl}
                className="mx-auto max-h-full rounded object-contain"
                alt={files[0]?.file?.name || 'Uploaded image'}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
              <div className="mb-2 flex size-11 items-center justify-center rounded-full border bg-background">
                <ImageIcon className="size-4 opacity-60" />
              </div>
              <p className="mb-1.5 font-medium text-sm">Drop your image here</p>
              <p className="text-xs text-muted-foreground">
                SVG, PNG, JPG or GIF (max. {maxSizeMB}MB)
              </p>
              <Button
                className="mt-4"
                onClick={openFileDialog}
                variant="outline"
              >
                <UploadIcon className="-ms-1 size-4 opacity-60" />
                Select image
              </Button>
            </div>
          )}
        </div>

        {/* Remove Image */}
        {previewUrl && (
          <Button
            onClick={() => {
              removeFile(files[0]?.id);
              setValue(null);
            }}
            className="absolute top-4 right-4 flex size-8 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
            type="button"
          >
            <XIcon className="size-4" />
          </Button>
        )}
      </div>

      {uploading && (
        <div className="flex items-center gap-2 text-sm">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-r-transparent" />
          Uploading...
        </div>
      )}
    </div>
  );
}
