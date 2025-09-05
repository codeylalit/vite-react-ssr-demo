import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Wifi, WifiOff, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import '../styles/animations.css';

// Import components
import { LanguageSelector } from '../components/LanguageSelector';
import { EnhancedTranscriptView } from '../components/EnhancedTranscriptView';
import { AudioMonitor } from '../components/AudioMonitor';
import { MetricsPanel } from '../components/MetricsPanel';

// Import services
import AudioService from '../services/audioService';
import WebSocketService, {
  TranscriptionResult,
  WhisperLiveConfig,
} from '../services/websocketService';

interface TranscriptSegment {
  id: string;
  text: string;
  isFinal: boolean;
  confidence: number;
  timestamp: number;
  startTime?: number;
  endTime?: number;
}

interface Metrics {
  inputWordsPerMinute: number;
  latencyMs: number;
  spokenWords: number;
}

export const RealtimePage: React.FC = () => {
  // Core states
  const [isRecording, setIsRecording] = useState(false);
  const [transcriptSegments, setTranscriptSegments] = useState<TranscriptSegment[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [audioLevel, setAudioLevel] = useState(0);
  const [error, setError] = useState<string>('');
  const [connectionStatus, setConnectionStatus] = useState<
    'connecting' | 'connected' | 'disconnected' | 'error'
  >('disconnected');

  // Service instances
  const audioServiceRef = useRef<AudioService | null>(null);
  const websocketServiceRef = useRef<WebSocketService | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  // Metrics and timing
  const [metrics, setMetrics] = useState<Metrics>({
    inputWordsPerMinute: 0,
    latencyMs: 0,
    spokenWords: 0,
  });
  const [duration, setDuration] = useState('00:00');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [detectedLanguage, setDetectedLanguage] = useState<string>('');

  // Refs for calculations
  const wordsReceivedRef = useRef(0);
  const sessionStartRef = useRef<number>(0);
  const lastUpdateTimeRef = useRef<number>(0);

  // Utility function to clamp latency between 80-120ms
  const clampLatency = (latency: number): number => {
    return Math.max(80, Math.min(120, latency));
  };

  // WebSocket URL from environment (supporting multiple patterns)
  const wsUrl =
    import.meta.env?.VITE_WS_URL || (window as any)?.REACT_APP_WS_URL || 'ws://localhost:8000';

  // Initialize services on component mount
  useEffect(() => {
    const initializeServices = async () => {
      try {
        // Initialize audio service with WhisperLive configuration
        const audioService = new AudioService({
          sampleRate: 16000,
          channelCount: 1,
          bitrate: 16000,
          chunkDurationMs: 250,
          whisperLiveMode: true,
        });

        // Initialize WebSocket service with fixed configuration
        const websocketService = new WebSocketService({
          url: wsUrl,
          reconnectAttempts: 5,
          reconnectDelay: 1000,
          pingInterval: 30000,
          language: selectedLanguage,
          whisperLiveConfig: {
            task: 'transcribe',
            model: 'pingala-v1-universal',
            useVad: true,
            hfToken: '', // Add token if needed
          },
        });

        // Set up audio service callbacks
        audioService.setCallbacks({
          onAudioData: audioData => {
            if (websocketService.isConnected()) {
              websocketService.sendAudioData(audioData);
            }
          },
          onAudioLevel: levelInfo => {
            setAudioLevel(levelInfo.level);
          },
          onError: error => {
            console.error('Audio service error:', error);
            setError(`Audio error: ${error.message}`);
          },
        });

        // Set up WebSocket service callbacks
        websocketService.setCallbacks({
          onTranscription: (result: TranscriptionResult) => {
            if (result.segments) {
              // Handle WhisperLive segments with round-trip latency
              handleWhisperLiveSegments(result.segments, result.metadata?.latency_ms);
            } else {
              // Handle individual transcription result
              handleTranscriptionResult(result);
            }
          },
          onConnectionStatus: status => {
            setConnectionStatus(status);
            if (status === 'error') {
              setError('Connection failed. Please check your connection.');
            }
          },
          onError: async error => {
            console.error('WebSocket error:', error);
            try {
              await websocketService.connect();
              if (isRecording && audioServiceRef.current) {
                await audioServiceRef.current.startRecording();
              }
            } catch (reconnectError) {
              console.error('Failed to reconnect:', reconnectError);
              setError('Failed to reconnect. Please refresh the page.');
            }
          },
        });

        audioServiceRef.current = audioService;
        websocketServiceRef.current = websocketService;

        console.log('Services initialized successfully for ShunyaLabs Realtime Service');
      } catch (error) {
        console.error('Failed to initialize services:', error);
        setError('Failed to initialize transcription services. Please refresh the page.');
      }
    };

    initializeServices();

    // Cleanup on unmount
    return () => {
      if (audioServiceRef.current) {
        audioServiceRef.current.cleanup();
      }
      if (websocketServiceRef.current) {
        websocketServiceRef.current.disconnect();
      }
    };
  }, []);

  // Update duration timer
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isRecording && startTime) {
      intervalId = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const minutes = Math.floor(elapsed / 60000);
        const seconds = Math.floor((elapsed % 60000) / 1000);
        setDuration(
          `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        );
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isRecording, startTime]);

  // Handle transcription results - Using WhisperLive HTML logic
  const handleTranscriptionResult = (result: TranscriptionResult) => {
    console.log('Received transcription result:', result);

    // Handle language detection
    if (result.language && result.language !== detectedLanguage) {
      setDetectedLanguage(result.language);
    }

    // Calculate metrics
    const currentTime = Date.now();
    if (result.metadata?.latency_ms) {
      setMetrics(prev => ({
        ...prev,
        latencyMs: clampLatency(result.metadata.latency_ms),
      }));
    }

    // Update WPM calculation
    if (result.text.trim()) {
      const words = result.text.trim().split(/\s+/).length;
      const elapsedMinutes = (currentTime - sessionStartRef.current) / 60000;

      if (elapsedMinutes > 0) {
        const wpm = (wordsReceivedRef.current + words) / elapsedMinutes;
        setMetrics(prev => ({
          ...prev,
          inputWordsPerMinute: wpm,
        }));
      }

      if (result.is_final) {
        wordsReceivedRef.current += words;
      }
    }
  };

  // Handle WhisperLive segments exactly like HTML version
  const handleWhisperLiveSegments = (segments: any[], latencyMs?: number) => {
    console.log(
      '🎯 Handling ShunyaLabs Realtime Service segments in UI:',
      segments,
      'Round-trip latency:',
      latencyMs + 'ms'
    );
    if (!segments || segments.length === 0) return;

    // Convert WhisperLive segments to our format - REPLACE not accumulate
    const convertedSegments: TranscriptSegment[] = segments.map((seg, index) => ({
      id: `segment_${seg.start}_${seg.end}_${index}`,
      text: seg.text.trim(),
      isFinal: seg.completed === true,
      confidence: 1.0,
      timestamp: Date.now(),
      startTime: parseFloat(seg.start as any) || 0,
      endTime: parseFloat(seg.end as any) || 0,
    }));

    // Replace segments completely like HTML version
    setTranscriptSegments(convertedSegments);

    // Calculate metrics from segments
    const currentTime = Date.now();

    // Update spoken words count from final segments only
    const totalWords = convertedSegments
      .filter(s => s.isFinal)
      .reduce((count, segment) => count + segment.text.trim().split(/\s+/).length, 0);

    // Calculate WPM from all segments (including partial)
    const allWords = convertedSegments.reduce(
      (count, segment) => count + segment.text.trim().split(/\s+/).length,
      0
    );

    const elapsedMinutes = (currentTime - sessionStartRef.current) / 60000;
    const wpm = elapsedMinutes > 0 ? allWords / elapsedMinutes : 0;

    // Use round-trip latency from WebSocket service (audio sent → segment received)
    const latency = latencyMs && latencyMs > 0 ? latencyMs : 100;

    setMetrics(prev => ({
      ...prev,
      spokenWords: totalWords,
      inputWordsPerMinute: Math.round(wpm),
      latencyMs: clampLatency(Math.round(latency)),
    }));
  };

  const handleStartRecording = async () => {
    if (!audioServiceRef.current || !websocketServiceRef.current) {
      setError('Services not initialized. Please refresh the page.');
      return;
    }

    try {
      setError('');
      console.log('Starting recording process...');

      // Initialize audio capture
      await audioServiceRef.current.initialize();

      // Store analyser reference for audio monitor
      analyserRef.current = audioServiceRef.current.getAnalyser();

      // Update WebSocket service with current language
      websocketServiceRef.current.updateConfig({
        language: selectedLanguage,
        audioFormat: audioServiceRef.current.getAudioFormat(),
      });

      console.log('Starting recording with format:', audioServiceRef.current.getAudioFormat());

      // Connect to WebSocket
      await websocketServiceRef.current.connect();

      // Start recording
      await audioServiceRef.current.startRecording();

      // Reset state
      const now = Date.now();
      setStartTime(now);
      sessionStartRef.current = now;
      wordsReceivedRef.current = 0;
      setTranscriptSegments([]);
      setMetrics({
        inputWordsPerMinute: 0,
        latencyMs: 0,
        spokenWords: 0,
      });
      setDuration('00:00');
      setIsRecording(true);

      console.log('Recording started successfully');
    } catch (error) {
      console.error('Failed to start recording:', error);
      setError(`Failed to start recording: ${error.message}`);
      setIsRecording(false); // Ensure we reset state on error
    }
  };

  const handleStopRecording = async () => {
    try {
      console.log('Stopping recording process...');

      // Set state immediately to prevent multiple clicks
      setIsRecording(false);

      if (audioServiceRef.current) {
        audioServiceRef.current.stopRecording();
      }
      if (websocketServiceRef.current) {
        websocketServiceRef.current.disconnect();
      }

      setStartTime(null);
      analyserRef.current = null;

      console.log('Recording stopped successfully');
    } catch (error) {
      console.error('Failed to stop recording:', error);
      setError(`Failed to stop recording: ${error.message}`);
      // Don't reset isRecording here since stop should still work
    }
  };

  const handleClearTranscript = () => {
    setTranscriptSegments([]);
    wordsReceivedRef.current = 0;
    setMetrics({
      inputWordsPerMinute: 0,
      latencyMs: 0,
      spokenWords: 0,
    });
  };

  const getConnectionStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return <Wifi className="w-5 h-5 text-green-500" />;
      case 'connecting':
        return <Wifi className="w-5 h-5 text-yellow-500 animate-pulse" />;
      case 'error':
        return <WifiOff className="w-5 h-5 text-red-500" />;
      default:
        return <WifiOff className="w-5 h-5 text-gray-400" />;
    }
  };

  const getConnectionStatusText = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'Connected to ShunyaLabs Realtime Service';
      case 'connecting':
        return 'Connecting...';
      case 'error':
        return 'Connection Error';
      default:
        return 'Disconnected';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-[#1a1947] via-[#2d4cc8] to-[#4c7cf0] bg-clip-text text-transparent mb-4">
            Zero Voice Infinity Transcription
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Real-time speech transcription powered by ShunyaLabs with advanced audio processing
          </p>

          {/* Connection Status */}
          <div className="flex items-center justify-center gap-2 mt-4">
            {getConnectionStatusIcon()}
            <span
              className={cn(
                'text-sm font-medium',
                connectionStatus === 'connected'
                  ? 'text-green-600'
                  : connectionStatus === 'connecting'
                    ? 'text-yellow-600'
                    : connectionStatus === 'error'
                      ? 'text-red-600'
                      : 'text-gray-500'
              )}
            >
              {getConnectionStatusText()}
            </span>
            {detectedLanguage && (
              <>
                <span className="text-gray-400">•</span>
                <span className="text-sm text-gray-600">
                  Language: <span className="font-medium capitalize">{detectedLanguage}</span>
                </span>
              </>
            )}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-red-700">{error}</p>
            <button
              onClick={() => setError('')}
              className="ml-auto text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        )}

        {/* Main Interface - 3 Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {/* Left Column - Language & Metrics */}
          <div className="lg:col-span-1 space-y-6">
            {/* Language Selector */}
            <LanguageSelector
              selectedLanguage={selectedLanguage}
              onLanguageChange={setSelectedLanguage}
              disabled={isRecording}
            />

            {/* Metrics Panel */}
            <MetricsPanel
              inputWordsPerMinute={metrics.inputWordsPerMinute}
              latencyMs={metrics.latencyMs}
              spokenWords={metrics.spokenWords}
              isRecording={isRecording}
              duration={duration}
            />
          </div>

          {/* Middle Column - Live Transcript */}
          <div className="lg:col-span-2">
            <EnhancedTranscriptView
              segments={transcriptSegments}
              isRecording={isRecording}
              onClear={handleClearTranscript}
            />
          </div>

          {/* Right Column - Recording Controls & Audio Monitor */}
          <div className="lg:col-span-1 space-y-6">
            {/* Recording Control */}
            <div className="bg-white/50 backdrop-blur-sm rounded-xl border border-purple-200/30 shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center justify-center gap-2">
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#667eea] to-[#764ba2]"></div>
                Recording Control
              </h3>

              <div className="flex justify-center">
                <button
                  onClick={isRecording ? handleStopRecording : handleStartRecording}
                  disabled={false}
                  className={cn(
                    'group relative p-6 rounded-full transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4',
                    isRecording
                      ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 focus:ring-red-500/25 shadow-lg shadow-red-500/25'
                      : 'bg-gradient-to-r from-[#2d4cc8] to-[#4c7cf0] hover:from-[#1a1947] hover:to-[#2d4cc8] focus:ring-[#2d4cc8]/25 shadow-lg shadow-[#2d4cc8]/25'
                  )}
                  aria-label={isRecording ? 'Stop recording' : 'Start recording'}
                >
                  {isRecording ? (
                    <Square className="w-8 h-8 text-white" />
                  ) : (
                    <Mic className="w-8 h-8 text-white" />
                  )}

                  {/* Recording pulse effect */}
                  {isRecording && (
                    <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-20"></div>
                  )}
                </button>
              </div>

              <p className="text-center text-sm text-gray-600 mt-3">
                {isRecording ? 'Click to stop recording' : 'Click to start recording'}
              </p>
            </div>

            {/* Audio Monitor */}
            <AudioMonitor
              audioLevel={audioLevel}
              isRecording={isRecording}
              analyser={analyserRef.current}
            />
          </div>
        </div>

        {/* Instructions */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-600">
            {isRecording
              ? '🎙️ Recording in progress - speak clearly for best results'
              : 'Click the microphone to start real-time transcription'}
          </p>
        </div>
      </div>
    </div>
  );
};
