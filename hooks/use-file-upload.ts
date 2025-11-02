"use client";

import {
  useCallback,
  useRef,
  useState,
  useEffect,
  type ChangeEvent,
  type DragEvent,
  type InputHTMLAttributes,
} from "react";

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
    props?: InputHTMLAttributes<HTMLInputElement>
  ) => InputHTMLAttributes<HTMLInputElement> & {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: any;
  };
};

export const useFileUpload = (
  options: FileUploadOptions = {}
): [FileUploadState, FileUploadActions] => {
  const {
    maxFiles = 1,
    maxSize = 5,
    accept = "*",
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

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      objectUrlsRef.current.forEach((url) => {
        URL.revokeObjectURL(url);
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
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
      // Check size
      if (file.size > maxSize) {
        return `File "${file.name}" exceeds the maximum size of ${formatBytes(
          maxSize
        )}.`;
      }

      // Check type
      if (accept !== "*") {
        const acceptedTypes = accept.split(",").map((type) => type.trim());
        const fileType = file.type || "";
        const fileExtension = `.${
          file.name.split(".").pop()?.toLowerCase() || ""
        }`;

        const isAccepted = acceptedTypes.some((type) => {
          if (type.startsWith(".")) {
            return fileExtension === type.toLowerCase();
          }
          if (type.endsWith("/*")) {
            const baseType = type.split("/")[0];
            return fileType.startsWith(`${baseType}/`);
          }
          return fileType === type;
        });

        if (!isAccepted) {
          return `File "${file.name}" is not an accepted file type.`;
        }
      }

      return null;
    },
    [accept, maxSize]
  );

  const createPreview = useCallback(
    (file: File | FileMetadata): string | undefined => {
      if (file instanceof File) {
        const url = URL.createObjectURL(file);
        objectUrlsRef.current.add(url);
        return url;
      }
      return file.url;
    },
    []
  );

  const generateUniqueId = useCallback((file: File | FileMetadata): string => {
    if (file instanceof File) {
      return `${file.name}-${file.size}-${file.lastModified}-${Math.random()
        .toString(36)
        .substring(2, 9)}`;
    }
    return file.id;
  }, []);

  const cleanupFiles = useCallback(
    (files: FileWithPreview[]) => {
      files.forEach((fileWithPreview) => {
        if (
          fileWithPreview.preview &&
          fileWithPreview.file instanceof File &&
          fileWithPreview.file.type.startsWith("image/")
        ) {
          revokeObjectUrl(fileWithPreview.preview);
        }
      });
    },
    [revokeObjectUrl]
  );

  const clearFiles = useCallback(() => {
    setState((prev) => {
      cleanupFiles(prev.files);

      if (inputRef.current) {
        inputRef.current.value = "";
      }

      const newState = {
        ...prev,
        files: [],
        errors: [],
      };

      onFilesChange?.(newState.files);
      return newState;
    });
  }, [onFilesChange, cleanupFiles]);

  const addFiles = useCallback(
    (newFiles: FileList | File[]) => {
      if (!newFiles || newFiles.length === 0) return;

      setState((prev) => {
        const newFilesArray = Array.from(newFiles);
        const errors: string[] = [];

        // In single file mode, clean up existing files
        let currentFiles = prev.files;
        if (!multiple && currentFiles.length > 0) {
          cleanupFiles(currentFiles);
          currentFiles = [];
        }

        // Check if adding these files would exceed maxFiles
        if (
          multiple &&
          maxFiles !== Infinity &&
          currentFiles.length + newFilesArray.length > maxFiles
        ) {
          errors.push(`You can only upload a maximum of ${maxFiles} files.`);
          return { ...prev, errors };
        }

        const validFiles: FileWithPreview[] = [];

        newFilesArray.forEach((file) => {
          // Check for duplicates in multiple mode
          if (multiple) {
            const isDuplicate = currentFiles.some((existingFile) => {
              const existingFileObj = existingFile.file;
              return (
                existingFileObj.name === file.name &&
                existingFileObj.size === file.size &&
                (existingFileObj instanceof File
                  ? existingFileObj.lastModified === file.lastModified
                  : true)
              );
            });

            if (isDuplicate) {
              return;
            }
          }

          const error = validateFile(file);
          if (error) {
            errors.push(error);
          } else {
            validFiles.push({
              file,
              id: generateUniqueId(file),
              preview: createPreview(file),
            });
          }
        });

        // Only update if we have valid files
        if (validFiles.length > 0) {
          onFilesAdded?.(validFiles);

          const newFiles = multiple
            ? [...currentFiles, ...validFiles]
            : validFiles;
          onFilesChange?.(newFiles);

          // Reset input after successful upload
          if (inputRef.current) {
            inputRef.current.value = "";
          }

          return {
            ...prev,
            files: newFiles,
            errors: errors.length > 0 ? errors : [],
          };
        } else if (errors.length > 0) {
          return {
            ...prev,
            errors,
          };
        }

        return prev;
      });
    },
    [
      maxFiles,
      multiple,
      validateFile,
      createPreview,
      generateUniqueId,
      cleanupFiles,
      onFilesChange,
      onFilesAdded,
    ]
  );

  const removeFile = useCallback(
    (id: string) => {
      setState((prev) => {
        const fileToRemove = prev.files.find((file) => file.id === id);

        if (fileToRemove) {
          cleanupFiles([fileToRemove]);
        }

        const newFiles = prev.files.filter((file) => file.id !== id);
        onFilesChange?.(newFiles);

        return {
          ...prev,
          files: newFiles,
          errors: [],
        };
      });
    },
    [onFilesChange, cleanupFiles]
  );

  const clearErrors = useCallback(() => {
    setState((prev) => ({
      ...prev,
      errors: [],
    }));
  }, []);

  const handleDragEnter = useCallback((e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setState((prev) => ({ ...prev, isDragging: true }));
  }, []);

  const handleDragLeave = useCallback((e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.currentTarget.contains(e.relatedTarget as Node)) {
      return;
    }

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

      if (inputRef.current?.disabled) {
        return;
      }

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        if (!multiple) {
          addFiles([e.dataTransfer.files[0]]);
        } else {
          addFiles(e.dataTransfer.files);
        }
      }
    },
    [addFiles, multiple]
  );

  const handleFileChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        addFiles(e.target.files);
      }
    },
    [addFiles]
  );

  const openFileDialog = useCallback(() => {
    if (inputRef.current && !inputRef.current.disabled) {
      inputRef.current.click();
    }
  }, []);

  const getInputProps = useCallback(
    (props: InputHTMLAttributes<HTMLInputElement> = {}) => {
      return {
        ...props,
        type: "file" as const,
        onChange: handleFileChange,
        accept: props.accept || accept,
        multiple: props.multiple !== undefined ? props.multiple : multiple,
        ref: inputRef as unknown,
        style: { display: "none", ...props.style },
      };
    },
    [accept, multiple, handleFileChange]
  );

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
  if (bytes === 0) return "0 Bytes";
  if (bytes === Infinity) return "Unlimited";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${Number.parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${
    sizes[i]
  }`;
};
