import React from 'react';
import { Mic, MicOff, Square, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';


interface MicButtonProps {
  isRecording: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  size?: 'default' | 'large';
  className?: string;
  audioLevel?: number;
}

export const MicButton: React.FC<MicButtonProps> = ({
  isRecording,
  onStartRecording,
  onStopRecording,
  size = 'default',
  className,
  audioLevel = 0,
}) => {
  const handleClick = () => {
    if (isRecording) {
      onStopRecording();
    } else {
      onStartRecording();
    }
  };

  const sizeClasses = {
    small: 'w-8 h-8',
    default: 'w-10 h-10',
    large: 'w-12 h-12'
  };

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Main Button - Minimized */}
      <button
        onClick={handleClick}
        className={cn(
          'group relative flex items-center justify-center transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#2d4cc8]/30',
          'w-12 h-12', // Minimized size
          isRecording
            ? 'bg-gradient-to-br from-red-500 via-red-600 to-red-700 hover:from-red-600 hover:via-red-700 hover:to-red-800 shadow-lg shadow-red-500/40'
            : 'bg-gradient-to-br from-[#1a1947] via-[#2d4cc8] to-[#4c7cf0] hover:from-[#2d4cc8] hover:via-[#4c7cf0] hover:to-[#6b8df5] shadow-lg shadow-[#2d4cc8]/40',
          'rounded-full border-2 border-white/20 hover:scale-105 active:scale-95',
          'backdrop-blur-xl',
          className
        )}
        aria-label={isRecording ? 'Stop recording' : 'Start recording'}
        aria-pressed={isRecording}
      >
      {/* Recording Animation */}
      {isRecording && (
        <div className="absolute inset-0 rounded-full border-2 border-red-400/60 animate-ping" />
      )}

      {/* Icon */}
      {isRecording ? (
        <Square className="w-5 h-5 text-white fill-current drop-shadow-sm" />
      ) : (
        <Mic className="w-5 h-5 text-white drop-shadow-sm" />
      )}
     </button>

      {/* Compact Audio Level Visualization */}
      {isRecording && (
        <div className="flex items-center justify-center gap-1 h-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={cn(
                "w-0.5 bg-gradient-to-t from-[#2d4cc8] to-[#4c7cf0] rounded-full transition-all duration-150",
                audioLevel > (i + 1) * 20 ? 'opacity-100' : 'opacity-30'
              )}
              style={{
                height: `${Math.max(2, (audioLevel > (i + 1) * 20 ? Math.min(16, 8 + i * 2) : 2))}px`
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};
