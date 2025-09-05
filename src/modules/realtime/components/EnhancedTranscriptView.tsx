import React, { useMemo, useRef, useEffect } from 'react';
import { Copy, Download, Trash2, Mic } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TranscriptSegment {
  id: string;
  text: string;
  isFinal: boolean;
  confidence: number;
  timestamp: number;
  startTime?: number;
  endTime?: number;
}

interface EnhancedTranscriptViewProps {
  segments: TranscriptSegment[];
  isRecording: boolean;
  onClear: () => void;
}

export const EnhancedTranscriptView: React.FC<EnhancedTranscriptViewProps> = ({
  segments,
  isRecording,
  onClear,
}) => {
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  // Removed auto-scroll as requested
  // useEffect(() => {
  //   if (isRecording && transcriptEndRef.current) {
  //     transcriptEndRef.current.scrollIntoView({ behavior: 'smooth' });
  //   }
  // }, [segments, isRecording]);

  const handleCopy = () => {
    // Create text like the HTML version - show complete text flow
    const text = segments.map(segment => segment.text).join(' ');
    navigator.clipboard.writeText(text);
  };

  const handleDownload = () => {
    const text = segments.map(segment => segment.text).join(' ');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `whisper-transcript-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatTime = (seconds: number) => {
    const date = new Date(seconds * 1000);
    const hh = String(date.getUTCHours()).padStart(2, '0');
    const mm = String(date.getUTCMinutes()).padStart(2, '0');
    const ss = String(date.getUTCSeconds()).padStart(2, '0');
    const mmm = String(date.getUTCMilliseconds()).padStart(3, '0');
    return `${hh}:${mm}:${ss},${mmm}`;
  };

  return (
    <div className="flex flex-col h-full min-h-[500px] bg-white/50 backdrop-blur-sm rounded-2xl border border-purple-200/30 shadow-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-purple-200/50 bg-gradient-to-r from-purple-50/80 to-blue-50/80 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#1a1947] via-[#2d4cc8] to-[#4c7cf0] flex items-center justify-center">
            <Mic className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Live Transcript</h3>
            <p className="text-sm text-gray-600">ShunyaLabs Real-time Transcription</p>
          </div>
        </div>

        {/* Control Actions */}
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={handleCopy}
            disabled={segments.length === 0}
            className={cn(
              'p-2 rounded-xl bg-white/80 backdrop-blur-sm border border-purple-200/60 text-gray-600 transition-all duration-200',
              'flex items-center justify-center',
              'hover:text-[#2d4cc8] hover:border-[#2d4cc8]/50 hover:bg-purple-50/50 hover:scale-105',
              'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
              'focus:outline-none focus:ring-2 focus:ring-[#2d4cc8]/50'
            )}
            aria-label="Copy transcript to clipboard"
          >
            <Copy className="w-4 h-4" />
          </button>

          <button
            onClick={handleDownload}
            disabled={segments.length === 0}
            className={cn(
              'p-2 rounded-xl bg-white/80 backdrop-blur-sm border border-purple-200/60 text-gray-600 transition-all duration-200',
              'flex items-center justify-center',
              'hover:text-[#2d4cc8] hover:border-[#2d4cc8]/50 hover:bg-purple-50/50 hover:scale-105',
              'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
              'focus:outline-none focus:ring-2 focus:ring-[#2d4cc8]/50'
            )}
            aria-label="Download transcript as text file"
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            onClick={onClear}
            disabled={segments.length === 0}
            className={cn(
              'p-2 rounded-xl bg-white/80 backdrop-blur-sm border border-purple-200/60 text-gray-600 transition-all duration-200',
              'flex items-center justify-center',
              'hover:text-red-600 hover:border-red-300 hover:bg-red-50/50 hover:scale-105',
              'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
              'focus:outline-none focus:ring-2 focus:ring-red-500/50'
            )}
            aria-label="Clear current transcript"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Transcript Content - Matching HTML version exactly */}
      <div className="flex-1 p-6 overflow-y-auto bg-gradient-to-b from-white/90 to-purple-50/30">
        {/* Empty state */}
        {segments.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-gray-500">
            <Mic className="w-16 h-16 mb-4 text-gray-400" />
            <p className="text-lg mb-2">Ready for Transcription</p>
            <p className="text-sm text-center">
              Tap the microphone to begin real-time speech recognition with ShunyaLabs
            </p>
          </div>
        )}

        {/* Transcript Display - Each segment as a block like HTML version */}
        {segments.length > 0 && (
          <div className="space-y-3">
            {segments.map(segment => (
              <div
                key={segment.id}
                className={cn(
                  'p-4 rounded-lg border-l-4 shadow-sm transition-all duration-300',
                  segment.isFinal
                    ? 'bg-white border-l-gray-400 border border-gray-200'
                    : 'bg-yellow-50 border-l-yellow-400 border border-yellow-200 animate-pulse'
                )}
              >
                {/* Timestamp if available */}
                {segment.startTime !== undefined && (
                  <div className="text-xs text-gray-500 mb-1">
                    [{formatTime(segment.startTime)}]
                  </div>
                )}

                {/* Segment text */}
                <div
                  className={cn(
                    'text-base leading-relaxed',
                    segment.isFinal ? 'text-gray-900' : 'text-yellow-900 font-medium'
                  )}
                >
                  {segment.text}
                </div>

                {/* Status indicator */}
                <div className="flex items-center justify-start mt-2">
                  <span
                    className={cn(
                      'text-xs px-2 py-1 rounded-full',
                      segment.isFinal
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    )}
                  >
                    {segment.isFinal ? 'Final' : 'Partial'}
                  </span>
                </div>
              </div>
            ))}
            <div ref={transcriptEndRef} />
          </div>
        )}
      </div>

      {/* Status Footer */}
      <div className="px-6 py-3 border-t border-purple-200/50 bg-white/60 backdrop-blur-sm">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>
            {segments.length} segment{segments.length !== 1 ? 's' : ''}
          </span>
          <div className="flex items-center gap-2">
            {isRecording && (
              <>
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                <span className="text-red-600 font-medium">Recording</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
