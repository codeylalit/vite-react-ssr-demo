export interface AudioConfig {
  sampleRate: number;
  channelCount: number;
  bitrate: number;
  chunkDurationMs: number;
  whisperLiveMode?: boolean; // Enable WhisperLive compatibility mode
}

export interface AudioLevelInfo {
  level: number;
  isClipping: boolean;
  timestamp: number;
}

export interface PCMFrame {
  seq: number;
  timestamp: number;
  pcm: Int16Array;
}

export type AudioDataCallback = (audioData: ArrayBuffer) => void;
export type AudioLevelCallback = (levelInfo: AudioLevelInfo) => void;
export type AudioErrorCallback = (error: Error) => void;

class AudioService {
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private microphone: MediaStreamAudioSourceNode | null = null;
  private stream: MediaStream | null = null;
  private pcmRecorderNode: AudioWorkletNode | null = null;
  private isRecording = false;
  private audioLevelMonitor: number | null = null;
  private chunkSequence = 0;
  private sessionId: string | null = null;

  private config: AudioConfig = {
    sampleRate: 16000,
    channelCount: 1,
    bitrate: 16000,
    chunkDurationMs: 50,
  };

  private onAudioData: AudioDataCallback | null = null;
  private onAudioLevel: AudioLevelCallback | null = null;
  private onError: AudioErrorCallback | null = null;

  constructor(config?: Partial<AudioConfig>) {
    if (config) {
      this.config = { ...this.config, ...config };
    }
  }

  /**
   * Set callback functions
   */
  setCallbacks(callbacks: {
    onAudioData?: AudioDataCallback;
    onAudioLevel?: AudioLevelCallback;
    onError?: AudioErrorCallback;
  }): void {
    this.onAudioData = callbacks.onAudioData || null;
    this.onAudioLevel = callbacks.onAudioLevel || null;
    this.onError = callbacks.onError || null;
  }

  /**
   * Initialize audio capture
   */
  async initialize(): Promise<void> {
    try {
      // Check if audio is supported
      if (!AudioService.isSupported()) {
        throw new Error('Audio recording is not supported in this browser');
      }

      // Check AudioWorklet support
      if (!('audioWorklet' in AudioContext.prototype)) {
        throw new Error('AudioWorklet is not supported in this browser');
      }

      // Request microphone permission with better error handling
      try {
        this.stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            sampleRate: 48000, // Let browser use native rate, we'll downsample
            channelCount: 2, // Allow stereo, we'll convert to mono
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
          video: false,
        });
      } catch (permissionError) {
        console.error('Microphone permission denied or failed:', permissionError);
        if (permissionError.name === 'NotAllowedError') {
          throw new Error(
            'Microphone access denied. Please allow microphone access and refresh the page.'
          );
        } else if (permissionError.name === 'NotFoundError') {
          throw new Error('No microphone found. Please connect a microphone and refresh the page.');
        } else {
          throw new Error(`Failed to access microphone: ${permissionError.message}`);
        }
      }

      // Create audio context for audio level monitoring
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

      // Handle audio context state
      if (this.audioContext.state === 'suspended') {
        console.log('Audio context suspended, will resume when starting recording');
      }

      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 256;
      this.analyser.smoothingTimeConstant = 0.8;

      // Connect microphone to analyser
      this.microphone = this.audioContext.createMediaStreamSource(this.stream);
      this.microphone.connect(this.analyser);

      // Load AudioWorklet processor
      let workletUrl: any;
      try {
        // Use explicit import for the worklet URL
        workletUrl = await import('../lib/worklets/pcm-recorder.worklet.js?url');
        console.log('Loading AudioWorklet from:', workletUrl.default);
        console.log('Environment:', import.meta.env.MODE);
        await this.audioContext.audioWorklet.addModule(workletUrl.default);

        // Create AudioWorkletNode
        this.pcmRecorderNode = new AudioWorkletNode(this.audioContext, 'pcm-recorder');

        // Set up PCM frame handler
        this.setupPCMFrameHandler();

        console.log('AudioWorklet ready @16 kHz PCM');
      } catch (workletError) {
        console.error('Failed to load AudioWorklet:', workletError);
        console.error('Worklet URL was:', workletUrl?.default || 'URL import failed');

        // Provide more specific error messages
        if (workletError instanceof TypeError) {
          throw new Error(
            'AudioWorklet module failed to load - check network connection and file availability'
          );
        } else if (workletError.name === 'AbortError') {
          throw new Error(
            'AudioWorklet module loading was aborted - the worklet file may not exist or have syntax errors'
          );
        } else {
          throw new Error(`AudioWorklet initialization failed: ${workletError.message}`);
        }
      }

