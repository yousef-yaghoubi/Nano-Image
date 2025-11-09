'use client';

import {
  useCallback,
  useRef,
  useState,
  useEffect,
  type ChangeEvent,
  type DragEvent,
  type InputHTMLAttributes,
} from 'react';

export type FileMetadata = {
  name: string;
  size: number;
  type: string;
  url: string;
  id: string;
};

export type FileWithPreview = {
  file: File | FileMetadata;
  id: string;
  preview?: string;
};

export type FileUploadOptions = {
  maxFiles?: number;
  maxSize?: number;
  accept?: string;
  multiple?: boolean;
  initialFiles?: FileMetadata[];
  onFilesChange?: (files: FileWithPreview[]) => void;
  onFilesAdded?: (addedFiles: FileWithPreview[]) => void;
};

export type FileUploadState = {
  files: FileWithPreview[];
  isDragging: boolean;
  errors: string[];
};

export type FileUploadActions = {
  addFiles: (files: FileList | File[]) => void;
  removeFile: (id: string) => void;
  clearFiles: () => void;
  clearErrors: () => void;
  handleDragEnter: (e: DragEvent<HTMLElement>) => void;
  handleDragLeave: (e: DragEvent<HTMLElement>) => void;
  handleDragOver: (e: DragEvent<HTMLElement>) => void;
  handleDrop: (e: DragEvent<HTMLElement>) => void;
  handleFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  openFileDialog: () => void;
  getInputProps: (
    props?: InputHTMLAttributes<HTMLInputElement>,
  ) => InputHTMLAttributes<HTMLInputElement> & {
    ref: unknown;
  };
};

