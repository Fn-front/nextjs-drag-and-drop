export interface FileUploadState {
  id: string;
  file: File;
  isUploaded: boolean;
  progress: number;
  previewUrl?: string;
  uploadController?: AbortController;
}
