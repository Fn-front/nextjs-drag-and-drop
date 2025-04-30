export const MAX_FILES = 10;
export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export const ACCEPTED_FILE_TYPES = {
  'image/jpeg': [],
  'image/png': [],
  'application/pdf': [],
};

export const ERROR_MESSAGES = {
  fileTooLarge: (filename: string) =>
    `${filename} のファイルサイズが大きすぎます。50MB以下のファイルをアップロードしてください。`,
  invalidType: (filename: string) =>
    `${filename} のファイル形式が許可されていません。許可されているファイル形式は jpg, png, pdf です。`,
  default: 'エラーが発生しました。',
  maxFilesExceeded: '最大10ファイルまでアップロードできます。',
  uploadError: (error: unknown) =>
    `アップロード中にエラーが発生しました: ${error}`,
};
