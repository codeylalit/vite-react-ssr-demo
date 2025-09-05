export interface TranscriptionResult {
  text: string;
  is_final: boolean;
  confidence: number;
  start_time?: number;
  end_time?: number;
  timestamp: number;
  session_id?: string;
  message_id?: string;
  segment_id?: string;
  language?: string;
  script?: string;
  sentence_state?: 'incomplete' | 'complete' | 'paragraph_end';
  sentence_confidence?: number;
  segments?: WhisperLiveSegment[]; // Add segments for WhisperLive
  metadata?: {
    word_rate_wpm?: number;
    processing_time_ms?: number;
    latency_ms?: number;
  };
}

// WhisperLive specific interfaces
export interface WhisperLiveSegment {
  start: number | string; // WhisperLive sends these as strings
  end: number | string; // WhisperLive sends these as strings
  text: string;
  completed?: boolean;
}

export interface WhisperLiveMessage {
  status?: string;
  message?: string | number;
  language?: string;
  segments?: WhisperLiveSegment[];
}

export interface WhisperLiveConfig {
  uid: string;
  language?: string | null;
  task: string;
  model: string;
  use_vad: boolean;
  save_output_recording: boolean;
  output_recording_filename?: string;
  hf_token?: string;
}

export interface WebSocketConfig {
  url: string;
  reconnectAttempts: number;
  reconnectDelay: number;
  pingInterval: number;
  language: string;
  script?: string;
  audioFormat?: string;
  // WhisperLive specific config
  whisperLiveConfig?: {
    task?: string;
    model?: string;
    useVad?: boolean;
    hfToken?: string;
  };
}

export interface WebSocketMessage {
  type: string;
  [key: string]: any;
}

export interface AudioParameters {
  chunk_duration_ms?: number;
  min_silence_duration_ms?: number;
  speech_pad_ms?: number;
  vad_threshold?: number;
  buffer_duration_s?: number;
  partial_interval_ms?: number;
  partial_window_ms?: number;
}

export type TranscriptionCallback = (result: TranscriptionResult) => void;
export type ConnectionStatusCallback = (
  status: 'connecting' | 'connected' | 'disconnected' | 'error'
) => void;
export type ErrorCallback = (error: Error) => void;
export type ParameterUpdateCallback = (parameters: AudioParameters) => void;

class WebSocketService {
  private websocket: WebSocket | null = null;
  private config: WebSocketConfig;
  private reconnectTimer: number | null = null;
  private pingTimer: number | null = null;
  private reconnectAttempts = 0;
  private isIntentionalClose = false;
  private connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error' = 'disconnected';
  private messageHistory: Set<string> = new Set();
  private currentSession: string | null = null;
  private currentParameters: AudioParameters = {};

  // Client-side transcript merging state
  private lastTranscriptText: string = '';
  private lastTranscriptTime: number = 0;
  private messageIds: Set<string> = new Set();

  // WhisperLive specific state
  private clientUid: string = '';
  private isWhisperLiveMode: boolean = false;
  private configSent: boolean = false;
  private segments: WhisperLiveSegment[] = [];
  private segmentCounter: number = 0;
  private lastAudioSentTime: number = 0; // Track when we last sent audio for latency
  private processedSegments: Map<string, TranscriptionResult> = new Map();

  // Callbacks
  private onTranscription: TranscriptionCallback | null = null;
  private onConnectionStatus: ConnectionStatusCallback | null = null;
  private onError: ErrorCallback | null = null;
  private onParameterUpdate: ParameterUpdateCallback | null = null;

  constructor(config: WebSocketConfig) {
    this.config = config;
    this.isWhisperLiveMode = config.url.includes('8000') || config.whisperLiveConfig !== undefined;
    this.clientUid = this.generateUID();
  }

