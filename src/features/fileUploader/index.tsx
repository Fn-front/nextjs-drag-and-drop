'use client';

import { useCallback } from 'react';
import { FileRejection, useDropzone } from 'react-dropzone';
import { useFileUploader } from '@/functions/hooks/useFileUploader';
import { FilePreview } from '@/components/FilePreview';
import { MAX_FILES, MAX_FILE_SIZE, ACCEPTED_FILE_TYPES, ERROR_MESSAGES } from '@/functions/constants';

const FileUploader = () => {
  const { files, handleFileUpload, cancelUpload, removeFile } = useFileUploader();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length + files.length > MAX_FILES) {
      alert(ERROR_MESSAGES.maxFilesExceeded);
      return;
    }

    try {
      await Promise.all(acceptedFiles.map(handleFileUpload));
    } catch (error) {
      alert(ERROR_MESSAGES.uploadError(error));
    }
  }, [files.length, handleFileUpload]);

  const onDropRejected = useCallback((rejectedFiles: FileRejection[]) => {
    rejectedFiles.forEach(({ file, errors }) => {
      errors.forEach(({ code }) => {
        const message = code === 'file-too-large'
          ? ERROR_MESSAGES.fileTooLarge(file.name)
          : code === 'file-invalid-type'
            ? ERROR_MESSAGES.invalidType(file.name)
            : ERROR_MESSAGES.default;
        alert(message);
      });
    });
  }, []);

  const { getRootProps, getInputProps, isDragAccept, isDragReject } = useDropzone({
    onDrop,
    onDropRejected,
    accept: ACCEPTED_FILE_TYPES,
    maxSize: MAX_FILE_SIZE,
  });

  return (
    <div className='w-full max-w-4xl mx-auto p-4'>
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
          ${isDragAccept ? 'border-green-500 bg-green-50' : ''}
          ${isDragReject ? 'border-red-500 bg-red-50' : ''}
        `}
      >
        <input {...getInputProps()} />
        <p className='text-lg font-medium mb-2'>
          {isDragAccept
            ? 'ファイルをアップロードします。'
            : isDragReject
              ? 'エラー'
              : 'ファイルを登録してください。'}
        </p>
        <p className='mb-4'>
          {isDragReject
            ? 'このファイル形式のアップロードは許可されていません。'
            : 'ファイルを選択するか、ドラッグアンドドロップしてください。'}
        </p>
        <button
          className='px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50'
          disabled={isDragReject}
        >
          ファイルを選択
        </button>
      </div>

      <div className='mt-4 text-sm text-gray-600'>
        <p>複数のファイルを選択できます。pdf, png, jpg, jpeg ファイルを選択できます。</p>
        <p className='text-red-500'>※1ファイルの最大サイズは50MBです</p>
      </div>

      {files.length > 0 && (
        <div className='mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
          {files.map((file) => (
            <FilePreview
              key={file.id}
              file={file}
              onCancel={cancelUpload}
              onRemove={removeFile}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUploader;