import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import {
  Globe,
  Target,
  Cpu,
  ArrowDown,
  Mic,
  Square,
  Upload,
  Play,
  Award,
  Zap,
  Loader2,
  AlertCircle,
  ArrowRight,
  DollarSign,
  Shield,
  Info,
  Cloud,
  Code,
} from 'lucide-react';
import LanguageSelector from './LanguageSelector';
import ScriptSelector from './ScriptSelector';
import AudioUploadZone from './AudioUploadZone';
import ProcessingIndicator from './ProcessingIndicator';
import TranscriptionDisplay from './TranscriptionDisplay';
import RecordingControls from './RecordingControls';
import { ErrorDisplay } from './ErrorDisplay';
import { TranscriptionService } from '../services/transcriptionService';
import { Language } from '../types';
import { TranscriptionResult } from '../types/transcription';
import { availableLanguages } from './LanguageSelector';
import { languages } from '../data/languages';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { InfoTooltip } from '@/shared/components/ui/enhanced-tooltip';
// Hero component props interface
interface HeroProps {
  externalLanguageSelection?: Language | null;
  onLanguageChange?: (language: Language) => void;
}

// Helper function (simplified): only "auto" when autodetect is chosen explicitly.
const getApiLanguageCode = (frontendLanguageCode: string): string => {
  return frontendLanguageCode === 'autodetect' ? 'auto' : frontendLanguageCode.toLowerCase();
};

// Function to find the script for a given language code from the CSV data
const getScriptForLanguage = (languageCode: string): string => {
  // First try exact match
  const exactMatch = languages.find(
    lang => lang.code === languageCode && lang.status === 'available'
  );

  if (exactMatch) {
    return exactMatch.script;
  }

  // Fallback to base language code if no exact match (e.g., en-US -> en)
  const baseCode = languageCode.split('-')[0];
  const baseMatch = languages.find(lang => lang.code === baseCode && lang.status === 'available');

  if (baseMatch) {
    return baseMatch.script;
  }

  // If still no match, try to find any language that starts with the base code
  const partialMatch = languages.find(
    lang => lang.code.startsWith(baseCode) && lang.status === 'available'
  );

  if (partialMatch) {
    return partialMatch.script;
  }

  // Default fallback to Latin if no entries found
  return 'Latin';
};

// PRIORITY 2: Language State Validation Function
const validateLanguageState = (selectedLanguage: Language, context: string): boolean => {
  const isValid =
    selectedLanguage &&
    selectedLanguage.code &&
    selectedLanguage.code.trim() !== '' &&
    selectedLanguage.code !== 'undefined' &&
    selectedLanguage.native &&
    selectedLanguage.native.trim() !== '';

  if (!isValid) {
    console.error(`❌ [ERROR] Language state validation failed in ${context}:`, {
      selectedLanguage,
      context,
      timestamp: new Date().toISOString(),
    });
  } else {
    console.log(`✅ [DEBUG] Language state validation passed in ${context}:`, {
      code: selectedLanguage.code,
      native: selectedLanguage.native,
      context,
      timestamp: new Date().toISOString(),
    });
  }

  return isValid;
};