  /**
   * Generate a unique client ID for WhisperLive
   */
  private generateUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0;
      const v = c == 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  /**
   * Set callback functions
   */
  setCallbacks(callbacks: {
    onTranscription?: TranscriptionCallback;
    onConnectionStatus?: ConnectionStatusCallback;
    onError?: ErrorCallback;
    onParameterUpdate?: ParameterUpdateCallback;
  }): void {
    this.onTranscription = callbacks.onTranscription || null;
    this.onConnectionStatus = callbacks.onConnectionStatus || null;
    this.onError = callbacks.onError || null;
    this.onParameterUpdate = callbacks.onParameterUpdate || null;
  }

  /**
   * Connect to WebSocket server
   */
  async connect(authToken?: string): Promise<void> {
    try {
      this.isIntentionalClose = false;
      this.setConnectionStatus('connecting');

      // Initialize new session
      this.currentSession = `ws_session_${Date.now()}`;
      this.messageHistory.clear();
      this.configSent = false;
      this.segments = [];
      this.segmentCounter = 0;
      this.processedSegments.clear();

      let wsUrl: string;

      if (this.isWhisperLiveMode) {
        // For WhisperLive, just use the URL as-is (usually ws://localhost:9090)
        wsUrl = this.config.url;
      } else {
        // For original service, build WebSocket URL with authentication token
        // Don't double-encode the token - it's already encoded from the auth service
        wsUrl = `${this.config.url}?token=${authToken}`;
      }

      console.log('Connecting to WebSocket:', wsUrl.replace(/token=[^&]+/, 'token=***'));
      console.log('Realtime Service mode:', this.isWhisperLiveMode);
      console.log('Starting new WebSocket session:', this.currentSession);
      console.log('Client UID:', this.clientUid);

      this.websocket = new WebSocket(wsUrl);
      this.setupWebSocketHandlers();

      // Wait for connection to open
      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('WebSocket connection timeout'));
        }, 10000); // 10 second timeout

        if (this.websocket) {
          this.websocket.onopen = () => {
            clearTimeout(timeout);

            // Send initial config for WhisperLive
            if (this.isWhisperLiveMode) {
              this.sendWhisperLiveConfig();
            }

            resolve();
          };

          this.websocket.onerror = error => {
            clearTimeout(timeout);
            reject(new Error('WebSocket connection failed'));
          };
        }
      });
    } catch (error) {
      console.error('Failed to connect to WebSocket:', error);
      this.handleError(error as Error);
      throw error;
    }
  }

  /**
   * Send initial configuration to WhisperLive server
   */
  private sendWhisperLiveConfig(): void {
    // console.log('sendWhisperLiveConfig called');
    // console.log('WebSocket state:', this.websocket?.readyState);
    // console.log('Config sent already:', this.configSent);

    if (!this.websocket) {
      console.error('No websocket available for config sending');
      return;
    }

    if (this.configSent) {
      console.log('Config already sent, skipping');
      return;
    }

    const whisperConfig = this.config.whisperLiveConfig || {};

    const config: WhisperLiveConfig = {
      uid: this.clientUid,
      language: this.config.language || null,
      task: whisperConfig.task || 'transcribe',
      model: whisperConfig.model || 'base',
      use_vad: whisperConfig.useVad || false,
      save_output_recording: false,
      output_recording_filename: './output_recording.wav',
    };

    // Add HuggingFace token if provided
    if (whisperConfig.hfToken) {
      config.hf_token = whisperConfig.hfToken;
    }

    // console.log('Sending WhisperLive config:', config);
    // console.log('JSON config:', JSON.stringify(config));

    try {
      this.websocket.send(JSON.stringify(config));
      this.configSent = true;
      // console.log('WhisperLive config sent successfully');
    } catch (error) {
      console.error('Failed to send WhisperLive config:', error);
    }
  }

  /**
   * Setup WebSocket event handlers
   */
  private setupWebSocketHandlers(): void {
    if (!this.websocket) return;

    this.websocket.onopen = () => {
      // console.log('WebSocket onopen triggered in setupWebSocketHandlers');
      // console.log('WhisperLive mode in setupWebSocketHandlers:', this.isWhisperLiveMode);
      this.setConnectionStatus('connected');
      this.reconnectAttempts = 0;

      if (this.isWhisperLiveMode) {
        // For WhisperLive, configuration is already sent in connect() method
        // console.log('WhisperLive mode: Configuration already sent in connect() method');
      } else {
        // Send initialization message for original service
        // console.log('Sending init message for original service');
        this.sendInitMessage();

        // Get current parameters from server
        setTimeout(() => {
          this.getParameters();
        }, 500); // Small delay to ensure server is ready

        // Start ping/pong to keep connection alive
        this.startPingInterval();
      }
    };

    this.websocket.onmessage = event => {
      try {
        if (this.isWhisperLiveMode) {
          const message = JSON.parse(event.data) as WhisperLiveMessage;
          this.handleWhisperLiveMessage(message);
        } else {
          const message: WebSocketMessage = JSON.parse(event.data);
          this.handleMessage(message);
        }
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
        this.handleError(new Error('Invalid message format received'));
      }
    };

    this.websocket.onclose = event => {
      // console.log('WebSocket closed:', event.code, event.reason);
      this.setConnectionStatus('disconnected');
      this.cleanup();

      // Attempt reconnection if not intentional
      if (!this.isIntentionalClose) {
        this.scheduleReconnect();
      }
    };

    this.websocket.onerror = error => {
      console.error('WebSocket error details:', error);
      console.error('WebSocket readyState:', this.websocket?.readyState);
      // console.error('WhisperLive mode:', this.isWhisperLiveMode);
      // console.error('WebSocket URL was:', this.config.url);
      this.setConnectionStatus('error');
      this.handleError(new Error('WebSocket connection error'));
    };
  }

  /**
   * Send initialization message to server
   */
  private sendInitMessage(): void {
    const initMessage = {
      type: 'init',
      language: this.config.language,
      script: this.config.script,
      audio_format: 'raw_pcm', // Always use raw PCM now
      timestamp: Date.now(),
    };

    this.sendMessage(initMessage);
  }

  /**
   * Handle WhisperLive server messages
   */
  private handleWhisperLiveMessage(message: WhisperLiveMessage): void {
    // console.log('Received WhisperLive message:', message);

    // Handle server busy status
    if (message.status === 'WAIT') {
      const waitTime = typeof message.message === 'number' ? message.message : 0;
      this.handleError(
        new Error(`Server is busy. Estimated wait time: ${Math.round(waitTime)} minutes`)
      );
      return;
    }

    // Handle language detection
    if (message.language) {
      // console.log('Language detected:', message.language);
      // Note: Language detection handled separately, not affecting transcript display
    }

    // Handle transcription segments - send raw segments to callback
    if (message.segments && message.segments.length > 0) {
      this.segments = message.segments;

      // Calculate actual round-trip latency: audio sent → segment received
      const now = Date.now();
      const roundTripLatency = this.lastAudioSentTime > 0 ? now - this.lastAudioSentTime : 0;

      console.log('🎯 Round-trip latency calculation:', {
        audioSentAt: new Date(this.lastAudioSentTime).toISOString().split('T')[1],
        segmentReceivedAt: new Date(now).toISOString().split('T')[1],
        latencyMs: roundTripLatency,
      });

      // Send segments directly to the callback for HTML-like handling
      if (this.onTranscription) {
        this.onTranscription({
          text: '',
          is_final: false,
          confidence: 1.0,
          timestamp: now,
          segments: message.segments,
          metadata: {
            latency_ms: roundTripLatency,
            processing_time_ms: roundTripLatency,
            word_rate_wpm: 0,
          },
        });
      }
    }
  }

  /**
   * Process WhisperLive transcription segments into our format
   * Handles partial and final segments properly like the HTML example
   */
  private processWhisperLiveSegments(segments: WhisperLiveSegment[]): void {
    // console.log('Processing WhisperLive segments:', segments);

    segments.forEach((segment, index) => {
      // Parse start/end times as numbers (WhisperLive sends them as strings)
      const startTime = parseFloat(segment.start as any) || 0;
      const endTime = parseFloat(segment.end as any) || 0;

      // Create a stable segment key based on timing only (not array index)
      // This ensures the same segment always gets the same key regardless of position
      const segmentKey = `${startTime.toFixed(3)}_${endTime.toFixed(3)}`;

      // Check if this is an existing segment being updated
      const existingSegment = this.processedSegments.get(segmentKey);

      // Generate unique segment ID
      let segmentId: string;
      if (existingSegment) {
        // Use existing ID for updates
        segmentId = existingSegment.segment_id!;
      } else {
        // Create new ID for new segments
        segmentId = `whisper_segment_${this.segmentCounter++}`;
      }

      const result: TranscriptionResult = {
        text: segment.text.trim(),
        is_final: segment.completed === true,
        confidence: 0.95, // WhisperLive doesn't provide confidence
        start_time: startTime,
        end_time: endTime,
        timestamp: Date.now(),
        session_id: this.currentSession || '',
        message_id: `${segmentId}_${Date.now()}`,
        segment_id: segmentId,
        language: this.config.language,
        script: this.config.script,
        sentence_state: segment.completed === true ? 'complete' : 'incomplete',
        sentence_confidence: 0.95,
      };

      // Only send to callback if this is genuinely new or updated content
      if (!existingSegment) {
        // Completely new segment
        console.log(`Processing NEW ${result.is_final ? 'FINAL' : 'PARTIAL'} segment:`, {
          id: segmentId,
          text: result.text,
          startTime,
          endTime,
          completed: segment.completed,
        });

        this.processedSegments.set(segmentKey, result);

        if (this.onTranscription) {
          this.onTranscription(result);
        }
      } else if (
        existingSegment.text !== result.text ||
        existingSegment.is_final !== result.is_final
      ) {
        // Updated segment content or completion status
        console.log(`Processing UPDATED ${result.is_final ? 'FINAL' : 'PARTIAL'} segment:`, {
          id: segmentId,
          oldText: existingSegment.text,
          newText: result.text,
          wasCompleted: existingSegment.is_final,
          nowCompleted: result.is_final,
          startTime,
          endTime,
        });

        this.processedSegments.set(segmentKey, result);

        if (this.onTranscription) {
          this.onTranscription(result);
        }
      } else {
        // Identical segment - skip completely
        console.log(`Skipping duplicate segment: ${segmentKey} - "${result.text}"`);
      }
    });
  }

  /**
   * Start ping interval to keep connection alive
   */
  private startPingInterval(): void {
    this.pingTimer = window.setInterval(() => {
      if (this.websocket?.readyState === WebSocket.OPEN) {
        this.sendMessage({
          type: 'ping',
          timestamp: Date.now(),
        });
      }
    }, this.config.pingInterval);
  }

  /**
   * Handle different types of WebSocket messages
   */
  private handleMessage(message: WebSocketMessage): void {
    switch (message.type) {
      case 'pong':
        // Handle ping response
        break;
      case 'transcription':
        this.handleTranscriptionMessage(message);
        break;
      case 'parameter_update_response':
        this.handleParameterUpdateResponse(message);
        break;
      case 'get_parameters_response':
        this.handleGetParametersResponse(message);
        break;
      case 'error':
        console.error('WebSocket error from server:', message.message);
        this.handleError(new Error(message.message));
        break;
      case 'init_response':
        console.log('Initialization response received:', message);
        break;
      default:
        console.warn('Unknown message type:', message.type);
    }
  }

  /**
   * Handle transcription messages from server
   */
  private handleTranscriptionMessage(message: WebSocketMessage): void {
    try {
      const result: TranscriptionResult = {
        text: message.text || '',
        confidence: message.confidence || 0,
        is_final: message.is_final || false,
        timestamp: message.timestamp || Date.now(),
        session_id: message.session_id || '',
        message_id: message.message_id || '',
        segment_id: message.segment_id || '',
        language: message.language || 'en',
        script: message.script || 'auto',
        sentence_state: message.sentence_state || 'incomplete',
        sentence_confidence: message.sentence_confidence || 0,
        metadata: message.metadata || {},
      };

      // Skip duplicate messages
      const messageId = result.message_id;
      if (messageId && this.messageIds.has(messageId)) {
        console.log('Skipping duplicate transcription message:', messageId);
        return;
      }

      if (messageId) {
        this.messageIds.add(messageId);
        // Keep only last 100 message IDs to prevent memory growth
        if (this.messageIds.size > 100) {
          const oldest = Array.from(this.messageIds)[0];
          this.messageIds.delete(oldest);
        }
      }

      // Apply client-side merging to prevent duplications
      const mergedResult = this.mergeTranscriptResult(result);

      if (this.onTranscription) {
        this.onTranscription(mergedResult);
      }
    } catch (error) {
      console.error('Failed to handle transcription message:', error);
    }
  }

  /**
   * Merge transcript result with previous text to prevent duplications
   */
  private mergeTranscriptResult(result: TranscriptionResult): TranscriptionResult {
    const currentTime = Date.now();
    const currentText = result.text.trim();

    // If no previous text or too much time has passed, return as-is
    if (!this.lastTranscriptText || currentTime - this.lastTranscriptTime > 5000) {
      this.lastTranscriptText = currentText;
      this.lastTranscriptTime = currentTime;
      return result;
    }

    // Check for overlap between current and previous text
    const overlap = this.findTextOverlap(this.lastTranscriptText, currentText);

    if (overlap.overlapRatio > 0.5) {
      // Significant overlap detected - merge by taking only the new part
      const mergedText = overlap.mergedText;

      console.log(`Client-side merge: ${overlap.overlapRatio.toFixed(2)} overlap`);
      console.log(`Previous: "${this.lastTranscriptText}"`);
      console.log(`Current: "${currentText}"`);
      console.log(`Merged: "${mergedText}"`);

      this.lastTranscriptText = mergedText;
      this.lastTranscriptTime = currentTime;

      return {
        ...result,
        text: mergedText,
      };
    }

    // No significant overlap - update tracking and return original
    this.lastTranscriptText = currentText;
    this.lastTranscriptTime = currentTime;
    return result;
  }

  /**
   * Find overlap between two text strings and create merged result
   */
  private findTextOverlap(
    previousText: string,
    currentText: string
  ): {
    overlapRatio: number;
    mergedText: string;
  } {
    if (!previousText || !currentText) {
      return { overlapRatio: 0, mergedText: currentText };
    }

    const prevWords = previousText.toLowerCase().split(/\s+/);
    const currWords = currentText.toLowerCase().split(/\s+/);

    let maxOverlap = 0;
    let bestMerge = currentText;

    // Check for suffix of previous matching prefix of current
    for (let i = 1; i <= Math.min(prevWords.length, currWords.length); i++) {
      const prevSuffix = prevWords.slice(-i);
      const currPrefix = currWords.slice(0, i);

      // Compare word sequences
      const matches = prevSuffix.every((word, idx) => this.wordsAreSimilar(word, currPrefix[idx]));

      if (matches && i > maxOverlap) {
        maxOverlap = i;
        // Create merged text by combining previous + non-overlapping current
        const originalCurrWords = currentText.split(/\s+/);
        const newPart = originalCurrWords.slice(i).join(' ');
        bestMerge = newPart.trim() || currentText;
      }
    }

    const overlapRatio = maxOverlap / Math.min(prevWords.length, currWords.length);

    return {
      overlapRatio,
      mergedText: bestMerge,
    };
  }

  /**
   * Check if two words are similar (handles minor transcription variations)
   */
  private wordsAreSimilar(word1: string, word2: string): boolean {
    if (word1 === word2) return true;

    // Handle minor differences (e.g., punctuation, contractions)
    const clean1 = word1.replace(/[^\w]/g, '').toLowerCase();
    const clean2 = word2.replace(/[^\w]/g, '').toLowerCase();

    if (clean1 === clean2) return true;

    // Handle very short words more strictly
    if (clean1.length <= 2 || clean2.length <= 2) {
      return clean1 === clean2;
    }

    // Simple Levenshtein distance for longer words
    const distance = this.levenshteinDistance(clean1, clean2);
    const maxLength = Math.max(clean1.length, clean2.length);
    const similarity = 1 - distance / maxLength;

    return similarity >= 0.8; // 80% similarity threshold
  }

  /**
   * Calculate Levenshtein distance between two strings
   */
  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1)
      .fill(null)
      .map(() => Array(str1.length + 1).fill(null));

    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;

    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const substitutionCost = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1, // deletion
          matrix[j - 1][i] + 1, // insertion
          matrix[j - 1][i - 1] + substitutionCost // substitution
        );
      }
    }

    return matrix[str2.length][str1.length];
  }

  /**
   * Handle parameter update response
   */
  private handleParameterUpdateResponse(message: WebSocketMessage): void {
    try {
      console.log('Parameter update response:', message);

      if (message.status === 'success') {
        // Update current parameters with the confirmed values
        this.currentParameters = { ...this.currentParameters, ...message.updated_parameters };

        // Notify callback if available
        if (this.onParameterUpdate) {
          this.onParameterUpdate(this.currentParameters);
        }

        console.log('Parameters updated successfully:', this.currentParameters);
      } else {
        console.error('Parameter update failed:', message.message);
        this.handleError(new Error(message.message || 'Parameter update failed'));
      }
    } catch (error) {
      console.error('Error handling parameter update response:', error);
      this.handleError(error as Error);
    }
  }

  /**
   * Handle get parameters response
   */
  private handleGetParametersResponse(message: WebSocketMessage): void {
    try {
      console.log('Get parameters response:', message);

      if (message.status === 'success') {
        this.currentParameters = message.parameters || {};

        // Notify callback if available
        if (this.onParameterUpdate) {
          this.onParameterUpdate(this.currentParameters);
        }

        console.log('Current parameters retrieved:', this.currentParameters);
      } else {
        console.error('Get parameters failed:', message.message);
        this.handleError(new Error(message.message || 'Get parameters failed'));
      }
    } catch (error) {
      console.error('Error handling get parameters response:', error);
      this.handleError(error as Error);
    }
  }

  /**
   * Send audio data to server
   * audioData is already in binary format: [seq(4) + timestamp(8) + pcm_payload(...)]
   */
  sendAudioData(audioData: ArrayBuffer): void {
    if (this.websocket?.readyState === WebSocket.OPEN) {
      try {
        // Record timestamp when sending audio
        this.lastAudioSentTime = Date.now();
        this.websocket.send(audioData);
      } catch (error) {
        console.error('Failed to send audio data:', error);
        this.handleError(error as Error);
      }
    }
  }

  /**
   * Send JSON message to server
   */
  private sendMessage(message: WebSocketMessage): void {
    if (this.websocket?.readyState === WebSocket.OPEN) {
      try {
        const jsonMessage = JSON.stringify(message);
        this.websocket.send(jsonMessage);
      } catch (error) {
        console.error('Failed to send message:', error);
        this.handleError(error as Error);
      }
    }
  }

  /**
   * Update WebSocket configuration
   */
  updateConfig(updates: Partial<WebSocketConfig>): void {
    this.config = { ...this.config, ...updates };

    // If language or script changed and we're connected, send update
    if (this.websocket?.readyState === WebSocket.OPEN && (updates.language || updates.script)) {
      this.sendInitMessage();
    }
  }

  /**
   * Update audio processing parameters
   */
  async updateParameters(parameters: AudioParameters): Promise<boolean> {
    if (!this.isConnected()) {
      console.warn('Cannot update parameters: WebSocket not connected');
      return false;
    }

    try {
      const message = {
        type: 'update_parameters',
        parameters: parameters,
        timestamp: Date.now(),
      };

      this.sendMessage(message);
      console.log('Parameter update sent:', parameters);
      return true;
    } catch (error) {
      console.error('Failed to send parameter update:', error);
      return false;
    }
  }

  /**
   * Get current audio processing parameters
   */
  async getParameters(): Promise<boolean> {
    if (!this.isConnected()) {
      console.warn('Cannot get parameters: WebSocket not connected');
      return false;
    }

    try {
      const message = {
        type: 'get_parameters',
        timestamp: Date.now(),
      };

      this.sendMessage(message);
      console.log('Get parameters request sent');
      return true;
    } catch (error) {
      console.error('Failed to send get parameters request:', error);
      return false;
    }
  }

  /**
   * Get current cached parameters
   */
  getCurrentParameters(): AudioParameters {
    return { ...this.currentParameters };
  }

  /**
   * Schedule reconnection attempt
   */
  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.config.reconnectAttempts) {
      console.log('Max reconnection attempts reached');
      this.setConnectionStatus('error');
      this.handleError(new Error('Reconnection requires fresh authentication token'));
      return;
    }

    const delay = this.config.reconnectDelay * Math.pow(2, this.reconnectAttempts); // Exponential backoff
    this.reconnectAttempts++;

    console.log(
      `Reconnecting in ${delay}ms... (attempt ${this.reconnectAttempts}/${this.config.reconnectAttempts})`
    );

    this.reconnectTimer = window.setTimeout(() => {
      if (!this.isIntentionalClose) {
        console.log('Attempting to reconnect...');
        // Note: This will require a fresh token from the caller
        this.handleError(new Error('Reconnection requires fresh authentication token'));
      }
    }, delay);
  }

  /**
   * Set connection status and notify callback
   */
  private setConnectionStatus(status: 'connecting' | 'connected' | 'disconnected' | 'error'): void {
    this.connectionStatus = status;
    if (this.onConnectionStatus) {
      this.onConnectionStatus(status);
    }
  }

  /**
   * Handle errors and notify callback
   */
  private handleError(error: Error): void {
    if (this.onError) {
      this.onError(error);
    }
  }

  /**
   * Get current connection status
   */
  getConnectionStatus(): 'connecting' | 'connected' | 'disconnected' | 'error' {
    return this.connectionStatus;
  }

  /**
   * Check if WebSocket is connected
   */
  isConnected(): boolean {
    return this.websocket?.readyState === WebSocket.OPEN;
  }

  /**
   * Disconnect from WebSocket server
   */
  disconnect(): void {
    this.isIntentionalClose = true;
    this.cleanup();

    if (this.websocket) {
      this.websocket.close(1000, 'Client disconnect');
      this.websocket = null;
    }

    // Clean up session
    this.messageHistory.clear();
    this.currentSession = null;

    this.setConnectionStatus('disconnected');
    console.log('WebSocket disconnected');
  }

  /**
   * Cleanup timers and resources
   */
  private cleanup(): void {
    if (this.pingTimer) {
      clearInterval(this.pingTimer);
      this.pingTimer = null;
    }

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  /**
   * Get WebSocket configuration
   */
  getConfig(): WebSocketConfig {
    return { ...this.config };
  }
}

export default WebSocketService;
