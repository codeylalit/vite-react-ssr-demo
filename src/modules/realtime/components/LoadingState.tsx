import React from 'react';
import { Loader2, Mic, Zap, Brain } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingStateProps {
  type?: 'initializing' | 'processing' | 'uploading' | 'analyzing';
  progress?: number;
  message?: string;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  type = 'processing',
  progress = 0,
  message,
  className,
}) => {
  const getLoadingConfig = () => {
    switch (type) {
      case 'initializing':
        return {
          icon: Mic,
          title: 'Initializing Audio',
          defaultMessage: 'Setting up microphone and audio processing...',
          gradient: 'from-blue-500 to-purple-600',
          animation: 'animate-pulse'
        };
      case 'processing':
        return {
          icon: Brain,
          title: 'Processing Speech',
          defaultMessage: 'Analyzing audio with AI-powered transcription...',
          gradient: 'from-purple-500 to-pink-600',
          animation: 'animate-spin'
        };
      case 'uploading':
        return {
          icon: Zap,
          title: 'Uploading Audio',
          defaultMessage: 'Uploading your audio file securely...',
          gradient: 'from-green-500 to-blue-600',
          animation: 'animate-bounce'
        };
      case 'analyzing':
        return {
          icon: Brain,
          title: 'Analyzing',
          defaultMessage: 'Running advanced speech analysis...',
          gradient: 'from-orange-500 to-red-600',
          animation: 'animate-pulse'
        };
    }
  };

  const config = getLoadingConfig();
  const IconComponent = config.icon;

  return (
    <div className={cn(
      "flex flex-col items-center justify-center p-8 space-y-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-purple-200/30",
      className
    )}>
      {/* Animated Icon */}
      <div className="relative">
        <div className={cn(
          "w-20 h-20 rounded-full bg-gradient-to-r flex items-center justify-center",
          config.gradient,
          "shadow-lg"
        )}>
          <IconComponent className={cn("w-10 h-10 text-white", config.animation)} />
        </div>
        
        {/* Ripple Effect */}
        <div className="absolute inset-0 rounded-full border-2 border-purple-300/50 animate-ping" />
        <div className="absolute inset-0 rounded-full border-2 border-purple-200/30 animate-ping delay-75" />
      </div>

      {/* Loading Text */}
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold text-gray-900">{config.title}</h3>
        <p className="text-gray-600 max-w-sm">
          {message || config.defaultMessage}
        </p>
      </div>

      {/* Progress Bar (if progress is provided) */}
      {progress > 0 && (
        <div className="w-full max-w-xs space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div 
              className={cn(
                "h-full bg-gradient-to-r transition-all duration-300 ease-out",
                config.gradient
              )}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Animated Dots */}
      <div className="flex items-center space-x-1">
        <div className="w-2 h-2 bg-[#2d4cc8] rounded-full animate-bounce" />
        <div className="w-2 h-2 bg-[#2d4cc8] rounded-full animate-bounce delay-100" />
        <div className="w-2 h-2 bg-[#2d4cc8] rounded-full animate-bounce delay-200" />
      </div>
    </div>
  );
};

// Skeleton Loader Component
interface SkeletonProps {
  className?: string;
  children?: React.ReactNode;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className, children }) => {
  return (
    <div className={cn(
      "animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded",
      "bg-[length:200%_100%] animate-shimmer",
      className
    )}>
      {children}
    </div>
  );
};

// Transcript Skeleton Loader
export const TranscriptSkeleton: React.FC = () => {
  return (
    <div className="space-y-4 p-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="w-32 h-4" />
            <Skeleton className="w-24 h-3" />
          </div>
        </div>
        <div className="flex gap-2">
          <Skeleton className="w-8 h-8 rounded-lg" />
          <Skeleton className="w-8 h-8 rounded-lg" />
          <Skeleton className="w-8 h-8 rounded-lg" />
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="space-y-3 mt-8">
        <div className="flex flex-wrap gap-2">
          {[...Array(8)].map((_, i) => (
            <Skeleton 
              key={i} 
              className={cn(
                "h-8 rounded-lg",
                i === 0 ? "w-16" : i === 1 ? "w-20" : i === 2 ? "w-12" : i === 3 ? "w-24" : 
                i === 4 ? "w-18" : i === 5 ? "w-14" : i === 6 ? "w-22" : "w-16"
              )} 
            />
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {[...Array(6)].map((_, i) => (
            <Skeleton 
              key={i} 
              className={cn(
                "h-8 rounded-lg",
                i === 0 ? "w-20" : i === 1 ? "w-16" : i === 2 ? "w-24" : i === 3 ? "w-12" : 
                i === 4 ? "w-18" : "w-14"
              )} 
            />
          ))}
        </div>
      </div>

      {/* Stats Skeleton */}
      <div className="bg-gray-100 rounded-xl p-4 mt-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="text-center space-y-2">
              <Skeleton className="w-12 h-8 mx-auto" />
              <Skeleton className="w-16 h-3 mx-auto" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingState; 