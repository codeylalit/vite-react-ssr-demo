import React, { useState, useEffect } from 'react';
import { X, Mic, Globe, Type, Zap, ArrowRight, CheckCircle, Settings, Monitor } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getLanguageStatistics } from '../../landing/utils/languageStats';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  tips: string[];
  target?: string;
}

const getOnboardingSteps = (): OnboardingStep[] => {
  const languageStats = getLanguageStatistics();

  return [
    {
      id: 'welcome',
      title: 'Welcome to Real-time Speech Recognition',
      description:
        "Experience Pingala V1 - the world's most advanced real-time ASR system with ultra-low latency WebSocket streaming and enterprise-grade accuracy.",
      icon: Zap,
      tips: [
        'Powered by Pingala V1 - #1 ranked ASR model on HuggingFace Open ASR Leaderboard',
        'Ultra-low latency: <150ms partial transcription using WebSocket streaming',
        `Enterprise-grade accuracy: 3.37% average WER across 216 languages`,
        'Advanced features: Voice Activity Detection (VAD), confidence scoring, and real-time metrics',
      ],
    },
    {
      id: 'language',
      title: 'Select Language & Script',
      description: `Choose from 216 supported languages, now intelligently ordered by global speaker count. Each language is optimized with Pingala V1's advanced neural architecture.`,
      icon: Globe,
      tips: [
        'Languages ordered by speaker count (most popular first) for better discoverability',
        'Supports major language families: Indo-European, Sino-Tibetan, Afro-Asiatic, and more',
        'Script selection enables proper text rendering (Latin, Devanagari, Arabic, Chinese, etc.)',
        'Real-time language model switching with optimized CTranslate2 quantization',
      ],
      target: 'language-selector',
    },
    {
      id: 'microphone',
      title: 'Start Recording',
      description:
        'Click the microphone button to begin streaming audio. Our WebSocket implementation provides real-time audio ingestion with Opus codec optimization.',
      icon: Mic,
      tips: [
        'Audio captured at 16kHz sample rate with automatic gain control',
        'Real-time Opus encoding/decoding for optimal bandwidth efficiency',
        'Intelligent audio chunking (250ms default) for perfect latency-accuracy balance',
        'Silero VAD integration for precise speech boundary detection',
      ],
      target: 'mic-button',
    },
    {
      id: 'transcript',
      title: 'Live Transcription Display',
      description:
        'Watch your speech transform into text in real-time. Words are color-coded by confidence and sentences are intelligently segmented.',
      icon: Type,
      tips: [
        'Color-coded confidence: Green (>90%), Yellow (70-90%), Orange (<70%)',
        'Completed sentences now highlighted in rose theme to show finalization',
        'Real-time metrics: Input WPM, processing latency, and transcription quality',
        'Export options: Copy to clipboard, download as text, or JSON with metadata',
      ],
      target: 'transcript-view',
    },
    {
      id: 'settings',
      title: 'Advanced Audio Settings',
      description:
        'Fine-tune your transcription experience with professional-grade audio processing controls. Settings can now be adjusted even when disconnected.',
      icon: Settings,
      tips: [
        'Chunk Duration (50-1000ms): Balance between latency and processing efficiency',
        'VAD Threshold (0.0-1.0): Adjust speech detection sensitivity for your environment',
        'Silence Detection (100-5000ms): Control when sentences are considered complete',
        'Speech Padding (0-1000ms): Extra context capture to prevent word cutoff',
      ],
      target: 'settings-panel',
    },
    {
      id: 'advanced',
      title: 'Performance Monitoring',
      description:
        'Monitor real-time performance metrics and system health. Our backend provides comprehensive analytics for optimal transcription quality.',
      icon: Monitor,
      tips: [
        'Real-time Factor (RTF): Current system performance vs real-time (target <0.5)',
        'Connection latency monitoring with automatic reconnection handling',
        'GPU memory optimization with int8 quantization for efficient inference',
        'Concurrent stream handling: Support for 256+ simultaneous connections',
      ],
      target: 'transcript-view',
    },
  ];
};

interface OnboardingGuideProps {
  isVisible: boolean;
  onComplete: () => void;
  onDismiss: () => void;
}

