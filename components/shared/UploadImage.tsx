'use client';

import { ImageIcon, UploadIcon, XIcon } from 'lucide-react';
import { useFileUpload } from '@/hooks/use-file-upload';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { useField, useFormikContext } from 'formik';
import { Label } from '../ui/label';

interface UploadImageProps {
  name?: string; // Optional when not using Formik
  label: string;
  method?: 'api' | 'editProfile'; // Method selector: 'api' (default) or 'editProfile'
  onFileSelectEditProfile?: (file: File | null) => void; // Called in 'editProfile' method
  important?: boolean;
  // Optional props for non-Formik usage
  value?: string | null;
  onChange?: (url: string | null) => void;
}

/**
 * UploadImage component can work in two modes:
 * 1. Default ('api'): uploads image to API and sets image URL field.
 * 2. 'editProfile': sends file to EditImage in EditProfile via onFileSelectEditProfile callback, does NOT upload to API.
 *
 * Formik is optional - if Formik context is available and 'name' is provided, it will use Formik.
 * Otherwise, it uses local state and optional value/onChange props.
 */
export default function UploadImage({
  name,
  label,
  method = 'api',
  onFileSelectEditProfile,
  important = false,
  value: controlledValue,
  onChange: controlledOnChange,
}: UploadImageProps) {
  // Try to use Formik if context is available and name is provided
  const formikContext = useFormikContext();
  const hasFormik = formikContext && name;

  // Use Formik field if available, otherwise use local state or controlled props
  let field: { value: string | null } | null = null;
  let helpers: {
    setValue: (value: string | null) => void;
    setTouched: (touched: boolean) => void;
  } | null = null;

  if (hasFormik) {
    try {
      const [formikField, , formikHelpers] = useField<string | null>(name!);
      field = formikField;
      helpers = formikHelpers;
    } catch {
      // Formik context exists but useField failed, fall back to local state
      console.warn(
        'Formik context detected but useField failed, using local state'
      );
    }
  }

  // Local state for non-Formik usage
  const [localValue, setLocalValue] = useState<string | null>(
    controlledValue ?? null
  );

  // Determine the current image URL
  const imageUrl = field?.value ?? controlledValue ?? localValue;

  // Wrapper functions for setting value
  const setValue = (url: string | null) => {
    if (helpers) {
      helpers.setValue(url);
    } else if (controlledOnChange) {
      controlledOnChange(url);
    } else {
      setLocalValue(url);
    }
  };

  const setTouched = (touched: boolean) => {
    if (helpers) {
      helpers.setTouched(touched);
    }
    // No-op for non-Formik usage
  };

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
    accept: 'image/png,image/jpeg,image/jpg',
    maxSize,
    maxFiles: 1,
  });

  // Show preview of selected file or value of field (URL string)
  const previewUrl = files[0]?.preview || imageUrl;

  // Upload to API (Cloudinary) - for "api" mode only
  const handleUploadToCloudinary = async () => {
    const fileItem = files[0]?.file as File;

    if (!fileItem) return;
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

  // On file select (handles both methods)
  useEffect(() => {
    if (files[0]) {
      if (method === 'api') {
        // Method 1: Send file to API, save URL to form
        if (!imageUrl) handleUploadToCloudinary();
      } else if (method === 'editProfile') {
        // Method 2: Pass file object to parent handler (do not upload, do not set form value)
        if (typeof onFileSelectEditProfile === 'function') {
          const selectedFile = files[0].file;
          // Only call if it's an actual File (not FileMetadata from react-upload-kit)
          if (selectedFile instanceof File) {
            onFileSelectEditProfile(selectedFile);
          }
        }
      }
      // Optionally set touched so Formik shows error for required profile image
      setTouched(true);
    }
  }, [files[0]]);

  // Sync controlled value prop changes
  useEffect(() => {
    if (controlledValue !== undefined && !field) {
      setLocalValue(controlledValue);
    }
  }, [controlledValue, field]);

  // For method=api, keep Formik "touched" and clear/remove if unset
  // For editProfile, don't clear form value (always null), but remove file if user clicks remove
  useEffect(() => {
    if (method === 'api') {
      if (imageUrl) {
        setTouched(true);
      } else {
        removeFile(files[0]?.id);
        setValue(null);
      }
    }
  }, [imageUrl, method]);

  // Clear files when controlled value becomes null in editProfile mode
  useEffect(() => {
    if (method === 'editProfile' && controlledValue === null && files[0]) {
      removeFile(files[0]?.id);
    }
  }, [controlledValue, method]);

  // Remove button handler
  const onRemove = () => {
    removeFile(files[0]?.id);
    if (method === 'api') {
      setValue(null);
    }
    // In editProfile mode, do not update formik value
    if (
      typeof onFileSelectEditProfile === 'function' &&
      method === 'editProfile'
    ) {
      onFileSelectEditProfile(null); // indicate clear
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="relative">
        {/* Drop zone */}
        <Label htmlFor={name || 'upload-image'}>
          {label} {important && <span className="text-destructive">*</span>}
        </Label>
        <div
          className="relative flex min-h-52 mt-2 flex-col items-center justify-center overflow-hidden rounded-xl border border-input border-dashed p-4 transition-colors data-[dragging=true]:bg-accent/50"
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
                PNG or JPG (max. {maxSizeMB}MB)
              </p>
              <Button
                className="mt-4"
                onClick={openFileDialog}
                variant="outline"
                type="button"
              >
                <UploadIcon className="-ms-1 size-4 opacity-60" />
                Select image
              </Button>
            </div>
          )}
        </div>

        {/* Remove Image / File */}
        {previewUrl && (
          <Button
            onClick={onRemove}
            className="absolute top-6 right-4 flex size-8 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
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
