import React, { useState, useEffect } from 'react';
import { Settings, X, Info, RotateCcw, Save, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { QuickTooltip } from './Tooltip';
import { AudioParameters } from '../services/websocketService';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  currentParameters: AudioParameters;
  onParameterUpdate: (parameters: AudioParameters) => void;
  onParameterReset: () => void;
  isConnected: boolean;
}

// Default parameter values with ranges
const PARAMETER_DEFAULTS = {
  chunk_duration_ms: { value: 3000, min: 50, max: 10000, step: 25 },
  min_silence_duration_ms: { value: 800, min: 100, max: 5000, step: 100 },
  speech_pad_ms: { value: 200, min: 0, max: 1000, step: 50 },
  vad_threshold: { value: 0.5, min: 0.0, max: 1.0, step: 0.1 },
  buffer_duration_s: { value: 30, min: 5, max: 60, step: 5 },
  partial_interval_ms: { value: 300, min: 100, max: 2000, step: 50 },
  partial_window_ms: { value: 600, min: 300, max: 3000, step: 100 },
};

// Parameter descriptions and tooltips
const PARAMETER_INFO = {
  chunk_duration_ms: {
    label: 'Chunk Duration',
    description: 'Size of audio chunks sent to the server',
    tooltip: 'Controls how frequently audio data is sent to the server for processing. Lower values (50-150ms) provide ultra-low latency and near-instantaneous partial transcription updates, making the system feel highly responsive. However, this increases network traffic and CPU overhead. Higher values (500-1000ms) reduce processing load and improve overall system stability by batching more audio data together, but introduce noticeable delays in transcription updates. The default 250ms provides an optimal balance for most use cases.',
    unit: 'ms',
    impact: 'Latency vs Processing Efficiency'
  },
  min_silence_duration_ms: {
    label: 'Silence Detection',
    description: 'Minimum silence duration to detect speech pauses',
    tooltip: 'Determines how long a pause must be before the system considers it the end of a speech segment. Lower values (100-400ms) make the system highly responsive to natural speech pauses, creating more frequent sentence boundaries and faster final transcriptions. However, this may prematurely cut off words or misinterpret natural hesitations as speech endings. Higher values (800-2000ms) provide more accurate sentence boundary detection by waiting longer to ensure speech has truly ended, but may feel less responsive to actual speech conclusions.',
    unit: 'ms',
    impact: 'Responsiveness vs Accuracy'
  },
  speech_pad_ms: {
    label: 'Speech Padding',
    description: 'Extra audio captured around detected speech',
    tooltip: 'Adds additional audio context before and after detected speech segments to prevent word cutoff. Higher values (200-500ms) capture more surrounding context, ensuring that word beginnings and endings are not missed due to Voice Activity Detection boundaries. This is particularly important for languages with soft consonants or quick speech patterns. Lower values (0-100ms) minimize the inclusion of background noise and overlapping speech but risk missing parts of words that fall outside the detected speech boundaries.',
    unit: 'ms',
    impact: 'Speech Completeness'
  },
  vad_threshold: {
    label: 'Voice Activity Detection',
    description: 'Sensitivity threshold for speech detection',
    tooltip: 'Controls the sensitivity of the Silero VAD model used to distinguish speech from silence or background noise. Lower values (0.1-0.3) make the system more sensitive, detecting quieter speech, whispers, and soft-spoken words. This is ideal for quiet environments or soft speakers but may trigger false positives from background noise, breathing, or ambient sounds. Higher values (0.7-0.9) create a more conservative threshold that effectively filters out noise and non-speech audio, but may miss quiet speech or the beginnings/endings of words.',
    unit: '',
    impact: 'Sensitivity vs Noise Rejection'
  },
  buffer_duration_s: {
    label: 'Audio Buffer Duration',
    description: 'Size of the circular audio buffer',
    tooltip: 'Determines how much audio history is maintained in memory for processing. Higher values (30-60s) enable better contextual understanding for long utterances and complex sentences, allowing the ASR model to reference earlier context for improved accuracy. This is beneficial for technical discussions or detailed explanations but uses more memory and may introduce processing delays. Lower values (5-15s) use less memory and provide more responsive processing but may lose important context for long sentences or complex phrases.',
    unit: 's',
    impact: 'Context vs Memory Usage'
  },
  partial_interval_ms: {
    label: 'Partial Update Interval',
    description: 'Frequency of partial transcription updates',
    tooltip: 'Controls how often partial (preliminary) transcription results are generated and sent to the frontend. Lower values (100-200ms) provide extremely smooth, typewriter-like text flow with very responsive real-time updates, creating an exceptional user experience. However, this significantly increases CPU usage and may cause performance issues on lower-end systems. Higher values (500-1000ms) reduce computational load and improve system stability by processing fewer intermediate results, but make the transcription feel less fluid and more choppy.',
    unit: 'ms',
    impact: 'Responsiveness vs CPU Usage'
  },
  partial_window_ms: {
    label: 'Partial Context Window',
    description: 'Context window size for partial transcriptions',
    tooltip: 'Defines how much previous audio context is included when generating partial transcription results. Larger windows (1000-3000ms) provide more context to the ASR model, resulting in more accurate and stable partial transcriptions with fewer corrections as more audio becomes available. This reduces the "flickering" effect where words change frequently. Smaller windows (300-600ms) generate faster partial results with lower memory usage but may produce less accurate preliminary transcriptions that change more frequently as additional context becomes available.',
    unit: 'ms',
    impact: 'Accuracy vs Latency'
  }
};

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  isOpen,
  onClose,
  currentParameters,
  onParameterUpdate,
  onParameterReset,
  isConnected
}) => {
  const [localParameters, setLocalParameters] = useState<AudioParameters>(currentParameters);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Update local parameters when props change
  useEffect(() => {
    setLocalParameters(currentParameters);
    setHasChanges(false);
  }, [currentParameters]);

  // Check for changes
  useEffect(() => {
    const hasChanged = Object.keys(localParameters).some(key => 
      localParameters[key as keyof AudioParameters] !== currentParameters[key as keyof AudioParameters]
    );
    setHasChanges(hasChanged);
  }, [localParameters, currentParameters]);

  const handleParameterChange = (param: keyof AudioParameters, value: number) => {
    setLocalParameters(prev => ({
      ...prev,
      [param]: value
    }));
  };

  const handleSave = async () => {
    if (!hasChanges) return;
    
    setIsSaving(true);
    await onParameterUpdate(localParameters);
    setIsSaving(false);
  };

  const handleReset = () => {
    const resetParams: AudioParameters = {};
    Object.keys(PARAMETER_DEFAULTS).forEach(key => {
      resetParams[key as keyof AudioParameters] = PARAMETER_DEFAULTS[key as keyof typeof PARAMETER_DEFAULTS].value;
    });
    setLocalParameters(resetParams);
    onParameterReset();
  };

  const getParameterValue = (param: keyof AudioParameters): number => {
    return localParameters[param] ?? PARAMETER_DEFAULTS[param]?.value ?? 0;
  };

  const getParameterConfig = (param: keyof AudioParameters) => {
    return PARAMETER_DEFAULTS[param] || { min: 0, max: 100, step: 1 };
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-purple-200/50 shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden relative">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-purple-200/50 bg-gradient-to-r from-purple-50/80 to-blue-50/80">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#1a1947] via-[#2d4cc8] to-[#4c7cf0] flex items-center justify-center shadow-lg">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">Audio Processing Settings</h2>
              <p className="text-sm text-gray-600">Fine-tune your real-time transcription experience</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center p-2 rounded-xl bg-white/80 backdrop-blur-sm border border-purple-200/60 text-gray-600 hover:text-gray-800 hover:bg-white/90 transition-all duration-200 shadow-sm"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Connection Status */}
        <div className="px-6 py-3 bg-gradient-to-r from-white/90 to-purple-50/30">
          <div className="flex items-center gap-2 text-sm">
            <div className={cn(
              "w-2 h-2 rounded-full",
              isConnected ? "bg-green-500" : "bg-red-500"
            )} />
            <span className={cn(
              "font-medium",
              isConnected ? "text-green-700" : "text-red-700"
            )}>
              {isConnected ? "Connected" : "Disconnected"}
            </span>
            {!isConnected && (
              <span className="text-gray-600">• Settings changes will apply when reconnected</span>
            )}
          </div>
        </div>

        {/* Settings Content */}
        <div className="p-6 space-y-8 overflow-y-auto overflow-x-hidden max-h-[60vh]">
          {/* Audio Processing Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 pb-2 border-b border-gray-200/50">
              <Zap className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-800">Audio Processing</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(PARAMETER_INFO).filter(([param]) => 
                !['partial_interval_ms', 'partial_window_ms'].includes(param)
              ).map(([param, info]) => {
            const config = getParameterConfig(param as keyof AudioParameters);
            const value = getParameterValue(param as keyof AudioParameters);
            
            return (
                  <div key={param} className="bg-gray-50/50 rounded-xl p-4 border border-gray-200/50">
                    <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-semibold text-gray-700">
                      {info.label}
                    </label>
                    <QuickTooltip message={info.tooltip} isSettingsTooltip={true} position="bottom">
                          <Info className="w-4 h-4 text-gray-400 cursor-help hover:text-purple-600 transition-colors" />
                    </QuickTooltip>
                  </div>
                  <div className="flex items-center gap-2">
                        <span className="text-sm font-mono text-purple-600 bg-purple-50 px-2 py-1 rounded-md">
                      {value}{info.unit}
                    </span>
                  </div>
                </div>
                
                    <div className="space-y-3">
                  {param === 'chunk_duration_ms' ? (
                    // Number input for Chunk Duration
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-500 w-12 text-right">
                        {config.min}{info.unit}
                      </span>
                      <div className="flex-1 relative">
                        <input
                          type="number"
                          min={config.min}
                          max={config.max}
                          step={config.step}
                          value={value}
                          onChange={(e) => {
                            const newValue = parseInt(e.target.value) || 0;
                            // Allow any input during typing, validate on blur
                            handleParameterChange(param as keyof AudioParameters, newValue);
                          }}
                          onBlur={(e) => {
                            const newValue = parseInt(e.target.value) || PARAMETER_DEFAULTS[param as keyof typeof PARAMETER_DEFAULTS].value;
                            // Clamp to valid range on blur
                            const clampedValue = Math.max(config.min, Math.min(config.max, newValue));
                            if (clampedValue !== newValue) {
                              handleParameterChange(param as keyof AudioParameters, clampedValue);
                            }
                          }}
                          className="w-full px-3 py-2 pr-12 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                          placeholder={`${config.min}-${config.max}`}
                        />
                        <div className="absolute right-8 top-1/2 transform -translate-y-1/2 text-xs text-gray-400 pointer-events-none">
                          {info.unit}
                        </div>
                      </div>
                      <span className="text-xs text-gray-500 w-12">
                        {config.max}{info.unit}
                      </span>
                    </div>
                  ) : (
                    // Slider for other parameters
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-500 w-12 text-right">
                        {config.min}{info.unit}
                      </span>
                      <input
                        type="range"
                        min={config.min}
                        max={config.max}
                        step={config.step}
                        value={value}
                        onChange={(e) => handleParameterChange(param as keyof AudioParameters, parseFloat(e.target.value))}
                        className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      />
                      <span className="text-xs text-gray-500 w-12">
                        {config.max}{info.unit}
                      </span>
                    </div>
                  )}
                  
                      <div className="text-xs text-gray-600 px-2">
                        <span className="font-medium">{info.description}</span>
                        <span className="mx-2">•</span>
                        <span className="italic text-purple-600">{info.impact}</span>
                  </div>
                </div>
              </div>
            );
          })}
            </div>
          </div>
          
          {/* Partial Transcription Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 pb-2 border-b border-gray-200/50">
              <Zap className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-800">Partial Transcription</h3>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Advanced</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(PARAMETER_INFO).filter(([param]) => 
                ['partial_interval_ms', 'partial_window_ms'].includes(param)
              ).map(([param, info]) => {
                const config = getParameterConfig(param as keyof AudioParameters);
                const value = getParameterValue(param as keyof AudioParameters);
                
                return (
                  <div key={param} className="bg-blue-50/50 rounded-xl p-4 border border-blue-200/50">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <label className="text-sm font-semibold text-gray-700">
                          {info.label}
                        </label>
                        <QuickTooltip message={info.tooltip} isSettingsTooltip={true} position="bottom">
                          <Info className="w-4 h-4 text-gray-400 cursor-help hover:text-blue-600 transition-colors" />
                        </QuickTooltip>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-mono text-blue-600 bg-blue-100 px-2 py-1 rounded-md">
                          {value}{info.unit}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-500 w-12 text-right">
                          {config.min}{info.unit}
                        </span>
                        <input
                          type="range"
                          min={config.min}
                          max={config.max}
                          step={config.step}
                          value={value}
                          onChange={(e) => handleParameterChange(param as keyof AudioParameters, parseFloat(e.target.value))}
                          className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                        />
                        <span className="text-xs text-gray-500 w-12">
                          {config.max}{info.unit}
                        </span>
                      </div>
                      
                      <div className="text-xs text-gray-600 px-2">
                        <span className="font-medium">{info.description}</span>
                        <span className="mx-2">•</span>
                        <span className="italic text-blue-600">{info.impact}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between p-6 border-t border-purple-200/50 bg-gradient-to-r from-purple-50/80 to-blue-50/80">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/80 backdrop-blur-sm border border-purple-200/60 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reset to Defaults
          </button>
          
          <div className="flex items-center gap-3">
            {hasChanges && (
              <div className="flex items-center gap-2 text-sm text-amber-600">
                <div className="w-2 h-2 rounded-full bg-amber-500" />
                Unsaved changes
              </div>
            )}
            
            <button
              onClick={handleSave}
              disabled={!hasChanges || isSaving}
              className={cn(
                "flex items-center gap-2 px-6 py-2 rounded-xl font-medium transition-all",
                hasChanges && !isSaving
                  ? "bg-gradient-to-r from-[#1a1947] via-[#2d4cc8] to-[#4c7cf0] text-white hover:shadow-lg hover:scale-105"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
              )}
            >
              {isSaving ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {isSaving ? "Saving..." : isConnected ? "Save Changes" : "Save Changes (will apply when reconnected)"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel; 