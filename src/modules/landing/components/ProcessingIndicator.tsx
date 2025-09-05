import React, { useState, useEffect } from 'react';
import { Loader2, Volume2, Brain, FileText, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProcessingIndicatorProps {
  isProcessing: boolean;
  processingStage?: 'uploading' | 'processing' | 'analyzing' | 'transcribing' | 'complete';
  progress?: number;
  onCancel?: () => void;
  className?: string;
}

const PROCESSING_STAGES = [
  {
    stage: 'uploading',
    title: 'Uploading file...',
    description: 'Preparing your audio file',
    icon: Volume2,
    color: 'blue',
  },
  {
    stage: 'processing',
    title: 'Processing audio...',
    description: 'Analyzing audio quality and format',
    icon: Loader2,
    color: 'purple',
  },
  {
    stage: 'analyzing',
    title: 'Analyzing speech...',
    description: 'Detecting language and speakers',
    icon: Brain,
    color: 'indigo',
  },
  {
    stage: 'transcribing',
    title: 'Generating transcription...',
    description: 'Converting speech to text',
    icon: FileText,
    color: 'green',
  },
];

export const ProcessingIndicator: React.FC<ProcessingIndicatorProps> = ({
  isProcessing,
  processingStage = 'processing',
  progress,
  onCancel,
  className,
}) => {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [animatedProgress, setAnimatedProgress] = useState(0);

  // Auto-advance stages if no specific stage is provided
  useEffect(() => {
    if (!isProcessing) {
      setCurrentStageIndex(0);
      return;
    }

    const stageIndex = PROCESSING_STAGES.findIndex(s => s.stage === processingStage);
    if (stageIndex >= 0) {
      setCurrentStageIndex(stageIndex);
    } else {
      // Auto-cycle through stages
      const interval = setInterval(() => {
        setCurrentStageIndex(prev => (prev + 1) % PROCESSING_STAGES.length);
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [isProcessing, processingStage]);

  // Animate progress
  useEffect(() => {
    if (!isProcessing) {
      setAnimatedProgress(0);
      return;
    }

    if (progress !== undefined) {
      setAnimatedProgress(progress);
    } else {
      // Auto-increment progress
      const interval = setInterval(() => {
        setAnimatedProgress(prev => Math.min(prev + Math.random() * 5, 95));
      }, 200);

      return () => clearInterval(interval);
    }
  }, [isProcessing, progress]);

  if (!isProcessing) return null;

  const currentStage = PROCESSING_STAGES[currentStageIndex];
  const IconComponent = currentStage.icon;

  return (
    <div className={cn('w-full max-w-md mx-auto', className)}>
      {/* Main Processing Card */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-lg">
        {/* Header with Cancel Button */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Processing Audio</h3>
          {onCancel && (
            <button
              onClick={onCancel}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
              title="Cancel processing"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Current Stage */}
        <div className="flex items-center space-x-3 mb-4">
          <div
            className={cn(
              'w-10 h-10 rounded-full flex items-center justify-center',
              `bg-${currentStage.color}-100 text-${currentStage.color}-600`
            )}
          >
            <IconComponent
              className={cn('w-5 h-5', currentStage.icon === Loader2 && 'animate-spin')}
            />
          </div>

          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">{currentStage.title}</p>
            <p className="text-xs text-gray-600">{currentStage.description}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-gray-600">Progress</span>
            <span className="text-xs text-gray-600">{Math.round(animatedProgress)}%</span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={cn(
                'h-2 rounded-full transition-all duration-300 ease-out',
                `bg-gradient-to-r from-${currentStage.color}-400 to-${currentStage.color}-600`
              )}
              style={{ width: `${animatedProgress}%` }}
            />
          </div>
        </div>

        {/* Stage Indicators */}
        <div className="flex justify-between items-center">
          {PROCESSING_STAGES.map((stage, index) => (
            <div
              key={stage.stage}
              className={cn(
                'flex flex-col items-center space-y-1 flex-1',
                index > 0 && 'border-l border-gray-200 ml-2 pl-2'
              )}
            >
              <div
                className={cn(
                  'w-6 h-6 rounded-full flex items-center justify-center text-xs transition-all duration-300',
                  {
                    [`bg-${stage.color}-600 text-white`]: index === currentStageIndex,
                    [`bg-${stage.color}-100 text-${stage.color}-600`]: index < currentStageIndex,
                    'bg-gray-100 text-gray-400': index > currentStageIndex,
                  }
                )}
              >
                {index < currentStageIndex ? '✓' : index + 1}
              </div>

              <span
                className={cn('text-xs text-center transition-colors duration-300', {
                  'text-gray-900 font-medium': index === currentStageIndex,
                  'text-gray-600': index < currentStageIndex,
                  'text-gray-400': index > currentStageIndex,
                })}
              >
                {stage.stage.charAt(0).toUpperCase() + stage.stage.slice(1)}
              </span>
            </div>
          ))}
        </div>

        {/* Waveform Animation */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-center space-x-1 h-8">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  'w-1 rounded-full transition-all duration-200',
                  `bg-gradient-to-t from-${currentStage.color}-400 to-${currentStage.color}-600`
                )}
                style={{
                  height: `${8 + Math.sin(Date.now() / 200 + i * 0.5) * 12}px`,
                  animationDelay: `${i * 50}ms`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessingIndicator;
