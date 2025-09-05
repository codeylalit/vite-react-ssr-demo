import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Mic, Square, Play, Upload, Zap } from 'lucide-react';
import LanguageSelector from './LanguageSelector';

interface Language {
  code: string;
  name: string;
  native: string;
  speakers: string;
  region: string;
  sampleText: string;
  flag?: string;
  isAvailable: boolean;
}

const LanguageDemo = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>({
    code: 'en-global',
    name: 'English',
    native: 'English',
    speakers: '1530M',
    region: 'Global',
    sampleText: 'Everything starts from Zero',
    flag: '🌍',
    isAvailable: true,
  });
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [processingTime, setProcessingTime] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);

  const intervalRef = useRef<NodeJS.Timeout>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Simulate audio level animation during recording
  useEffect(() => {
    if (isRecording) {
      intervalRef.current = setInterval(() => {
        setAudioLevel(Math.random() * 100);
      }, 100);
    } else {
      setAudioLevel(0);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRecording]);

  const startRecording = () => {
    setIsRecording(true);
    setTranscription('');
    setConfidence(0);
    setProcessingTime(0);
  };

  const stopRecording = () => {
    setIsRecording(false);
    processAudio();
  };

  const processAudio = () => {
    setIsProcessing(true);
    const startTime = Date.now();

    // Simulate processing with realistic delay
    setTimeout(
      () => {
        setProcessingTime(Date.now() - startTime);
        setTranscription(selectedLanguage.sampleText);
        setConfidence(95 + Math.random() * 4); // 95-99%
        setIsProcessing(false);
      },
      1200 + Math.random() * 800
    );
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processAudio();
    }
  };

  return (
    <div className="space-y-8">
      {/* Language Selector */}
      <div className="text-center">
        <LanguageSelector
          selectedLanguage={selectedLanguage}
          onLanguageChange={setSelectedLanguage}
        />
      </div>

      {/* Demo Interface */}
      <Card className="border-0 bg-white/5 dark:bg-white/5 backdrop-blur-xl">
        <CardContent className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Recording Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Record or Upload Audio
              </h3>

              {/* Recording Controls */}
              <div className="flex gap-3 justify-center">
                {!isRecording ? (
                  <Button
                    onClick={startRecording}
                    size="default"
                    className="bg-gradient-to-r from-[#1a1947] via-[#2d4cc8] to-[#4c7cf0] hover:from-[#1a1947]/90 hover:via-[#2d4cc8]/90 hover:to-[#4c7cf0]/90 text-white px-6 text-sm"
                    disabled={isProcessing}
                  >
                    <Mic className="w-4 h-4 mr-2" />
                    Start Recording
                  </Button>
                ) : (
                  <Button
                    onClick={stopRecording}
                    size="default"
                    variant="destructive"
                    className="px-6 text-sm"
                  >
                    <Square className="w-4 h-4 mr-2" />
                    Stop Recording
                  </Button>
                )}

                <Button
                  onClick={() => fileInputRef.current?.click()}
                  size="default"
                  variant="outline"
                  disabled={isRecording || isProcessing}
                  className="px-6 text-sm"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload File
                </Button>
              </div>

              {/* Audio Visualizer */}
              {(isRecording || isProcessing) && (
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                  <div className="flex items-center justify-center space-x-1 h-12">
                    {Array.from({ length: 20 }).map((_, i) => (
                      <div
                        key={i}
                        className="w-1 bg-gradient-to-t from-[#1a1947] via-[#2d4cc8] to-[#4c7cf0] rounded-full transition-all duration-100"
                        style={{
                          height: isRecording
                            ? `${20 + audioLevel * Math.random() * 0.6}px`
                            : '8px',
                          animationDelay: `${i * 50}ms`,
                        }}
                      />
                    ))}
                  </div>
                  <div className="text-center text-xs text-gray-600 dark:text-gray-400 mt-2">
                    {isRecording ? 'Recording...' : 'Processing...'}
                  </div>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {/* Results Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Transcription Result
              </h3>

              {transcription ? (
                <div className="space-y-3">
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                    <div className="text-base text-gray-900 dark:text-white font-medium">
                      "{transcription}"
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="text-xl font-bold text-green-600 dark:text-green-400">
                        {confidence.toFixed(1)}%
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Confidence</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                        {processingTime}ms
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Latency</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-center space-x-2 text-xs text-gray-600 dark:text-gray-400">
                    <Zap className="w-3 h-3" />
                    <span>Processed on CPU</span>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center">
                  <div className="text-gray-500 dark:text-gray-400">
                    Record or upload audio to see transcription results
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LanguageDemo;
