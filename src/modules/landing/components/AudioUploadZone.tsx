import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AudioUploadZoneProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
  className?: string;
}

// Extended list to include both audio and video formats supported by the backend
// Audio:  .wav, .mp3, .m4a, .flac, .ogg, .aac, .wma
// Video:  .mp4, .mkv, .mov, .avi, .webm
const SUPPORTED_FORMATS = [
  'mp3',
  'wav',
  'm4a',
  'aac',
  'ogg',
  'flac',
  'wma',
  'mp4',
  'mkv',
  'mov',
  'avi',
  'webm',
];
const MAX_FILE_SIZE_MB = 100;

export const AudioUploadZone: React.FC<AudioUploadZoneProps> = ({
  onFileSelect,
  disabled = false,
  className,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback((file: File): { valid: boolean; error?: string } => {
    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > MAX_FILE_SIZE_MB) {
      return {
        valid: false,
        error: `File too large (${fileSizeMB.toFixed(1)}MB). Max ${MAX_FILE_SIZE_MB}MB.`,
      };
    }

    // Check file type
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (!fileExtension || !SUPPORTED_FORMATS.includes(fileExtension)) {
      return {
        valid: false,
        error: `Unsupported format. Use: ${SUPPORTED_FORMATS.join(', ')}`,
      };
    }

    return { valid: true };
  }, []);

  const handleFile = useCallback(
    (file: File) => {
      setError('');
      const validation = validateFile(file);

      if (!validation.valid) {
        setError(validation.error || 'Invalid file');
        return;
      }

      setSelectedFile(file);
      onFileSelect(file);
    },
    [validateFile, onFileSelect]
  );

  // Helper to determine if file will use direct upload
  const willUseDirectUpload = (file: File | null): boolean => {
    if (!file) return false;
    const DIRECT_UPLOAD_THRESHOLD = 4 * 1024 * 1024; // 4MB
    return file.size > DIRECT_UPLOAD_THRESHOLD;
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
  }, []);

  const handleDragEnter = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!disabled) {
        setIsDragOver(true);
      }
    },
    [disabled]
  );

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;

    if (x < rect.left || x >= rect.right || y < rect.top || y >= rect.bottom) {
      setIsDragOver(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);

      if (disabled) return;

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        handleFile(files[0]);
      }
    },
    [disabled, handleFile]
  );

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFile(file);
      }
    },
    [handleFile]
  );

  const clearFile = useCallback(() => {
    setSelectedFile(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  return (
    <div className={cn('w-full', className)}>
      <div
        className={cn(
          'relative border-2 border-dashed rounded-lg transition-all duration-200 cursor-pointer',
          'h-20 flex items-center justify-center p-3',
          {
            'border-blue-400 bg-blue-50': isDragOver && !disabled,
            'border-gray-300 hover:border-gray-400': !isDragOver && !disabled && !error,
            'border-red-300 bg-red-50': error,
            'border-gray-200 bg-gray-50 cursor-not-allowed': disabled,
            'border-green-400 bg-green-50': selectedFile && !error,
          }
        )}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        {/* Content */}
        {selectedFile && !error ? (
          <div className="flex items-center space-x-3 w-full">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{selectedFile.name}</p>
            </div>
            <button
              onClick={e => {
                e.stopPropagation();
                clearFile();
              }}
              className="p-1 text-gray-400 hover:text-gray-600 rounded"
              disabled={disabled}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : error ? (
          <div className="flex items-center space-x-2 text-red-600">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        ) : (
          <div className="flex items-center space-x-2 text-gray-600">
            <Upload className="w-4 h-4" />
            <span className="text-sm">{isDragOver ? 'Drop file here' : 'Drag file or click'}</span>
          </div>
        )}

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*,video/*"
          onChange={handleFileInputChange}
          className="hidden"
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default AudioUploadZone;
