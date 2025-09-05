import React, { useState, useEffect } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Mic, Square } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RecordingControlsProps {
  isRecording: boolean;
  isProcessing: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  disabled?: boolean;
  className?: string;
  audioLevel?: number; // Real-time audio level (0-100)
}

export const RecordingControls: React.FC<RecordingControlsProps> = ({
  isRecording,
  isProcessing,
  onStartRecording,
  onStopRecording,
  disabled = false,
  className,
  audioLevel = 0,
}) => {
  const [recordingDuration, setRecordingDuration] = useState(0);

  // Track recording duration
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRecording) {
      interval = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    } else {
      setRecordingDuration(0);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording]);

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isDisabled = disabled || isProcessing;

  return (
    <div className={cn('w-full', className)}>
      {/* Fixed container to prevent layout shifts - Reduced height since we removed upload section */}
      <div className="min-h-[140px] flex flex-col justify-center space-y-4">
        {/* Recording Duration Display - Fixed height container */}
        <div className="h-8 flex items-center justify-center">
          {isRecording && (
            <div className="inline-flex items-center space-x-2 bg-red-50 text-red-700 px-3 py-1 rounded-full text-sm font-medium animate-fade-in">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span>Recording: {formatDuration(recordingDuration)}</span>
            </div>
          )}
        </div>

        {/* Audio Visualizer for Recording - Fixed height container */}
        <div className="h-20 flex items-center justify-center">
          {isRecording && (
            <div className="w-full max-w-md bg-gray-100 rounded-xl p-4 animate-fade-in">
              <div className="flex items-center justify-center space-x-1 h-12">
                {Array.from({ length: 20 }).map((_, i) => {
                  // Simple and responsive bar heights based on real audio level
                  const baseHeight = 4;
                  const maxHeight = 48;

                  // More responsive to audio changes
                  const effectiveLevel = audioLevel > 2 ? audioLevel : 0; // Lower threshold for better responsiveness

                  // Create natural bar variation with center bias (middle bars higher)
                  const centerDistance = Math.abs(i - 10) / 10; // Distance from center (0-1)
                  const centerBias = 1 - centerDistance * 0.3; // Center bars are 30% higher

                  // Random variation for each bar
                  const randomVariation = 0.8 + Math.sin(i * 0.7 + Date.now() * 0.002) * 0.2;

                  const height =
                    baseHeight +
                    (maxHeight - baseHeight) *
                      (effectiveLevel / 100) *
                      centerBias *
                      randomVariation;

                  // Color progression: Green -> Yellow -> Orange -> Red
                  let color;
                  if (effectiveLevel < 15) {
                    color = `rgb(34, 197, 94)`; // Green
                  } else if (effectiveLevel < 40) {
                    color = `rgb(234, 179, 8)`; // Yellow
                  } else if (effectiveLevel < 70) {
                    color = `rgb(249, 115, 22)`; // Orange
                  } else {
                    color = `rgb(239, 68, 68)`; // Red
                  }

                  return (
                    <div
                      key={i}
                      className="w-2 rounded-full transition-all duration-75"
                      style={{
                        height: `${Math.max(4, height)}px`,
                        backgroundColor: effectiveLevel > 1 ? color : '#d1d5db',
                        transform: `scaleY(${effectiveLevel > 1 ? 1 : 0.3})`, // Scale down when silent
                      }}
                    />
                  );
                })}
              </div>
              <div className="text-center text-xs text-gray-600 mt-2">
                {audioLevel > 5 ? (
                  <>
                    Audio level:{' '}
                    <span className="font-medium text-green-600">{Math.round(audioLevel)}%</span> -
                    Keep speaking!
                  </>
                ) : (
                  <>
                    Audio level:{' '}
                    <span className="font-medium text-gray-500">{Math.round(audioLevel)}%</span> -
                    Speak into your microphone
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Main Recording Button - Centered and prominent */}
        <div className="h-16 flex justify-center items-center">
          {!isRecording ? (
            <Button
              onClick={onStartRecording}
              size="lg"
              disabled={isDisabled}
              className={cn(
                'h-12 px-8 bg-gradient-to-r from-[#1a1947] via-[#2d4cc8] to-[#4c7cf0]',
                'hover:from-[#1a1947]/90 hover:via-[#2d4cc8]/90 hover:to-[#4c7cf0]/90',
                'text-white font-semibold transition-all duration-200',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                'focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                'transform transition-transform duration-200 hover:scale-105'
              )}
            >
              {isProcessing ? (
                <>Processing...</>
              ) : (
                <>
                  <Mic className="w-5 h-5 mr-2" />
                  Start Recording
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={onStopRecording}
              size="lg"
              variant="destructive"
              className={cn(
                'h-12 px-8 bg-red-600 hover:bg-red-700',
                'text-white font-semibold transition-all duration-200',
                'focus:ring-2 focus:ring-red-500 focus:ring-offset-2',
                'transform transition-transform duration-200 hover:scale-105',
                'animate-pulse-border'
              )}
            >
              <Square className="w-5 h-5 mr-2" />
              Stop Recording
            </Button>
          )}
        </div>

        {/* Instructions Container - Fixed height to prevent layout shift */}
        <div className="h-12 flex items-center justify-center">
          <div className="text-center text-sm text-gray-600 max-w-md mx-auto transition-opacity duration-200">
            {isRecording && (
              <p className="animate-fade-in">
                Speak clearly into your microphone. Click <strong>Stop Recording</strong> when
                finished.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecordingControls;
