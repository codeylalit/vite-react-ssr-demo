import React from 'react';
import { AlertCircle, RefreshCw, X } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

interface ErrorDisplayProps {
  error: string;
  onRetry?: () => void;
  onDismiss: () => void;
  retryable?: boolean;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  onRetry,
  onDismiss,
  retryable = true,
}) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-4 my-4">
      <div className="flex items-start space-x-3">
        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h4 className="text-sm font-medium text-red-800">Transcription Error</h4>
          <p className="text-sm text-red-700 mt-1">{error}</p>
          {retryable && onRetry && (
            <div className="flex items-center space-x-2 mt-3">
              <Button
                onClick={onRetry}
                size="sm"
                variant="outline"
                className="text-red-700 border-red-300 hover:bg-red-100"
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                Try Again
              </Button>
            </div>
          )}
        </div>
        <button onClick={onDismiss} className="text-red-400 hover:text-red-600 transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
