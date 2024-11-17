import { FileUploadState } from '@/functions/types'
import { FileIcon, X, Trash } from 'lucide-react';

interface FilePreviewProps {
  file: FileUploadState;
  onCancel: (id: string) => void;
  onRemove: (id: string) => void;
}

export const FilePreview: React.FC<FilePreviewProps> = ({ file, onCancel, onRemove }) => {
  const isImage = file!.file.type.startsWith('image/');

  return (
    <div className='relative group'>
      <div className='p-4 bg-gray-50 rounded-lg'>
        {isImage && file!.previewUrl ? (
          <div className='relative w-full aspect-video'>
            <img
              src={file!.previewUrl}
              alt={file!.file.name}
              className='object-contain w-full h-full rounded'
            />
          </div>
        ) : (
          <div className='flex items-center justify-center aspect-video bg-gray-100 rounded'>
            <FileIcon className='w-12 h-12 text-gray-400' />
          </div>
        )}

        <div className='mt-2'>
          <p className='text-sm font-medium truncate text-black'>{file!.file.name}</p>
          {!file!.isUploaded && (
            <div className='mt-2'>
              <div className='h-2 bg-gray-200 rounded-full overflow-hidden'>
                <div
                  className='h-full bg-blue-500 transition-all duration-300'
                  style={{ width: `${file!.progress}%` }}
                />
              </div>
              <p className='text-xs text-gray-500 mt-1'>
                {file!.progress.toFixed(0)}%
              </p>
            </div>
          )}
        </div>
      </div>

      <div className='absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity'>
        {!file!.isUploaded ? (
          <button
            onClick={() => onCancel(file!.id)}
            className='p-1 bg-red-500 text-white rounded-full hover:bg-red-600'
          >
            <X className='w-4 h-4' />
          </button>
        ) : (
          <button
            onClick={() => onRemove(file!.id)}
            className='p-1 bg-gray-500 text-white rounded-full hover:bg-gray-600'
          >
            <Trash className='w-4 h-4' />
          </button>
        )}
      </div>
    </div>
  );
};

export default FilePreview;