export const useFileUpload = (
  options: FileUploadOptions = {},
): [FileUploadState, FileUploadActions] => {
  const {
    maxSize = 2,
    accept = '*',
    multiple = false,
    initialFiles = [],
    onFilesChange,
    onFilesAdded,
  } = options;

  const [state, setState] = useState<FileUploadState>({
    files: initialFiles.map((file) => ({
      file,
      id: file.id,
      preview: file.url,
    })),
    isDragging: false,
    errors: [],
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const objectUrlsRef = useRef<Set<string>>(new Set());
  const addedFilesRef = useRef<FileWithPreview[]>([]);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      objectUrlsRef.current.clear();
    };
  }, []);

  const revokeObjectUrl = useCallback((url: string) => {
    if (objectUrlsRef.current.has(url)) {
      URL.revokeObjectURL(url);
      objectUrlsRef.current.delete(url);
    }
  }, []);

  const validateFile = useCallback(
    (file: File | FileMetadata): string | null => {
      if (file.size > maxSize) {
        return `File "${file.name}" exceeds the maximum size of ${formatBytes(maxSize)}.`;
      }

      if (accept !== '*') {
        const acceptedTypes = accept.split(',').map((t) => t.trim());
        const fileType = file.type || '';
        const fileExtension = `.${file.name.split('.').pop()?.toLowerCase() || ''}`;

        const isAccepted = acceptedTypes.some((type) => {
          if (type.startsWith('.')) return fileExtension === type.toLowerCase();
          if (type.endsWith('/*')) return fileType.startsWith(type.split('/')[0] + '/');
          return fileType === type;
        });

        if (!isAccepted) return `File "${file.name}" is not an accepted file type.`;
      }

      return null;
    },
    [accept, maxSize],
  );

  const createPreview = useCallback((file: File | FileMetadata): string | undefined => {
    if (file instanceof File) {
      const url = URL.createObjectURL(file);
      objectUrlsRef.current.add(url);
      return url;
    }
    return file.url;
  }, []);

  const generateUniqueId = useCallback((file: File | FileMetadata) => {
    if (file instanceof File) {
      return `${file.name}-${file.size}-${file.lastModified}-${Math.random().toString(36).substring(2, 9)}`;
    }
    return file.id;
  }, []);

  const cleanupFiles = useCallback(
    (files: FileWithPreview[]) => {
      files.forEach((f) => {
        if (f.preview && f.file instanceof File && f.file.type.startsWith('image/')) {
          revokeObjectUrl(f.preview);
        }
      });
    },
    [revokeObjectUrl],
  );

  const clearFiles = useCallback(() => {
    setState((prev) => {
      cleanupFiles(prev.files);
      if (inputRef.current) inputRef.current.value = '';
      return { ...prev, files: [], errors: [] };
    });
  }, [cleanupFiles]);

  const addFiles = useCallback(
    (newFiles: FileList | File[]) => {
      if (!newFiles || newFiles.length === 0) return;

      setState((prev) => {
        const currentFiles = multiple ? [...prev.files] : [];
        if (!multiple && currentFiles.length > 0) cleanupFiles(currentFiles);

        const newFilesArray = Array.from(newFiles);
        const validFiles: FileWithPreview[] = [];
        const errors: string[] = [];

        newFilesArray.forEach((file) => {
          const isDuplicate =
            multiple &&
            currentFiles.some((f) => {
              const fFile = f.file;
              return (
                fFile.name === file.name &&
                fFile.size === file.size &&
                (fFile instanceof File ? fFile.lastModified === file.lastModified : true)
              );
            });
          if (isDuplicate) return;

          const error = validateFile(file);
          if (error) errors.push(error);
          else validFiles.push({ file, id: generateUniqueId(file), preview: createPreview(file) });
        });

        if (validFiles.length > 0) {
          addedFilesRef.current = validFiles;
          const updatedFiles = multiple ? [...currentFiles, ...validFiles] : validFiles;
          return { ...prev, files: updatedFiles, errors: errors.length > 0 ? errors : [] };
        } else if (errors.length > 0) {
          return { ...prev, errors };
        }
        return prev;
      });
    },
    [multiple, validateFile, generateUniqueId, createPreview, cleanupFiles],
  );

  const removeFile = useCallback(
    (id: string) => {
      setState((prev) => {
        const fileToRemove = prev.files.find((f) => f.id === id);
        if (fileToRemove) cleanupFiles([fileToRemove]);
        return { ...prev, files: prev.files.filter((f) => f.id !== id), errors: [] };
      });
    },
    [cleanupFiles],
  );

  const clearErrors = useCallback(() => setState((prev) => ({ ...prev, errors: [] })), []);

  const handleDragEnter = useCallback((e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setState((prev) => ({ ...prev, isDragging: true }));
  }, []);
  const handleDragLeave = useCallback((e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setState((prev) => ({ ...prev, isDragging: false }));
  }, []);
  const handleDragOver = useCallback((e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);
  const handleDrop = useCallback(
    (e: DragEvent<HTMLElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setState((prev) => ({ ...prev, isDragging: false }));
      if (inputRef.current?.disabled) return;
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) addFiles(e.dataTransfer.files);
    },
    [addFiles],
  );

  const handleFileChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) addFiles(e.target.files);
    },
    [addFiles],
  );

  const openFileDialog = useCallback(() => {
    if (inputRef.current && !inputRef.current.disabled) inputRef.current.click();
  }, []);

  const getInputProps = useCallback(
    (props: InputHTMLAttributes<HTMLInputElement> = {}) => ({
      ...props,
      type: 'file' as const,
      onChange: handleFileChange,
      accept: props.accept || accept,
      multiple: props.multiple ?? multiple,
      ref: inputRef as unknown,
      style: { display: 'none', ...props.style },
    }),
    [accept, multiple, handleFileChange],
  );

  // ✅ اجرا کردن callbacks بعد از تغییر state
  useEffect(() => {
    if (onFilesChange) onFilesChange(state.files);
    if (onFilesAdded && addedFilesRef.current.length > 0) {
      onFilesAdded(addedFilesRef.current);
      addedFilesRef.current = [];
    }
  }, [state.files, onFilesChange, onFilesAdded]);

  return [
    state,
    {
      addFiles,
      removeFile,
      clearFiles,
      clearErrors,
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      handleFileChange,
      openFileDialog,
      getInputProps,
    },
  ];
};

export const formatBytes = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return '0 Bytes';
  if (bytes === Infinity) return 'Unlimited';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${Number((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};
