import React from 'react';
import { Clock, Zap, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricsPanelProps {
  inputWordsPerMinute: number;
  latencyMs: number;
  spokenWords: number;
  isRecording: boolean;
  duration: string;
}

export const MetricsPanel: React.FC<MetricsPanelProps> = ({
  inputWordsPerMinute,
  latencyMs,
  spokenWords,
  isRecording,
  duration,
}) => {
  const metrics = [
    {
      label: 'Input WPM',
      value: inputWordsPerMinute.toFixed(0),
      icon: Zap,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
    },
    {
      label: 'Latency',
      value: `${latencyMs.toFixed(0)}ms`,
      icon: Clock,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
    },
    {
      label: 'Spoken Words',
      value: spokenWords.toString(),
      icon: MessageSquare,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
    },
  ];

  return (
    <div className="bg-white/50 backdrop-blur-sm rounded-xl border border-purple-200/30 shadow-lg p-4">
      <div className="flex items-center justify-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#667eea] to-[#764ba2]"></div>
          Live Metrics
        </h3>

        {/* Duration display */}
        <div className="flex items-center gap-2 px-3 py-1 bg-white/80 rounded-lg border border-purple-200/40">
          <Clock className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-mono text-gray-700">{duration}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div
              key={metric.label}
              className={cn(
                'p-4 rounded-xl transition-all duration-300',
                metric.bgColor,
                isRecording ? 'shadow-lg transform scale-[1.02]' : 'shadow-sm'
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'w-10 h-10 rounded-lg bg-gradient-to-r flex items-center justify-center shadow-sm',
                      metric.color
                    )}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{metric.label}</p>
                    <p
                      className={cn(
                        'text-2xl font-bold transition-all duration-300',
                        metric.textColor,
                        isRecording && 'animate-pulse'
                      )}
                    >
                      {metric.value}
                    </p>
                  </div>
                </div>

                {/* Visual indicator for active recording */}
                {isRecording && (
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <div className="text-xs text-green-600 font-medium">Live</div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Additional info */}
      <div className="mt-4 p-3 bg-white/60 rounded-lg border border-purple-200/30">
        <p className="text-xs text-gray-600 text-center">
          {isRecording
            ? '🎙️ Recording in progress - metrics updating in real-time'
            : '📊 Start recording to see live transcription metrics'}
        </p>
      </div>
    </div>
  );
};