export const OnboardingGuide: React.FC<OnboardingGuideProps> = ({
  isVisible,
  onComplete,
  onDismiss,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const onboardingSteps = getOnboardingSteps();

  useEffect(() => {
    if (isVisible) {
      setCurrentStep(0);
    }
  }, [isVisible]);

  const handleNext = () => {
    setIsAnimating(true);
    setTimeout(() => {
      if (currentStep < onboardingSteps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        onComplete();
      }
      setIsAnimating(false);
    }, 200);
  };

  const handleSkip = () => {
    onDismiss();
  };

  if (!isVisible) return null;

  const step = onboardingSteps[currentStep];
  const IconComponent = step.icon;
  const isLastStep = currentStep === onboardingSteps.length - 1;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div
        className={cn(
          'bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-purple-200/50 max-w-md w-full',
          'transform transition-all duration-300',
          isAnimating ? 'scale-95 opacity-70' : 'scale-100 opacity-100'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#1a1947] via-[#2d4cc8] to-[#4c7cf0] flex items-center justify-center">
              <IconComponent className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{step.title}</h3>
              <p className="text-sm text-gray-600">
                Step {currentStep + 1} of {onboardingSteps.length}
              </p>
            </div>
          </div>
          <button
            onClick={handleSkip}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Skip onboarding"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Description */}
          <p className="text-gray-700 leading-relaxed">{step.description}</p>

          {/* Tips */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#2d4cc8]" />
              Tips for Success
            </h4>
            <ul className="space-y-2">
              {step.tips.map((tip, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Progress Indicator */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Progress</span>
              <span>{Math.round(((currentStep + 1) / onboardingSteps.length) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="h-2 bg-gradient-to-r from-[#1a1947] via-[#2d4cc8] to-[#4c7cf0] rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / onboardingSteps.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200/50">
          <button
            onClick={handleSkip}
            className="text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors"
          >
            Skip Tour
          </button>

          <button
            onClick={handleNext}
            className={cn(
              'inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200',
              'bg-gradient-to-r from-[#1a1947] via-[#2d4cc8] to-[#4c7cf0] text-white',
              'hover:from-[#2d4cc8] hover:via-[#4c7cf0] hover:to-[#6b8df5]',
              'focus:outline-none focus:ring-2 focus:ring-[#2d4cc8]/50',
              'shadow-lg hover:shadow-xl transform hover:scale-105'
            )}
          >
            {isLastStep ? 'Get Started' : 'Next'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Quick Tips Component for contextual help
interface QuickTipsProps {
  className?: string;
}

export const QuickTips: React.FC<QuickTipsProps> = ({ className }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const tips = [
    {
      icon: Mic,
      title: 'WebRTC Audio Streaming',
      description:
        'Ultra-low latency audio capture at 16kHz with automatic gain control and noise suppression.',
    },
    {
      icon: Globe,
      title: 'Dynamic Model Loading',
      description:
        'Language-specific AI models are loaded on-demand for optimal accuracy in your chosen language.',
    },
    {
      icon: Zap,
      title: 'Real-time VAD & Processing',
      description:
        'Voice Activity Detection and 250ms chunk processing ensure immediate transcription with confidence scoring.',
    },
  ];

  return (
    <div
      className={cn(
        'bg-gradient-to-r from-purple-50/80 to-blue-50/80 backdrop-blur-sm rounded-xl border border-purple-200/30 p-4',
        className
      )}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-[#2d4cc8]" />
          <span className="text-sm font-medium text-gray-900">Quick Tips</span>
        </div>
        <ArrowRight
          className={cn(
            'w-4 h-4 text-gray-400 transition-transform duration-200',
            isExpanded && 'rotate-90'
          )}
        />
      </button>

      {isExpanded && (
        <div className="mt-4 space-y-3 animate-fadeInUp">
          {tips.map((tip, index) => {
            const IconComponent = tip.icon;
            return (
              <div key={index} className="flex items-start gap-3 p-3 bg-white/50 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#1a1947] to-[#2d4cc8] flex items-center justify-center flex-shrink-0">
                  <IconComponent className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-1">{tip.title}</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">{tip.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OnboardingGuide;
