import React, { useState, useEffect } from 'react';
import { TranscriptView } from './TranscriptView';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface TranscriptSegment {
  id: string;
  text: string;
  isFinal: boolean;
  confidence: number;
  timestamp: number;
  metadata?: {
    latency_ms?: number;
  };
}

// Demo data simulating real transcription flow with accumulating partials
const DEMO_FLOW = [
  { text: 'Hello', isFinal: false, confidence: 0.7, delay: 500 },
  { text: 'world', isFinal: false, confidence: 0.8, delay: 1000 },
  { text: 'Hello world!', isFinal: true, confidence: 0.95, delay: 1500 },
  { text: 'How', isFinal: false, confidence: 0.6, delay: 2000 },
  { text: 'are', isFinal: false, confidence: 0.75, delay: 2500 },
  { text: 'you', isFinal: false, confidence: 0.8, delay: 3000 },
  { text: 'How are you?', isFinal: true, confidence: 0.92, delay: 3500 },
  { text: "I'm", isFinal: false, confidence: 0.7, delay: 4000 },
  { text: 'doing', isFinal: false, confidence: 0.8, delay: 4500 },
  { text: 'great', isFinal: false, confidence: 0.85, delay: 5000 },
  { text: 'today', isFinal: false, confidence: 0.88, delay: 5500 },
  { text: "I'm doing great today!", isFinal: true, confidence: 0.93, delay: 6000 },
];

export const TranscriptDemo: React.FC = () => {
  const [segments, setSegments] = useState<TranscriptSegment[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const reset = () => {
    setSegments([]);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const startDemo = () => {
    if (currentStep >= DEMO_FLOW.length) {
      reset();
      return;
    }

    setIsPlaying(true);

    const step = DEMO_FLOW[currentStep];
    const segmentId = step.isFinal ? `final_${currentStep}` : `partial_${currentStep}`;

    const newSegment: TranscriptSegment = {
      id: segmentId,
      text: step.text,
      isFinal: step.isFinal,
      confidence: step.confidence,
      timestamp: Date.now(),
      metadata: { latency_ms: Math.random() * 200 + 50 },
    };

    setTimeout(() => {
      setSegments(prevSegments => {
        if (newSegment.isFinal) {
          // Final segment: remove all partial segments and add this final one
          const finalSegments = prevSegments.filter(s => s.isFinal);
          return [...finalSegments, newSegment];
        } else {
          // Partial segment: add to existing segments (accumulate partials)
          return [...prevSegments, newSegment];
        }
      });

      setCurrentStep(prev => prev + 1);

      if (currentStep + 1 < DEMO_FLOW.length) {
        // Continue to next step automatically
        setTimeout(() => {
          if (isPlaying) {
            setIsPlaying(false);
            setTimeout(() => startDemo(), 100);
          }
        }, 300);
      } else {
        setIsPlaying(false);
      }
    }, 200);
  };

  const toggleDemo = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      startDemo();
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Transcript Flow Demo</h2>
        <p className="text-gray-600 mb-4">
          Watch how partial transcripts accumulate and are then replaced by final ones
        </p>

        <div className="flex items-center justify-center gap-4">
          <button
            onClick={toggleDemo}
            disabled={isPlaying}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isPlaying
              ? 'Playing...'
              : currentStep >= DEMO_FLOW.length
                ? 'Restart Demo'
                : 'Start Demo'}
          </button>

          <button
            onClick={reset}
            className="flex items-center gap-2 px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>

        <div className="mt-4 text-sm text-gray-500">
          Step {currentStep} of {DEMO_FLOW.length}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <TranscriptView
          segments={segments}
          isRecording={isPlaying}
          onClear={reset}
          audioLevel={isPlaying ? Math.random() * 100 : 0}
        />
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-3">How it works:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded animate-pulse"></div>
              <span>
                <strong>Blue (Animated):</strong> Partial transcripts in progress
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded"></div>
              <span>
                <strong>Gray (Stable):</strong> Final transcripts (locked)
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <div>✅ Partial transcripts accumulate one after another</div>
            <div>✅ Final transcripts replace all accumulated partials</div>
            <div>✅ Clean, predictable flow</div>
            <div>✅ Auto-scroll to latest content</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TranscriptDemo;