const Hero: React.FC<HeroProps> = ({ externalLanguageSelection, onLanguageChange }) => {
  // DEBUG: Track component mounting
  const componentId = useRef(Math.random().toString(36).substr(2, 9));

  useEffect(() => {
    console.log('🚀 [DEBUG] Hero component mounted with ID:', componentId.current);
    return () => {
      console.log('🔥 [DEBUG] Hero component unmounting with ID:', componentId.current);
    };
  }, []);

  // Demo state - internal language state as fallback
  const [internalSelectedLanguage, setInternalSelectedLanguage] = useState<Language>(() => {
    // Find English (US) as the default language
    const englishUS = availableLanguages.find(lang => lang.code === 'en-US');
    return englishUS || availableLanguages[0];
  });

  // Use external language selection if provided, otherwise use internal state
  const selectedLanguage = externalLanguageSelection || internalSelectedLanguage;

  // Language setter that handles both internal and external state
  const setSelectedLanguage = useCallback(
    (language: Language) => {
      console.log('🌍 [DEBUG] Hero setSelectedLanguage called with:', language);

      // Update internal state
      setInternalSelectedLanguage(language);

      // Notify parent component if callback provided
      if (onLanguageChange) {
        onLanguageChange(language);
      }
    },
    [onLanguageChange]
  );

  // Effect to sync with external language selection
  useEffect(() => {
    if (externalLanguageSelection) {
      console.log(
        '🔄 [DEBUG] Syncing Hero with external language selection:',
        externalLanguageSelection
      );
      setInternalSelectedLanguage(externalLanguageSelection);
    }
  }, [externalLanguageSelection]);

  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [processingTime, setProcessingTime] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [error, setError] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [result, setResult] = useState<TranscriptionResult | null>(null);
  const [processingStage, setProcessingStage] = useState<
    'uploading' | 'processing' | 'analyzing' | 'transcribing'
  >('processing');
  const [transcriptionMode, setTranscriptionMode] = useState<'enhanced' | 'verbatim'>('verbatim');
  const [selectedScript, setSelectedScript] = useState<string>('Latin');

  const intervalRef = useRef<NodeJS.Timeout>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number>();

  // Create transcription service instance
  const transcriptionService = useMemo(() => new TranscriptionService(), []);

  // Audio analyzer setup for real-time visualization - Simplified approach
  const setupAudioAnalyzer = useCallback((stream: MediaStream) => {
    console.log('🎤 Setting up simplified audio analyzer...');

    try {
      // Clean up any existing audio context
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }

      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();

      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);

      // Simple settings for overall audio level detection
      analyserRef.current.fftSize = 256;
      analyserRef.current.smoothingTimeConstant = 0.8;

      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      let animationId: number;

      const updateAudioLevel = () => {
        if (analyserRef.current) {
          analyserRef.current.getByteTimeDomainData(dataArray);

          // Calculate RMS (Root Mean Square) for overall volume level
          let sum = 0;
          for (let i = 0; i < bufferLength; i++) {
            const value = (dataArray[i] - 128) / 128;
            sum += value * value;
          }

          const rms = Math.sqrt(sum / bufferLength);
          let normalizedLevel = Math.min(100, rms * 500); // Scale to 0-100

          // Noise gate: treat anything below 8% as silence
          if (normalizedLevel < 8) {
            normalizedLevel = 0;
          }

          setAudioLevel(normalizedLevel);

          animationId = requestAnimationFrame(updateAudioLevel);
        }
      };

      // Start the audio level monitoring
      updateAudioLevel();
      console.log('🎤 Audio analyzer setup complete and monitoring started');

      // Store animation ID for cleanup
      animationFrameRef.current = animationId;
    } catch (error) {
      console.error('❌ Audio analysis setup failed:', error);
      setAudioLevel(0);
    }
  }, []);

  // TASK 3: Browser Compatibility Analysis
  useEffect(() => {
    // Log browser audio capabilities on component mount for debugging
    if (typeof window !== 'undefined') {
      const capabilities = transcriptionService.getBrowserAudioCapabilities();
      console.log('🔍 Browser Audio Recording Capabilities:', capabilities);

      if (capabilities.supportsRecording) {
        const apiCompatibleFormats = capabilities.supportedFormats.filter(f => f.apiCompatible);
        if (apiCompatibleFormats.length > 0) {
          console.log(
            '✅ API-compatible formats available:',
            apiCompatibleFormats.map(f => f.name).join(', ')
          );
        } else {
          console.warn('⚠️ No API-compatible recording formats detected. Recording may fail.');
        }
      } else {
        console.warn('❌ Browser does not support audio recording');
      }
    }
  }, []);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);

    // Simulate loading state for progressive enhancement
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
      clearTimeout(loadingTimer);
    };
  }, []);

  // DEBUG: Monitor selectedLanguage state changes
  useEffect(() => {
    console.log('🔍 [DEBUG] selectedLanguage state updated:', {
      code: selectedLanguage.code,
      name: selectedLanguage.name,
      native: selectedLanguage.native,
      region: selectedLanguage.region,
      flag: selectedLanguage.flag,
      timestamp: new Date().toISOString(),
    });

    // Also log the expected API language code
    const expectedApiCode = getApiLanguageCode(selectedLanguage.code);
    console.log('🔍 [DEBUG] Expected API language code:', expectedApiCode);
  }, [selectedLanguage]);

  // Real audio analyser handles levels now – simulation removed

  // ---------------------------------------------------------------------------
  //  🔊  Speech-to-Text setup for language auto-detection
  // ---------------------------------------------------------------------------
  // Language auto-detection will be handled based on API response; no external speech-recognition required.

  // Keep the latest selectedLanguage in a ref to avoid stale closures
  const selectedLanguageRef = useRef<Language>(selectedLanguage);
  useEffect(() => {
    selectedLanguageRef.current = selectedLanguage;
  }, [selectedLanguage]);

  // Keep the latest selectedScript in a ref similar to selectedLanguage
  const selectedScriptRef = useRef<string>(selectedScript);
  useEffect(() => {
    selectedScriptRef.current = selectedScript;
  }, [selectedScript]);

  const startRecording = useCallback(async () => {
    // PRIORITY 2: Validate language state at start of recording
    if (!validateLanguageState(selectedLanguage, 'startRecording')) {
      setError('Please select a valid language before recording');
      return;
    }

    // PRIORITY 1: Enhanced Debug Logging - Log language state at start of recording
    console.log('🎙️ [DEBUG] startRecording initiated with language:', {
      code: selectedLanguage.code,
      name: selectedLanguage.name,
      native: selectedLanguage.native,
      region: selectedLanguage.region,
      flag: selectedLanguage.flag,
      timestamp: new Date().toISOString(),
    });

    setError('');
    setTranscription('');
    setConfidence(0);
    setProcessingTime(0);
    setAudioLevel(0); // Initialize audio level

    try {
      // Check for MediaRecorder support
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error(
          'Your browser does not support audio recording. Please use a modern browser.'
        );
      }

      if (!window.MediaRecorder) {
        throw new Error(
          'MediaRecorder is not supported in your browser. Please use Chrome, Firefox, or Safari.'
        );
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1, // Mono for better compression
          sampleRate: 44100, // Standard sample rate
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      // Setup audio analyzer for real-time visualization
      setupAudioAnalyzer(stream);

      // TASK 1 & 2: Fix MediaRecorder Format Compatibility
      // API supports: .wma, .m4a, .wav, .mp3, .aac, .flac, .ogg
      // Let's try formats in order of API compatibility and browser support
      const supportedFormats = [
        // Try MP4/AAC first (supported by API as .m4a/.aac)
        { mimeType: 'audio/mp4', extension: '.m4a', name: 'MP4/AAC' },
        { mimeType: 'audio/mp4;codecs=mp4a.40.2', extension: '.m4a', name: 'MP4/AAC with codec' },

        // Try OGG (supported by API as .ogg)
        { mimeType: 'audio/ogg', extension: '.ogg', name: 'OGG' },
        { mimeType: 'audio/ogg;codecs=opus', extension: '.ogg', name: 'OGG/Opus' },

        // Try WebM with Opus (we'll convert this)
        { mimeType: 'audio/webm', extension: '.webm', name: 'WebM' },
        { mimeType: 'audio/webm;codecs=opus', extension: '.webm', name: 'WebM/Opus' },
      ];

      let selectedFormat = null;
      let mediaRecorder = null;

      // TASK 3: Browser Compatibility Testing
      // Test each format until we find one that works
      for (const format of supportedFormats) {
        if (MediaRecorder.isTypeSupported(format.mimeType)) {
          console.log(`✅ Browser supports ${format.name} (${format.mimeType})`);
          try {
            // Test if we can actually create a MediaRecorder with this format
            const testRecorder = new MediaRecorder(stream, { mimeType: format.mimeType });
            selectedFormat = format;
            mediaRecorder = testRecorder;
            break;
          } catch (error) {
            console.warn(`❌ Failed to create MediaRecorder with ${format.name}: ${error}`);
            continue;
          }
        } else {
          console.warn(`❌ Browser does not support ${format.name} (${format.mimeType})`);
        }
      }

      // If no supported format found, try without specifying mimeType
      if (!mediaRecorder) {
        console.log('🔄 Falling back to default MediaRecorder format');
        try {
          mediaRecorder = new MediaRecorder(stream);
          selectedFormat = {
            mimeType: mediaRecorder.mimeType || 'audio/webm',
            extension: '.webm',
            name: 'Default Browser Format',
          };
        } catch (error) {
          throw new Error(
            'Your browser does not support any compatible audio recording formats. Please use a modern browser like Chrome, Firefox, or Safari.'
          );
        }
      }

      console.log(`🎙️ Recording with format: ${selectedFormat.name} (${selectedFormat.mimeType})`);

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = event => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        // PRIORITY 2: Enhanced Debug Logging - Log language state in mediaRecorder.onstop callback
        console.log('🔄 [DEBUG] mediaRecorder.onstop callback executing with language:', {
          code: selectedLanguage.code,
          name: selectedLanguage.name,
          native: selectedLanguage.native,
          capturedAt: new Date().toISOString(),
        });

        const actualMimeType = mediaRecorder.mimeType || selectedFormat.mimeType;
        const audioBlob = new Blob(audioChunksRef.current, { type: actualMimeType });

        console.log(`🎵 Audio recorded: ${audioBlob.size} bytes, type: ${actualMimeType}`);

        // Proceed with transcription using selected language
        processAudio(audioBlob);

        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start(1000); // Collect data every second for better error handling
      setIsRecording(true);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to access microphone. Please check your permissions.';
      setError(errorMessage);
      console.error('Error accessing microphone:', error);
    }
  }, [selectedLanguage]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }

    // Clean up audio analyzer
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
    }

    // Reset audio level to 0 when stopping
    setAudioLevel(0);
    setIsRecording(false);
  }, []);

  const processAudio = useCallback(
    async (audioInput?: Blob | File) => {
      const currentLanguage = selectedLanguageRef.current;
      if (!audioInput) return;

      setIsProcessing(true);
      setError('');

      try {
        // PRIORITY 3: Language State Guards - Validate selectedLanguage before processing
        if (!validateLanguageState(currentLanguage, 'processAudio')) {
          throw new Error('Please select a valid language before processing audio');
        }

        // DEBUG: Enhanced logging to track the complete language state
        console.log('🔍 [DEBUG] processAudio called with selectedLanguage:', {
          code: currentLanguage.code,
          name: currentLanguage.name,
          native: currentLanguage.native,
          region: currentLanguage.region,
          flag: currentLanguage.flag,
        });

        // Use the *latest* language stored in the ref to decide whether we should send "auto" or the explicit code
        const languageCode: string = currentLanguage.code.toLowerCase();

        // No longer default to auto for unsupported; API will accept explicit codes

        // Convert Blob to File if needed
        const audioFile =
          audioInput instanceof File
            ? audioInput
            : await transcriptionService.prepareAudioBlob(audioInput);

        // Validate the audio file
        const validation = transcriptionService.validateAudioFile(audioFile);
        if (!validation.valid) {
          throw new Error(validation.error);
        }

        // Read the most recent script from the ref to avoid stale closures
        const currentScript = selectedScriptRef.current;

        // Prepare API request data
        const apiRequest = {
          audio: audioFile,
          language_code: languageCode,
          enable_diarization: true,
          chunk_size: 120,
          output_script: currentScript,
          // Map transcription mode to model index: Enhanced = 0, Verbatim = 1
          index: transcriptionMode === 'enhanced' ? 0 : 1,
        } as any;

        // DEBUG: Log the complete API request (excluding audio file)
        console.log('🔍 [DEBUG] API Request params:', {
          language_code: apiRequest.language_code,
          enable_diarization: apiRequest.enable_diarization,
          chunk_size: apiRequest.chunk_size,
          audioFileName: audioFile.name,
          audioSize: `${(audioFile.size / 1024).toFixed(2)} KB`,
          selectedLanguageDisplay: currentLanguage.native,
        });

        // Call the transcription API
        const result = await transcriptionService.transcribe(apiRequest);

        // DEBUG: Log API response
        console.log('🔍 [DEBUG] API Response:', {
          transcription: result.transcription,
          confidence: result.confidence,
          detectedLanguage: result.detectedLanguage,
          processingTime: result.processingTime,
        });

        // Update state with results
        setTranscription(result.transcription);
        setConfidence(result.confidence);
        setProcessingTime(result.processingTime);
        setResult(result);

        // If API detected language and differs, update dropdown accordingly
        if (result.detectedLanguage) {
          const detectedBase = result.detectedLanguage.toLowerCase();
          const candidate = availableLanguages.find(lang =>
            lang.code.toLowerCase().startsWith(detectedBase)
          );
          if (candidate) {
            setSelectedLanguage(candidate);
            selectedLanguageRef.current = candidate;
            console.log('🌍 [DEBUG] Language auto-selected from API detection:', candidate);
          }
        }
      } catch (error) {
        console.error('🚨 [ERROR] Transcription error:', error);
        setError(error instanceof Error ? error.message : 'Transcription failed');
      } finally {
        setIsProcessing(false);
      }
    },
    [transcriptionMode, selectedScript]
  );

  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        setError('');
        processAudio(file);
      }
    },
    [processAudio]
  );

  const handleFileSelect = useCallback(
    (file: File) => {
      setError('');
      processAudio(file);
    },
    [processAudio]
  );

  const resetDemo = useCallback(() => {
    setTranscription('');
    setConfidence(0);
    setProcessingTime(0);
    setResult(null);
    setError('');
  }, []);

  // Loading state for progressive enhancement
  if (isLoading) {
    return (
      <section className="relative py-12 md:py-16 lg:py-20 overflow-hidden bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-4">
            <Loader2 className="w-12 h-12 text-gray-600 animate-spin mx-auto" />
            <p className="text-gray-900 text-lg">Loading Shunya Labs...</p>
            <p className="text-gray-600 text-sm">Preparing the infinite possibility</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="hero"
      className="relative py-12 md:py-16 lg:py-20 bg-gradient-to-br from-white via-purple-50 to-blue-50 border-b-0"
      style={{ overflow: 'visible' }}
    >
      {/* Skip link for keyboard navigation */}
      <a
        href="#languages"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-purple-600 focus:text-white focus:rounded-md focus:shadow-lg"
      >
        Skip to main content
      </a>

      {/* Full Width Background Grid - Constrained to Hero Section */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        {/* Full screen width background */}
        <div className="absolute left-1/2 top-0 w-screen h-full -translate-x-1/2">
          {/* Subtle geometric pattern for texture only */}
          <div className="absolute inset-0 w-full h-full opacity-[0.02]">
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 100 100"
              fill="none"
              preserveAspectRatio="none"
            >
              <defs>
                <pattern id="heroGrid" width="5" height="5" patternUnits="userSpaceOnUse">
                  <path d="M 5 0 L 0 0 0 5" fill="none" stroke="currentColor" strokeWidth="0.5" />
                </pattern>
                <linearGradient id="heroFadeOut" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style={{ stopColor: 'currentColor', stopOpacity: 1 }} />
                  <stop offset="60%" style={{ stopColor: 'currentColor', stopOpacity: 0.7 }} />
                  <stop offset="85%" style={{ stopColor: 'currentColor', stopOpacity: 0.3 }} />
                  <stop offset="100%" style={{ stopColor: 'currentColor', stopOpacity: 0 }} />
                </linearGradient>
              </defs>
              <rect
                width="100"
                height="100"
                fill="url(#heroGrid)"
                mask="url(#heroFadeOut)"
                className="text-gray-900"
              />
            </svg>
          </div>
          {/* Strong fade overlay at bottom to ensure clean cutoff */}
          <div className="absolute bottom-0 left-0 right-0 w-full h-40 bg-gradient-to-t from-white via-white/60 to-transparent"></div>
        </div>
      </div>

      {/* Main Content - Clean Grid Layout */}
      <div
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 md:pb-12"
        style={{ overflow: 'visible' }}
      >
        <div className="text-center md:pt-12 min-h-screen">
          {/* Main Headline */}
          <h1 className="text-5xl lg:text-7xl font-bold text-midnight mb-6 tracking-tight bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            The State-of-the-Art Open Models
            {/* <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              You Keep the Signal.
            </span> */}
          </h1>

          {/* Subheadline */}
          <p className="text-xl lg:text-2xl text-gray-900 mb-12 max-w-4xl mx-auto leading-relaxed">
            Shunya Labs Launches Pingala V1: Top-Ranked ASR Model Setting Performance Records
          </p>
          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16 max-w-4xl mx-auto">
            {/* Cloud API Button */}
            <div className="group relative flex-1 sm:flex-none">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#1a1947] to-[#2d4cc8] rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-200"></div>
              <Button
                // size="lg"
                className="relative w-full sm:w-auto min-w-[200px] h-12 sm:h-[50px] px-8 sm:py-4 text-lg font-semibold bg-gradient-to-r from-[#1a1947] to-[#2d4cc8] text-white hover:from-[#1a1947]/90 hover:to-[#2d4cc8]/90 shadow-xl hover:shadow-2xl hover:shadow-[#2d4cc8]/20 transition-all duration-300 group-hover:scale-105 rounded-2xl border-0"
                onClick={() => (window.location.href = '/api')}
              >
                <div className="flex items-center justify-center gap-3">
                  <div className="p-2 group-hover:scale-110 transition-transform duration-200">
                    <Cloud className="w-6 h-6" />
                  </div>
                  <div className="text-center">
                    <div className="font-bold">Cloud API</div>
                    <div className="text-xs opacity-80">Production Ready</div>
                  </div>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                </div>
              </Button>
            </div>

            {/* Python SDK Button */}
            <div className="group relative flex-1 sm:flex-none">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-200"></div>
              <Button
                // size="lg"
                className="relative w-full sm:w-auto min-w-[200px] h-12 sm:h-[50px] px-8 sm:py-4 text-lg font-semibold bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 shadow-xl hover:shadow-2xl hover:shadow-purple-600/20 transition-all duration-300 group-hover:scale-105 rounded-2xl border-0"
                onClick={() => (window.location.href = '/docs')}
              >
                <div className="flex items-center justify-center gap-3">
                  <div className="p-2 group-hover:scale-110 transition-transform duration-200">
                    <Code className="w-6 h-6" />
                  </div>
                  <div className="text-center">
                    <div className="font-bold">Developer Documentation</div>
                    <div className="text-xs opacity-80">Local Deployment</div>
                  </div>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                </div>
              </Button>
            </div>

            {/* Hugging Face Models Button */}
            <div className="group relative flex-1 sm:flex-none">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#FFD21E] to-[#FF9D00] rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-200"></div>
              <Button
                // size="lg"
                className="relative w-full sm:w-auto min-w-[200px] h-12 sm:h-[50px] px-8 sm:py-4 text-lg font-semibold bg-gradient-to-r from-[#FFD21E] to-[#FF9D00] text-white hover:from-[#FF9D00] hover:to-[#FFD21E] shadow-xl hover:shadow-2xl hover:shadow-[#FFD21E]/20 transition-all duration-300 group-hover:scale-105 rounded-2xl border-0"
                onClick={() => window.open('https://huggingface.co/shunyalabs', '_blank')}
              >
                <div className="flex items-center justify-center gap-3">
                  <div className="p-2 group-hover:scale-110 transition-transform duration-200">
                    <div className="text-2xl">🤗</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold">Hugging Face</div>
                    <div className="text-xs opacity-80">Open Models</div>
                  </div>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                </div>
              </Button>
            </div>
          </div>

          {/* Fast Facts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-8 max-w-4xl mx-auto flex-1 w-full my-10">
            <div className="flex items-center justify-center space-x-2 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-200 hover:shadow-lg transition-all duration-300  aspect-auto w-full">
              <span className="text-purple-700 font-bold">&lt;</span>
              <span className="font-semibold text-sm text-purple-700">100 ms inference</span>
            </div>

            <div className="flex items-center justify-center space-x-2 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border border-blue-200 hover:shadow-lg transition-all duration-300 aspect-auto w-full">
              <Zap className="w-5 h-5 text-blue-500" />
              <span className="font-semibold text-sm text-blue-700">216 languages</span>
            </div>

            <div className="flex items-center justify-center space-x-2 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200 hover:shadow-lg transition-all duration-300  aspect-auto w-full">
              <Shield className="w-5 h-5 text-green-500" />
              <span className="font-semibold text-sm text-green-700">2.94% WER</span>
            </div>
          </div>
        </div>
        <div
          className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start lg:items-center"
          style={{ overflow: 'visible' }}
          id="hero-audio-sample"
        >
          {/* Left Side: Philosophical Content */}
          <div className="text-center lg:text-left relative z-0 lg:z-10 order-2 lg:order-1">
            {/* Mathematical Expression Headline */}
            <div className="space-y-6">
              {/* <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight mb-6 relative z-0 lg:z-20 overflow-visible">
                Mathematical symbols with better mobile scaling
                <div className="mb-4 lg:mb-6">
                  <span
                    className={`inline-block text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[12rem] bg-gradient-to-r from-[#1a1947] via-[#2d4cc8] to-[#4c7cf0] bg-clip-text text-transparent animate-gradient font-bold ${!reducedMotion ? 'animate-fade-in-up' : ''}`}
                    style={{ backgroundSize: '200% 200%' }}
                  >
                    ∅ ≈ ∞
                  </span>
                </div>
                Explanation text on one line
                <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl whitespace-nowrap">
                  <span className={`text-gray-900 ${!reducedMotion ? 'animate-fade-in-up' : ''}`}>
                    Nothing
                  </span>{' '}
                  <span
                    className={`bg-gradient-to-r from-[#1a1947] via-[#2d4cc8] to-[#4c7cf0] bg-clip-text text-transparent animate-gradient ${!reducedMotion ? 'animate-fade-in-up' : ''}`}
                    style={{ backgroundSize: '200% 200%' }}
                  >
                    approximates
                  </span>{' '}
                  <span className={`text-gray-900 ${!reducedMotion ? 'animate-fade-in-up' : ''}`}>
                    Everything
                  </span>
                </div>
              </h1> */}

              {/* Sanskrit element with warmer accent */}
              {/* <div
                className={`space-y-4 mt-6 lg:mt-8 mb-6 p-4 lg:p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200/50 relative z-0 lg:z-10 text-center ${!reducedMotion ? 'animate-fade-in-up' : ''}`}
                style={{
                  fontFamily: '"Noto Serif Devanagari", "Devanagari Sangam MN", "Mangal", serif',
                  position: 'relative',
                  isolation: 'isolate',
                }}
              >
                <div className="text-lg sm:text-xl lg:text-2xl bg-gradient-to-r from-amber-700 to-orange-600 bg-clip-text text-transparent font-semibold">
                  Śūnyaṃ eva siddhiḥ
                </div>
                <div className="text-sm text-amber-700 italic">
                  Nothingness itself is the ultimate attainment.
                </div>
              </div> */}
              <h5 className="inline-flex text-3xl sm:text-3xl md:text-6xl bg-gradient-to-r from-[#1a1947] via-[#2d4cc8] to-[#4c7cf0] bg-clip-text text-transparent animate-gradient font-bold animate-fade-in-up pb-3 text-center md:text-left mx-auto md:ml-0">
                Signal Alive.
                <br />
                Noise Dead.
              </h5>

              {/* Fast Facts */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-3 max-w-4xl mx-auto flex-1 w-full my-10">
                <div className="flex items-start justify-center space-x-2 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-200 hover:shadow-lg transition-all duration-300  aspect-auto w-full">
                  <DollarSign className="w-5 h-5 min-w-h min-h-5 text-purple-500" />
                  <span className="font-semibold text-sm text-purple-700">
                    CPU-First. Zero Cloud. Instant Polyglot
                  </span>
                </div>

                <div className="flex items-start justify-center space-x-2 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border border-blue-200 hover:shadow-lg transition-all duration-300 aspect-auto w-full">
                  <Zap className="w-5 h-5 min-w-h min-h-5 text-blue-500" />
                  <span className="font-semibold text-sm text-blue-700">
                    Runs on Chips, Not Clusters. Data Stays Home
                  </span>
                </div>

                <div className="flex items-start justify-center space-x-2 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200 hover:shadow-lg transition-all duration-300  aspect-auto w-full">
                  <Shield className="w-5 h-5 min-w-h min-h-5 text-green-500" />
                  <span className="font-semibold text-sm text-green-700">
                    Edge Muscle. Air-Gapped Safe. 216 Languages
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Demo Panel */}
          <div className="space-y-6 order-1 lg:order-2">
            {/* Simplified Voice Recording Card */}
            <div className="relative">
              <Card className="relative bg-white/80 backdrop-blur-xl border border-purple-500/30 shadow-xl rounded-3xl overflow-hidden">
                <CardContent className="relative p-6">
                  {!result ? (
                    /* Demo Interface - Clean 4 Elements */
                    <div className="space-y-6">
                      {/* 1. Section Header */}
                      <div className="text-center" id="demo">
                        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">
                          <span className="text-gray-900">Watch </span>
                          <span
                            className="bg-gradient-to-r from-[#1a1947] via-[#2d4cc8] to-[#4c7cf0] bg-clip-text text-transparent animate-gradient"
                            style={{ backgroundSize: '200% 200%' }}
                          >
                            Silence
                          </span>
                          <span className="text-gray-900"> Transform</span>
                        </h3>
                      </div>

                      {/* 2. Language Selection */}
                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <LanguageSelector
                          selectedLanguage={selectedLanguage}
                          onLanguageChange={language => {
                            // Update the state
                            setSelectedLanguage(language);

                            // Automatically select the appropriate script for this language
                            const autoSelectedScript = getScriptForLanguage(language.code);
                            setSelectedScript(autoSelectedScript);
                          }}
                          className="w-full"
                        />

                        {/* Script selector */}
                        <ScriptSelector
                          selectedScript={selectedScript}
                          onScriptChange={setSelectedScript}
                          className="w-full"
                        />
                      </div>

                      {/* 2.5. Transcription Mode Toggle */}
                      <div className="flex items-center justify-center mb-4">
                        <div className="bg-white/90 backdrop-blur-sm border border-purple-200/50 rounded-xl p-2 shadow-sm">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-700">
                              Transcription Mode:
                            </span>
                            <div className="flex bg-gray-100 rounded-lg p-1">
                              <InfoTooltip
                                content="Enhanced mode provides context-rich clarity by removing filler words and improving readability for better understanding."
                                side="bottom"
                                size="sm"
                              >
                                <button
                                  onClick={() => setTranscriptionMode('enhanced')}
                                  className={`px-3 py-1 text-sm font-medium rounded-md transition-all flex items-center gap-1.5 ${
                                    transcriptionMode === 'enhanced'
                                      ? 'bg-white text-purple-700 shadow-sm'
                                      : 'text-gray-600 hover:text-gray-800'
                                  }`}
                                >
                                  Enhanced
                                  <Info className="w-3 h-3 opacity-60" />
                                </button>
                              </InfoTooltip>
                              <InfoTooltip
                                content="Verbatim mode provides exact word-for-word transcription, retaining all filler words, pauses, and speech patterns for complete accuracy."
                                side="bottom"
                                size="sm"
                              >
                                <button
                                  onClick={() => setTranscriptionMode('verbatim')}
                                  className={`px-3 py-1 text-sm font-medium rounded-md transition-all flex items-center gap-1.5 ${
                                    transcriptionMode === 'verbatim'
                                      ? 'bg-white text-purple-700 shadow-sm'
                                      : 'text-gray-600 hover:text-gray-800'
                                  }`}
                                >
                                  Verbatim
                                  <Info className="w-3 h-3 opacity-60" />
                                </button>
                              </InfoTooltip>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 3. Start Recording Button */}
                      <div className="text-center">
                        <RecordingControls
                          isRecording={isRecording}
                          isProcessing={isProcessing}
                          onStartRecording={startRecording}
                          onStopRecording={stopRecording}
                          disabled={isProcessing}
                          audioLevel={audioLevel}
                        />
                      </div>

                      {/* 4. Small Upload Area */}
                      <div>
                        <AudioUploadZone
                          onFileSelect={handleFileSelect}
                          disabled={isRecording || isProcessing}
                          className="h-24"
                        />
                      </div>

                      {/* Enhanced Error Display */}
                      {error && (
                        <ErrorDisplay
                          error={error}
                          onRetry={() => {
                            setError('');
                            // Try to restart the demo
                            resetDemo();
                          }}
                          onDismiss={() => setError('')}
                          retryable={true}
                        />
                      )}

                      {/* Processing Indicator (minimal) */}
                      {isProcessing && (
                        <div className="text-center py-4">
                          <Loader2 className="w-6 h-6 text-purple-600 animate-spin mx-auto mb-2" />
                          <p className="text-sm text-gray-600">Processing...</p>
                        </div>
                      )}

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="audio/*,video/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </div>
                  ) : (
                    /* Results View - Transcription Display Replaces Everything */
                    <div className="space-y-6 h-full flex flex-col">
                      <TranscriptionDisplay result={result} className="flex-1" />

                      {/* New Session Button */}
                      <div className="text-center pt-4 border-t border-gray-200">
                        <Button
                          onClick={resetDemo}
                          // variant="outline"
                          className="bg-white hover:bg-gray-50"
                        >
                          <Zap className="w-4 h-4 mr-2" />
                          Start New Transcription
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced CSS Animations */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes gradient-animation {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          
          @keyframes fade-in {
            0% { opacity: 0; transform: translateY(10px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes slide-up {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes slide-down {
            0% { opacity: 0; transform: translateY(-10px) scale(0.95); }
            100% { opacity: 1; transform: translateY(0) scale(1); }
          }
          
          @keyframes pulse-glow {
            0%, 100% { box-shadow: 0 0 20px rgba(45, 76, 200, 0.3); }
            50% { box-shadow: 0 0 30px rgba(45, 76, 200, 0.5), 0 0 40px rgba(76, 124, 240, 0.3); }
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-6px); }
          }
          
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
          
          @keyframes celebration {
            0% { transform: scale(1) rotate(0deg); }
            25% { transform: scale(1.05) rotate(1deg); }
            50% { transform: scale(1.1) rotate(0deg); }
            75% { transform: scale(1.05) rotate(-1deg); }
            100% { transform: scale(1) rotate(0deg); }
          }
          
          .animate-gradient {
            animation: gradient-animation 6s ease infinite;
          }
          
          .animate-fade-in {
            animation: fade-in 0.6s ease-out;
          }
          
          .animate-slide-up {
            animation: slide-up 0.4s ease-out;
          }
          
          .animate-slide-down {
            animation: slide-down 0.3s ease-out;
          }
          
          .animate-pulse-glow {
            animation: pulse-glow 2s ease-in-out infinite;
          }
          
          .animate-float {
            animation: float 3s ease-in-out infinite;
          }
          
          .animate-shimmer {
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
            background-size: 200% 100%;
            animation: shimmer 2s infinite;
          }
          
          .animate-celebration {
            animation: celebration 0.6s ease-out;
          }
          
          /* Mathematical pattern animation */
          #demoGrid {
            animation: gradient-animation 8s ease infinite;
          }
          
          @media (prefers-reduced-motion: reduce) {
            .animate-gradient,
            .animate-fade-in,
            .animate-slide-up,
            .animate-slide-down,
            .animate-pulse-glow,
            .animate-float,
            .animate-shimmer,
            .animate-celebration,
            #demoGrid {
              animation: none;
            }
          }
        `,
        }}
      />
    </section>
  );
};

export default Hero;
