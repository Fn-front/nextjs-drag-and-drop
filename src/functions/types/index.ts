export type FileUploadState = {
  id: string;
  file: File;
  isUploaded: boolean;
  progress: number;
  previewUrl?: string;
  uploadController?: AbortController;
};
