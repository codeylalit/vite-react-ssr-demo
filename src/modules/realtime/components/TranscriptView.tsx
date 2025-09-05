import React, { useMemo, useRef, useEffect } from 'react';
import { Copy, Download, Trash2, Mic, Clock, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { QuickTooltip, TooltipMessages } from './Tooltip';

interface TranscriptSegment {
  id: string;
  text: string;
  isFinal: boolean;
  confidence: number;
  timestamp: number;
  startTime?: number;
  endTime?: number;
  metadata?: {
    word_rate_wpm?: number;
    processing_time_ms?: number;
    latency_ms?: number;
  };
}

interface TranscriptViewProps {
  segments: TranscriptSegment[];
  isRecording: boolean;
  onClear: () => void;
  audioLevel?: number;
}

// Calculate metrics from segments
const calculateMetrics = (segments: TranscriptSegment[]) => {
  if (segments.length === 0) {
    return {
      wordCount: 0,
      avgWordRate: 0,
      avgLatency: 0,
      estimatedDuration: 0,
    };
  }

  const allText = segments.map(s => s.text).join(' ');
  const totalWords = allText
    .trim()
    .split(/\s+/)
    .filter(w => w).length;

  // Calculate word rate from metadata
  const wordRates = segments.map(s => s.metadata?.word_rate_wpm || 0).filter(rate => rate > 0);
  const avgWordRate =
    wordRates.length > 0 ? wordRates.reduce((sum, rate) => sum + rate, 0) / wordRates.length : 0;

  // Calculate average latency
  const latencies = segments.map(s => s.metadata?.latency_ms || 0).filter(l => l > 0);
  const avgLatency =
    latencies.length > 0 ? latencies.reduce((sum, l) => sum + l, 0) / latencies.length : 0;

  const timestamps = segments.map(s => s.timestamp).filter(t => t > 0);
  const estimatedDuration =
    timestamps.length > 1 ? (Math.max(...timestamps) - Math.min(...timestamps)) / 1000 : 0;

  return {
    wordCount: totalWords,
    avgWordRate,
    avgLatency,
    estimatedDuration,
  };
};

export const TranscriptView: React.FC<TranscriptViewProps> = ({
  segments,
  isRecording,
  onClear,
  audioLevel = 0,
}) => {
  const metrics = useMemo(() => calculateMetrics(segments), [segments]);
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new content appears
  useEffect(() => {
    if (isRecording && transcriptEndRef.current) {
      transcriptEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [segments, isRecording]);

  const handleCopy = () => {
    const text = segments.map(segment => segment.text).join(' ');
    navigator.clipboard.writeText(text);
  };

  const handleDownload = () => {
    const text = segments.map(segment => segment.text).join(' ');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transcript-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getSegmentClassName = (segment: TranscriptSegment) => {
    const baseClasses = 'inline-block px-3 py-2 rounded-lg mr-2 mb-2 transition-all duration-300';

    if (segment.isFinal) {
      // Final segments - stable, darker styling
      return cn(baseClasses, 'bg-gray-100 text-gray-900 border border-gray-300 shadow-sm');
    } else {
      // Partial segments - animated, blue styling to show they're in progress
      return cn(
        baseClasses,
        'bg-blue-50 text-blue-900 border border-blue-300 shadow-sm',
        'animate-pulse',
        isRecording && 'shadow-lg transform scale-105'
      );
    }
  };

  return (
    <div className="flex flex-col h-full min-h-[400px] sm:min-h-[500px] bg-white/50 backdrop-blur-sm rounded-2xl border border-purple-200/30 shadow-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-purple-200/50 bg-gradient-to-r from-purple-50/80 to-blue-50/80 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#1a1947] via-[#2d4cc8] to-[#4c7cf0] flex items-center justify-center">
            <Mic className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Live Transcript</h3>
            <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">
              Real-time speech recognition
            </p>
          </div>
        </div>

        {/* Control Actions */}
        <div className="flex items-center gap-2">
          <QuickTooltip message={TooltipMessages.transcript.copy}>
            <button
              onClick={handleCopy}
              disabled={segments.length === 0}
              className={cn(
                'p-2 rounded-xl bg-white/80 backdrop-blur-sm border border-purple-200/60 text-gray-600 transition-all duration-200',
                'hover:text-[#2d4cc8] hover:border-[#2d4cc8]/50 hover:bg-purple-50/50 hover:scale-105',
                'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
                'focus:outline-none focus:ring-2 focus:ring-[#2d4cc8]/50',
                'flex items-center justify-center'
              )}
              aria-label="Copy transcript to clipboard"
            >
              <Copy className="w-4 h-4" />
            </button>
          </QuickTooltip>

          <QuickTooltip message={TooltipMessages.transcript.download}>
            <button
              onClick={handleDownload}
              disabled={segments.length === 0}
              className={cn(
                'p-2 rounded-xl bg-white/80 backdrop-blur-sm border border-purple-200/60 text-gray-600 transition-all duration-200',
                'hover:text-[#2d4cc8] hover:border-[#2d4cc8]/50 hover:bg-purple-50/50 hover:scale-105',
                'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
                'focus:outline-none focus:ring-2 focus:ring-[#2d4cc8]/50',
                'flex items-center justify-center'
              )}
              aria-label="Download transcript as text file"
            >
              <Download className="w-4 h-4" />
            </button>
          </QuickTooltip>

          <QuickTooltip message={TooltipMessages.transcript.clear}>
            <button
              onClick={onClear}
              disabled={segments.length === 0}
              className={cn(
                'p-2 rounded-xl bg-white/80 backdrop-blur-sm border border-purple-200/60 text-gray-600 transition-all duration-200',
                'hover:text-red-600 hover:border-red-300 hover:bg-red-50/50 hover:scale-105',
                'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
                'focus:outline-none focus:ring-2 focus:ring-red-500/50',
                'flex items-center justify-center'
              )}
              aria-label="Clear current transcript"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </QuickTooltip>
        </div>
      </div>

      {/* Transcript Content */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto bg-gradient-to-b from-white/90 to-purple-50/30">
        {/* Empty state */}
        {segments.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-gray-500">
            <Mic className="w-16 h-16 mb-4 text-gray-400" />
            <p className="text-lg mb-2">Ready to Transform</p>
            <p className="text-sm">Tap the microphone to begin real-time speech recognition</p>
          </div>
        )}

        {/* Transcript Segments */}
        {segments.length > 0 && (
          <div className="text-lg leading-relaxed space-y-2">
            {segments.map(segment => (
              <span
                key={segment.id}
                className={getSegmentClassName(segment)}
                title={`${segment.isFinal ? 'Final' : 'Partial'}`}
              >
                {segment.text}
                {!segment.isFinal && (
                  <span className="inline-block w-1 h-4 bg-blue-500 ml-1 animate-pulse" />
                )}
              </span>
            ))}

            {/* Typing indicator for active recording */}
            {isRecording && (
              <span className="inline-block w-2 h-6 bg-gradient-to-b from-[#1a1947] via-[#2d4cc8] to-[#4c7cf0] ml-2 animate-pulse rounded-full" />
            )}

            {/* Invisible element for auto-scroll */}
            <div ref={transcriptEndRef} />
          </div>
        )}
      </div>

      {/* Stats Section */}
      <div className="p-4 sm:p-6 bg-gradient-to-r from-purple-50/60 to-blue-50/60 border-t border-purple-200/30">
        <div className="bg-gradient-to-r from-purple-50/80 to-blue-50/80 rounded-xl p-3 sm:p-4 border border-purple-200/30">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-[#2d4cc8] mb-1">
                {segments.length > 0 ? Math.round(metrics.avgWordRate) : '-'}
              </div>
              <div className="text-xs sm:text-sm text-gray-600 font-medium">
                Input Words per Minute
              </div>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Clock className="w-4 h-4 text-purple-600" />
                <div className="text-xl sm:text-2xl font-bold text-purple-600">
                  {segments.length > 0 ? Math.round(metrics.avgLatency) : '-'}
                </div>
              </div>
              <div className="text-xs sm:text-sm text-gray-600 font-medium">Latency (ms)</div>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <div className="text-xl sm:text-2xl font-bold text-blue-600">
                  {segments.length > 0
                    ? Math.round(metrics.wordCount / Math.max(1, metrics.estimatedDuration / 60))
                    : '-'}
                </div>
              </div>
              <div className="text-xs sm:text-sm text-gray-600 font-medium">Spoken Words</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TranscriptView;
