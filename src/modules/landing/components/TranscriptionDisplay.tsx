import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Copy, Check, Users, Clock, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TranscriptionResult, TranscriptionSegment } from '../types/transcription';

interface TranscriptionDisplayProps {
  result: TranscriptionResult;
  className?: string;
}

interface FormattedSegment extends TranscriptionSegment {
  speakerColor: string;
  speakerLabel: string;
}

const SPEAKER_COLORS = [
  'bg-blue-100 text-blue-800 border-blue-200',
  'bg-green-100 text-green-800 border-green-200',
  'bg-purple-100 text-purple-800 border-purple-200',
  'bg-orange-100 text-orange-800 border-orange-200',
  'bg-pink-100 text-pink-800 border-pink-200',
  'bg-indigo-100 text-indigo-800 border-indigo-200',
];

// Increased height by 30% (300 * 1.3 = 390)
const MAX_DISPLAY_HEIGHT = 390; // pixels

export const TranscriptionDisplay: React.FC<TranscriptionDisplayProps> = ({
  result,
  className,
}) => {
  const [copied, setCopied] = useState(false);
  const [selectedSpeakers, setSelectedSpeakers] = useState<Set<string>>(new Set());
  const textRef = useRef<HTMLDivElement>(null);

  // Format segments with speaker information
  const formatSegments = (): FormattedSegment[] => {
    if (!result.segments || result.segments.length === 0) {
      return [];
    }

    const uniqueSpeakers = Array.from(new Set(result.segments.map(s => s.speaker)));

    return result.segments.map(segment => ({
      ...segment,
      speakerColor: SPEAKER_COLORS[uniqueSpeakers.indexOf(segment.speaker) % SPEAKER_COLORS.length],
      speakerLabel: `Speaker ${uniqueSpeakers.indexOf(segment.speaker) + 1}`,
    }));
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDuration = (ms: number): string => {
    if (ms < 1000) return `${ms}ms`;
    const seconds = ms / 1000;
    if (seconds < 60) return `${seconds.toFixed(1)}s`;
    const minutes = seconds / 60;
    return `${minutes.toFixed(1)}m`;
  };

  const copyTranscription = async () => {
    try {
      let textToCopy = '';

      if (hasSegments && formattedSegments.length > 0) {
        // Copy diarized format with speaker labels
        const speakerTexts = new Map<string, string[]>();

        // Group segments by speaker
        filteredSegments.forEach(segment => {
          if (!speakerTexts.has(segment.speaker)) {
            speakerTexts.set(segment.speaker, []);
          }
          speakerTexts.get(segment.speaker)!.push(segment.text);
        });

        // Format as speaker-by-speaker text
        const allSpeakers = Array.from(new Set(formattedSegments.map(s => s.speaker)));
        allSpeakers.forEach((speaker, index) => {
          const speakerLabel = `Speaker ${index + 1}`;
          const speakerContent = speakerTexts.get(speaker);
          if (speakerContent && speakerContent.length > 0) {
            textToCopy += `${speakerLabel}:\n${speakerContent.join(' ')}\n\n`;
          }
        });
      } else {
        // Fallback to raw transcription if no segments
        textToCopy = result.transcription;
      }

      await navigator.clipboard.writeText(textToCopy.trim());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  const handleSpeakerClick = (speaker: string) => {
    setSelectedSpeakers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(speaker)) {
        newSet.delete(speaker);
      } else {
        newSet.add(speaker);
      }
      return newSet;
    });
  };

  const formattedSegments = formatSegments();
  const hasSegments = formattedSegments.length > 0;
  const hasSpeakers = result.speakers && result.speakers.length > 1;

  // Initialize with all speakers selected by default
  const allSpeakers = Array.from(new Set(formattedSegments.map(s => s.speaker)));

  // Set all speakers selected on first render
  React.useEffect(() => {
    if (allSpeakers.length > 0 && selectedSpeakers.size === 0) {
      setSelectedSpeakers(new Set(allSpeakers));
    }
  }, [allSpeakers.length]);

  // Filter segments based on selected speakers
  const filteredSegments =
    selectedSpeakers.size === 0 || selectedSpeakers.size === allSpeakers.length
      ? formattedSegments
      : formattedSegments.filter(segment => selectedSpeakers.has(segment.speaker));

  return (
    <div className={cn('space-y-4', className)}>
      {/* Transcription Content */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50/50">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <Check className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Transcription Complete</h3>
              <p className="text-xs text-gray-600">
                {result.detectedLanguage && `Detected: ${result.detectedLanguage}`}
              </p>
            </div>
          </div>

          {/* Compact Copy Button */}
          <Button
            onClick={copyTranscription}
            size="sm"
            variant="outline"
            className="h-8 px-2 text-xs"
          >
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            <span className="ml-1 hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
          </Button>
        </div>

        {/* Compact Speaker Tags */}
        {hasSpeakers && hasSegments && (
          <div className="px-3 py-2 bg-gray-50/50 border-b border-gray-200">
            <div className="flex items-center flex-wrap gap-1.5">
              <div className="flex items-center space-x-1 mr-2">
                <Users className="w-3 h-3 text-gray-600" />
                <span className="text-xs text-gray-600">{result.speakers?.length} speakers:</span>
              </div>

              {allSpeakers.map((speaker, index) => (
                <button
                  key={speaker}
                  onClick={() => handleSpeakerClick(speaker)}
                  className={cn(
                    'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border',
                    'transition-all duration-150 cursor-pointer hover:opacity-80 h-6',
                    SPEAKER_COLORS[index % SPEAKER_COLORS.length],
                    {
                      'opacity-50': !selectedSpeakers.has(speaker),
                    }
                  )}
                >
                  <span>Speaker {index + 1}</span>
                  {selectedSpeakers.has(speaker) && (
                    <span className="ml-1 text-green-600 text-xs">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Transcription Text - Increased height and removed show more functionality */}
        <div className="relative">
          <div
            ref={textRef}
            className="p-4 text-sm text-gray-900 leading-relaxed overflow-auto"
            style={{
              maxHeight: `${MAX_DISPLAY_HEIGHT}px`,
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
              hyphens: 'auto',
              scrollBehavior: 'smooth',
            }}
          >
            {hasSegments ? (
              // Display with speaker segments - Chat-like layout
              <div className="space-y-4">
                {filteredSegments.map((segment, index) => (
                  <div key={index} className="flex flex-col space-y-2">
                    {/* Speaker Header with Timestamp */}
                    <div className="flex items-center justify-between">
                      <span
                        className={cn(
                          'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border',
                          segment.speakerColor
                        )}
                      >
                        {segment.speakerLabel}
                      </span>
                      {segment.start !== undefined && (
                        <span className="text-xs text-gray-500 font-mono">
                          {formatTime(segment.start)}
                        </span>
                      )}
                    </div>

                    {/* Message Bubble */}
                    <div
                      className={cn(
                        'bg-gray-50 border border-gray-200 rounded-2xl p-3 ml-4',
                        'relative before:absolute before:left-[-8px] before:top-3',
                        'before:w-0 before:h-0 before:border-t-[8px] before:border-t-transparent',
                        'before:border-b-[8px] before:border-b-transparent',
                        'before:border-r-[8px] before:border-r-gray-200'
                      )}
                    >
                      <p className="text-sm text-gray-900 leading-relaxed">{segment.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Display plain transcription
              <div
                className="whitespace-pre-wrap"
                style={{
                  wordBreak: 'break-word',
                  overflowWrap: 'break-word',
                }}
              >
                {result.transcription}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Language */}
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-gray-200 text-center">
          <div className="flex items-center justify-center mb-1">
            <Globe className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-xs text-gray-600 mb-1">Language</div>
          <div className="text-sm font-semibold text-gray-900 truncate">
            {result.detectedLanguage || 'Auto'}
          </div>
        </div>

        {/* Processing Time */}
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-gray-200 text-center">
          <div className="flex items-center justify-center mb-1">
            <Clock className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-xs text-gray-600 mb-1">Processed</div>
          <div className="text-sm font-semibold text-gray-900">
            {formatDuration(result.processingTime)}
          </div>
        </div>

        {/* Word Count */}
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-gray-200 text-center">
          <div className="flex items-center justify-center mb-1">
            <div className="w-4 h-4 bg-green-600 rounded-sm flex items-center justify-center">
              <span className="text-white text-xs font-bold">W</span>
            </div>
          </div>
          <div className="text-xs text-gray-600 mb-1">Words</div>
          <div className="text-sm font-semibold text-gray-900">
            {result.transcription.split(/\s+/).filter(word => word.length > 0).length}
          </div>
        </div>

        {/* Speakers */}
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-gray-200 text-center">
          <div className="flex items-center justify-center mb-1">
            <Users className="w-4 h-4 text-orange-600" />
          </div>
          <div className="text-xs text-gray-600 mb-1">Speakers</div>
          <div className="text-sm font-semibold text-gray-900">{result.speakers?.length || 1}</div>
        </div>
      </div>
    </div>
  );
};

export default TranscriptionDisplay;