      console.log('Audio service initialized successfully');
      console.log('Using AudioWorklet for PCM capture');
      console.log('Target sample rate:', this.config.sampleRate);
      console.log('Target channel count:', this.config.channelCount);
      console.log('Audio context state:', this.audioContext.state);
    } catch (error) {
      console.error('Failed to initialize audio service:', error);
      this.handleError(error as Error);
      throw error;
    }
  }

  /**
   * Setup PCM frame handler for AudioWorklet
   */
  private setupPCMFrameHandler(): void {
    if (!this.pcmRecorderNode) return;

    this.pcmRecorderNode.port.onmessage = event => {
      const frame: PCMFrame = event.data;

      if (this.onAudioData) {
        // Choose format based on mode
        if (this.config.whisperLiveMode) {
          // Convert to Float32Array for WhisperLive
          const buffer = this.convertToFloat32Array(frame);
          this.onAudioData(buffer);
        } else {
          // Serialize PCM frame to binary format (original behavior)
          const buffer = this.serializePCMFrame(frame);
          this.onAudioData(buffer);
        }
      }
    };
  }

  /**
   * Convert PCM frame to Float32Array for WhisperLive
   */
  private convertToFloat32Array(frame: PCMFrame): ArrayBuffer {
    // Convert Int16 to Float32 (normalize to [-1, 1] range)
    const float32Data = new Float32Array(frame.pcm.length);
    for (let i = 0; i < frame.pcm.length; i++) {
      float32Data[i] = frame.pcm[i] / 32768.0; // Normalize 16-bit PCM to [-1, 1]
    }

    // Return the Float32Array buffer directly
    return float32Data.buffer;
  }

  /**
   * Serialize PCM frame to binary format
   */
  private serializePCMFrame(frame: PCMFrame): ArrayBuffer {
    const headerSize = 12; // 4 bytes seq + 8 bytes timestamp
    const payloadSize = frame.pcm.byteLength;
    const buffer = new ArrayBuffer(headerSize + payloadSize);
    const view = new DataView(buffer);

    // Write header
    view.setUint32(0, frame.seq, true); // little endian
    view.setFloat64(4, frame.timestamp, true); // little endian

    // Write PCM payload
    const pcmView = new Int16Array(buffer, headerSize);
    pcmView.set(frame.pcm);

    return buffer;
  }

  /**
   * Start recording
   */
  async startRecording(): Promise<void> {
    if (this.isRecording) {
      console.warn('Already recording');
      return;
    }

    if (!this.audioContext || !this.microphone || !this.pcmRecorderNode) {
      throw new Error('Audio service not initialized');
    }

    try {
      // Resume audio context if suspended
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      // Connect microphone to PCM recorder
      this.microphone.connect(this.pcmRecorderNode);

      // Update frame duration if needed
      this.pcmRecorderNode.port.postMessage({
        type: 'updateParams',
        frameDurationMs: this.config.chunkDurationMs,
      });

      this.isRecording = true;
      this.chunkSequence = 0;

      // Start audio level monitoring
      this.startAudioLevelMonitoring();

      console.log('PCM recording started');
    } catch (error) {
      console.error('Failed to start recording:', error);
      this.handleError(error as Error);
      throw error;
    }
  }

  /**
   * Stop recording
   */
  stopRecording(): void {
    if (!this.isRecording) {
      console.warn('Not currently recording');
      return;
    }

    try {
      if (this.microphone && this.pcmRecorderNode) {
        this.microphone.disconnect(this.pcmRecorderNode);
      }

      this.isRecording = false;
      this.stopAudioLevelMonitoring();

      console.log('PCM recording stopped');
    } catch (error) {
      console.error('Failed to stop recording:', error);
      this.handleError(error as Error);
    }
  }

  /**
   * Start audio level monitoring
   */
  private startAudioLevelMonitoring(): void {
    if (!this.analyser || this.audioLevelMonitor) return;

    const updateAudioLevel = () => {
      if (!this.analyser || !this.isRecording) return;

      const bufferLength = this.analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      this.analyser.getByteFrequencyData(dataArray);

      // Calculate RMS level
      let sum = 0;
      for (let i = 0; i < bufferLength; i++) {
        sum += dataArray[i] * dataArray[i];
      }
      const rms = Math.sqrt(sum / bufferLength);
      const level = rms / 255; // Normalize to 0-1

      // Check for clipping
      const isClipping = level > 0.95;

      if (this.onAudioLevel) {
        this.onAudioLevel({
          level,
          isClipping,
          timestamp: Date.now(),
        });
      }

      this.audioLevelMonitor = requestAnimationFrame(updateAudioLevel);
    };

    this.audioLevelMonitor = requestAnimationFrame(updateAudioLevel);
  }

  /**
   * Stop audio level monitoring
   */
  private stopAudioLevelMonitoring(): void {
    if (this.audioLevelMonitor) {
      cancelAnimationFrame(this.audioLevelMonitor);
      this.audioLevelMonitor = null;
    }
  }

  /**
   * Handle errors
   */
  private handleError(error: Error): void {
    console.error('AudioService error:', error);
    if (this.onError) {
      this.onError(error);
    }
  }

  /**
   * Get recording state
   */
  getRecordingState(): boolean {
    return this.isRecording;
  }

  /**
   * Get analyser node for audio visualization
   */
  getAnalyser(): AnalyserNode | null {
    return this.analyser;
  }

  /**
   * Get configuration
   */
  getConfig(): AudioConfig {
    return { ...this.config };
  }

  /**
   * Get audio format (now always PCM)
   */
  getAudioFormat(): string {
    return 'raw_pcm';
  }

  /**
   * Check if audio recording is supported
   */
  static isSupported(): boolean {
    return !!(
      navigator.mediaDevices &&
      navigator.mediaDevices.getUserMedia &&
      window.AudioContext &&
      'audioWorklet' in AudioContext.prototype
    );
  }

  /**
   * Get available audio devices
   */
  static async getAudioDevices(): Promise<MediaDeviceInfo[]> {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      return devices.filter(device => device.kind === 'audioinput');
    } catch (error) {
      console.error('Failed to get audio devices:', error);
      return [];
    }
  }

  /**
   * Cleanup resources
   */
  cleanup(): void {
    this.stopRecording();
    this.stopAudioLevelMonitoring();

    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }

    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }

    this.microphone = null;
    this.analyser = null;
    this.pcmRecorderNode = null;
  }
}

export default AudioService;
