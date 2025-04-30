import { useState, useCallback } from 'react';
import { nanoid } from 'nanoid';
import type { FileUploadState } from '@/functions/types';
import { ERROR_MESSAGES } from '@/functions/constants';

export const useFileUploader = () => {
  const [files, setFiles] = useState<FileUploadState[]>([]);

  const createPreviewUrl = useCallback((file: File): string | undefined => {
    if (file.type.startsWith('image/')) {
      return URL.createObjectURL(file);
    }
    return undefined;
  }, []);

  const simulateFileUpload = async (
    file: File,
    onProgress: (progress: number) => void,
    signal: AbortSignal,
  ): Promise<void> => {
    const totalChunks = 100;
    const chunkTime = Math.random() * 90 + 10; // 10-100ms per chunk

    for (let i = 0; i < totalChunks; i++) {
      if (signal.aborted) {
        throw new Error('Upload cancelled');
      }
      await new Promise((resolve) => setTimeout(resolve, chunkTime));
      onProgress(((i + 1) / totalChunks) * 100);
    }
  };

  const handleFileUpload = async (file: File): Promise<void> => {
    const id = nanoid();
    const previewUrl = createPreviewUrl(file);
    const uploadController = new AbortController();

    try {
      setFiles((prev) => [
        ...prev,
        {
          id,
          file,
          isUploaded: false,
          progress: 0,
          previewUrl,
          uploadController,
        },
      ]);

      await simulateFileUpload(
        file,
        (progress) => {
          setFiles((prev) =>
            prev.map((f) => (f.id === id ? { ...f, progress } : f)),
          );
        },
        uploadController.signal,
      );

      setFiles((prev) =>
        prev.map((f) => (f.id === id ? { ...f, isUploaded: true } : f)),
      );
    } catch (error) {
      if ((error as Error).message === 'Upload cancelled') {
        setFiles((prev) => prev.filter((f) => f.id !== id));
      } else {
        alert(ERROR_MESSAGES.uploadError(error));
        setFiles((prev) => prev.filter((f) => f.id !== id));
      }
    }
  };

  const cancelUpload = useCallback((id: string) => {
    setFiles((prev) => {
      const file = prev.find((f) => f.id === id);
      file?.uploadController?.abort();
      return prev.filter((f) => f.id !== id);
    });
  }, []);

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => {
      const file = prev.find((f) => f.id === id);
      if (file?.previewUrl) {
        URL.revokeObjectURL(file.previewUrl);
      }
      return prev.filter((f) => f.id !== id);
    });
  }, []);

  return {
    files,
    handleFileUpload,
    cancelUpload,
    removeFile,
  };
};
